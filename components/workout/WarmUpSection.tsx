'use client'

/**
 * WarmUpSection Component
 * Displays warm-up routine before the main workout
 */

import { useState } from 'react'
import { Flame, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import type { WarmUpExercise } from '@/lib/data/warm-up-routines'

interface WarmUpSectionProps {
  exercises: WarmUpExercise[]
}

export function WarmUpSection({ exercises }: WarmUpSectionProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExercise = (index: number) => {
    setCompleted(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const completedCount = completed.size
  const totalCount = exercises.length
  const isFullyCompleted = completedCount === totalCount

  return (
    <div className={`rounded-2xl border-2 transition-all ${
      isFullyCompleted
        ? 'bg-orange-500/5 border-orange-500/30'
        : 'bg-background border-border'
    }`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors rounded-t-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Загряване</h3>
            <p className="text-sm text-muted-foreground">
              5-10 минути динамични упражнения
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isFullyCompleted
              ? 'bg-orange-500 text-white'
              : 'bg-muted text-muted-foreground'
          }`}>
            {completedCount}/{totalCount}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Exercises List */}
      {isExpanded && (
        <div className="p-5 pt-0 space-y-2 border-t border-border">
          {exercises.map((exercise, index) => {
            const isCompleted = completed.has(index)

            return (
              <button
                key={index}
                onClick={() => toggleExercise(index)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  isCompleted
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-muted/30 border-border hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Exercise Info */}
                  <div className="flex-1">
                    <div className="font-medium">{exercise.name_bg}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {exercise.description_bg}
                    </div>
                    <div className="text-xs text-primary mt-2">
                      {exercise.reps && `${exercise.reps} повторения`}
                      {exercise.reps && exercise.duration_seconds && ' | '}
                      {exercise.duration_seconds && `${exercise.duration_seconds}s`}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}

          {/* Info Message */}
          {!isFullyCompleted && (
            <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                ℹ️ Загряването намалява риска от контузии и подготвя мускулите за тренировка
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
