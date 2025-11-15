import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // User who performed the action (nullable for system actions)
      table.integer('user_id').unsigned().nullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')

      // Action performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
      table.string('action', 50).notNullable()

      // Resource type (e.g., 'Booking', 'Customer', 'Schedule')
      table.string('resource_type', 100).notNullable()

      // Resource ID
      table.integer('resource_id').notNullable()

      // Old and new values (JSON)
      table.json('old_values').nullable()
      table.json('new_values').nullable()

      // IP address
      table.string('ip_address', 50).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())

      // Indexes for faster lookups
      table.index(['user_id'])
      table.index(['action'])
      table.index(['resource_type'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
