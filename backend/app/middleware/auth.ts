import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used to authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to when user is not authenticated
   */
  redirectTo = '/api/auth/login'

  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Check if user is authenticated or not
     */
    await ctx.auth.authenticate()

    /**
     * Continue the request
     */
    return next()
  }
}
