'use client'

/**
 * MealsSection Component
 * Displays all meals for a day with confirmation and locking
 */

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { MealCard } from './MealCard'

interface Ingredient {
  name: string
  quantity: string
  calories: number
}

interface Meal {
  meal_number: number
  time: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: Ingredient[]
}

interface MealsSectionProps {
  meals: Meal[]
  completedMeals: number[]
  isLocked?: boolean
  onConfirm: (mealNumbers: number[]) => void
}

export function MealsSection({
  meals,
  completedMeals,
  isLocked = false,
  onConfirm,
}: MealsSectionProps) {
  // Local state for pending selections
  const [pendingMeals, setPendingMeals] = useState<number[]>(completedMeals)

  // Update pending state when props change
  useEffect(() => {
    setPendingMeals(completedMeals)
  }, [completedMeals])

  const hasChanges = JSON.stringify(pendingMeals.sort()) !== JSON.stringify(completedMeals.sort())
  const canConfirm = !isLocked && hasChanges

  const handleToggleMeal = (mealNumber: number) => {
    if (isLocked) return

    if (pendingMeals.includes(mealNumber)) {
      setPendingMeals(pendingMeals.filter(m => m !== mealNumber))
    } else {
      setPendingMeals([...pendingMeals, mealNumber])
    }
  }

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(pendingMeals)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>Хранителен план</span>
          <span className="text-sm font-normal text-muted-foreground">
            ({meals.length} хранения)
          </span>
        </h3>

        {isLocked && completedMeals.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Заключено</span>
          </div>
        )}
      </div>

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
            isCompleted={pendingMeals.includes(meal.meal_number)}
            isLocked={isLocked}
            onToggleComplete={() => handleToggleMeal(meal.meal_number)}
          />
        ))}
      </div>

      {/* Confirm Button */}
      {canConfirm && (
        <button
          onClick={handleConfirm}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
        >
          Потвърди хранене
        </button>
      )}

      {/* Locked Message */}
      {isLocked && completedMeals.length > 0 && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Хранителният план е заключен до полунощ (00:00)
          </p>
        </div>
      )}

      {/* Helper Text */}
      {!isLocked && completedMeals.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Маркирай хранения след като ги приемеш и натисни "Потвърди хранене"
        </p>
      )}
    </div>
  )
}
