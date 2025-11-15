import vine from '@vinejs/vine'

/**
 * Validator for creating an Indoor booking
 * - Allows 1 to 3 consecutive time slots
 * - Price: 70€ per slot
 */
export const createIndoorBookingValidator = vine.compile(
  vine.object({
    // Customer information
    firstName: vine.string().trim().minLength(2).maxLength(255),
    lastName: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email(),
    phone: vine.string().trim().minLength(10).maxLength(20),

    // Booking details
    date: vine.date({ formats: ['YYYY-MM-DD'] }),
    timeSlotIds: vine
      .array(vine.number())
      .minLength(1)
      .maxLength(3)
      .distinct(), // No duplicates

    // Optional fields
    specialRequests: vine.string().trim().optional(),
  })
)

/**
 * Validator for creating an Accompanied booking (9 or 18 holes)
 */
export const createAccompaniedBookingValidator = vine.compile(
  vine.object({
    // Customer information
    firstName: vine.string().trim().minLength(2).maxLength(255),
    lastName: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email(),
    phone: vine.string().trim().minLength(10).maxLength(20),

    // Booking details
    type: vine.enum(['ACCOMPANIED_9', 'ACCOMPANIED_18']),
    date: vine.date({ formats: ['YYYY-MM-DD'] }).optional(), // Optional if user wants to be called back
    numberOfPlayers: vine.number().min(1).max(3),
    courseId: vine.number().positive(),

    // Optional fields
    specialRequests: vine.string().trim().optional(),
    preferCallback: vine.boolean().optional(), // If true, coach will call the customer
  })
)

/**
 * Validator for updating a booking
 */
export const updateBookingValidator = vine.compile(
  vine.object({
    // Booking can be updated with new date/time slots
    date: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    timeSlotIds: vine
      .array(vine.number())
      .minLength(1)
      .maxLength(3)
      .distinct()
      .optional(),

    // Or update special requests
    specialRequests: vine.string().trim().optional(),

    // Status can be updated (by coach/admin only)
    status: vine.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  })
)

/**
 * Validator for cancelling a booking
 */
export const cancelBookingValidator = vine.compile(
  vine.object({
    cancellationReason: vine.string().trim().minLength(3).maxLength(500),
  })
)
