import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedule_slots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('weekly_schedule_id').unsigned().notNullable()
      table.foreign('weekly_schedule_id')
        .references('id')
        .inTable('weekly_schedules')
        .onDelete('CASCADE')

      // Time range for this slot (e.g., 09:00 - 12:00)
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      // Index for faster lookups
      table.index(['weekly_schedule_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
