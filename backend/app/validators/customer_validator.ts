import vine from '@vinejs/vine'

/**
 * Validator for creating a customer
 */
export const createCustomerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(255),
    lastName: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email(),
    phone: vine.string().trim().minLength(10).maxLength(20),
    notes: vine.string().trim().optional(),
    userId: vine.number().positive().optional(),
  })
)

/**
 * Validator for updating a customer
 */
export const updateCustomerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(255).optional(),
    lastName: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().optional(),
    phone: vine.string().trim().minLength(10).maxLength(20).optional(),
    notes: vine.string().trim().optional(),
  })
)
