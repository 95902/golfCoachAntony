import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccompaniedStore } from '@/stores/accompaniedStore'
import { BookingTypeSelector } from '@/components/booking/BookingTypeSelector'
import { CourseSelector } from '@/components/booking/CourseSelector'
import { PlayerSelector } from '@/components/booking/PlayerSelector'
import { AccompaniedBookingForm } from '@/components/booking/AccompaniedBookingForm'
import { AccompaniedSummary } from '@/components/booking/AccompaniedSummary'
import { PriceDisplay } from '@/components/booking/PriceDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createAccompaniedBooking } from '@/services/bookings'
import type { CreateAccompaniedBookingRequest } from '@/types'

export default function BookingAccompanied() {
  const navigate = useNavigate()
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const {
    bookingType,
    setBookingType,
    selectedCourse,
    setSelectedCourse,
    numberOfPlayers,
    setNumberOfPlayers,
    selectedDate,
    setSelectedDate,
    preferCallback,
    setPreferCallback,
    customerInfo,
    setCustomerInfo,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    getBasePrice,
    getPricePerPlayer,
    getTotalPrice,
    isLoading,
    setIsLoading,
    reset,
  } = useAccompaniedStore()

  const handleBookingTypeSelect = (type: 'ACCOMPANIED_9' | 'ACCOMPANIED_18') => {
    setBookingType(type)
    nextStep()
  }

  const handleCourseAndPlayersNext = () => {
    if (!selectedCourse) {
      setBookingError('Veuillez sélectionner un parcours')
      return
    }
    setBookingError(null)
    nextStep()
  }

  const handleFormSubmit = (data: Partial<CreateAccompaniedBookingRequest>) => {
    setCustomerInfo(data)
    nextStep()
  }

  const handleConfirmBooking = async () => {
    if (!bookingType || !selectedCourse || !customerInfo) {
      setBookingError('Informations manquantes')
      return
    }

    setIsLoading(true)
    setBookingError(null)

    try {
      const bookingData: CreateAccompaniedBookingRequest = {
        type: bookingType,
        courseId: selectedCourse.id,
        numberOfPlayers,
        firstName: customerInfo.firstName!,
        lastName: customerInfo.lastName!,
        email: customerInfo.email!,
        phone: customerInfo.phone!,
        date: preferCallback ? undefined : selectedDate || undefined,
        preferCallback,
        specialRequests: customerInfo.specialRequests,
      }

      await createAccompaniedBooking(bookingData)
      setBookingSuccess(true)
    } catch (err: any) {
      setBookingError(
        err.response?.data?.error || 'Erreur lors de la création de la réservation'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHome = () => {
    reset()
    navigate('/')
  }

  const handleNewBooking = () => {
    reset()
    setBookingSuccess(false)
    setBookingError(null)
  }

  // Success screen
  if (bookingSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Réservation confirmée !</h1>
              <p className="text-muted-foreground">
                {preferCallback
                  ? 'Votre demande a bien été enregistrée. Le coach vous contactera sous 24h pour convenir d\'une date.'
                  : 'Votre réservation a bien été enregistrée. Vous allez recevoir un email de confirmation.'}
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parcours</span>
                  <span className="font-medium">
                    {bookingType === 'ACCOMPANIED_9' ? '9 Trous' : '18 Trous'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Golf</span>
                  <span className="font-medium">{selectedCourse?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{customerInfo?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={handleBackToHome} className="sm:flex-1">
                Retour à l'accueil
              </Button>
              <Button onClick={handleNewBooking} className="sm:flex-1">
                Nouvelle réservation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main booking flow
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Réservation Parcours Accompagné</h1>
        <p className="text-muted-foreground">
          Réservez votre séance de golf accompagné par un coach professionnel
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Type' },
            { num: 2, label: 'Parcours' },
            { num: 3, label: 'Informations' },
            { num: 4, label: 'Confirmation' },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step.num
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.num
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.label}</span>
              </div>
              {idx < 3 && (
                <div
                  className={`h-1 flex-1 ${currentStep > step.num ? 'bg-primary' : 'bg-muted'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Booking type */}
          {currentStep === 1 && (
            <BookingTypeSelector
              selectedType={bookingType}
              onSelectType={handleBookingTypeSelect}
            />
          )}

          {/* Step 2: Course and players */}
          {currentStep === 2 && (
            <>
              <CourseSelector selectedCourse={selectedCourse} onSelectCourse={setSelectedCourse} />
              <PlayerSelector
                numberOfPlayers={numberOfPlayers}
                onSelectPlayers={setNumberOfPlayers}
                basePrice={getBasePrice()}
              />
              {bookingError && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                  {bookingError}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={previousStep} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleCourseAndPlayersNext} className="flex-1">
                  Continuer
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Customer form */}
          {currentStep === 3 && (
            <>
              <AccompaniedBookingForm
                onSubmit={handleFormSubmit}
                initialData={customerInfo}
                preferCallback={preferCallback}
                onToggleCallback={setPreferCallback}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              <Button variant="outline" onClick={previousStep} className="w-full">
                Retour
              </Button>
            </>
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && selectedCourse && bookingType && (
            <AccompaniedSummary
              bookingType={bookingType}
              course={selectedCourse}
              numberOfPlayers={numberOfPlayers}
              selectedDate={selectedDate}
              preferCallback={preferCallback}
              customerInfo={customerInfo || {}}
              basePrice={getBasePrice()}
              pricePerPlayer={getPricePerPlayer()}
              totalPrice={getTotalPrice()}
              onConfirm={handleConfirmBooking}
              onBack={previousStep}
              isSubmitting={isLoading}
              error={bookingError}
            />
          )}
        </div>

        {/* Sidebar - Price display */}
        {currentStep > 1 && bookingType && (
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <PriceDisplay
                bookingType={bookingType}
                numberOfPlayers={numberOfPlayers}
                basePrice={getBasePrice()}
                pricePerPlayer={getPricePerPlayer()}
                totalPrice={getTotalPrice()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
