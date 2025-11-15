import { create } from 'zustand'
import type { TimeSlot, CreateIndoorBookingRequest } from '@/types'

interface BookingState {
  // Step 1: Date selection
  selectedDate: string | null
  setSelectedDate: (date: string | null) => void

  // Step 2: Time slots
  availableSlots: TimeSlot[]
  setAvailableSlots: (slots: TimeSlot[]) => void
  selectedSlots: TimeSlot[]
  setSelectedSlots: (slots: TimeSlot[]) => void
  toggleSlot: (slot: TimeSlot) => void

  // Step 3: Customer info
  customerInfo: Partial<CreateIndoorBookingRequest> | null
  setCustomerInfo: (info: Partial<CreateIndoorBookingRequest>) => void

  // Current step
  currentStep: number
  setCurrentStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void

  // Calculated values
  getTotalPrice: () => number
  getSelectedSlotIds: () => number[]

  // Reset
  reset: () => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  selectedDate: null,
  availableSlots: [],
  selectedSlots: [],
  customerInfo: null,
  currentStep: 1,
  isLoading: false,

  // Setters
  setSelectedDate: (date) => set({ selectedDate: date }),
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  setSelectedSlots: (slots) => set({ selectedSlots: slots }),
  setCustomerInfo: (info) => set({ customerInfo: info }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Toggle slot selection
  toggleSlot: (slot) =>
    set((state) => {
      const isSelected = state.selectedSlots.some((s) => s.id === slot.id)

      if (isSelected) {
        // Remove slot
        return {
          selectedSlots: state.selectedSlots.filter((s) => s.id !== slot.id),
        }
      } else {
        // Add slot (max 3 slots)
        if (state.selectedSlots.length >= 3) {
          return state // Don't add more than 3
        }

        // Add and sort by start time
        const newSlots = [...state.selectedSlots, slot].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        )

        return { selectedSlots: newSlots }
      }
    }),

  // Step navigation
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  // Calculated values
  getTotalPrice: () => {
    const { selectedSlots } = get()
    return selectedSlots.length * 70 // 70€ per slot
  },

  getSelectedSlotIds: () => {
    const { selectedSlots } = get()
    return selectedSlots.map((slot) => slot.id)
  },

  // Reset all state
  reset: () =>
    set({
      selectedDate: null,
      availableSlots: [],
      selectedSlots: [],
      customerInfo: null,
      currentStep: 1,
      isLoading: false,
    }),
}))
