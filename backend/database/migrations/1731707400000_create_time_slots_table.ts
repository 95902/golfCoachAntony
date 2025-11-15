import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_slots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Link to booking (nullable if not booked yet)
      table.integer('booking_id').unsigned().nullable()
      table.foreign('booking_id').references('id').inTable('bookings').onDelete('CASCADE')

      // Date and time of the slot
      table.date('date').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()

      // Availability flag
      table.boolean('is_available').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      // Indexes for faster lookups
      table.index(['date'])
      table.index(['is_available'])
      table.index(['booking_id'])

      // Unique constraint: one slot per date + time combination
      table.unique(['date', 'start_time', 'end_time'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
