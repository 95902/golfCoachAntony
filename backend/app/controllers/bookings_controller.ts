import type { HttpContext } from '@adonisjs/core/http'
import Booking from '#models/booking'
import BookingService from '#services/booking_service'
import N8nService from '#services/n8n_service'
import {
  createIndoorBookingValidator,
  createAccompaniedBookingValidator,
  updateBookingValidator,
  cancelBookingValidator,
} from '#validators/booking_validator'

export default class BookingsController {
  /**
   * Get all bookings (with filters and pagination)
   * GET /api/bookings
   */
  async index({ request, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const status = request.input('status') // Filter by status
      const type = request.input('type') // Filter by type
      const date = request.input('date') // Filter by date

      let query = Booking.query().preload('customer')

      // If user is not coach/admin, only show their own bookings
      if (!user.isCoach()) {
        // Get customer for this user
        const customer = await user.related('customer').query().first()
        if (customer) {
          query = query.where('customer_id', customer.id)
        } else {
          // User has no bookings yet
          return response.ok({
            data: [],
            meta: {
              total: 0,
              perPage: limit,
              currentPage: page,
              lastPage: 1,
            },
          })
        }
      }

      // Apply filters
      if (status) {
        query = query.where('status', status)
      }

      if (type) {
        query = query.where('type', type)
      }

      if (date) {
        query = query.where('booking_date', date)
      }

      // Order by date (most recent first)
      query = query.orderBy('booking_date', 'desc').orderBy('start_time', 'desc')

      // Paginate
      const bookings = await query.paginate(page, limit)

      // Load relations
      for (const booking of bookings.all()) {
        if (booking.type === 'INDOOR') {
          await booking.load('timeSlots')
        } else {
          await booking.load('course')
        }
      }

      return response.ok(bookings.serialize())
    } catch (error) {
      return response.badRequest({
        error: 'Failed to fetch bookings',
        details: error.message,
      })
    }
  }

  /**
   * Get a single booking by ID
   * GET /api/bookings/:id
   */
  async show({ params, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      const booking = await Booking.query()
        .where('id', params.id)
        .preload('customer')
        .firstOrFail()

      // Check authorization (users can only see their own bookings)
      if (!user.isCoach()) {
        const customer = await user.related('customer').query().first()
        if (!customer || booking.customerId !== customer.id) {
          return response.forbidden({
            error: 'You do not have permission to view this booking',
          })
        }
      }

      // Load relations
      if (booking.type === 'INDOOR') {
        await booking.load('timeSlots')
      } else {
        await booking.load('course')
      }

      return response.ok(booking.serialize())
    } catch (error) {
      return response.notFound({
        error: 'Booking not found',
      })
    }
  }

  /**
   * Create a new booking (Indoor or Accompanied)
   * POST /api/bookings
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      // Get user if authenticated (optional for public bookings)
      let userId: number | undefined
      try {
        await auth.check()
        userId = auth.user?.id
      } catch {
        // Not authenticated, that's OK for public bookings
      }

      const bookingType = request.input('type')

      let booking: Booking

      if (bookingType === 'INDOOR' || !bookingType) {
        // Indoor booking
        const data = await request.validateUsing(createIndoorBookingValidator)
        booking = await BookingService.createIndoorBooking(data, userId)
      } else {
        // Accompanied booking
        const data = await request.validateUsing(createAccompaniedBookingValidator)
        booking = await BookingService.createAccompaniedBooking(data, userId)
      }

      // Trigger N8N webhook (async, non-blocking)
      N8nService.triggerBookingCreated(booking).catch((err) => {
        console.error('N8N webhook failed:', err)
      })

      return response.created({
        message: 'Booking created successfully',
        booking: booking.serialize(),
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to create booking',
        details: error.messages || error.message,
      })
    }
  }

  /**
   * Update a booking
   * PUT /api/bookings/:id
   */
  async update({ params, request, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      const bookingId = params.id

      // Check if booking exists and user has permission
      const existingBooking = await Booking.query().where('id', bookingId).preload('customer').firstOrFail()

      // Authorization check
      if (!user.isCoach()) {
        const customer = await user.related('customer').query().first()
        if (!customer || existingBooking.customerId !== customer.id) {
          return response.forbidden({
            error: 'You do not have permission to update this booking',
          })
        }

        // Users can only update bookings that are PENDING or CONFIRMED
        if (!existingBooking.canBeModified()) {
          return response.badRequest({
            error: 'This booking cannot be modified',
          })
        }
      }

      const data = await request.validateUsing(updateBookingValidator)
      const booking = await BookingService.updateBooking(bookingId, data, user.id)

      // Trigger N8N webhook
      N8nService.triggerBookingUpdated(booking).catch((err) => {
        console.error('N8N webhook failed:', err)
      })

      return response.ok({
        message: 'Booking updated successfully',
        booking: booking.serialize(),
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to update booking',
        details: error.messages || error.message,
      })
    }
  }

  /**
   * Cancel a booking
   * DELETE /api/bookings/:id
   */
  async destroy({ params, request, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      const bookingId = params.id

      // Check if booking exists and user has permission
      const existingBooking = await Booking.query().where('id', bookingId).preload('customer').firstOrFail()

      // Authorization check
      if (!user.isCoach()) {
        const customer = await user.related('customer').query().first()
        if (!customer || existingBooking.customerId !== customer.id) {
          return response.forbidden({
            error: 'You do not have permission to cancel this booking',
          })
        }
      }

      const data = await request.validateUsing(cancelBookingValidator)
      const booking = await BookingService.cancelBooking(
        bookingId,
        data.cancellationReason,
        user.id
      )

      // Trigger N8N webhook
      N8nService.triggerBookingCancelled(booking).catch((err) => {
        console.error('N8N webhook failed:', err)
      })

      return response.ok({
        message: 'Booking cancelled successfully',
        booking: booking.serialize(),
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to cancel booking',
        details: error.messages || error.message,
      })
    }
  }
}
