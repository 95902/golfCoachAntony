import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'

export default class CoursesController {
  /**
   * Get all golf courses (public)
   * GET /api/courses
   */
  async index({ response }: HttpContext) {
    try {
      const courses = await Course.query().orderBy('name', 'asc')

      return response.ok(courses)
    } catch (error) {
      return response.badRequest({
        error: 'Failed to fetch courses',
        details: error.message,
      })
    }
  }

  /**
   * Get a single course by ID (public)
   * GET /api/courses/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      const course = await Course.findOrFail(params.id)

      return response.ok(course)
    } catch (error) {
      return response.notFound({
        error: 'Course not found',
      })
    }
  }
}
