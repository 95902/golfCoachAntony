import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PriceDisplayProps {
  bookingType: 'ACCOMPANIED_9' | 'ACCOMPANIED_18'
  numberOfPlayers: number
  basePrice: number
  pricePerPlayer: number
  totalPrice: number
  className?: string
}

export function PriceDisplay({
  bookingType,
  numberOfPlayers,
  basePrice,
  pricePerPlayer,
  totalPrice,
  className,
}: PriceDisplayProps) {
  const is9Holes = bookingType === 'ACCOMPANIED_9'
  const holesText = is9Holes ? '9 Trous' : '18 Trous'
  const durationText = is9Holes ? '4 heures' : 'Journée complète'

  const includedItems = is9Holes
    ? [
        'Accompagnement sur 9 trous',
        'Conseils personnalisés',
        'Analyse de jeu',
        'Durée : 4 heures',
      ]
    : [
        'Accompagnement sur 18 trous',
        'Conseils personnalisés tout au long du parcours',
        'Analyse complète de jeu',
        'Stratégie de parcours',
        'Durée : journée complète',
      ]

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Récapitulatif</CardTitle>
          <Badge variant="secondary">{holesText}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking type info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{holesText}</span>
            <span className="text-sm text-muted-foreground">{durationText}</span>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 pb-3 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Prix du parcours</span>
            <span className="text-sm font-medium">{basePrice}€</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Nombre de joueurs
            </span>
            <span className="text-sm font-medium">
              {numberOfPlayers} {numberOfPlayers === 1 ? 'joueur' : 'joueurs'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Prix par joueur</span>
            <span className="text-sm font-medium">{pricePerPlayer}€</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-2">
          <span className="text-base font-semibold">Total</span>
          <Badge variant="default" className="text-xl font-bold px-4 py-2">
            {totalPrice}€
          </Badge>
        </div>

        {/* Included items */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-semibold mb-2">Ce qui est inclus</h4>
          <ul className="space-y-1.5">
            {includedItems.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Additional info */}
        <div className="p-3 bg-primary/5 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Bon à savoir :</strong> Le prix est fixe quel que soit le nombre de
            joueurs. Partagez les frais entre vous !
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
