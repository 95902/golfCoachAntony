import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { CreateAccompaniedBookingRequest } from '@/types'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const bookingSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères'),
  specialRequests: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface AccompaniedBookingFormProps {
  onSubmit: (data: Partial<CreateAccompaniedBookingRequest>) => void
  initialData?: Partial<CreateAccompaniedBookingRequest>
  preferCallback: boolean
  onToggleCallback: (value: boolean) => void
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

export function AccompaniedBookingForm({
  onSubmit,
  initialData,
  preferCallback,
  onToggleCallback,
  selectedDate,
  onSelectDate,
}: AccompaniedBookingFormProps) {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      specialRequests: initialData?.specialRequests || '',
    },
  })

  const handleFormSubmit = async (data: BookingFormData) => {
    setError(null)

    // Validate that either a date is selected OR preferCallback is checked
    if (!preferCallback && !selectedDate) {
      setError('Veuillez sélectionner une date ou cocher "Être rappelé"')
      return
    }

    try {
      onSubmit(data)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    }
  }

  // Generate next 30 days for date selection
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const availableDates = generateDates()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vos informations</CardTitle>
        <CardDescription>
          Remplissez le formulaire pour finaliser votre réservation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Date selection or callback preference */}
          <div className="space-y-4">
            <Label>Date souhaitée</Label>

            <div className="space-y-3">
              {/* Callback checkbox */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="preferCallback"
                  checked={preferCallback}
                  onChange={(e) => {
                    onToggleCallback(e.target.checked)
                    if (e.target.checked) {
                      onSelectDate(null)
                    }
                  }}
                  className="mt-1 h-4 w-4 rounded border-input"
                />
                <div>
                  <label
                    htmlFor="preferCallback"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Je préfère être rappelé(e)
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Le coach vous contactera pour convenir d'une date
                  </p>
                </div>
              </div>

              {/* Date selector (disabled if preferCallback) */}
              {!preferCallback && (
                <div className="space-y-2">
                  <select
                    value={selectedDate || ''}
                    onChange={(e) => onSelectDate(e.target.value || null)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={preferCallback}
                  >
                    <option value="">-- Sélectionnez une date --</option>
                    {availableDates.map((date) => {
                      const dateStr = format(date, 'yyyy-MM-dd')
                      const displayStr = format(date, 'EEEE d MMMM yyyy', { locale: fr })
                      return (
                        <option key={dateStr} value={dateStr}>
                          {displayStr}
                        </option>
                      )
                    })}
                  </select>
                  {!preferCallback && !selectedDate && (
                    <p className="text-xs text-muted-foreground">
                      Sélectionnez une date ou cochez "Être rappelé"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Votre prénom"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Votre nom"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Téléphone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Demandes spéciales (optionnel)</Label>
            <textarea
              id="specialRequests"
              placeholder="Niveau de jeu, objectifs particuliers, besoins spécifiques..."
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('specialRequests')}
            />
            {errors.specialRequests && (
              <p className="text-sm text-destructive">{errors.specialRequests.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Chargement...' : 'Continuer vers le récapitulatif'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
