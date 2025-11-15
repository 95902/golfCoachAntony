import vine from '@vinejs/vine'

/**
 * Validator for user login
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(6),
  })
)

/**
 * Validator for user registration
 */
export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    username: vine.string().trim().minLength(3).maxLength(255),
    password: vine.string().minLength(8).maxLength(255),
    role: vine.enum(['CLIENT', 'USER']).optional(), // Default to USER
  })
)
