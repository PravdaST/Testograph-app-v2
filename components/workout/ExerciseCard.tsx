'use client'

/**
 * ExerciseCard Component
 * Displays a single exercise with GIF, sets, reps, and completion tracking
 */

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, Circle, Timer, Info } from 'lucide-react'
import type { Exercise } from '@/lib/data/mock-workouts'

interface ExerciseCardProps {
  exercise: Exercise
  exerciseNumber: number
  completedSets: number[]
  onSetToggle: (setNumber: number) => void
}

export function ExerciseCard({
  exercise,
  exerciseNumber,
  completedSets,
  onSetToggle,
}: ExerciseCardProps) {
  const [showNotes, setShowNotes] = useState(false)

  // Use local GIFs from public/exercises folder
  const gifUrl = `/exercises/${exercise.exercisedb_id}.gif`

  // Calculate progress
  const totalSets = exercise.sets
  const completedCount = completedSets.length
  const isFullyCompleted = completedCount === totalSets

  return (
    <div
      className={`
        rounded-2xl border-2 transition-all
        ${
          isFullyCompleted
            ? 'bg-success/5 border-success/30'
            : 'bg-background border-border'
        }
      `}
    >
      {/* Exercise Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {exerciseNumber}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{exercise.name_bg}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                {exercise.sets} серии × {exercise.reps} повт.
              </span>
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                <span>{exercise.rest_seconds}s почивка</span>
              </div>
            </div>
          </div>

          {/* Progress Badge */}
          <div
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${
                isFullyCompleted
                  ? 'bg-success text-white'
                  : 'bg-muted text-muted-foreground'
              }
            `}
          >
            {completedCount}/{totalSets}
          </div>
        </div>

        {/* Notes Toggle */}
        {exercise.notes && (
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Info className="w-4 h-4" />
            <span>{showNotes ? 'Скрий бележки' : 'Виж бележки'}</span>
          </button>
        )}

        {showNotes && exercise.notes && (
          <div className="mt-2 p-3 bg-primary/5 rounded-lg text-sm border border-primary/20">
            {exercise.notes}
          </div>
        )}
      </div>

      {/* GIF Demo */}
      <div className="relative aspect-video bg-muted">
        <Image
          src={gifUrl}
          alt={exercise.name_bg}
          fill
          className="object-contain"
          unoptimized // ExerciseDB returns GIFs
        />
      </div>

      {/* Set Checkboxes */}
      <div className="p-4">
        <p className="text-sm font-medium mb-3">Маркирай завършените серии:</p>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalSets }, (_, i) => i + 1).map((setNum) => {
            const isCompleted = completedSets.includes(setNum)

            return (
              <button
                key={setNum}
                onClick={() => onSetToggle(setNum)}
                className={`
                  h-12 rounded-lg border-2 flex flex-col items-center justify-center transition-all
                  ${
                    isCompleted
                      ? 'bg-success border-success text-white'
                      : 'bg-background border-border hover:border-primary'
                  }
                `}
              >
                <span className="text-xs font-medium">Серия</span>
                <span className="text-lg font-bold">{setNum}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
