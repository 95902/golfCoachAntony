import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasOne } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare username: string

  @column({ serializeAs: null }) // Don't expose password in JSON
  declare password: string

  @column()
  declare role: 'CLIENT' | 'USER' | 'COACH' | 'ADMIN'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @hasOne(() => Customer)
  declare customer: HasOne<typeof Customer>

  // Hooks
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  // Helper methods
  async verifyPassword(plainPassword: string): Promise<boolean> {
    return hash.verify(this.password, plainPassword)
  }

  isCoach(): boolean {
    return this.role === 'COACH' || this.role === 'ADMIN'
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN'
  }
}
