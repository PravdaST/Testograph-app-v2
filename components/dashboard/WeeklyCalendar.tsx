'use client'

/**
 * WeeklyCalendar Component
 * Horizontal scrolling week view (7 days)
 * Shows current week with today highlighted
 */

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
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

interface CompletionStatus {
  completed: number
  total: number
}

interface WeeklyCalendarProps {
  programStartDate: Date
  selectedDate: Date
  onDateSelect: (date: Date) => void
  completedDates?: Record<string, CompletionStatus> // Map of dateString -> completion status
}

export function WeeklyCalendar({
  programStartDate,
  selectedDate,
  onDateSelect,
  completedDates = {},
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
          className="p-2 rounded-lg hover:bg-muted transition-colors ripple-effect hover-lift"
          aria-label="Предишна седмица"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors ripple-effect hover-lift"
        >
          Днес
        </button>

        <button
          onClick={handleNextWeek}
          className="p-2 rounded-lg hover:bg-muted transition-colors ripple-effect hover-lift"
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

          // Check completion status
          const dateString = day.toISOString().split('T')[0]
          const completionStatus = completedDates[dateString]
          const completedCount = completionStatus?.completed || 0
          const isFullyCompleted = completedCount === 4
          const isPartiallyCompleted = completedCount > 0 && completedCount < 4
          const isNotCompleted = completedCount === 0

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isBeforeProgramStart && onDateSelect(day)}
              disabled={isBeforeProgramStart}
              className={`
                flex-shrink-0 w-16 rounded-xl p-3 transition-all
                ${
                  isBeforeProgramStart
                    ? 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed opacity-60'
                    : isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105 hover-lift ripple-effect'
                      : isDayToday
                        ? 'bg-primary/10 border-2 border-primary text-primary hover-lift ripple-effect'
                        : isFullyCompleted
                          ? 'bg-success/10 border-2 border-success/30 text-success hover-lift ripple-effect'
                          : isPartiallyCompleted && isDayPast
                            ? 'bg-warning/10 border-2 border-warning/30 text-warning hover-lift ripple-effect'
                            : isNotCompleted && isDayPast
                              ? 'bg-destructive/10 border-2 border-destructive/30 text-destructive hover-lift ripple-effect'
                              : isDayPast
                                ? 'bg-muted text-muted-foreground hover-lift ripple-effect'
                                : 'bg-background border border-border hover:border-primary hover:bg-primary/5 hover-lift ripple-effect'
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
                        : isFullyCompleted
                          ? 'text-success'
                          : isPartiallyCompleted && isDayPast
                            ? 'text-warning'
                            : isNotCompleted && isDayPast && !isBeforeProgramStart
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                  }`}
                >
                  {getDayNameShort(dayOfWeek)}
                </span>

                {/* Day Date or Lock Icon */}
                {isBeforeProgramStart ? (
                  <Lock className="w-5 h-5 text-muted-foreground/40" />
                ) : (
                  <span
                    className={`text-lg font-bold ${
                      isSelected
                        ? 'text-primary-foreground'
                        : isDayToday
                          ? 'text-primary'
                          : isFullyCompleted
                            ? 'text-success'
                            : isPartiallyCompleted && isDayPast
                              ? 'text-warning'
                              : isNotCompleted && isDayPast
                                ? 'text-destructive'
                                : ''
                    }`}
                  >
                    {day.getDate()}
                  </span>
                )}

                {/* Program Day Number - Show from program start onwards (past, today, and future) */}
                {!isBeforeProgramStart && dayNumber > 0 && dayNumber <= 30 && (
                  <span
                    className={`text-xs ${
                      isSelected
                        ? 'text-primary-foreground/80'
                        : isFullyCompleted
                          ? 'text-success/80'
                          : isPartiallyCompleted && isDayPast
                            ? 'text-warning/80'
                            : isNotCompleted && isDayPast && !isBeforeProgramStart
                              ? 'text-destructive/80'
                              : isDayFuture
                                ? 'text-muted-foreground/60'
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
