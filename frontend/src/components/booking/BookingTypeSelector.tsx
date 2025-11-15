import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface BookingTypeSelectorProps {
  selectedType: 'ACCOMPANIED_9' | 'ACCOMPANIED_18' | null
  onSelectType: (type: 'ACCOMPANIED_9' | 'ACCOMPANIED_18') => void
}

export function BookingTypeSelector({ selectedType, onSelectType }: BookingTypeSelectorProps) {
  const types = [
    {
      value: 'ACCOMPANIED_9' as const,
      title: '9 Trous',
      duration: '4 heures',
      price: '180€',
      description: 'Demi-journée sur un parcours de 9 trous avec coaching professionnel',
    },
    {
      value: 'ACCOMPANIED_18' as const,
      title: '18 Trous',
      duration: 'Journée complète',
      price: '300€',
      description: 'Journée complète sur un parcours de 18 trous avec coaching professionnel',
      warning: 'Bloque toute la journée',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Type de parcours</CardTitle>
        <CardDescription>Choisissez votre formule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => onSelectType(type.value)}
              className={cn(
                "p-6 rounded-lg border-2 text-left transition-all",
                "hover:border-primary hover:bg-accent",
                selectedType === type.value && "bg-primary text-primary-foreground border-primary"
              )}
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{type.title}</h3>
                <p className="text-sm opacity-90">{type.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-current/20">
                  <div>
                    <p className="text-xs opacity-75">Durée</p>
                    <p className="font-semibold">{type.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75">Prix total</p>
                    <p className="text-2xl font-bold">{type.price}</p>
                  </div>
                </div>
                {type.warning && (
                  <p className="text-xs opacity-75 mt-2">⚠️ {type.warning}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Info :</strong> Le prix est divisé entre les joueurs (1 à 3 max).
            Par exemple, pour 2 joueurs en 9 trous : 90€/personne.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
