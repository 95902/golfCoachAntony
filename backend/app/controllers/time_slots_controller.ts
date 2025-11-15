import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import TimeSlot from '#models/time_slot'
import Booking from '#models/booking'

export default class TimeSlotsController {
  /**
   * Get available time slots for a specific date
   * GET /api/bookings/available?date=2024-11-20
   */
  async getAvailable({ request, response }: HttpContext) {
    try {
      const dateString = request.input('date')

      if (!dateString) {
        return response.badRequest({
          error: 'Date parameter is required (format: YYYY-MM-DD)',
        })
      }

      // Parse date
      const date = DateTime.fromFormat(dateString, 'yyyy-MM-dd')

      if (!date.isValid) {
        return response.badRequest({
          error: 'Invalid date format. Use YYYY-MM-DD',
        })
      }

      // Check if date is in the past
      const today = DateTime.now().startOf('day')
      if (date < today) {
        return response.badRequest({
          error: 'Cannot retrieve slots for past dates',
        })
      }

      // Check if date is too far in the future (max 30 days)
      const maxDate = today.plus({ days: 30 })
      if (date > maxDate) {
        return response.badRequest({
          error: 'Cannot retrieve slots more than 30 days in advance',
        })
      }

      // Check if the entire day is blocked by an 18-hole booking
      const dayBooking = await Booking.query()
        .where('booking_date', date.toSQLDate()!)
        .where('type', 'ACCOMPANIED_18')
        .whereIn('status', ['CONFIRMED', 'PENDING'])
        .first()

      if (dayBooking) {
        return response.ok({
          date: dateString,
          available: false,
          reason: '18-hole accompanied booking blocks the entire day',
          slots: [],
        })
      }

      // Get available time slots for this date
      const timeSlots = await TimeSlot.query()
        .where('date', date.toSQLDate()!)
        .where('is_available', true)
        .orderBy('start_time', 'asc')

      // Format response
      const formattedSlots = timeSlots.map((slot) => ({
        id: slot.id,
        date: slot.date.toFormat('yyyy-MM-dd'),
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
      }))

      return response.ok({
        date: dateString,
        available: formattedSlots.length > 0,
        totalSlots: formattedSlots.length,
        slots: formattedSlots,
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to fetch available time slots',
        details: error.message,
      })
    }
  }

  /**
   * Get available time slots for a date range
   * GET /api/bookings/available-range?startDate=2024-11-20&endDate=2024-11-27
   */
  async getAvailableRange({ request, response }: HttpContext) {
    try {
      const startDateString = request.input('startDate')
      const endDateString = request.input('endDate')

      if (!startDateString || !endDateString) {
        return response.badRequest({
          error: 'Both startDate and endDate parameters are required (format: YYYY-MM-DD)',
        })
      }

      const startDate = DateTime.fromFormat(startDateString, 'yyyy-MM-dd')
      const endDate = DateTime.fromFormat(endDateString, 'yyyy-MM-dd')

      if (!startDate.isValid || !endDate.isValid) {
        return response.badRequest({
          error: 'Invalid date format. Use YYYY-MM-DD',
        })
      }

      if (startDate > endDate) {
        return response.badRequest({
          error: 'startDate must be before or equal to endDate',
        })
      }

      // Limit range to 7 days
      const daysDiff = endDate.diff(startDate, 'days').days
      if (daysDiff > 7) {
        return response.badRequest({
          error: 'Date range cannot exceed 7 days',
        })
      }

      // Get available slots for the range
      const timeSlots = await TimeSlot.query()
        .whereBetween('date', [startDate.toSQLDate()!, endDate.toSQLDate()!])
        .where('is_available', true)
        .orderBy('date', 'asc')
        .orderBy('start_time', 'asc')

      // Group by date
      const slotsByDate: Record<string, any[]> = {}

      for (const slot of timeSlots) {
        const dateKey = slot.date.toFormat('yyyy-MM-dd')

        if (!slotsByDate[dateKey]) {
          slotsByDate[dateKey] = []
        }

        slotsByDate[dateKey].push({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable,
        })
      }

      return response.ok({
        startDate: startDateString,
        endDate: endDateString,
        slotsByDate,
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to fetch available time slots',
        details: error.message,
      })
    }
  }
}
