import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import WeeklySchedule from './weekly_schedule.js'

export default class ScheduleSlot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare weeklyScheduleId: number

  @column()
  declare startTime: string // Format: 'HH:mm'

  @column()
  declare endTime: string // Format: 'HH:mm'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => WeeklySchedule)
  declare weeklySchedule: BelongsTo<typeof WeeklySchedule>

  // Helper methods
  getDurationHours(): number {
    const [startHour, startMin] = this.startTime.split(':').map(Number)
    const [endHour, endMin] = this.endTime.split(':').map(Number)
    return (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60
  }
}
