'use client'

/**
 * RecipeModal Component
 * Full-screen modal displaying cooking recipe with steps, timing, and tips
 */

import { X, Clock, ChefHat, AlertCircle, Wrench } from 'lucide-react'
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border-2 border-border shadow-2xl animate-in slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Затвори"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="pr-12">
            <h2 className="text-2xl font-bold text-white mb-3">{mealName}</h2>

            {/* Timing and Difficulty */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Подготовка:</span>
                <span className="font-medium text-white">{formatRecipeTime(recipe.prep_time)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Готвене:</span>
                <span className="font-medium text-white">{formatRecipeTime(recipe.cook_time)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">Общо:</span>
                <span className="font-medium text-white">{formatRecipeTime(recipe.total_time)}</span>
              </div>

              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4" style={{ color: getDifficultyColor(recipe.difficulty) }} />
                <span className="text-muted-foreground">Сложност:</span>
                <span className="font-medium" style={{ color: getDifficultyColor(recipe.difficulty) }}>
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Steps */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Стъпки за приготвяне
            </h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground pt-0.5 flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
              <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Съвети
              </h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="flex-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipment */}
          {recipe.equipment && recipe.equipment.length > 0 && (
            <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
              <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-accent" />
                Необходими съдове и прибори
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Notes */}
          {recipe.special_notes && (
            <div className="rounded-xl bg-success/5 border border-success/20 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-success">Хранителна стойност:</span> {recipe.special_notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Затвори
          </button>
        </div>
      </div>
    </div>
  )
}
