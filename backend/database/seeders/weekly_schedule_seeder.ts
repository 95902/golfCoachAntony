import { BaseSeeder } from '@adonisjs/lucid/seeders'
import WeeklySchedule from '#models/weekly_schedule'
import ScheduleSlot from '#models/schedule_slot'

export default class extends BaseSeeder {
  async run() {
    /**
     * Week 1 Schedule (Odd weeks)
     */

    // Monday (Week 1): 09:00-12:00, 14:00-18:00
    const week1Monday = await WeeklySchedule.updateOrCreate(
      { weekType: 1, dayOfWeek: 0 },
      { weekType: 1, dayOfWeek: 0 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Monday.id, startTime: '09:00' },
      { weeklyScheduleId: week1Monday.id, startTime: '09:00', endTime: '12:00' }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Monday.id, startTime: '14:00' },
      { weeklyScheduleId: week1Monday.id, startTime: '14:00', endTime: '18:00' }
    )

    // Tuesday (Week 1): 09:00-12:00, 14:00-17:00
    const week1Tuesday = await WeeklySchedule.updateOrCreate(
      { weekType: 1, dayOfWeek: 1 },
      { weekType: 1, dayOfWeek: 1 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Tuesday.id, startTime: '09:00' },
      { weeklyScheduleId: week1Tuesday.id, startTime: '09:00', endTime: '12:00' }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Tuesday.id, startTime: '14:00' },
      { weeklyScheduleId: week1Tuesday.id, startTime: '14:00', endTime: '17:00' }
    )

    // Wednesday (Week 1): CLOSED (no schedule)

    // Thursday (Week 1): 10:00-12:00, 14:00-19:00
    const week1Thursday = await WeeklySchedule.updateOrCreate(
      { weekType: 1, dayOfWeek: 3 },
      { weekType: 1, dayOfWeek: 3 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Thursday.id, startTime: '10:00' },
      { weeklyScheduleId: week1Thursday.id, startTime: '10:00', endTime: '12:00' }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Thursday.id, startTime: '14:00' },
      { weeklyScheduleId: week1Thursday.id, startTime: '14:00', endTime: '19:00' }
    )

    // Friday (Week 1): 09:00-12:00, 14:00-16:00
    const week1Friday = await WeeklySchedule.updateOrCreate(
      { weekType: 1, dayOfWeek: 4 },
      { weekType: 1, dayOfWeek: 4 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Friday.id, startTime: '09:00' },
      { weeklyScheduleId: week1Friday.id, startTime: '09:00', endTime: '12:00' }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Friday.id, startTime: '14:00' },
      { weeklyScheduleId: week1Friday.id, startTime: '14:00', endTime: '16:00' }
    )

    // Saturday (Week 1): 09:00-13:00
    const week1Saturday = await WeeklySchedule.updateOrCreate(
      { weekType: 1, dayOfWeek: 5 },
      { weekType: 1, dayOfWeek: 5 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week1Saturday.id, startTime: '09:00' },
      { weeklyScheduleId: week1Saturday.id, startTime: '09:00', endTime: '13:00' }
    )

    // Sunday (Week 1): CLOSED (no schedule)

    /**
     * Week 2 Schedule (Even weeks)
     */

    // Monday (Week 2): 10:00-12:00, 14:00-19:00
    const week2Monday = await WeeklySchedule.updateOrCreate(
      { weekType: 2, dayOfWeek: 0 },
      { weekType: 2, dayOfWeek: 0 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Monday.id, startTime: '10:00' },
      { weeklyScheduleId: week2Monday.id, startTime: '10:00', endTime: '12:00' }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Monday.id, startTime: '14:00' },
      { weeklyScheduleId: week2Monday.id, startTime: '14:00', endTime: '19:00' }
    )

    // Tuesday (Week 2): 09:00-12:00, 15:00-18:00
    const week2Tuesday = await WeeklySchedule.updateOrCreate(
      { weekType: 2, dayOfWeek: 1 },
      { weekType: 2, dayOfWeek: 1 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Tuesday.id, startTime: '09:00' },
      { weeklyScheduleId: week2Tuesday.id, startTime: '09:00', endTime: '12:00' }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Tuesday.id, startTime: '15:00' },
      { weeklyScheduleId: week2Tuesday.id, startTime: '15:00', endTime: '18:00' }
    )

    // Wednesday (Week 2): 09:00-13:00 (open exceptionally)
    const week2Wednesday = await WeeklySchedule.updateOrCreate(
      { weekType: 2, dayOfWeek: 2 },
      { weekType: 2, dayOfWeek: 2 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Wednesday.id, startTime: '09:00' },
      { weeklyScheduleId: week2Wednesday.id, startTime: '09:00', endTime: '13:00' }
    )

    // Thursday (Week 2): 09:00-12:00, 14:00-17:00
    const week2Thursday = await WeeklySchedule.updateOrCreate(
      { weekType: 2, dayOfWeek: 3 },
      { weekType: 2, dayOfWeek: 3 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Thursday.id, startTime: '09:00' },
      { weeklyScheduleId: week2Thursday.id, startTime: '09:00', endTime: '12:00' }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Thursday.id, startTime: '14:00' },
      { weeklyScheduleId: week2Thursday.id, startTime: '14:00', endTime: '17:00' }
    )

    // Friday (Week 2): CLOSED (day off)

    // Saturday (Week 2): 09:00-14:00
    const week2Saturday = await WeeklySchedule.updateOrCreate(
      { weekType: 2, dayOfWeek: 5 },
      { weekType: 2, dayOfWeek: 5 }
    )
    await ScheduleSlot.updateOrCreate(
      { weeklyScheduleId: week2Saturday.id, startTime: '09:00' },
      { weeklyScheduleId: week2Saturday.id, startTime: '09:00', endTime: '14:00' }
    )

    // Sunday (Week 2): CLOSED (no schedule)

    console.log('✅ Weekly schedules seeded successfully')
    console.log('   Week 1: Mon-Tue, Thu-Sat (Wed & Sun closed)')
    console.log('   Week 2: Mon-Thu, Sat (Fri & Sun closed, Wed open)')
  }
}
