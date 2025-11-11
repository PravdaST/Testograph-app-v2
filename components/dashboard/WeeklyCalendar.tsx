'use client'

/**
 * WeeklyCalendar Component
 * Horizontal scrolling week view (7 days)
 * Shows current week with today highlighted
 */

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  getWeekStart,
  getWeekDays,
  formatDate,
  getDayNameShort,
  getDayNumber,
  isToday,
  isPast,
  isFuture,
} from '@/lib/utils/date-helpers'

interface WeeklyCalendarProps {
  programStartDate: Date
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function WeeklyCalendar({
  programStartDate,
  selectedDate,
  onDateSelect,
}: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(selectedDate)
  )

  const weekDays = getWeekDays(currentWeekStart)

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newWeekStart)
  }

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newWeekStart)
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentWeekStart(getWeekStart(today))
    onDateSelect(today)
  }

  return (
    <div className="space-y-4">
      {/* Week Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousWeek}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Предишна седмица"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
        >
          Днес
        </button>

        <button
          onClick={handleNextWeek}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Следваща седмица"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week Days Grid */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {weekDays.map((day) => {
          const dayNumber = getDayNumber(programStartDate, day)
          const dayOfWeek = day.getDay()
          const isSelected =
            formatDate(day) === formatDate(selectedDate)
          const isDayToday = isToday(day)
          const isDayPast = isPast(day)
          const isDayFuture = isFuture(day)

          // Check if day is before program start
          const dayTime = new Date(day).setHours(0, 0, 0, 0)
          const startTime = new Date(programStartDate).setHours(0, 0, 0, 0)
          const isBeforeProgramStart = dayTime < startTime

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                flex-shrink-0 w-16 rounded-xl p-3 transition-all
                ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : isDayToday
                      ? 'bg-primary/10 border-2 border-primary text-primary'
                      : isDayPast
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-background border border-border hover:border-primary hover:bg-primary/5'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-1">
                {/* Day Name */}
                <span
                  className={`text-xs font-medium ${
                    isSelected
                      ? 'text-primary-foreground'
                      : isDayToday
                        ? 'text-primary'
                        : 'text-muted-foreground'
                  }`}
                >
                  {getDayNameShort(dayOfWeek)}
                </span>

                {/* Day Date */}
                <span
                  className={`text-lg font-bold ${
                    isSelected
                      ? 'text-primary-foreground'
                      : isDayToday
                        ? 'text-primary'
                        : ''
                  }`}
                >
                  {day.getDate()}
                </span>

                {/* Program Day Number - Only show from program start onwards */}
                {!isBeforeProgramStart && dayNumber > 0 && dayNumber <= 30 && !isDayFuture && (
                  <span
                    className={`text-xs ${
                      isSelected
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Ден {dayNumber}
                  </span>
                )}

                {/* Today Indicator Dot */}
                {isDayToday && !isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
