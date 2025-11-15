import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { TimeSlot } from '@/types'
import type { BookingFormData } from './BookingForm'

interface BookingSummaryProps {
  date: Date
  slots: TimeSlot[]
  customerInfo: BookingFormData
  totalPrice: number
  onConfirm: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string | null
}

export function BookingSummary({
  date,
  slots,
  customerInfo,
  totalPrice,
  onConfirm,
  onBack,
  isLoading = false,
  error,
}: BookingSummaryProps) {
  const sortedSlots = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime))
  const startTime = sortedSlots[0]?.startTime
  const endTime = sortedSlots[sortedSlots.length - 1]?.endTime
  const duration = slots.length * 60 // minutes

  return (
    <div className="space-y-6">
      {/* Success message */}
      <Alert variant="success">
        <AlertTitle className="text-lg font-semibold">
          ✓ Tout est prêt !
        </AlertTitle>
        <AlertDescription>
          Vérifiez les informations ci-dessous avant de confirmer votre réservation
        </AlertDescription>
      </Alert>

      {/* Booking details */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de la réservation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold">
                {format(date, 'EEEE dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horaire</p>
              <p className="font-semibold">
                {startTime} - {endTime}
              </p>
            </div>
          </div>

          {/* Duration and slots */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Durée</p>
              <p className="font-semibold">{duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Créneaux</p>
              <p className="font-semibold">{slots.length} créneau(x)</p>
            </div>
          </div>

          {/* Slot details */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Détail des créneaux</p>
            <div className="flex flex-wrap gap-2">
              {sortedSlots.map((slot) => (
                <div key={slot.id} className="px-3 py-1 bg-primary/10 rounded-md text-sm">
                  {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer info */}
      <Card>
        <CardHeader>
          <CardTitle>Vos informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-semibold">
                {customerInfo.firstName} {customerInfo.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{customerInfo.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Téléphone</p>
            <p className="font-semibold">{customerInfo.phone}</p>
          </div>

          {customerInfo.specialRequests && (
            <div>
              <p className="text-sm text-muted-foreground">Demandes spéciales</p>
              <p className="text-sm">{customerInfo.specialRequests}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price */}
      <Card className="border-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Prix total</p>
              <p className="text-xs text-muted-foreground">
                {slots.length} créneau(x) × 70€
              </p>
            </div>
            <div className="text-4xl font-bold text-primary">{totalPrice}€</div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading} className="flex-1">
          Retour
        </Button>
        <Button onClick={onConfirm} disabled={isLoading} className="flex-1" size="lg">
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Confirmation...
            </>
          ) : (
            'Confirmer la réservation'
          )}
        </Button>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          📧 <strong>Confirmation par email :</strong> Vous recevrez un email de confirmation
          à l'adresse <strong>{customerInfo.email}</strong> avec tous les détails de votre
          réservation.
        </p>
      </div>
    </div>
  )
}
