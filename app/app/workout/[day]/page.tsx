'use client'

/**
 * Workout Detail Page
 * Shows all exercises for a specific workout day
 */

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Dumbbell, CheckCircle2, TrendingUp, History } from 'lucide-react'
import Link from 'next/link'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { WorkoutTimer } from '@/components/workout/WorkoutTimer'
import { WorkoutWeekCalendar } from '@/components/workout/WorkoutWeekCalendar'
import { Button } from '@/components/ui/Button'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'

// Workout Imports - ENERGY
import { ENERGY_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-low-home'
import { ENERGY_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-low-gym'
import { ENERGY_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-normal-home'
import { ENERGY_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-normal-gym'
import { ENERGY_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-high-home'
import { ENERGY_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-high-gym'

// Workout Imports - LIBIDO
import { LIBIDO_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-low-home'
import { LIBIDO_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-low-gym'
import { LIBIDO_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-normal-home'
import { LIBIDO_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-normal-gym'
import { LIBIDO_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-high-home'
import { LIBIDO_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-high-gym'

// Workout Imports - MUSCLE
import { MUSCLE_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-low-home'
import { MUSCLE_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-low-gym'
import { MUSCLE_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-normal-home'
import { MUSCLE_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-normal-gym'
import { MUSCLE_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-high-home'
import { MUSCLE_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-high-gym'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  workout_location?: 'home' | 'gym'
  first_name?: string
  profile_picture_url?: string
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

// Helper function to get workout plan based on category, level, and location
function getWorkoutsForCategoryAndLocation(
  category: 'energy' | 'libido' | 'muscle',
  location: 'home' | 'gym' = 'gym',
  level: string = 'normal'
) {
  const normalizedLevel = level.toLowerCase()

  if (category === 'energy') {
    if (normalizedLevel === 'low') {
      return location === 'home' ? ENERGY_LOW_HOME_WORKOUTS : ENERGY_LOW_GYM_WORKOUTS
    } else if (normalizedLevel === 'high') {
      return location === 'home' ? ENERGY_HIGH_HOME_WORKOUTS : ENERGY_HIGH_GYM_WORKOUTS
    }
    return location === 'home' ? ENERGY_NORMAL_HOME_WORKOUTS : ENERGY_NORMAL_GYM_WORKOUTS
  } else if (category === 'libido') {
    if (normalizedLevel === 'low') {
      return location === 'home' ? LIBIDO_LOW_HOME_WORKOUTS : LIBIDO_LOW_GYM_WORKOUTS
    } else if (normalizedLevel === 'high') {
      return location === 'home' ? LIBIDO_HIGH_HOME_WORKOUTS : LIBIDO_HIGH_GYM_WORKOUTS
    }
    return location === 'home' ? LIBIDO_NORMAL_HOME_WORKOUTS : LIBIDO_NORMAL_GYM_WORKOUTS
  } else {
    if (normalizedLevel === 'low') {
      return location === 'home' ? MUSCLE_LOW_HOME_WORKOUTS : MUSCLE_LOW_GYM_WORKOUTS
    } else if (normalizedLevel === 'high') {
      return location === 'home' ? MUSCLE_HIGH_HOME_WORKOUTS : MUSCLE_HIGH_GYM_WORKOUTS
    }
    return location === 'home' ? MUSCLE_NORMAL_HOME_WORKOUTS : MUSCLE_NORMAL_GYM_WORKOUTS
  }
}

export default function WorkoutPage() {
  const router = useRouter()
  const params = useParams()
  const dayOfWeek = parseInt(params.day as string)

  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>()
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({})

  // Fetch user program to determine correct workout
  useEffect(() => {
    const fetchUserProgram = async () => {
      try {
        const email = localStorage.getItem('quizEmail')
        if (!email) {
          router.push('/quiz')
          return
        }

        const response = await fetch(`/api/user/program?email=${encodeURIComponent(email)}`)
        if (response.ok) {
          const data = await response.json()
          setUserProgram({
            category: data.category,
            level: data.level,
            workout_location: data.workout_location || 'gym',
            first_name: data.first_name,
            profile_picture_url: data.profile_picture_url
          })

          // Set user name from first_name or email fallback
          if (data.first_name) {
            setUserName(data.first_name)
          } else {
            const emailUsername = email.split('@')[0]
            setUserName(emailUsername)
          }
        }

        // Fetch completed workouts for this week
        const historyResponse = await fetch(
          `/api/workout/history/week?email=${encodeURIComponent(email)}`
        )
        if (historyResponse.ok) {
          const historyData = await historyResponse.json()
          setCompletedDays(historyData.completedByDayOfWeek || {})
        }
      } catch (error) {
        console.error('Error fetching user program:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProgram()
  }, [router])

  // Get correct workouts based on user's program
  const workouts = userProgram
    ? getWorkoutsForCategoryAndLocation(
        userProgram.category,
        userProgram.workout_location || 'gym',
        userProgram.level
      )
    : []

  // Find workout for this day
  const workout = workouts.find((w) => w.day_of_week === dayOfWeek)

  // State for tracking completed sets per exercise
  // Format: { exerciseIndex: [completedSetNumbers] }
  const [completedSets, setCompletedSets] = useState<
    Record<number, number[]>
  >({})

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`workout-${dayOfWeek}`)
    if (saved) {
      setCompletedSets(JSON.parse(saved))
    }
  }, [dayOfWeek])

  // Save progress to localStorage
  useEffect(() => {
    if (Object.keys(completedSets).length > 0) {
      localStorage.setItem(
        `workout-${dayOfWeek}`,
        JSON.stringify(completedSets)
      )
    }
  }, [completedSets, dayOfWeek])

  const handleSetToggle = (exerciseIndex: number, setNumber: number) => {
    setCompletedSets((prev) => {
      const exerciseSets = prev[exerciseIndex] || []
      const isCompleted = exerciseSets.includes(setNumber)

      return {
        ...prev,
        [exerciseIndex]: isCompleted
          ? exerciseSets.filter((s) => s !== setNumber)
          : [...exerciseSets, setNumber].sort((a, b) => a - b),
      }
    })
  }

  const handleFinishWorkout = async () => {
    try {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      // Save workout completion to database
      const response = await fetch('/api/workout/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          day_of_week: dayOfWeek,
          workout_name: workout?.name || '',
          target_duration_minutes: workout?.duration || 0,
          completed_sets: completedSets,
        }),
      })

      if (response.ok) {
        alert('Браво! Тренировката е завършена успешно! 💪')

        // Clear local storage for this workout
        localStorage.removeItem(`workout-${dayOfWeek}`)

        // Refresh completed days
        const historyResponse = await fetch(
          `/api/workout/history/week?email=${encodeURIComponent(email)}`
        )
        if (historyResponse.ok) {
          const historyData = await historyResponse.json()
          setCompletedDays(historyData.completedByDayOfWeek || {})
        }

        router.push('/app')
      } else {
        alert('Възникна грешка при записване на тренировката')
      }
    } catch (error) {
      console.error('Error finishing workout:', error)
      alert('Възникна грешка при записване на тренировката')
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
        {/* Top Navigation - Loading State */}
        <TopNav
          programName="Зареждане..."
          userName={userName}
        />

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Зареждане...</p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav onNavigate={() => router.push('/app')} />
      </div>
    )
  }

  // If no workout found or rest day
  if (!workout || workout.duration === 0) {
    const programName = userProgram ? CATEGORY_NAMES[userProgram.category] : ''

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
        {/* Top Navigation */}
        <TopNav
          programName={programName}
          userName={userName}
          profilePictureUrl={userProgram?.profile_picture_url}
        />

        <div className="container-mobile py-6 pb-24">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>

          <div className="bg-background rounded-2xl p-8 text-center border border-border">
            <div className="text-6xl mb-4">🛌</div>
            <h2 className="text-2xl font-bold mb-2">Почивка</h2>
            <p className="text-muted-foreground">
              Днес е ден за възстановяване. Използвай го за активна почивка или
              лека разходка.
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav onNavigate={() => router.push('/app')} />
      </div>
    )
  }

  // Calculate overall progress
  const totalExercises = workout.exercises.length
  const totalSetsNeeded = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
  const totalSetsCompleted = Object.values(completedSets).reduce(
    (sum, sets) => sum + sets.length,
    0
  )
  const progressPercentage = Math.round(
    (totalSetsCompleted / totalSetsNeeded) * 100
  )

  const programName = userProgram ? CATEGORY_NAMES[userProgram.category] : ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      {/* Top Navigation */}
      <TopNav
        programName={programName}
        userName={userName}
        profilePictureUrl={userProgram?.profile_picture_url}
      />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>
          <Link
            href="/app/workout/history"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">История</span>
          </Link>
        </div>

        {/* Weekly Workout Calendar */}
        <WorkoutWeekCalendar
          workouts={workouts}
          currentDayOfWeek={dayOfWeek}
          completedDays={completedDays}
        />

        {/* Workout Info Card */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{workout.name}</h1>
              <p className="text-sm text-muted-foreground mb-3">
                {workout.duration} минути • {totalExercises} упражнения
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Прогрес</span>
                  <span className="font-bold text-primary">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalSetsCompleted} от {totalSetsNeeded} серии завършени
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Timer */}
        <WorkoutTimer
          workoutName={workout.name}
          targetDuration={workout.duration}
          dayOfWeek={dayOfWeek}
          onWorkoutComplete={(duration) => {
            console.log('Workout completed in', duration, 'minutes')
          }}
        />

        {/* Exercise List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Упражнения</h2>

          {workout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={index}
              exercise={exercise}
              exerciseNumber={index + 1}
              completedSets={completedSets[index] || []}
              onSetToggle={(setNum) => handleSetToggle(index, setNum)}
            />
          ))}
        </div>

        {/* Finish Button */}
        {progressPercentage === 100 && (
          <div className="sticky bottom-4 animate-slide-up">
            <Button
              size="lg"
              fullWidth
              onClick={handleFinishWorkout}
              className="shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Завърши тренировката
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
