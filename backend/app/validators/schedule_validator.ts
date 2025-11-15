import vine from '@vinejs/vine'

/**
 * Validator for creating a schedule slot (time range)
 */
export const createScheduleSlotValidator = vine.compile(
  vine.object({
    weekType: vine.number().in([1, 2]), // 1 = Semaine 1, 2 = Semaine 2
    dayOfWeek: vine.number().min(0).max(6), // 0 = Monday, 6 = Sunday
    startTime: vine.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:mm format
    endTime: vine.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:mm format
  })
)

/**
 * Validator for regenerating time slots
 */
export const regenerateTimeSlotsValidator = vine.compile(
  vine.object({
    daysAhead: vine.number().min(1).max(90).optional(), // Default 30 days
  })
)
