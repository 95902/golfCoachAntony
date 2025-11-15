import apiClient from './api'
import type { Course } from '@/types'

/**
 * Get all golf courses
 */
export const getCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<Course[]>('/courses')
  return response.data
}

/**
 * Get a single course by ID
 */
export const getCourse = async (id: number): Promise<Course> => {
  const response = await apiClient.get<Course>(`/courses/${id}`)
  return response.data
}
