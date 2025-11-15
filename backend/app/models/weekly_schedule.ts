import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ScheduleSlot from './schedule_slot.js'

export default class WeeklySchedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare weekType: 1 | 2 // 1 = Semaine 1, 2 = Semaine 2

  @column()
  declare dayOfWeek: number // 0 = Monday, 1 = Tuesday, ..., 6 = Sunday

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @hasMany(() => ScheduleSlot)
  declare slots: HasMany<typeof ScheduleSlot>

  // Helper methods
  getDayName(): string {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    return days[this.dayOfWeek] || 'Unknown'
  }

  getWeekTypeName(): string {
    return this.weekType === 1 ? 'Semaine 1' : 'Semaine 2'
  }
}
