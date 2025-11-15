import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('customer_id').unsigned().notNullable()
      table.foreign('customer_id').references('id').inTable('customers').onDelete('CASCADE')

      // Type of booking: INDOOR, ACCOMPANIED_9, ACCOMPANIED_18
      table.enum('type', ['INDOOR', 'ACCOMPANIED_9', 'ACCOMPANIED_18']).notNullable()

      // Status: PENDING, CONFIRMED, CANCELLED, COMPLETED
      table.enum('status', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
        .notNullable()
        .defaultTo('CONFIRMED')

      // Booking date and time
      table.date('booking_date').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()

      // Duration in minutes
      table.integer('duration_minutes').notNullable()

      // Price
      table.decimal('total_price', 10, 2).notNullable()

      // Number of players (for ACCOMPANIED bookings)
      table.integer('number_of_players').nullable()

      // Course (for ACCOMPANIED bookings)
      table.integer('course_id').unsigned().nullable()
      table.foreign('course_id').references('id').inTable('courses').onDelete('SET NULL')

      // Additional fields
      table.text('special_requests').nullable()
      table.text('cancellation_reason').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      // Indexes for faster lookups
      table.index(['customer_id'])
      table.index(['booking_date'])
      table.index(['status'])
      table.index(['type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
