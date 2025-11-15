import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Course, CreateAccompaniedBookingRequest } from '@/types'

interface AccompaniedSummaryProps {
  bookingType: 'ACCOMPANIED_9' | 'ACCOMPANIED_18'
  course: Course
  numberOfPlayers: number
  selectedDate: string | null
  preferCallback: boolean
  customerInfo: Partial<CreateAccompaniedBookingRequest>
  basePrice: number
  pricePerPlayer: number
  totalPrice: number
  onConfirm: () => void
  onBack: () => void
  isSubmitting: boolean
  error?: string | null
}

export function AccompaniedSummary({
  bookingType,
  course,
  numberOfPlayers,
  selectedDate,
  preferCallback,
  customerInfo,
  basePrice,
  pricePerPlayer,
  totalPrice,
  onConfirm,
  onBack,
  isSubmitting,
  error,
}: AccompaniedSummaryProps) {
  const is9Holes = bookingType === 'ACCOMPANIED_9'
  const holesText = is9Holes ? '9 Trous' : '18 Trous'
  const durationText = is9Holes ? '4 heures' : 'Journée complète'

  const formattedDate = selectedDate
    ? format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })
    : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Récapitulatif de votre réservation</CardTitle>
            <Badge variant="secondary" className="text-base">
              {holesText}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Booking details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Détails du parcours</h3>
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Type de parcours</span>
                  <span className="font-medium text-right">
                    {holesText}
                    <br />
                    <span className="text-sm text-muted-foreground">{durationText}</span>
                  </span>
                </div>
                <div className="flex justify-between items-start pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Parcours</span>
                  <span className="font-medium text-right">
                    {course.name}
                    <br />
                    <span className="text-sm text-muted-foreground">📍 {course.location}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Nombre de joueurs</span>
                  <span className="font-medium">
                    {numberOfPlayers} {numberOfPlayers === 1 ? 'joueur' : 'joueurs'}
                  </span>
                </div>
                <div className="flex justify-between items-start pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="font-medium text-right">
                    {preferCallback ? (
                      <Badge variant="outline" className="font-normal">
                        Rappel demandé
                      </Badge>
                    ) : formattedDate ? (
                      formattedDate
                    ) : (
                      'Non sélectionnée'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer information */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Vos informations</h3>
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nom complet</span>
                  <span className="font-medium">
                    {customerInfo.firstName} {customerInfo.lastName}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{customerInfo.email}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Téléphone</span>
                  <span className="font-medium">{customerInfo.phone}</span>
                </div>
                {customerInfo.specialRequests && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-muted-foreground block mb-1">
                      Demandes spéciales
                    </span>
                    <p className="text-sm">{customerInfo.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price breakdown */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Tarification</h3>
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Prix du parcours</span>
                  <span className="font-medium">{basePrice}€</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Prix par joueur</span>
                  <span className="font-medium">{pricePerPlayer}€</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t mt-2">
                  <span className="font-semibold text-base">Total à payer</span>
                  <Badge variant="default" className="text-xl font-bold px-4 py-2">
                    {totalPrice}€
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Important information */}
          <Alert>
            <AlertDescription>
              <strong>À savoir :</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  • Vous recevrez une confirmation par email à{' '}
                  <strong>{customerInfo.email}</strong>
                </li>
                {preferCallback ? (
                  <li>• Le coach vous contactera pour convenir d'une date</li>
                ) : (
                  <li>• Un rappel vous sera envoyé 24h avant votre séance</li>
                )}
                <li>• Annulation gratuite jusqu'à 48h avant la date prévue</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="sm:flex-1" size="lg">
              Retour
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="sm:flex-1"
              size="lg"
            >
              {isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
