import apiClient from './api'
import type {
  Booking,
  CreateIndoorBookingRequest,
  CreateAccompaniedBookingRequest,
  BookingResponse,
  AvailableSlotsResponse,
  PaginatedResponse,
} from '@/types'

/**
 * Get available time slots for a specific date
 */
export const getAvailableSlots = async (date: string): Promise<AvailableSlotsResponse> => {
  const response = await apiClient.get<AvailableSlotsResponse>('/time-slots/available', {
    params: { date },
  })
  return response.data
}

/**
 * Get available time slots for a date range
 */
export const getAvailableSlotsRange = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  const response = await apiClient.get('/time-slots/available-range', {
    params: { startDate, endDate },
  })
  return response.data
}

/**
 * Create an Indoor booking
 */
export const createIndoorBooking = async (
  data: CreateIndoorBookingRequest
): Promise<BookingResponse> => {
  const response = await apiClient.post<BookingResponse>('/bookings', {
    ...data,
    type: 'INDOOR',
  })
  return response.data
}

/**
 * Create an Accompanied booking (9 or 18 holes)
 */
export const createAccompaniedBooking = async (
  data: CreateAccompaniedBookingRequest
): Promise<BookingResponse> => {
  const response = await apiClient.post<BookingResponse>('/bookings', data)
  return response.data
}

/**
 * Get all bookings (paginated)
 */
export const getBookings = async (params?: {
  page?: number
  limit?: number
  status?: string
  type?: string
  date?: string
}): Promise<PaginatedResponse<Booking>> => {
  const response = await apiClient.get<PaginatedResponse<Booking>>('/bookings', { params })
  return response.data
}

/**
 * Get a single booking by ID
 */
export const getBooking = async (id: number): Promise<Booking> => {
  const response = await apiClient.get<Booking>(`/bookings/${id}`)
  return response.data
}

/**
 * Update a booking
 */
export const updateBooking = async (
  id: number,
  data: {
    date?: string
    timeSlotIds?: number[]
    specialRequests?: string
    status?: string
  }
): Promise<BookingResponse> => {
  const response = await apiClient.put<BookingResponse>(`/bookings/${id}`, data)
  return response.data
}

/**
 * Cancel a booking
 */
export const cancelBooking = async (
  id: number,
  cancellationReason: string
): Promise<BookingResponse> => {
  const response = await apiClient.delete<BookingResponse>(`/bookings/${id}`, {
    data: { cancellationReason },
  })
  return response.data
}
