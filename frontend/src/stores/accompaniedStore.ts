import { create } from 'zustand'
import type { Course, CreateAccompaniedBookingRequest } from '@/types'

interface AccompaniedBookingState {
  // Step 1: Type selection (9 or 18 holes)
  bookingType: 'ACCOMPANIED_9' | 'ACCOMPANIED_18' | null
  setBookingType: (type: 'ACCOMPANIED_9' | 'ACCOMPANIED_18') => void

  // Step 2: Course and players
  selectedCourse: Course | null
  setSelectedCourse: (course: Course | null) => void

  numberOfPlayers: number
  setNumberOfPlayers: (count: number) => void

  // Step 3: Date selection (optional)
  selectedDate: string | null
  setSelectedDate: (date: string | null) => void

  preferCallback: boolean
  setPreferCallback: (prefer: boolean) => void

  // Step 4: Customer info
  customerInfo: Partial<CreateAccompaniedBookingRequest> | null
  setCustomerInfo: (info: Partial<CreateAccompaniedBookingRequest>) => void

  // Current step
  currentStep: number
  setCurrentStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void

  // Calculated values
  getBasePrice: () => number
  getPricePerPlayer: () => number
  getTotalPrice: () => number

  // Reset
  reset: () => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAccompaniedStore = create<AccompaniedBookingState>((set, get) => ({
  // Initial state
  bookingType: null,
  selectedCourse: null,
  numberOfPlayers: 1,
  selectedDate: null,
  preferCallback: false,
  customerInfo: null,
  currentStep: 1,
  isLoading: false,

  // Setters
  setBookingType: (type) => set({ bookingType: type }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setNumberOfPlayers: (count) => set({ numberOfPlayers: Math.min(Math.max(count, 1), 3) }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setPreferCallback: (prefer) => set({ preferCallback: prefer }),
  setCustomerInfo: (info) => set({ customerInfo: info }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Step navigation
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  // Calculated values
  getBasePrice: () => {
    const { bookingType } = get()
    if (bookingType === 'ACCOMPANIED_9') return 180
    if (bookingType === 'ACCOMPANIED_18') return 300
    return 0
  },

  getPricePerPlayer: () => {
    const { numberOfPlayers } = get()
    const basePrice = get().getBasePrice()
    return Math.round(basePrice / numberOfPlayers)
  },

  getTotalPrice: () => {
    return get().getBasePrice()
  },

  // Reset all state
  reset: () =>
    set({
      bookingType: null,
      selectedCourse: null,
      numberOfPlayers: 1,
      selectedDate: null,
      preferCallback: false,
      customerInfo: null,
      currentStep: 1,
      isLoading: false,
    }),
}))
