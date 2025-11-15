import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '@/stores/bookingStore'
import { getAvailableSlots, createIndoorBooking } from '@/services/bookings'
import { CalendarPicker } from '@/components/booking/CalendarPicker'
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker'
import { BookingForm, type BookingFormData } from '@/components/booking/BookingForm'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function BookingIndoor() {
  const navigate = useNavigate()

  const {
    selectedDate,
    setSelectedDate,
    availableSlots,
    setAvailableSlots,
    selectedSlots,
    toggleSlot,
    customerInfo,
    setCustomerInfo,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    getTotalPrice,
    getSelectedSlotIds,
    reset,
    isLoading,
    setIsLoading,
  } = useBookingStore()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchSlots(format(new Date(selectedDate), 'yyyy-MM-dd'))
    }
  }, [selectedDate])

  const fetchSlots = async (dateString: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getAvailableSlots(dateString)
      setAvailableSlots(response.slots)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la récupération des créneaux')
      setAvailableSlots([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'))
  }

  const handleContinueToForm = () => {
    if (selectedSlots.length === 0) {
      setError('Veuillez sélectionner au moins un créneau')
      return
    }

    // Check if slots are consecutive
    const sorted = [...selectedSlots].sort((a, b) => a.startTime.localeCompare(b.startTime))
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endTime !== sorted[i + 1].startTime) {
        setError('Les créneaux doivent être consécutifs')
        return
      }
    }

    setError(null)
    nextStep()
  }

  const handleFormSubmit = (data: BookingFormData) => {
    setCustomerInfo(data)
    nextStep()
  }

  const handleConfirmBooking = async () => {
    if (!customerInfo || !selectedDate) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await createIndoorBooking({
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        date: selectedDate,
        timeSlotIds: getSelectedSlotIds(),
        specialRequests: customerInfo.specialRequests,
      })

      setSuccess(true)
      // Show success for 3 seconds then redirect
      setTimeout(() => {
        reset()
        navigate('/')
      }, 3000)
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.response?.data?.details || 'Erreur lors de la réservation'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Réservation Confirmée !
            </h1>
            <p className="text-lg text-muted-foreground">
              Un email de confirmation a été envoyé à {customerInfo?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Vous allez être redirigé vers la page d'accueil...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Réservation Indoor - Simulateur TrackMan 4</h1>
          <p className="text-muted-foreground mt-2">
            Réservez vos créneaux de 1 heure sur notre simulateur de golf dernière génération
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 w-16 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm text-muted-foreground">
            <span>Date</span>
            <span>Créneaux</span>
            <span>Infos</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Date selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <CalendarPicker
                selectedDate={selectedDate ? new Date(selectedDate) : null}
                onSelectDate={handleDateSelect}
              />

              {selectedDate && (
                <div className="flex justify-end">
                  <Button onClick={() => nextStep()} size="lg">
                    Continuer →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Time slot selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <TimeSlotPicker
                slots={availableSlots}
                selectedSlots={selectedSlots}
                onToggleSlot={toggleSlot}
                isLoading={isLoading}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={previousStep}>
                  ← Retour
                </Button>
                <Button onClick={handleContinueToForm} className="flex-1" size="lg">
                  Continuer →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Customer info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <BookingForm onSubmit={handleFormSubmit} isLoading={isLoading} error={error} />

              <Button variant="outline" onClick={previousStep}>
                ← Retour
              </Button>
            </div>
          )}

          {/* Step 4: Summary and confirmation */}
          {currentStep === 4 && customerInfo && selectedDate && (
            <BookingSummary
              date={new Date(selectedDate)}
              slots={selectedSlots}
              customerInfo={customerInfo}
              totalPrice={getTotalPrice()}
              onConfirm={handleConfirmBooking}
              onBack={previousStep}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  )
}
