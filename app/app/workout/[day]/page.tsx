'use client'

/**
 * Workout Detail Page
 * Shows all exercises for a specific workout day
 */

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createPortal } from 'react-dom'
import { ArrowLeft, Dumbbell, CheckCircle2, TrendingUp, History, Sparkles, Utensils, Moon, Timer, Info, X } from 'lucide-react'
import Link from 'next/link'
import { ExerciseCardEnhanced } from '@/components/workout/ExerciseCardEnhanced'
import { WorkoutTimer } from '@/components/workout/WorkoutTimer'
import { Button } from '@/components/ui/Button'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'
import { useWeeklyCompletion } from '@/lib/hooks/useWeeklyCompletion'

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
  program_start_date?: string
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
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date())
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({})

  // Initialize selectedDate based on dayOfWeek parameter
  const getDateForDayOfWeek = (dow: number) => {
    const today = new Date()
    const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // Convert Sunday from 0 to 7
    const diff = dow - currentDayOfWeek
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)
    return targetDate
  }

  const [selectedDate, setSelectedDate] = useState(getDateForDayOfWeek(dayOfWeek))
  const email = typeof window !== 'undefined' ? localStorage.getItem('quizEmail') : null
  const { completedDates } = useWeeklyCompletion(selectedDate, email)
  const [activeTooltip, setActiveTooltip] = useState<'hero' | null>(null)
  const [workoutSessionId, setWorkoutSessionId] = useState<string | null>(null)

  // Handle date change from calendar
  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    // Convert date to day of week (1-7, where 1=Monday, 7=Sunday)
    const dow = date.getDay() === 0 ? 7 : date.getDay()
    // Navigate to the workout page for that day
    router.push(`/app/workout/${dow}`)
  }

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
            profile_picture_url: data.profile_picture_url,
            program_start_date: data.program_start_date
          })

          // Set user name from first_name or email fallback
          if (data.first_name) {
            setUserName(data.first_name)
          } else {
            const emailUsername = email.split('@')[0]
            setUserName(emailUsername)
          }

          // Set program start date
          if (data.program_start_date) {
            setProgramStartDate(new Date(data.program_start_date))
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

  // Load workout completion status when selected date changes
  useEffect(() => {
    const loadWorkoutForDate = async () => {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await fetch(
        `/api/workout/check?email=${encodeURIComponent(email)}&date=${dateStr}`
      )

      if (response.ok) {
        const data = await response.json()
        // Update completedDays for this specific day
        setCompletedDays(prev => ({
          ...prev,
          [dayOfWeek]: data.completed
        }))

        // Clear localStorage progress if workout is completed
        if (data.completed) {
          setCompletedSets({})
        }
      }

      // Load workout session for this date
      const sessionResponse = await fetch(
        `/api/workout/session?email=${encodeURIComponent(email)}&date=${dateStr}`
      )
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json()
        if (sessionData.session) {
          setWorkoutSessionId(sessionData.session.id)
        } else {
          setWorkoutSessionId(null)
        }
      }
    }

    loadWorkoutForDate()
  }, [selectedDate, dayOfWeek])

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

        <div className="container-mobile py-6 pb-24 space-y-6">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>

          {/* Hero Section - Rest Day */}
          <div
            className="bg-gradient-to-r from-success/20 to-success/10 rounded-2xl p-6 border-2 border-success/30 animate-fade-in shimmer-effect spotlight-effect"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Sparkles className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">Ден за възстановяване</h1>
                <p className="text-sm text-muted-foreground">
                  Почивката е също толкова важна, колкото тренировката. Използвай този ден разумно!
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Calendar */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <WeeklyCalendar
              programStartDate={programStartDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateChange}
              completedDates={completedDates}
            />
          </div>

          {/* Bento Grid - Recovery Activities */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Active Recovery (2x1) */}
            <div
              className="col-span-2 bg-background rounded-2xl p-5 border border-border hover:border-primary/50 transition-all shimmer-effect hover-lift animate-fade-in"
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">Активна почивка</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Лека разходка 20-30 минути или динамичен стречинг
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                      Разходка
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                      Стречинг
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                      Йога
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hydration (1x1) */}
            <div
              className="bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all shimmer-effect hover-lift animate-fade-in"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              <div className="mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                  <span className="text-2xl">💧</span>
                </div>
                <h3 className="font-bold text-sm mb-1">Хидратация</h3>
                <p className="text-xs text-muted-foreground">
                  Изпий минимум 2-3 литра вода
                </p>
              </div>
            </div>

            {/* Sleep (1x1) */}
            <div
              className="bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all shimmer-effect hover-lift animate-fade-in"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            >
              <div className="mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                  <Moon className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-bold text-sm mb-1">Качествен сън</h3>
                <p className="text-xs text-muted-foreground">
                  8+ часа за пълно възстановяване
                </p>
              </div>
            </div>

            {/* Nutrition (2x1) */}
            <div
              className="col-span-2 bg-background rounded-2xl p-5 border border-border hover:border-primary/50 transition-all shimmer-effect hover-lift animate-fade-in"
              style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Utensils className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">Хранене</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Следвай хранителния си план - протеините са ключови за възстановяване
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Протеин</p>
                      <p className="text-sm font-bold">Висок</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Въглехидрати</p>
                      <p className="text-sm font-bold">Умерени</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Мазнини</p>
                      <p className="text-sm font-bold">Здравословни</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Relaxation (1x1) */}
            <div
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-all shimmer-effect hover-lift animate-fade-in"
              style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
            >
              <div className="mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm mb-1">Релакс</h3>
                <p className="text-xs text-muted-foreground">
                  Медитация, четене, или hobby
                </p>
              </div>
            </div>

            {/* Mobility (1x1) */}
            <div
              className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4 border border-success/20 hover:border-success/50 transition-all shimmer-effect hover-lift animate-fade-in"
              style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
            >
              <div className="mb-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-bold text-sm mb-1">Мобилност</h3>
                <p className="text-xs text-muted-foreground">
                  10-15 мин стречинг
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Progress Card */}
          {completedDays && Object.keys(completedDays).length > 0 && (
            <div
              className="bg-background rounded-2xl p-5 border border-border animate-fade-in"
              style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <h3 className="font-bold">Седмичен прогрес</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isCompleted = completedDays[day]
                  const isRestDay = day === 2 || day === 5 // Example rest days
                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isRestDay
                            ? 'bg-muted/50 text-muted-foreground'
                            : 'bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      {isRestDay ? '💤' : day}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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

        {/* Weekly Calendar */}
        <div className="animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
          <WeeklyCalendar
            programStartDate={programStartDate}
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
            completedDates={completedDates}
          />
        </div>

        {/* Hero Section - Workout Info */}
        <div
          className="relative bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30 animate-fade-in shimmer-effect spotlight-effect"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{workout.name}</h1>
              <p className="text-sm text-muted-foreground">
                {workout.duration} минути • {totalExercises} упражнения
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveTooltip(activeTooltip === 'hero' ? null : 'hero')
            }}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted/50 transition-colors z-10"
          >
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
          {activeTooltip === 'hero' && typeof window !== 'undefined' && createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 z-[99998] animate-fade-in"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(null)
                }}
              />
              <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 p-4 bg-white border-2 border-primary/20 rounded-xl shadow-2xl z-[99999] animate-fade-in">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-bold text-foreground">Тренировка</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTooltip(null)
                    }}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Специално подбрани упражнения за повишаване на тестостерона. Следвай техниката във видеата и маркирай всяка серия като завършена.
                </p>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* Bento Grid - Workout Stats */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {/* Progress (2x1) */}
          <div
            className="col-span-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-5 border-2 border-primary/30 animate-fade-in shimmer-effect hover-lift"
            style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Прогрес</h3>
            </div>
            <div className="text-4xl font-bold text-primary mb-2 animate-count-up">
              {progressPercentage}%
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              {totalSetsCompleted} от {totalSetsNeeded} серии
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Target Time (1x1) */}
          <div
            className="bg-background rounded-2xl p-4 border border-border animate-fade-in shimmer-effect hover-lift"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <Timer className="w-5 h-5 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1 animate-count-up">{workout.duration}</div>
            <div className="text-xs text-muted-foreground">минути</div>
          </div>

          {/* Exercises Count (1x1) */}
          <div
            className="bg-background rounded-2xl p-4 border border-border animate-fade-in shimmer-effect hover-lift"
            style={{ animationDelay: '0.25s', animationFillMode: 'both' }}
          >
            <Dumbbell className="w-5 h-5 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1 animate-count-up">{totalExercises}</div>
            <div className="text-xs text-muted-foreground">упражнения</div>
          </div>
        </div>

        {/* Workout Timer */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <WorkoutTimer
            workoutName={workout.name}
            targetDuration={workout.duration}
            dayOfWeek={dayOfWeek}
            onWorkoutComplete={(duration) => {
              console.log('Workout completed in', duration, 'minutes')
            }}
          />
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          <h2
            className="text-lg font-bold animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            Упражнения
          </h2>

          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${0.4 + index * 0.05}s`, animationFillMode: 'both' }}
            >
              <ExerciseCardEnhanced
                exercise={exercise}
                exerciseNumber={index + 1}
                exerciseOrder={index + 1}
                email={email || ''}
                date={selectedDate.toISOString().split('T')[0]}
                workoutSessionId={workoutSessionId}
                onAllSetsComplete={() => {
                  // Mark all sets as complete for progress tracking
                  setCompletedSets(prev => ({
                    ...prev,
                    [index]: Array.from({ length: exercise.sets }, (_, i) => i + 1)
                  }))
                }}
              />
            </div>
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
