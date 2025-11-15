import { DateTime } from 'luxon'
import Booking from '#models/booking'
import Customer from '#models/customer'
import TimeSlot from '#models/time_slot'
import AuditLog from '#models/audit_log'
import db from '@adonisjs/lucid/services/db'

interface CreateIndoorBookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: DateTime
  timeSlotIds: number[]
  specialRequests?: string
}

interface CreateAccompaniedBookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  type: 'ACCOMPANIED_9' | 'ACCOMPANIED_18'
  date?: DateTime
  numberOfPlayers: number
  courseId: number
  specialRequests?: string
  preferCallback?: boolean
}

export default class BookingService {
  /**
   * Indoor booking price per slot (1 hour)
   */
  private static readonly INDOOR_PRICE_PER_SLOT = 70

  /**
   * Accompanied 9 holes price
   */
  private static readonly ACCOMPANIED_9_PRICE = 180

  /**
   * Accompanied 18 holes price
   */
  private static readonly ACCOMPANIED_18_PRICE = 300

  /**
   * Create an Indoor booking
   * - Validates that time slots are available and consecutive
   * - Creates or finds customer
   * - Creates booking and links time slots
   * - Returns the created booking with relations
   */
  static async createIndoorBooking(data: CreateIndoorBookingData, userId?: number) {
    return await db.transaction(async (trx) => {
      // 1. Validate that we have 1-3 time slots
      if (data.timeSlotIds.length < 1 || data.timeSlotIds.length > 3) {
        throw new Error('Indoor bookings require 1 to 3 time slots')
      }

      // 2. Fetch the time slots and verify they exist and are available
      const timeSlots = await TimeSlot.query({ client: trx })
        .whereIn('id', data.timeSlotIds)
        .where('date', data.date.toSQLDate()!)
        .where('is_available', true)
        .orderBy('start_time', 'asc')

      if (timeSlots.length !== data.timeSlotIds.length) {
        throw new Error('One or more time slots are not available or do not exist')
      }

      // 3. Verify time slots are consecutive
      this.validateConsecutiveSlots(timeSlots)

      // 4. Find or create customer
      let customer = await Customer.query({ client: trx })
        .where('email', data.email)
        .first()

      if (!customer) {
        customer = await Customer.create(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            userId: userId || null,
          },
          { client: trx }
        )
      }

      // 5. Calculate booking details
      const startTime = timeSlots[0].startTime
      const endTime = timeSlots[timeSlots.length - 1].endTime
      const durationMinutes = timeSlots.length * 60
      const totalPrice = timeSlots.length * this.INDOOR_PRICE_PER_SLOT

      // 6. Create booking
      const booking = await Booking.create(
        {
          customerId: customer.id,
          type: 'INDOOR',
          status: 'CONFIRMED',
          bookingDate: data.date,
          startTime,
          endTime,
          durationMinutes,
          totalPrice,
          numberOfPlayers: null,
          courseId: null,
          specialRequests: data.specialRequests || null,
        },
        { client: trx }
      )

      // 7. Link time slots to booking and mark as unavailable
      for (const slot of timeSlots) {
        slot.bookingId = booking.id
        slot.isAvailable = false
        await slot.save({ client: trx })
      }

      // 8. Log audit
      await AuditLog.log({
        userId: userId,
        action: 'CREATE',
        resourceType: 'Booking',
        resourceId: booking.id,
        newValues: booking.toJSON(),
      })

      // 9. Load relations and return
      await booking.load('customer')
      await booking.load('timeSlots')

      return booking
    })
  }

  /**
   * Create an Accompanied booking (9 or 18 holes)
   */
  static async createAccompaniedBooking(
    data: CreateAccompaniedBookingData,
    userId?: number
  ) {
    return await db.transaction(async (trx) => {
      // 1. Find or create customer
      let customer = await Customer.query({ client: trx })
        .where('email', data.email)
        .first()

      if (!customer) {
        customer = await Customer.create(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            userId: userId || null,
          },
          { client: trx }
        )
      }

      // 2. Calculate price
      const basePrice =
        data.type === 'ACCOMPANIED_9'
          ? this.ACCOMPANIED_9_PRICE
          : this.ACCOMPANIED_18_PRICE

      const totalPrice = basePrice // Price is total, not per player

      // 3. Calculate duration
      const durationMinutes = data.type === 'ACCOMPANIED_9' ? 240 : 480 // 4h or 8h

      // 4. Determine status (PENDING if no date provided)
      const status = data.preferCallback || !data.date ? 'PENDING' : 'CONFIRMED'

      // 5. For 18 holes, we need to check if the entire day is available
      if (data.type === 'ACCOMPANIED_18' && data.date) {
        const existingBookings = await Booking.query({ client: trx })
          .where('booking_date', data.date.toSQLDate()!)
          .whereIn('status', ['CONFIRMED', 'PENDING'])

        if (existingBookings.length > 0) {
          throw new Error('The selected date is not available for 18-hole bookings')
        }
      }

      // 6. Create booking
      const booking = await Booking.create(
        {
          customerId: customer.id,
          type: data.type,
          status,
          bookingDate: data.date || DateTime.now(),
          startTime: '09:00', // Default start time
          endTime: data.type === 'ACCOMPANIED_9' ? '13:00' : '17:00',
          durationMinutes,
          totalPrice,
          numberOfPlayers: data.numberOfPlayers,
          courseId: data.courseId,
          specialRequests: data.specialRequests || null,
        },
        { client: trx }
      )

      // 7. Log audit
      await AuditLog.log({
        userId: userId,
        action: 'CREATE',
        resourceType: 'Booking',
        resourceId: booking.id,
        newValues: booking.toJSON(),
      })

      // 8. Load relations and return
      await booking.load('customer')
      await booking.load('course')

      return booking
    })
  }

  /**
   * Update a booking
   */
  static async updateBooking(
    bookingId: number,
    data: {
      date?: DateTime
      timeSlotIds?: number[]
      specialRequests?: string
      status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    },
    userId?: number
  ) {
    return await db.transaction(async (trx) => {
      const booking = await Booking.query({ client: trx })
        .where('id', bookingId)
        .firstOrFail()

      const oldValues = booking.toJSON()

      // If updating Indoor booking with new time slots
      if (booking.type === 'INDOOR' && data.timeSlotIds && data.date) {
        // Release old time slots
        const oldSlots = await TimeSlot.query({ client: trx }).where('booking_id', booking.id)

        for (const slot of oldSlots) {
          slot.bookingId = null
          slot.isAvailable = true
          await slot.save({ client: trx })
        }

        // Fetch and validate new time slots
        const newSlots = await TimeSlot.query({ client: trx })
          .whereIn('id', data.timeSlotIds)
          .where('date', data.date.toSQLDate()!)
          .where('is_available', true)
          .orderBy('start_time', 'asc')

        if (newSlots.length !== data.timeSlotIds.length) {
          throw new Error('One or more time slots are not available')
        }

        this.validateConsecutiveSlots(newSlots)

        // Update booking
        booking.bookingDate = data.date
        booking.startTime = newSlots[0].startTime
        booking.endTime = newSlots[newSlots.length - 1].endTime
        booking.durationMinutes = newSlots.length * 60
        booking.totalPrice = newSlots.length * this.INDOOR_PRICE_PER_SLOT

        // Link new slots
        for (const slot of newSlots) {
          slot.bookingId = booking.id
          slot.isAvailable = false
          await slot.save({ client: trx })
        }
      }

      // Update other fields
      if (data.specialRequests !== undefined) {
        booking.specialRequests = data.specialRequests
      }

      if (data.status) {
        booking.status = data.status
      }

      await booking.save({ client: trx })

      // Log audit
      await AuditLog.log({
        userId: userId,
        action: 'UPDATE',
        resourceType: 'Booking',
        resourceId: booking.id,
        oldValues,
        newValues: booking.toJSON(),
      })

      await booking.load('customer')
      if (booking.type === 'INDOOR') {
        await booking.load('timeSlots')
      } else {
        await booking.load('course')
      }

      return booking
    })
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(
    bookingId: number,
    cancellationReason: string,
    userId?: number
  ) {
    return await db.transaction(async (trx) => {
      const booking = await Booking.query({ client: trx })
        .where('id', bookingId)
        .firstOrFail()

      if (!booking.canBeCancelled()) {
        throw new Error('This booking cannot be cancelled')
      }

      const oldValues = booking.toJSON()

      // Release time slots if Indoor booking
      if (booking.type === 'INDOOR') {
        const slots = await TimeSlot.query({ client: trx }).where('booking_id', booking.id)

        for (const slot of slots) {
          slot.bookingId = null
          slot.isAvailable = true
          await slot.save({ client: trx })
        }
      }

      // Update booking status
      booking.status = 'CANCELLED'
      booking.cancellationReason = cancellationReason
      await booking.save({ client: trx })

      // Log audit
      await AuditLog.log({
        userId: userId,
        action: 'CANCEL',
        resourceType: 'Booking',
        resourceId: booking.id,
        oldValues,
        newValues: booking.toJSON(),
      })

      await booking.load('customer')

      return booking
    })
  }

  /**
   * Validate that time slots are consecutive (no gaps)
   */
  private static validateConsecutiveSlots(slots: TimeSlot[]) {
    if (slots.length === 1) return

    for (let i = 0; i < slots.length - 1; i++) {
      const currentEnd = slots[i].endTime
      const nextStart = slots[i + 1].startTime

      if (currentEnd !== nextStart) {
        throw new Error('Time slots must be consecutive with no gaps')
      }
    }
  }

  /**
   * Get price per player for Accompanied bookings
   */
  static getPricePerPlayer(type: 'ACCOMPANIED_9' | 'ACCOMPANIED_18', numberOfPlayers: number) {
    const basePrice =
      type === 'ACCOMPANIED_9' ? this.ACCOMPANIED_9_PRICE : this.ACCOMPANIED_18_PRICE

    return basePrice / numberOfPlayers
  }
}
