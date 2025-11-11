'use client'

/**
 * WorkoutWeekCalendar Component
 * Shows 7 days of the week with workout/rest status and completion
 */

import { CheckCircle2, Moon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Workout {
  day_of_week: number
  name: string
  duration: number
}

interface WorkoutWeekCalendarProps {
  workouts: Workout[]
  currentDayOfWeek: number
  completedDays: Record<number, boolean>
}

const DAY_NAMES = ['Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб', 'Нед']

export function WorkoutWeekCalendar({
  workouts,
  currentDayOfWeek,
  completedDays,
}: WorkoutWeekCalendarProps) {
  const router = useRouter()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">
        Седмична програма
      </h3>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) => {
          const workout = workouts.find((w) => w.day_of_week === dayOfWeek)
          const isRestDay = !workout || workout.duration === 0
          const isCompleted = completedDays[dayOfWeek] === true
          const isCurrent = dayOfWeek === currentDayOfWeek
          const dayName = DAY_NAMES[dayOfWeek - 1]

          return (
            <button
              key={dayOfWeek}
              onClick={() => router.push(`/app/workout/${dayOfWeek}`)}
              className={`
                flex-shrink-0 w-16 rounded-xl p-3 transition-all relative
                ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary'
                    : isCompleted
                      ? 'bg-green-500/20 border-2 border-green-500 text-green-700 dark:text-green-400'
                      : isRestDay
                        ? 'bg-muted/50 border border-dashed border-muted-foreground/30 text-muted-foreground'
                        : 'bg-background border border-border hover:border-primary hover:bg-primary/5'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-1">
                {/* Day Name */}
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-primary-foreground'
                      : isCompleted
                        ? 'text-green-700 dark:text-green-400'
                        : isRestDay
                          ? 'text-muted-foreground'
                          : 'text-muted-foreground'
                  }`}
                >
                  {dayName}
                </span>

                {/* Workout or Rest Icon */}
                <div className="relative">
                  {isRestDay ? (
                    <Moon className="w-5 h-5" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        isCurrent
                          ? 'border-primary-foreground'
                          : 'border-muted-foreground'
                      }`}
                    />
                  )}
                </div>

                {/* Workout Name (shortened) */}
                {!isRestDay && workout && (
                  <span
                    className={`text-[10px] font-medium truncate max-w-full ${
                      isCurrent
                        ? 'text-primary-foreground/80'
                        : isCompleted
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {workout.name.split(' ')[0]}
                  </span>
                )}

                {/* Current Day Indicator Dot */}
                {isCurrent && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-500" />
          <span>Завършена</span>
        </div>
        <div className="flex items-center gap-1">
          <Moon className="w-3 h-3" />
          <span>Почивка</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border-2 border-muted-foreground" />
          <span>Планирана</span>
        </div>
      </div>
    </div>
  )
}
