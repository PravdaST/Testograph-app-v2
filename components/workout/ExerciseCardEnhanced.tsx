'use client'

/**
 * ExerciseCardEnhanced Component
 * Enhanced version with weight/reps logging and history display
 */

import { useState, useEffect } from 'react'
import { CheckCircle2, Timer, Info, TrendingUp } from 'lucide-react'
import type { Exercise } from '@/lib/data/mock-workouts'

interface SetLog {
  setNumber: number
  weight: string
  reps: string
  completed: boolean
}

interface PreviousSet {
  set_number: number
  weight_kg: number | null
  actual_reps: number
  date: string
}

interface SavedSet {
  exercise_name: string
  set_number: number
  weight_kg: number | null
  actual_reps: number
}

interface ExerciseCardEnhancedProps {
  exercise: Exercise
  exerciseNumber: number
  exerciseOrder: number
  email: string
  date: string
  workoutSessionId: string | null
  onAllSetsComplete?: () => void
}

export function ExerciseCardEnhanced({
  exercise,
  exerciseNumber,
  exerciseOrder,
  email,
  date,
  workoutSessionId,
  onAllSetsComplete,
}: ExerciseCardEnhancedProps) {
  const [showNotes, setShowNotes] = useState(false)
  const [gifError, setGifError] = useState(false)
  const [previousWorkout, setPreviousWorkout] = useState<PreviousSet[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // Set logs state
  const [setLogs, setSetLogs] = useState<SetLog[]>(() =>
    Array.from({ length: exercise.sets }, (_, i) => ({
      setNumber: i + 1,
      weight: '',
      reps: '',
      completed: false,
    }))
  )

  const gifUrl = `/exercises/${exercise.exercisedb_id}.gif`

  // Load previous workout data
  useEffect(() => {
    const loadPreviousWorkout = async () => {
      try {
        const response = await fetch(
          `/api/workout/exercise-history?email=${encodeURIComponent(email)}&exerciseName=${encodeURIComponent(exercise.name_bg)}`
        )

        if (response.ok) {
          const data = await response.json()
          if (data.lastWorkout && data.lastWorkout.sets) {
            setPreviousWorkout(data.lastWorkout.sets)

            // Pre-fill weight and reps from last workout
            setSetLogs(prev =>
              prev.map((setLog, index) => {
                const previousSet = data.lastWorkout.sets.find((s: PreviousSet) => s.set_number === index + 1)
                return {
                  ...setLog,
                  weight: previousSet?.weight_kg ? String(previousSet.weight_kg) : '',
                  reps: previousSet?.actual_reps ? String(previousSet.actual_reps) : '',
                }
              })
            )
          }
        }
      } catch (error) {
        console.error('Error loading previous workout:', error)
      } finally {
        setLoadingHistory(false)
      }
    }

    loadPreviousWorkout()
  }, [email, exercise.name_bg])

  // Load saved sets for today (if any)
  useEffect(() => {
    const loadTodaySets = async () => {
      try {
        const response = await fetch(
          `/api/workout/sets?email=${encodeURIComponent(email)}&date=${date}`
        )

        if (response.ok) {
          const data = await response.json()
          const exerciseSets = data.sets.filter(
            (s: SavedSet) => s.exercise_name === exercise.name_bg
          )

          if (exerciseSets.length > 0) {
            setSetLogs(prev =>
              prev.map((setLog) => {
                const savedSet = exerciseSets.find((s: SavedSet) => s.set_number === setLog.setNumber)
                return savedSet ? {
                  setNumber: setLog.setNumber,
                  weight: savedSet.weight_kg ? String(savedSet.weight_kg) : '',
                  reps: String(savedSet.actual_reps),
                  completed: true,
                } : setLog
              })
            )
          }
        }
      } catch (error) {
        console.error('Error loading today\'s sets:', error)
      }
    }

    loadTodaySets()
  }, [email, date, exercise.name_bg])

  const handleSetComplete = async (setNumber: number) => {
    const setLog = setLogs[setNumber - 1]

    // If already completed, uncomplete it (delete from DB)
    if (setLog.completed) {
      // TODO: Implement delete functionality
      setSetLogs(prev =>
        prev.map(s =>
          s.setNumber === setNumber ? { ...s, completed: false } : s
        )
      )
      return
    }

    // Validate input
    const reps = parseInt(setLog.reps)
    if (!setLog.reps || isNaN(reps) || reps < 1) {
      alert('Моля въведи брой повторения')
      return
    }

    const weight = setLog.weight ? parseFloat(setLog.weight) : null

    try {
      const response = await fetch('/api/workout/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          workoutSessionId,
          date,
          exerciseName: exercise.name_bg,
          exerciseOrder,
          setNumber,
          targetReps: exercise.reps,
          actualReps: reps,
          weightKg: weight,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save set')
      }

      // Mark as completed
      setSetLogs(prev =>
        prev.map(s =>
          s.setNumber === setNumber ? { ...s, completed: true } : s
        )
      )

      // Check if all sets are complete
      const updatedLogs = setLogs.map(s =>
        s.setNumber === setNumber ? { ...s, completed: true } : s
      )
      const allComplete = updatedLogs.every(s => s.completed)
      if (allComplete && onAllSetsComplete) {
        onAllSetsComplete()
      }
    } catch (error) {
      console.error('Error saving set:', error)
      alert('Грешка при запазване. Моля опитай отново.')
    }
  }

  const handleWeightChange = (setNumber: number, value: string) => {
    setSetLogs(prev =>
      prev.map(s =>
        s.setNumber === setNumber ? { ...s, weight: value } : s
      )
    )
  }

  const handleRepsChange = (setNumber: number, value: string) => {
    setSetLogs(prev =>
      prev.map(s =>
        s.setNumber === setNumber ? { ...s, reps: value } : s
      )
    )
  }

  const completedCount = setLogs.filter(s => s.completed).length
  const isFullyCompleted = completedCount === exercise.sets

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
            {completedCount}/{exercise.sets}
          </div>
        </div>

        {/* Previous Workout Info */}
        {!loadingHistory && previousWorkout.length > 0 && (
          <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-1 text-xs text-primary font-medium mb-1">
              <TrendingUp className="w-3 h-3" />
              <span>Миналия път ({new Date(previousWorkout[0].date).toLocaleDateString('bg-BG')})</span>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {previousWorkout.slice(0, 3).map((set, i) => (
                <span key={i}>
                  {set.weight_kg ? `${set.weight_kg}kg` : 'BW'} × {set.actual_reps}
                </span>
              ))}
            </div>
          </div>
        )}

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
      <div className="relative aspect-video bg-muted overflow-hidden">
        {!gifError ? (
          <img
            src={gifUrl}
            alt={exercise.name_bg}
            className="absolute inset-0 w-full h-full object-contain"
            onError={() => setGifError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Timer className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {exercise.name_bg}
            </p>
            <p className="text-xs text-muted-foreground">
              Анимацията скоро ще бъде добавена
            </p>
          </div>
        )}
      </div>

      {/* Set Logging */}
      <div className="p-4 space-y-3">
        {setLogs.map((setLog) => (
          <div
            key={setLog.setNumber}
            className={`
              p-3 rounded-xl border-2 transition-all
              ${
                setLog.completed
                  ? 'bg-success/10 border-success/30'
                  : 'bg-muted/30 border-border'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Set Number */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">S</div>
                  <div className="text-sm font-bold">{setLog.setNumber}</div>
                </div>
              </div>

              {/* Weight Input */}
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">
                  Тежест (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={setLog.weight}
                  onChange={(e) => handleWeightChange(setLog.setNumber, e.target.value)}
                  disabled={setLog.completed}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Reps Input */}
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">
                  Повторения
                </label>
                <input
                  type="number"
                  min="1"
                  value={setLog.reps}
                  onChange={(e) => handleRepsChange(setLog.setNumber, e.target.value)}
                  disabled={setLog.completed}
                  placeholder={String(exercise.reps)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Complete Button */}
              <button
                onClick={() => handleSetComplete(setLog.setNumber)}
                disabled={setLog.completed && false} // Allow uncomplete
                className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all
                  ${
                    setLog.completed
                      ? 'bg-success text-white'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }
                `}
              >
                {setLog.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-bold">✓</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
