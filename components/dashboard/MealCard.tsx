'use client'

/**
 * MealCard Component
 * Displays a single meal with expandable ingredients and image
 */

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Clock, Flame, Drumstick, Wheat, Droplet, Lock, ImageIcon } from 'lucide-react'

interface Ingredient {
  name: string
  quantity: string
  calories: number
}

interface MealCardProps {
  mealNumber: number
  time: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: Ingredient[]
  isCompleted?: boolean
  isLocked?: boolean
  onToggleComplete?: () => void
  imageUrl?: string
}

export function MealCard({
  mealNumber,
  time,
  name,
  calories,
  protein,
  carbs,
  fats,
  ingredients,
  isCompleted = false,
  isLocked = false,
  onToggleComplete,
  imageUrl,
}: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`
        rounded-xl border-2 transition-all relative shimmer-effect hover-lift spotlight-effect overflow-hidden
        ${
          isCompleted
            ? 'bg-success/5 border-success/20'
            : 'bg-background border-border'
        }
        ${isLocked ? 'opacity-80' : ''}
      `}
    >
      {/* Meal Image */}
      {imageUrl ? (
        <div className="relative w-full h-40">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="relative w-full h-40 bg-muted/30 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
        </div>
      )}

      {/* Meal Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Хранене {mealNumber}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
              </div>
            </div>
            <h4 className="font-semibold text-base">{name}</h4>
          </div>

          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              disabled={isLocked}
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ripple-effect
                ${
                  isCompleted
                    ? 'bg-success border-success text-white'
                    : 'border-muted-foreground/30 hover:border-primary'
                }
                ${isLocked ? 'cursor-not-allowed opacity-60' : ''}
              `}
              aria-label={isCompleted ? 'Отмаркирай' : 'Маркирай като завършено'}
            >
              {isCompleted && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          )}

          {isLocked && isCompleted && (
            <Lock className="w-3 h-3 absolute top-2 right-10 text-muted-foreground" />
          )}
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Flame className="w-4 h-4 text-orange-500 mb-1" />
            <span className="text-xs font-bold animate-count-up">{calories}</span>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Drumstick className="w-4 h-4 text-red-500 mb-1" />
            <span className="text-xs font-bold animate-count-up">{protein}г</span>
            <span className="text-xs text-muted-foreground">Протеин</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Wheat className="w-4 h-4 text-yellow-600 mb-1" />
            <span className="text-xs font-bold animate-count-up">{carbs}г</span>
            <span className="text-xs text-muted-foreground">Въгл.</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Droplet className="w-4 h-4 text-blue-500 mb-1" />
            <span className="text-xs font-bold animate-count-up">{fats}г</span>
            <span className="text-xs text-muted-foreground">Мазнини</span>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <span>
            {isExpanded ? 'Скрий съставки' : 'Виж съставки'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Ingredients List (Expandable) */}
      {isExpanded && (
        <div className="border-t border-border px-4 py-3 space-y-2 animate-slide-down">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm py-1"
            >
              <div className="flex-1">
                <span className="font-medium">{ingredient.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({ingredient.quantity})
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {ingredient.calories} kcal
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
