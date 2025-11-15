import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'
import Course from './course.js'
import TimeSlot from './time_slot.js'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number

  @column()
  declare type: 'INDOOR' | 'ACCOMPANIED_9' | 'ACCOMPANIED_18'

  @column()
  declare status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

  @column.date()
  declare bookingDate: DateTime

  @column()
  declare startTime: string // Format: 'HH:mm'

  @column()
  declare endTime: string // Format: 'HH:mm'

  @column()
  declare durationMinutes: number

  @column()
  declare totalPrice: number

  @column()
  declare numberOfPlayers: number | null

  @column()
  declare courseId: number | null

  @column()
  declare specialRequests: string | null

  @column()
  declare cancellationReason: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @hasMany(() => TimeSlot)
  declare timeSlots: HasMany<typeof TimeSlot>

  // Helper methods
  isIndoor(): boolean {
    return this.type === 'INDOOR'
  }

  isAccompanied(): boolean {
    return this.type === 'ACCOMPANIED_9' || this.type === 'ACCOMPANIED_18'
  }

  isPending(): boolean {
    return this.status === 'PENDING'
  }

  isConfirmed(): boolean {
    return this.status === 'CONFIRMED'
  }

  isCancelled(): boolean {
    return this.status === 'CANCELLED'
  }

  isCompleted(): boolean {
    return this.status === 'COMPLETED'
  }

  canBeCancelled(): boolean {
    // Can only cancel if status is PENDING or CONFIRMED
    return this.status === 'PENDING' || this.status === 'CONFIRMED'
  }

  canBeModified(): boolean {
    // Can only modify if status is PENDING or CONFIRMED
    return this.status === 'PENDING' || this.status === 'CONFIRMED'
  }

  getPricePerPlayer(): number | null {
    if (!this.numberOfPlayers) return null
    return this.totalPrice / this.numberOfPlayers
  }
}
