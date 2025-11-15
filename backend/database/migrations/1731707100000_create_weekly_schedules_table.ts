import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'weekly_schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // week_type: 1 = Semaine 1, 2 = Semaine 2 (alternating weeks)
      table.integer('week_type').notNullable().checkIn([1, 2])

      // day_of_week: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
      table.integer('day_of_week').notNullable().checkBetween([0, 6])

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      // Unique constraint: only one schedule per week_type and day_of_week
      table.unique(['week_type', 'day_of_week'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
