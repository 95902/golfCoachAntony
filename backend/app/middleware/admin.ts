import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware is used to check if the authenticated user
 * has COACH or ADMIN role.
 */
export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Ensure user is authenticated
     */
    await ctx.auth.authenticate()

    /**
     * Check if user has admin privileges
     */
    const user = ctx.auth.user!

    if (!user.isCoach() && !user.isAdmin()) {
      return ctx.response.forbidden({
        error: 'Access denied. Admin privileges required.',
      })
    }

    /**
     * Continue the request
     */
    return next()
  }
}
