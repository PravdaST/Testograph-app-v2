'use client'

/**
 * WorkoutTimer Component
 * Simple timer for tracking workout duration
 * START → PAUSE/RESUME → FINISH flow
 */

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, CheckCircle2, Clock } from 'lucide-react'

interface WorkoutTimerProps {
  workoutName: string
  targetDuration: number // minutes
  dayOfWeek: number
  onWorkoutComplete?: (duration: number) => void
}

interface WorkoutSession {
  id: string
  status: 'in_progress' | 'paused' | 'completed'
  started_at: string
  paused_at?: string
  finished_at?: string
  total_pause_duration_seconds: number
  actual_duration_minutes?: number
}

export function WorkoutTimer({
  workoutName,
  targetDuration,
  dayOfWeek,
  onWorkoutComplete,
}: WorkoutTimerProps) {
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load existing session on mount
  useEffect(() => {
    loadSession()
  }, [])

  // Timer effect
  useEffect(() => {
    if (session?.status === 'in_progress') {
      intervalRef.current = setInterval(() => {
        const now = new Date()
        const startedAt = new Date(session.started_at)
        const totalElapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
        const netElapsed = totalElapsed - (session.total_pause_duration_seconds || 0)
        setElapsedSeconds(netElapsed)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [session])

  const loadSession = async () => {
    try {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(
        `/api/workout/session?email=${encodeURIComponent(email)}&date=${today}`
      )

      if (response.ok) {
        const data = await response.json()
        if (data.session) {
          setSession(data.session)

          // Calculate initial elapsed time
          if (data.session.status !== 'completed') {
            const now = new Date()
            const startedAt = new Date(data.session.started_at)
            let totalElapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000)

            if (data.session.status === 'paused') {
              const pausedAt = new Date(data.session.paused_at!)
              const currentPause = Math.floor((now.getTime() - pausedAt.getTime()) / 1000)
              totalElapsed = totalElapsed - (data.session.total_pause_duration_seconds || 0) - currentPause
            } else {
              totalElapsed = totalElapsed - (data.session.total_pause_duration_seconds || 0)
            }

            setElapsedSeconds(Math.max(0, totalElapsed))
          } else {
            setElapsedSeconds(data.session.actual_duration_minutes! * 60)
          }
        }
      }
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const handleStart = async () => {
    setIsLoading(true)
    try {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const today = new Date().toISOString().split('T')[0]

      const response = await fetch('/api/workout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          date: today,
          dayOfWeek,
          workoutName,
          targetDuration,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
        setElapsedSeconds(0)
      } else {
        const error = await response.json()
        console.error('Error starting workout:', error)
      }
    } catch (error) {
      console.error('Error starting workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePause = async () => {
    if (!session) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/workout/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          action: 'pause',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
      }
    } catch (error) {
      console.error('Error pausing workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResume = async () => {
    if (!session) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/workout/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          action: 'resume',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
      }
    } catch (error) {
      console.error('Error resuming workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = async () => {
    if (!session) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/workout/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          action: 'finish',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSession(data.session)

        if (onWorkoutComplete && data.session.actual_duration_minutes) {
          onWorkoutComplete(data.session.actual_duration_minutes)
        }
      }
    } catch (error) {
      console.error('Error finishing workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isCompleted = session?.status === 'completed'
  const isInProgress = session?.status === 'in_progress'
  const isPaused = session?.status === 'paused'

  return (
    <div
      className={`
        rounded-2xl p-6 border-2 transition-all
        ${
          isCompleted
            ? 'bg-success/5 border-success/30'
            : isInProgress
            ? 'bg-primary/5 border-primary/30'
            : isPaused
            ? 'bg-warning/5 border-warning/30'
            : 'bg-background border-border'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Тренировка таймер</h3>
            <p className="text-sm text-muted-foreground">
              Цел: {targetDuration} мин
            </p>
          </div>
        </div>
        {isCompleted && (
          <CheckCircle2 className="w-6 h-6 text-success" />
        )}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div
          className={`
            text-5xl font-bold tracking-tight
            ${
              isCompleted
                ? 'text-success'
                : isInProgress
                ? 'text-primary'
                : isPaused
                ? 'text-warning'
                : 'text-muted-foreground'
            }
          `}
        >
          {formatTime(elapsedSeconds)}
        </div>
        {isCompleted && session?.actual_duration_minutes && (
          <p className="text-sm text-success mt-2">
            Страхотна тренировка! {session.actual_duration_minutes} мин
          </p>
        )}
        {isPaused && (
          <p className="text-sm text-warning mt-2">На пауза</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!session && (
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Започни тренировка
          </button>
        )}

        {isInProgress && (
          <>
            <button
              onClick={handlePause}
              disabled={isLoading}
              className="flex-1 bg-warning text-warning-foreground py-4 rounded-xl font-semibold hover:bg-warning/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Pause className="w-5 h-5" />
              Пауза
            </button>
            <button
              onClick={handleFinish}
              disabled={isLoading}
              className="flex-1 bg-success text-success-foreground py-4 rounded-xl font-semibold hover:bg-success/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Завърши
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button
              onClick={handleResume}
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Продължи
            </button>
            <button
              onClick={handleFinish}
              disabled={isLoading}
              className="flex-1 bg-success text-success-foreground py-4 rounded-xl font-semibold hover:bg-success/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Завърши
            </button>
          </>
        )}

        {isCompleted && (
          <div className="flex-1 bg-success/10 border-2 border-success/30 py-4 rounded-xl font-semibold text-success flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Завършено
          </div>
        )}
      </div>
    </div>
  )
}
