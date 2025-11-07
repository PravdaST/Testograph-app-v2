'use client'

/**
 * DayCard Component
 * Displays all content for a single day (meals, workouts, TestoUp, etc.)
 */

import { useRouter } from 'next/navigation'
import { MealCard } from './MealCard'
import { TestoUpTracker } from './TestoUpTracker'
import { SleepAdvice } from './SleepAdvice'
import { Calendar, TrendingUp, Dumbbell, ChevronRight } from 'lucide-react'
import { formatDate, getDayNameFull, getDayNumber } from '@/lib/utils/date-helpers'

interface Meal {
  meal_number: number
  time: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: {
    name: string
    quantity: string
    calories: number
  }[]
}

interface Workout {
  name: string
  duration: number
}

interface DayCardProps {
  date: Date
  programStartDate: Date
  meals: Meal[]
  workout?: Workout
  testoUpMorning: boolean
  testoUpEvening: boolean
  testoUpInventory?: {
    capsules_remaining: number
    days_remaining: number
    percentage_remaining: number
  } | null
  onTestoUpToggle: (timeOfDay: 'morning' | 'evening') => void
  onTestoUpRefill?: () => void
  onMealComplete?: (mealNumber: number) => void
  completedMeals?: number[]
  category: 'energy' | 'libido' | 'muscle'
  mealsRef?: React.RefObject<HTMLDivElement | null>
  workoutRef?: React.RefObject<HTMLDivElement | null>
  sleepRef?: React.RefObject<HTMLDivElement | null>
  supplementRef?: React.RefObject<HTMLDivElement | null>
}

export function DayCard({
  date,
  programStartDate,
  meals,
  workout,
  testoUpMorning,
  testoUpEvening,
  testoUpInventory,
  onTestoUpToggle,
  onTestoUpRefill,
  onMealComplete,
  completedMeals = [],
  category,
  mealsRef,
  workoutRef,
  sleepRef,
  supplementRef,
}: DayCardProps) {
  const router = useRouter()
  const dayNumber = getDayNumber(programStartDate, date)
  const dayName = getDayNameFull(date.getDay())
  const dateStr = formatDate(date)
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()

  // Calculate daily totals
  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{dayName}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{dateStr}</span>
              {dayNumber > 0 && dayNumber <= 30 && (
                <>
                  <span>•</span>
                  <span>Ден {dayNumber} от 30</span>
                </>
              )}
            </div>
          </div>

          {/* Progress Ring (simplified) */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {Math.round((dayNumber / 30) * 100)}%
            </span>
          </div>
        </div>

        {/* Daily Totals */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-bold">{dailyTotals.calories}</div>
            <div className="text-xs text-muted-foreground">kcal</div>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-bold">{dailyTotals.protein}г</div>
            <div className="text-xs text-muted-foreground">Протеин</div>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-bold">{dailyTotals.carbs}г</div>
            <div className="text-xs text-muted-foreground">Въгл.</div>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-lg font-bold">{dailyTotals.fats}г</div>
            <div className="text-xs text-muted-foreground">Мазнини</div>
          </div>
        </div>
      </div>

      {/* TestoUp Tracker */}
      <div ref={supplementRef}>
        <TestoUpTracker
          morningCompleted={testoUpMorning}
          eveningCompleted={testoUpEvening}
          inventory={testoUpInventory}
          onToggle={onTestoUpToggle}
          onRefill={onTestoUpRefill}
        />
      </div>

      {/* Meals Section */}
      <div ref={mealsRef} className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>Хранителен план</span>
          <span className="text-sm font-normal text-muted-foreground">
            ({meals.length} хранения)
          </span>
        </h3>

        <div className="space-y-3">
          {meals.map((meal) => (
            <MealCard
              key={meal.meal_number}
              mealNumber={meal.meal_number}
              time={meal.time}
              name={meal.name}
              calories={meal.calories}
              protein={meal.protein}
              carbs={meal.carbs}
              fats={meal.fats}
              ingredients={meal.ingredients}
              isCompleted={completedMeals.includes(meal.meal_number)}
              onToggleComplete={
                onMealComplete
                  ? () => onMealComplete(meal.meal_number)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Workout Section */}
      {workout && workout.duration > 0 && (
        <div ref={workoutRef}>
          <button
            onClick={() => router.push(`/app/workout/${dayOfWeek}`)}
            className="w-full bg-background rounded-2xl p-6 border-2 border-border hover:border-primary transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{workout.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {workout.duration} минути тренировка
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>
      )}

      {/* Sleep & Recovery Section */}
      <div ref={sleepRef}>
        <SleepAdvice category={category} />
      </div>
    </div>
  )
}
