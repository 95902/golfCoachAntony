import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth_validator'

export default class AuthController {
  /**
   * Login user
   * POST /api/auth/login
   */
  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      // Find user by email
      const user = await User.query().where('email', email).first()

      if (!user) {
        return response.unauthorized({
          error: 'Invalid credentials',
        })
      }

      // Verify password
      const isPasswordValid = await user.verifyPassword(password)

      if (!isPasswordValid) {
        return response.unauthorized({
          error: 'Invalid credentials',
        })
      }

      // Login user (create session)
      await auth.use('web').login(user)

      return response.ok({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      })
    } catch (error) {
      return response.badRequest({
        error: 'Login failed',
        details: error.messages || error.message,
      })
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout({ response, auth }: HttpContext) {
    try {
      await auth.use('web').logout()

      return response.ok({
        message: 'Logout successful',
      })
    } catch (error) {
      return response.badRequest({
        error: 'Logout failed',
        details: error.message,
      })
    }
  }

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  async me({ response, auth }: HttpContext) {
    try {
      await auth.check()

      const user = auth.user

      if (!user) {
        return response.unauthorized({
          error: 'Not authenticated',
        })
      }

      return response.ok({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      })
    } catch (error) {
      return response.unauthorized({
        error: 'Not authenticated',
      })
    }
  }
}
