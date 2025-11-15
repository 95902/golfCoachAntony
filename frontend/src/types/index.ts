export interface User {
  id: number
  email: string
  username: string
  role: 'CLIENT' | 'USER' | 'COACH' | 'ADMIN'
}

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  notes?: string
  userId?: number
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  id: number
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  bookingId?: number
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: number
  name: string
  location: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type BookingType = 'INDOOR' | 'ACCOMPANIED_9' | 'ACCOMPANIED_18'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: number
  customerId: number
  type: BookingType
  status: BookingStatus
  bookingDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  totalPrice: number
  numberOfPlayers?: number
  courseId?: number
  specialRequests?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string

  // Relations
  customer?: Customer
  timeSlots?: TimeSlot[]
  course?: Course
}

export interface WeeklySchedule {
  id: number
  weekType: 1 | 2
  dayOfWeek: number
  slots: ScheduleSlot[]
  createdAt: string
  updatedAt: string
}

export interface ScheduleSlot {
  id: number
  weeklyScheduleId: number
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

// API Request/Response types

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  user: User
}

export interface CreateIndoorBookingRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  timeSlotIds: number[]
  specialRequests?: string
}

export interface CreateAccompaniedBookingRequest {
  type: 'ACCOMPANIED_9' | 'ACCOMPANIED_18'
  firstName: string
  lastName: string
  email: string
  phone: string
  date?: string
  numberOfPlayers: number
  courseId: number
  specialRequests?: string
  preferCallback?: boolean
}

export interface BookingResponse {
  message: string
  booking: Booking
}

export interface AvailableSlotsResponse {
  date: string
  available: boolean
  totalSlots?: number
  reason?: string
  slots: TimeSlot[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface ApiError {
  error: string
  details?: any
}
