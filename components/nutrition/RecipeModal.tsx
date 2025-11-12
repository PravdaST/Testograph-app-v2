'use client'

/**
 * RecipeModal Component
 * Full screen modal displaying cooking recipe
 */

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Clock, ChefHat, AlertCircle } from 'lucide-react'
import { Recipe, formatRecipeTime, getDifficultyLabel, getDifficultyColor } from '@/lib/types/recipe'

interface RecipeModalProps {
  isOpen: boolean
  onClose: () => void
  mealName: string
  recipe: Recipe
}

export function RecipeModal({ isOpen, onClose, mealName, recipe }: RecipeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-in fade-in"
        onClick={onClose}
      />

      {/* Full Screen Recipe Modal */}
      <div className="fixed inset-0 z-50 animate-in slide-in-from-bottom fade-in">
        <div className="h-full bg-background flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-bold text-white pr-8 leading-tight">{mealName}</h3>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Затвори"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timing Row */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium text-white">{formatRecipeTime(recipe.total_time)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ChefHat className="w-4 h-4" style={{ color: getDifficultyColor(recipe.difficulty) }} />
                <span className="font-medium" style={{ color: getDifficultyColor(recipe.difficulty) }}>
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Steps */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Стъпки
              </h4>
              <ol className="space-y-3">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            {recipe.tips && recipe.tips.length > 0 && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <h4 className="text-sm font-semibold text-info mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-info" />
                  Съвети
                </h4>
                <ul className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-info mt-0.5">•</span>
                      <span className="flex-1 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Special Notes */}
            {recipe.special_notes && (
              <div className="rounded-lg bg-success/5 border border-success/20 p-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-success">💡</span> {recipe.special_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
