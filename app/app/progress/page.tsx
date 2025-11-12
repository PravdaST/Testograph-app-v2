'use client'

/**
 * Progress Page
 * Shows workout progress charts and statistics
 */

import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Dumbbell } from 'lucide-react'
import Link from 'next/link'
import { ExerciseProgressChart } from '@/components/workout/ExerciseProgressChart'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'

interface ExerciseSummary {
  exercise_name: string
  total_workouts: number
  last_workout_date: string
}

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  first_name?: string
  profile_picture_url?: string
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

export default function ProgressPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [userName, setUserName] = useState<string>()
  const [exercises, setExercises] = useState<ExerciseSummary[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<30 | 90 | 180>(90)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get email from localStorage
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('quizEmail')
      setEmail(storedEmail)
    }
  }, [])

  // Load user program
  useEffect(() => {
    const loadUserProgram = async () => {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      try {
        const response = await fetch(`/api/user/program?email=${encodeURIComponent(email)}`)
        if (response.ok) {
          const data = await response.json()
          setUserProgram(data.program)
          if (data.program?.first_name) {
            setUserName(data.program.first_name)
          }
        }
      } catch (error) {
        console.error('Error loading user program:', error)
      }
    }

    loadUserProgram()
  }, [])

  useEffect(() => {
    const fetchExercises = async () => {
      if (!email) return

      try {
        setLoading(true)
        const response = await fetch(`/api/workout/exercises-list?email=${email}`)

        if (!response.ok) {
          throw new Error('Failed to fetch exercises')
        }

        const data = await response.json()
        setExercises(data.exercises || [])

        // Auto-select first exercise if available
        if (data.exercises && data.exercises.length > 0 && !selectedExercise) {
          setSelectedExercise(data.exercises[0].exercise_name)
        }
      } catch (error) {
        console.error('Error fetching exercises:', error)
        setExercises([])
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [email])

  const programName = userProgram
    ? CATEGORY_NAMES[userProgram.category]
    : 'Зареждане...'

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <TopNav programName="Зареждане..." userName={userName} />
        <div className="text-center">
          <p className="text-muted-foreground">Зареждане...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Top Navigation */}
      <TopNav
        programName={programName}
        userName={userName}
        profilePictureUrl={userProgram?.profile_picture_url}
      />

      {/* Header */}
      <div className="bg-primary text-white p-6">
        <h1 className="text-2xl font-bold">Твоят прогрес</h1>
        <p className="text-sm text-white/80 mb-4">
          Проследи силовото си развитие
        </p>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange(30)}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              timeRange === 30
                ? 'bg-white text-primary font-bold'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            30 дни
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              timeRange === 90
                ? 'bg-white text-primary font-bold'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            90 дни
          </button>
          <button
            onClick={() => setTimeRange(180)}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              timeRange === 180
                ? 'bg-white text-primary font-bold'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            6 месеца
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Зареждане на упражнения...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border-2 border-border">
            <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Все още няма данни</h3>
            <p className="text-muted-foreground mb-4">
              Започни да тренираш, за да видиш прогреса си!
            </p>
            <Link
              href="/app"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              Към тренировките
            </Link>
          </div>
        ) : (
          <>
            {/* Exercise Selector */}
            <div className="space-y-3">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Избери упражнение
              </h2>
              <div className="grid gap-2">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.exercise_name}
                    onClick={() => setSelectedExercise(exercise.exercise_name)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedExercise === exercise.exercise_name
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">{exercise.exercise_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3" />
                          Последна тренировка: {new Date(exercise.last_workout_date).toLocaleDateString('bg-BG')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {exercise.total_workouts}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          тренировки
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Chart */}
            {selectedExercise && (
              <div className="space-y-3">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  График на прогреса
                </h2>
                <ExerciseProgressChart
                  exerciseName={selectedExercise}
                  email={email}
                  days={timeRange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
