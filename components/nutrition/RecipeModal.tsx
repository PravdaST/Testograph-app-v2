'use client'

/**
 * RecipeModal Component
 * Mobile-first bottom sheet displaying cooking recipe with steps, timing, and tips
 */

import { X, Clock, ChefHat, AlertCircle, Wrench, ChevronDown } from 'lucide-react'
import { Recipe, formatRecipeTime, getDifficultyLabel, getDifficultyColor } from '@/lib/types/recipe'
import { useEffect, useRef, useState } from 'react'

interface RecipeModalProps {
  isOpen: boolean
  onClose: () => void
  mealName: string
  recipe: Recipe
}

export function RecipeModal({ isOpen, onClose, mealName, recipe }: RecipeModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaY = e.touches[0].clientY - startY
    if (deltaY > 0) {
      setCurrentY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (currentY > 100) {
      onClose()
    }
    setCurrentY(0)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 animate-in fade-in"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${currentY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Drag Handle */}
        <div className="flex flex-col items-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mb-2" />
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold text-white pr-8">{mealName}</h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Затвори"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timing and Difficulty */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">Подгот:</span>
              <span className="font-medium text-white">{formatRecipeTime(recipe.prep_time)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span className="text-muted-foreground">Готв:</span>
              <span className="font-medium text-white">{formatRecipeTime(recipe.cook_time)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-success" />
              <span className="text-muted-foreground">Общо:</span>
              <span className="font-medium text-white">{formatRecipeTime(recipe.total_time)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5" style={{ color: getDifficultyColor(recipe.difficulty) }} />
              <span className="text-muted-foreground">Сложност:</span>
              <span className="font-medium" style={{ color: getDifficultyColor(recipe.difficulty) }}>
                {getDifficultyLabel(recipe.difficulty)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 pb-safe">
          {/* Steps */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-primary" />
              Стъпки за приготвяне
            </h3>
            <ol className="space-y-2.5">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground text-sm pt-0.5 flex-1 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3.5">
              <h3 className="text-sm font-semibold text-white mb-2.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Съвети
              </h3>
              <ul className="space-y-1.5">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="flex-1 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipment */}
          {recipe.equipment && recipe.equipment.length > 0 && (
            <div className="rounded-xl bg-accent/5 border border-accent/20 p-3.5">
              <h3 className="text-sm font-semibold text-white mb-2.5 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-accent" />
                Необходими съдове и прибори
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {recipe.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Notes */}
          {recipe.special_notes && (
            <div className="rounded-xl bg-success/5 border border-success/20 p-3.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-success">Хранителна стойност:</span> {recipe.special_notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
