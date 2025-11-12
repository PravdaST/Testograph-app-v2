'use client'

/**
 * RecipeModal Component
 * Compact popover displaying cooking recipe within the meal card
 */

import { X, Clock, ChefHat, AlertCircle } from 'lucide-react'
import { Recipe, formatRecipeTime, getDifficultyLabel, getDifficultyColor } from '@/lib/types/recipe'

interface RecipeModalProps {
  isOpen: boolean
  onClose: () => void
  mealName: string
  recipe: Recipe
}

export function RecipeModal({ isOpen, onClose, mealName, recipe }: RecipeModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-in fade-in"
        onClick={onClose}
      />

      {/* Compact Recipe Popover */}
      <div className="fixed inset-x-4 top-20 bottom-20 z-50 animate-in slide-in-from-top-4 fade-in">
        <div className="h-full bg-background rounded-2xl shadow-2xl border-2 border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-bold text-white pr-8 leading-tight">{mealName}</h3>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Затвори"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Timing Row */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                <span className="font-medium text-white">{formatRecipeTime(recipe.total_time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-3 h-3" style={{ color: getDifficultyColor(recipe.difficulty) }} />
                <span className="font-medium" style={{ color: getDifficultyColor(recipe.difficulty) }}>
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Steps */}
            <div>
              <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5" />
                Стъпки
              </h4>
              <ol className="space-y-2">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-2 text-xs">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            {recipe.tips && recipe.tips.length > 0 && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-2.5">
                <h4 className="text-xs font-semibold text-white mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-primary" />
                  Съвети
                </h4>
                <ul className="space-y-1">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="flex gap-1.5 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="flex-1 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Special Notes */}
            {recipe.special_notes && (
              <div className="rounded-lg bg-success/5 border border-success/20 p-2.5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-success">💡</span> {recipe.special_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
