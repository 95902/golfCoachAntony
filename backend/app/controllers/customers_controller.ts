import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import {
  createCustomerValidator,
  updateCustomerValidator,
} from '#validators/customer_validator'

export default class CustomersController {
  /**
   * Get all customers (Coach/Admin only)
   * GET /api/customers
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const search = request.input('search') // Search by name or email

      let query = Customer.query()

      // Search filter
      if (search) {
        query = query.where((q) => {
          q.where('first_name', 'ILIKE', `%${search}%`)
            .orWhere('last_name', 'ILIKE', `%${search}%`)
            .orWhere('email', 'ILIKE', `%${search}%`)
        })
      }

      // Order by name
      query = query.orderBy('last_name', 'asc').orderBy('first_name', 'asc')

      // Paginate
      const customers = await query.paginate(page, limit)

      return response.ok(customers.serialize())
    } catch (error) {
      return response.badRequest({
        error: 'Failed to fetch customers',
        details: error.message,
      })
    }
  }

  /**
   * Get a single customer by ID
   * GET /api/customers/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      const customer = await Customer.query()
        .where('id', params.id)
        .preload('bookings')
        .firstOrFail()

      return response.ok(customer.serialize())
    } catch (error) {
      return response.notFound({
        error: 'Customer not found',
      })
    }
  }

  /**
   * Create a new customer (Coach/Admin only)
   * POST /api/admin/customers
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createCustomerValidator)

      // Check if customer with this email already exists
      const existing = await Customer.query().where('email', data.email).first()

      if (existing) {
        return response.conflict({
          error: 'A customer with this email already exists',
        })
      }

      const customer = await Customer.create(data)

      return response.created({
        message: 'Customer created successfully',
        customer: customer.serialize(),
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to create customer',
        details: error.messages || error.message,
      })
    }
  }

  /**
   * Update a customer (Coach/Admin only)
   * PUT /api/admin/customers/:id
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const customer = await Customer.findOrFail(params.id)

      const data = await request.validateUsing(updateCustomerValidator)

      // Check if email is being changed and if it's already taken
      if (data.email && data.email !== customer.email) {
        const existing = await Customer.query().where('email', data.email).first()

        if (existing) {
          return response.conflict({
            error: 'A customer with this email already exists',
          })
        }
      }

      customer.merge(data)
      await customer.save()

      return response.ok({
        message: 'Customer updated successfully',
        customer: customer.serialize(),
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to update customer',
        details: error.messages || error.message,
      })
    }
  }

  /**
   * Delete a customer (Coach/Admin only)
   * DELETE /api/admin/customers/:id
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const customer = await Customer.findOrFail(params.id)

      // Check if customer has active bookings
      const activeBookings = await customer
        .related('bookings')
        .query()
        .whereIn('status', ['PENDING', 'CONFIRMED'])

      if (activeBookings.length > 0) {
        return response.badRequest({
          error: 'Cannot delete customer with active bookings',
          activeBookingsCount: activeBookings.length,
        })
      }

      await customer.delete()

      return response.ok({
        message: 'Customer deleted successfully',
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to delete customer',
        details: error.message,
      })
    }
  }
}
