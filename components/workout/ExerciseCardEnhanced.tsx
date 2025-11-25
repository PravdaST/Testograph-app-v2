'use client'

/**
 * ExerciseCardEnhanced Component
 * Enhanced version with weight/reps logging and history display
 */

import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, Timer, Info, TrendingUp, Pause, Play, X } from 'lucide-react'
import type { Exercise } from '@/lib/data/mock-workouts'
import { useToast } from '@/contexts/ToastContext'
import { requiresWeightInput } from '@/lib/data/exercise-helpers'

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
  const toast = useToast()
  const [showNotes, setShowNotes] = useState(false)
  const [gifError, setGifError] = useState(false)
  const [previousWorkout, setPreviousWorkout] = useState<PreviousSet[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [validationErrors, setValidationErrors] = useState<Record<number, boolean>>({})

  // Rest Timer state
  const [restTimeRemaining, setRestTimeRemaining] = useState(0)
  const [isRestTimerActive, setIsRestTimerActive] = useState(false)
  const [isRestTimerPaused, setIsRestTimerPaused] = useState(false)
  const restTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Rest Timer effect
  useEffect(() => {
    if (isRestTimerActive && !isRestTimerPaused && restTimeRemaining > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer finished
            setIsRestTimerActive(false)
            setIsRestTimerPaused(false)
            // Vibrate if supported
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200])
            }
            toast.success('Почивката приключи! Готов за следващата серия 💪')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current)
        restTimerRef.current = null
      }
    }
  }, [isRestTimerActive, isRestTimerPaused, restTimeRemaining, toast])

  // Start rest timer
  const startRestTimer = () => {
    setRestTimeRemaining(exercise.rest_seconds)
    setIsRestTimerActive(true)
    setIsRestTimerPaused(false)
  }

  // Pause/Resume rest timer
  const toggleRestTimerPause = () => {
    setIsRestTimerPaused(prev => !prev)
  }

  // Stop rest timer
  const stopRestTimer = () => {
    setIsRestTimerActive(false)
    setIsRestTimerPaused(false)
    setRestTimeRemaining(0)
  }

  // Format seconds to MM:SS
  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
      setValidationErrors(prev => ({ ...prev, [setNumber]: true }))
      toast.warning('Моля въведи брой повторения')
      return
    }
    // Clear validation error
    setValidationErrors(prev => ({ ...prev, [setNumber]: false }))

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

      // Start rest timer if not the last set
      if (!allComplete) {
        startRestTimer()
      }
    } catch (error) {
      console.error('Error saving set:', error)
      toast.error('Грешка при запазване. Моля опитай отново.')
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
    // Clear validation error when user types
    if (validationErrors[setNumber]) {
      setValidationErrors(prev => ({ ...prev, [setNumber]: false }))
    }
  }

  const completedCount = setLogs.filter(s => s.completed).length
  const isFullyCompleted = completedCount === exercise.sets

  // Detect exercise type - time-based exercises don't need weight/reps inputs
  const repsStr = String(exercise.reps)
  const isTimeBased = repsStr.includes('мин') || repsStr.includes('s') || repsStr.includes('сек')
  const isCardio = isTimeBased || exercise.rest_seconds === 0

  // Check if exercise needs weight input (based on equipment type from exercises.json)
  const needsWeightInput = requiresWeightInput(exercise.exercisedb_id)

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

        {/* Previous Workout Info - only show for strength exercises */}
        {!isTimeBased && !loadingHistory && previousWorkout.length > 0 && (
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

      {/* GIF Demo - Compact */}
      <div className="relative h-48 bg-muted overflow-hidden">
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

      {/* Rest Timer */}
      {isRestTimerActive && (
        <div className="mx-4 mt-4 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Timer className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Почивка</p>
                <p className="text-xs text-muted-foreground">{exercise.rest_seconds}s препоръчителна</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold tabular-nums ${isRestTimerPaused ? 'text-warning' : 'text-primary'}`}>
                {formatRestTime(restTimeRemaining)}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${(restTimeRemaining / exercise.rest_seconds) * 100}%` }}
            />
          </div>
          {/* Controls */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={toggleRestTimerPause}
              className={`flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                isRestTimerPaused
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-warning/20 text-warning hover:bg-warning/30'
              }`}
            >
              {isRestTimerPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  Продължи
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Пауза
                </>
              )}
            </button>
            <button
              onClick={stopRestTimer}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Set Logging - Progressive Disclosure */}
      <div className="p-4 space-y-2">
        {setLogs.map((setLog, index) => {
          // Find first incomplete set index
          const firstIncompleteIndex = setLogs.findIndex(s => !s.completed)
          const isActive = index === firstIncompleteIndex
          const isFuture = !setLog.completed && index > firstIncompleteIndex

          // Completed sets - compact view
          if (setLog.completed) {
            // Format display based on exercise type
            let completedDisplay: string
            if (isTimeBased) {
              completedDisplay = `${exercise.reps} завършени`
            } else if (needsWeightInput) {
              completedDisplay = `${setLog.weight ? `${setLog.weight}kg` : 'BW'} × ${setLog.reps}`
            } else {
              // Bodyweight exercise - only show reps
              completedDisplay = `${setLog.reps} повт.`
            }

            return (
              <div
                key={setLog.setNumber}
                className="flex items-center gap-2 p-2 rounded-lg bg-success/10 border border-success/30"
              >
                <div className="w-6 h-6 rounded bg-success/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-success">{isTimeBased ? '✓' : `S${setLog.setNumber}`}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {completedDisplay}
                </span>
                <CheckCircle2 className="w-4 h-4 text-success ml-auto" />
              </div>
            )
          }

          // Future sets - hidden or collapsed
          if (isFuture) {
            return (
              <div
                key={setLog.setNumber}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/50 opacity-40"
              >
                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">S{setLog.setNumber}</span>
                </div>
                <span className="text-xs text-muted-foreground">Изчакваща серия</span>
              </div>
            )
          }

          // Active set - different UI for time-based vs strength exercises
          if (isTimeBased) {
            // Simple UI for cardio/time-based exercises
            return (
              <div
                key={setLog.setNumber}
                className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Timer className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{exercise.reps}</p>
                      <p className="text-xs text-muted-foreground">Натисни когато завършиш</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSetComplete(setLog.setNumber)}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium"
                  >
                    Готово
                  </button>
                </div>
              </div>
            )
          }

          // Full input view for strength exercises
          return (
            <div
              key={setLog.setNumber}
              className="p-3 rounded-xl border-2 border-primary/30 bg-primary/5 animate-fade-in"
            >
              <div className="flex items-center gap-3">
                {/* Set Number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-primary/70">S</div>
                    <div className="text-sm font-bold text-primary">{setLog.setNumber}</div>
                  </div>
                </div>

                {/* Weight Input - only for exercises that need it */}
                {needsWeightInput && (
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
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                )}

                {/* Reps Input */}
                <div className={needsWeightInput ? "flex-1" : "flex-[2]"}>
                  <label className={`text-xs block mb-1 ${validationErrors[setLog.setNumber] ? 'text-destructive' : 'text-muted-foreground'}`}>
                    Повторения {validationErrors[setLog.setNumber] && '*'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={setLog.reps}
                    onChange={(e) => handleRepsChange(setLog.setNumber, e.target.value)}
                    placeholder={String(exercise.reps)}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-colors ${
                      validationErrors[setLog.setNumber]
                        ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30'
                        : 'border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/30'
                    }`}
                  />
                </div>

                {/* Complete Button */}
                <button
                  onClick={() => handleSetComplete(setLog.setNumber)}
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  <span className="text-xs font-bold">✓</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
