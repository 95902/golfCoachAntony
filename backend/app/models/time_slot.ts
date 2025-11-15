import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Booking from './booking.js'

export default class TimeSlot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bookingId: number | null

  @column.date()
  declare date: DateTime

  @column()
  declare startTime: string // Format: 'HH:mm'

  @column()
  declare endTime: string // Format: 'HH:mm'

  @column()
  declare isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => Booking)
  declare booking: BelongsTo<typeof Booking>

  // Helper methods
  isBooked(): boolean {
    return this.bookingId !== null && !this.isAvailable
  }

  getDateTime(): DateTime {
    // Combine date and time into a single DateTime object
    const [hour, minute] = this.startTime.split(':').map(Number)
    return this.date.set({ hour, minute })
  }

  isPast(): boolean {
    return this.getDateTime() < DateTime.now()
  }

  isFuture(): boolean {
    return this.getDateTime() > DateTime.now()
  }
}
