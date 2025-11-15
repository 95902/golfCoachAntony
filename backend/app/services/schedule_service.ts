import { DateTime } from 'luxon'
import WeeklySchedule from '#models/weekly_schedule'
import ScheduleSlot from '#models/schedule_slot'
import TimeSlot from '#models/time_slot'
import db from '@adonisjs/lucid/services/db'

export default class ScheduleService {
  /**
   * Generate time slots for the next X days based on weekly schedules
   * - Deletes future time slots that are not booked
   * - Generates new time slots based on weekly schedules (Week 1 / Week 2)
   * - Each schedule slot (e.g., 09:00-12:00) is split into 1-hour time slots
   *
   * @param daysAhead Number of days to generate (default: 30)
   */
  static async generateTimeSlots(daysAhead: number = 30): Promise<number> {
    return await db.transaction(async (trx) => {
      const today = DateTime.now().startOf('day')

      // 1. Delete future time slots that are NOT booked
      await TimeSlot.query({ client: trx })
        .where('date', '>', today.toSQLDate()!)
        .whereNull('booking_id')
        .delete()

      let generatedCount = 0

      // 2. Generate time slots for each day
      for (let i = 0; i < daysAhead; i++) {
        const targetDate = today.plus({ days: i })

        // Determine which week type to use (1 or 2)
        // Week number based on ISO week: even week = Week 2, odd week = Week 1
        const weekNumber = targetDate.weekNumber
        const weekType = weekNumber % 2 === 0 ? 2 : 1

        // Get day of week (0 = Monday, 6 = Sunday)
        const dayOfWeek = targetDate.weekday - 1 // Luxon uses 1-7, we use 0-6

        // 3. Find the weekly schedule for this week type and day
        const weeklySchedule = await WeeklySchedule.query({ client: trx })
          .where('week_type', weekType)
          .where('day_of_week', dayOfWeek)
          .preload('slots')
          .first()

        // If no schedule exists for this day, it's a closed day
        if (!weeklySchedule || weeklySchedule.slots.length === 0) {
          continue
        }

        // 4. For each schedule slot (time range), generate 1-hour time slots
        for (const scheduleSlot of weeklySchedule.slots) {
          const slots = this.splitIntoHourlySlots(
            targetDate,
            scheduleSlot.startTime,
            scheduleSlot.endTime
          )

          // 5. Create time slots in database
          for (const slot of slots) {
            // Check if this time slot already exists
            const existing = await TimeSlot.query({ client: trx })
              .where('date', slot.date.toSQLDate()!)
              .where('start_time', slot.startTime)
              .where('end_time', slot.endTime)
              .first()

            if (!existing) {
              await TimeSlot.create(
                {
                  date: slot.date,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  isAvailable: true,
                  bookingId: null,
                },
                { client: trx }
              )
              generatedCount++
            }
          }
        }
      }

      return generatedCount
    })
  }

  /**
   * Split a time range into 1-hour slots
   * Example: 09:00-12:00 → [09:00-10:00, 10:00-11:00, 11:00-12:00]
   */
  private static splitIntoHourlySlots(
    date: DateTime,
    startTime: string,
    endTime: string
  ): Array<{ date: DateTime; startTime: string; endTime: string }> {
    const slots: Array<{ date: DateTime; startTime: string; endTime: string }> = []

    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)

    let currentHour = startHour

    // Generate 1-hour slots
    while (currentHour < endHour) {
      const slotStartTime = `${currentHour.toString().padStart(2, '0')}:00`
      const slotEndTime = `${(currentHour + 1).toString().padStart(2, '0')}:00`

      slots.push({
        date,
        startTime: slotStartTime,
        endTime: slotEndTime,
      })

      currentHour++
    }

    return slots
  }

  /**
   * Create a new schedule slot (time range) for a specific week and day
   */
  static async createScheduleSlot(
    weekType: 1 | 2,
    dayOfWeek: number,
    startTime: string,
    endTime: string
  ) {
    return await db.transaction(async (trx) => {
      // 1. Validate that start time is before end time
      const [startHour] = startTime.split(':').map(Number)
      const [endHour] = endTime.split(':').map(Number)

      if (startHour >= endHour) {
        throw new Error('Start time must be before end time')
      }

      // 2. Find or create weekly schedule
      let weeklySchedule = await WeeklySchedule.query({ client: trx })
        .where('week_type', weekType)
        .where('day_of_week', dayOfWeek)
        .first()

      if (!weeklySchedule) {
        weeklySchedule = await WeeklySchedule.create(
          {
            weekType,
            dayOfWeek,
          },
          { client: trx }
        )
      }

      // 3. Check for overlapping slots
      const existingSlots = await ScheduleSlot.query({ client: trx })
        .where('weekly_schedule_id', weeklySchedule.id)

      for (const slot of existingSlots) {
        if (this.timesOverlap(startTime, endTime, slot.startTime, slot.endTime)) {
          throw new Error(
            `Time range overlaps with existing slot: ${slot.startTime}-${slot.endTime}`
          )
        }
      }

      // 4. Create schedule slot
      const scheduleSlot = await ScheduleSlot.create(
        {
          weeklyScheduleId: weeklySchedule.id,
          startTime,
          endTime,
        },
        { client: trx }
      )

      return scheduleSlot
    })
  }

  /**
   * Delete a schedule slot
   */
  static async deleteScheduleSlot(scheduleSlotId: number) {
    const scheduleSlot = await ScheduleSlot.findOrFail(scheduleSlotId)
    await scheduleSlot.delete()
  }

  /**
   * Get all weekly schedules with their slots
   */
  static async getAllSchedules() {
    const schedules = await WeeklySchedule.query().preload('slots').orderBy('week_type').orderBy('day_of_week')

    // Group by week type
    const week1 = schedules.filter((s) => s.weekType === 1)
    const week2 = schedules.filter((s) => s.weekType === 2)

    return {
      week1: this.formatSchedules(week1),
      week2: this.formatSchedules(week2),
    }
  }

  /**
   * Format schedules for API response
   */
  private static formatSchedules(schedules: WeeklySchedule[]) {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

    return days.map((dayName, index) => {
      const schedule = schedules.find((s) => s.dayOfWeek === index)

      return {
        dayOfWeek: index,
        dayName,
        slots: schedule?.slots || [],
        isClosed: !schedule || schedule.slots.length === 0,
      }
    })
  }

  /**
   * Check if two time ranges overlap
   */
  private static timesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    const [s1Hour, s1Min] = start1.split(':').map(Number)
    const [e1Hour, e1Min] = end1.split(':').map(Number)
    const [s2Hour, s2Min] = start2.split(':').map(Number)
    const [e2Hour, e2Min] = end2.split(':').map(Number)

    const start1Minutes = s1Hour * 60 + s1Min
    const end1Minutes = e1Hour * 60 + e1Min
    const start2Minutes = s2Hour * 60 + s2Min
    const end2Minutes = e2Hour * 60 + e2Min

    return start1Minutes < end2Minutes && start2Minutes < end1Minutes
  }
}
