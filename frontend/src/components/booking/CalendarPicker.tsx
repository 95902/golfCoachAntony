import { useState } from 'react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isPast, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CalendarPickerProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  maxDaysAhead?: number
}

export function CalendarPicker({ selectedDate, onSelectDate, maxDaysAhead = 30 }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const today = new Date()
  const maxDate = addDays(today, maxDaysAhead)

  // Get day names
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  // Calculate starting day offset (Monday = 0)
  const startDayOffset = (monthStart.getDay() + 6) % 7

  // Determine if a day is selectable
  const isDateSelectable = (date: Date) => {
    return !isPast(date) && date <= maxDate
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sélectionnez une date</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            disabled={currentMonth <= today}
          >
            ←
          </Button>
          <h3 className="font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
          >
            →
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day names */}
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for offset */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Days */}
          {daysInMonth.map((day) => {
            const selectable = isDateSelectable(day)
            const selected = selectedDate && isSameDay(day, selectedDate)
            const isCurrentDay = isToday(day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => selectable && onSelectDate(day)}
                disabled={!selectable}
                className={cn(
                  "h-10 w-full rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  selected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  isCurrentDay && !selected && "border-2 border-primary",
                  !isSameMonth(day, currentMonth) && "text-muted-foreground"
                )}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Vous pouvez réserver jusqu'à {maxDaysAhead} jours à l'avance
        </p>
      </CardContent>
    </Card>
  )
}
