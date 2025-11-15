import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PlayerSelectorProps {
  numberOfPlayers: number
  onSelectPlayers: (count: number) => void
  basePrice: number
}

export function PlayerSelector({ numberOfPlayers, onSelectPlayers, basePrice }: PlayerSelectorProps) {
  const pricePerPlayer = Math.round(basePrice / numberOfPlayers)

  const handleDecrement = () => {
    if (numberOfPlayers > 1) {
      onSelectPlayers(numberOfPlayers - 1)
    }
  }

  const handleIncrement = () => {
    if (numberOfPlayers < 3) {
      onSelectPlayers(numberOfPlayers + 1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nombre de joueurs</CardTitle>
        <CardDescription>
          Sélectionnez le nombre de joueurs (1 à 3 personnes max)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="players">
            Joueurs <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleDecrement}
              disabled={numberOfPlayers <= 1}
              className="h-12 w-12 rounded-full text-xl"
            >
              -
            </Button>
            <div className="text-center min-w-[120px]">
              <div className="text-4xl font-bold text-primary">{numberOfPlayers}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {numberOfPlayers === 1 ? 'joueur' : 'joueurs'}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleIncrement}
              disabled={numberOfPlayers >= 3}
              className="h-12 w-12 rounded-full text-xl"
            >
              +
            </Button>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Prix total du parcours</span>
            <Badge variant="secondary" className="text-base font-semibold">
              {basePrice}€
            </Badge>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm font-medium">Prix par joueur</span>
            <Badge variant="default" className="text-lg font-bold">
              {pricePerPlayer}€
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Plus vous êtes nombreux, moins le prix par personne est élevé
          </p>
        </div>

        {/* Quick select buttons */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Sélection rapide</Label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((count) => (
              <Button
                key={count}
                type="button"
                variant={numberOfPlayers === count ? 'default' : 'outline'}
                onClick={() => onSelectPlayers(count)}
                className="h-auto py-3 flex flex-col"
              >
                <div className="text-lg font-bold">{count}</div>
                <div className="text-xs">
                  {count === 1 ? 'Solo' : count === 2 ? 'Duo' : 'Trio'}
                </div>
                <div className="text-xs mt-1 font-normal">
                  {Math.round(basePrice / count)}€/pers
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
