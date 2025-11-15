import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { TimeSlot } from '@/types'

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedSlots: TimeSlot[]
  onToggleSlot: (slot: TimeSlot) => void
  isLoading?: boolean
}

export function TimeSlotPicker({
  slots,
  selectedSlots,
  onToggleSlot,
  isLoading = false,
}: TimeSlotPickerProps) {
  const isSelected = (slot: TimeSlot) => {
    return selectedSlots.some((s) => s.id === slot.id)
  }

  const canSelectMore = selectedSlots.length < 3

  // Check if slots are consecutive
  const areConsecutive = (slots: TimeSlot[]): boolean => {
    if (slots.length <= 1) return true

    const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime))

    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endTime !== sorted[i + 1].startTime) {
        return false
      }
    }

    return true
  }

  // Group slots by time period (morning, afternoon)
  const morningSlots = slots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(':')[0])
    return hour < 12
  })

  const afternoonSlots = slots.filter((slot) => {
    const hour = parseInt(slot.startTime.split(':')[0])
    return hour >= 12
  })

  const renderSlots = (slotList: TimeSlot[], title: string) => {
    if (slotList.length === 0) return null

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">{title}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {slotList.map((slot) => {
            const selected = isSelected(slot)
            const disabled = !canSelectMore && !selected

            return (
              <button
                key={slot.id}
                onClick={() => onToggleSlot(slot)}
                disabled={disabled}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-sm font-medium",
                  "hover:border-primary hover:bg-accent",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  selected && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                )}
              >
                <div>{slot.startTime} - {slot.endTime}</div>
                <div className="text-xs mt-1">
                  {selected && <Badge variant="success" className="text-xs">Sélectionné</Badge>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (slots.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const consecutiveWarning = selectedSlots.length > 1 && !areConsecutive(selectedSlots)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Choisissez vos créneaux</CardTitle>
        <CardDescription>
          Sélectionnez de 1 à 3 créneaux consécutifs (70€ par créneau)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Consecutive warning */}
        {consecutiveWarning && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              ⚠️ Les créneaux doivent être consécutifs (pas de trous entre les créneaux)
            </AlertDescription>
          </Alert>
        )}

        {/* Selection info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
          <div className="text-sm">
            <span className="font-medium">{selectedSlots.length} créneau(x) sélectionné(s)</span>
            {selectedSlots.length > 0 && (
              <span className="text-muted-foreground ml-2">
                ({selectedSlots.length * 60} min total)
              </span>
            )}
          </div>
          <div className="text-lg font-bold">
            {selectedSlots.length * 70}€
          </div>
        </div>

        {/* Slots */}
        {renderSlots(morningSlots, "Matinée")}
        {renderSlots(afternoonSlots, "Après-midi")}

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Astuce :</strong> Les créneaux doivent se suivre sans interruption.
            Par exemple : 09:00-10:00, 10:00-11:00, 11:00-12:00.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
