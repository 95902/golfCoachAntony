import type { HttpContext } from '@adonisjs/core/http'
import ScheduleService from '#services/schedule_service'
import {
  createScheduleSlotValidator,
  regenerateTimeSlotsValidator,
} from '#validators/schedule_validator'

export default class SchedulesController {
  /**
   * Get all weekly schedules (Week 1 and Week 2)
   * GET /api/admin/schedules
   */
  async index({ response }: HttpContext) {
    try {
      const schedules = await ScheduleService.getAllSchedules()

      return response.ok(schedules)
    } catch (error) {
      return response.badRequest({
        error: 'Failed to fetch schedules',
        details: error.message,
      })
    }
  }

  /**
   * Add a schedule slot (time range) to a specific week and day
   * POST /api/admin/schedules/:id/slots
   *
   * Body:
   * {
   *   "weekType": 1 or 2,
   *   "dayOfWeek": 0-6,
   *   "startTime": "09:00",
   *   "endTime": "12:00"
   * }
   */
  async addSlot({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createScheduleSlotValidator)

      const slot = await ScheduleService.createScheduleSlot(
        data.weekType as 1 | 2,
        data.dayOfWeek,
        data.startTime,
        data.endTime
      )

      return response.created({
        message: 'Schedule slot created successfully',
        slot: slot.toJSON(),
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to create schedule slot',
        details: error.message,
      })
    }
  }

  /**
   * Remove a schedule slot
   * DELETE /api/admin/schedules/slots/:id
   */
  async removeSlot({ params, response }: HttpContext) {
    try {
      await ScheduleService.deleteScheduleSlot(params.id)

      return response.ok({
        message: 'Schedule slot deleted successfully',
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to delete schedule slot',
        details: error.message,
      })
    }
  }

  /**
   * Regenerate time slots for the next X days
   * POST /api/admin/schedules/regenerate
   *
   * Body (optional):
   * {
   *   "daysAhead": 30
   * }
   */
  async regenerate({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(regenerateTimeSlotsValidator)

      const daysAhead = data.daysAhead || 30

      const generatedCount = await ScheduleService.generateTimeSlots(daysAhead)

      return response.ok({
        message: 'Time slots regenerated successfully',
        generatedCount,
        daysAhead,
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to regenerate time slots',
        details: error.message,
      })
    }
  }
}
