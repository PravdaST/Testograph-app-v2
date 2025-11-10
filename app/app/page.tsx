'use client'

/**
 * Main Dashboard Page
 * Weekly view with meals, workouts, and TestoUp tracking
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'
import { DayCard } from '@/components/dashboard/DayCard'
import { WelcomeGuide } from '@/components/dashboard/WelcomeGuide'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { createClient } from '@/lib/supabase/client'
// Meal Plan Imports - LOW level
import { ENERGY_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-low'
import { LIBIDO_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-low'
import { MUSCLE_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-low'

// Meal Plan Imports - NORMAL level
import { ENERGY_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-normal'
import { LIBIDO_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-normal'
import { MUSCLE_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-normal'

// Meal Plan Imports - HIGH level
import { ENERGY_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-high'
import { LIBIDO_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-high'
import { MUSCLE_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-high'

// Workout Imports - ENERGY LOW
import { ENERGY_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-low-home'
import { ENERGY_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-low-gym'

// Workout Imports - ENERGY NORMAL
import { ENERGY_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-normal-home'
import { ENERGY_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-normal-gym'

// Workout Imports - ENERGY HIGH
import { ENERGY_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-energy-high-home'
import { ENERGY_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-energy-high-gym'

// Workout Imports - LIBIDO LOW
import { LIBIDO_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-low-home'
import { LIBIDO_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-low-gym'

// Workout Imports - LIBIDO NORMAL
import { LIBIDO_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-normal-home'
import { LIBIDO_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-normal-gym'

// Workout Imports - LIBIDO HIGH
import { LIBIDO_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-libido-high-home'
import { LIBIDO_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-libido-high-gym'

// Workout Imports - MUSCLE LOW
import { MUSCLE_LOW_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-low-home'
import { MUSCLE_LOW_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-low-gym'

// Workout Imports - MUSCLE NORMAL
import { MUSCLE_NORMAL_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-normal-home'
import { MUSCLE_NORMAL_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-normal-gym'

// Workout Imports - MUSCLE HIGH
import { MUSCLE_HIGH_HOME_WORKOUTS } from '@/lib/data/mock-workouts-muscle-high-home'
import { MUSCLE_HIGH_GYM_WORKOUTS } from '@/lib/data/mock-workouts-muscle-high-gym'
import { Target, TrendingUp } from 'lucide-react'
import type { FeedbackDay, FeedbackResponse } from '@/lib/data/feedback-questions'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  total_score: number
  workout_location?: 'home' | 'gym'
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

// Helper function to get meal plan based on category and level
function getMealPlanForCategory(
  category: 'energy' | 'libido' | 'muscle',
  level: string = 'normal'
) {
  // Determine level based on score (LOW: 0-40, NORMAL: 41-70, HIGH: 71-100)
  const normalizedLevel = level.toLowerCase()

  if (category === 'energy') {
    if (normalizedLevel === 'low') return ENERGY_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return ENERGY_HIGH_MEAL_PLAN
    return ENERGY_NORMAL_MEAL_PLAN
  } else if (category === 'libido') {
    if (normalizedLevel === 'low') return LIBIDO_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return LIBIDO_HIGH_MEAL_PLAN
    return LIBIDO_NORMAL_MEAL_PLAN
  } else {
    if (normalizedLevel === 'low') return MUSCLE_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return MUSCLE_HIGH_MEAL_PLAN
    return MUSCLE_NORMAL_MEAL_PLAN
  }
}

// Helper function to get workout plan based on category, level, and location
function getWorkoutsForCategoryAndLocation(
  category: 'energy' | 'libido' | 'muscle',
  location: 'home' | 'gym' = 'gym', // Default to gym if not specified
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

export default function DashboardPage() {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackDay, setFeedbackDay] = useState<FeedbackDay | null>(null)
  const [userName, setUserName] = useState<string>()

  // Refs for scrolling to sections
  const mealsRef = useRef<HTMLDivElement>(null)
  const workoutRef = useRef<HTMLDivElement>(null)
  const sleepRef = useRef<HTMLDivElement>(null)
  const supplementRef = useRef<HTMLDivElement>(null)

  // Mock program start date (today - 5 days for demo)
  const programStartDate = new Date()
  programStartDate.setDate(programStartDate.getDate() - 5)

  const [selectedDate, setSelectedDate] = useState(new Date())

  // State for tracking completion (in real app, this comes from database)
  const [testoUpTracking, setTestoUpTracking] = useState<
    Record<string, { morning: boolean; evening: boolean }>
  >({})

  const [completedMeals, setCompletedMeals] = useState<
    Record<string, number[]>
  >({})

  const [testoUpInventory, setTestoUpInventory] = useState<{
    capsules_remaining: number
    days_remaining: number
    percentage_remaining: number
  } | null>(null)

  // Check if feedback is due for current day
  const checkFeedbackDue = async (email: string) => {
    try {
      // Calculate current program day
      const today = new Date()
      const daysSinceStart = Math.floor(
        (today.getTime() - programStartDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      const currentDay = daysSinceStart + 1

      // Check if today is a feedback day
      const feedbackDays: FeedbackDay[] = [7, 14, 21, 28, 30]
      const feedbackDueDay = feedbackDays.find((day) => day === currentDay)

      if (feedbackDueDay) {
        // Check if user already submitted feedback for this day
        const feedbackResponse = await fetch(
          `/api/feedback/history?email=${encodeURIComponent(email)}`
        )

        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          const alreadySubmitted = feedbackData.submissions?.some(
            (sub: { program_day: number }) => sub.program_day === feedbackDueDay
          )

          if (!alreadySubmitted) {
            setFeedbackDay(feedbackDueDay)
            setShowFeedback(true)
          }
        }
      }
    } catch (error) {
      console.error('Error checking feedback:', error)
      // Don't block if feedback check fails
    }
  }

  // Load user program on mount
  useEffect(() => {
    const loadUserProgram = async () => {
      try {
        // Get email from localStorage (saved during quiz)
        const email = localStorage.getItem('quizEmail')

        if (!email) {
          // No email found - redirect to login
          router.push('/login')
          return
        }

        // 🔒 ACCESS CONTROL: Check if user has active access
        const accessResponse = await fetch(`/api/user/access?email=${encodeURIComponent(email)}`)
        if (accessResponse.ok) {
          const accessData = await accessResponse.json()

          if (!accessData.hasAccess) {
            // No access - redirect to purchase page
            router.push('/no-access')
            return
          }
        }

        // Fetch user's program
        const response = await fetch(`/api/user/program?email=${encodeURIComponent(email)}`)

        if (!response.ok) {
          if (response.status === 404) {
            // No quiz result - redirect to quiz
            router.push('/quiz')
            return
          }
          throw new Error('Failed to fetch program')
        }

        const data = await response.json()
        setUserProgram(data)

        // Fetch TestoUp inventory
        const inventoryResponse = await fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json()
          setTestoUpInventory(inventoryData)
        }

        // Fetch today's TestoUp tracking
        const today = new Date().toISOString().split('T')[0]
        const trackingResponse = await fetch(`/api/testoup/track?email=${encodeURIComponent(email)}&date=${today}`)
        if (trackingResponse.ok) {
          const trackingData = await trackingResponse.json()
          const dateKey = getDateKey(new Date())
          setTestoUpTracking({
            [dateKey]: {
              morning: trackingData.morning_taken,
              evening: trackingData.evening_taken
            }
          })
        }

        // Fetch today's completed meals
        const mealsResponse = await fetch(`/api/meals/complete?email=${encodeURIComponent(email)}&date=${today}`)
        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json()
          const dateKey = getDateKey(new Date())
          setCompletedMeals({
            [dateKey]: mealsData.completedMeals
          })
        }

        // Check if this is first time login
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
        if (!hasSeenWelcome) {
          setShowWelcome(true)

          // Get user name from Supabase auth metadata
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user?.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name)
          }
        } else {
          // Check if feedback is due
          await checkFeedbackDue(email)
        }
      } catch (error) {
        console.error('Error loading program:', error)
        // On error, redirect to quiz
        router.push('/quiz')
      } finally {
        setLoading(false)
      }
    }

    loadUserProgram()
  }, [router])

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setShowWelcome(false)

    // After welcome, check for feedback
    const email = localStorage.getItem('quizEmail')
    if (email) {
      checkFeedbackDue(email)
    }
  }

  const handleFeedbackComplete = async (responses: FeedbackResponse[]) => {
    if (!feedbackDay) return

    try {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          program_day: feedbackDay,
          responses,
        }),
      })

      if (response.ok) {
        setShowFeedback(false)
        setFeedbackDay(null)
      } else {
        console.error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const handleFeedbackSkip = () => {
    setShowFeedback(false)
    setFeedbackDay(null)
  }

  const handleNavigation = (section: 'meals' | 'workout' | 'sleep' | 'supplement') => {
    const refs = {
      meals: mealsRef,
      workout: workoutRef,
      sleep: sleepRef,
      supplement: supplementRef,
    }

    const targetRef = refs[section]
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  // Get date key for tracking
  const getDateKey = (date: Date) => date.toISOString().split('T')[0]

  // Get personalized meal plan and workouts based on user's category, location, and level
  const mealPlan = userProgram ? getMealPlanForCategory(userProgram.category, userProgram.level) : null
  const workouts = userProgram
    ? getWorkoutsForCategoryAndLocation(
        userProgram.category,
        userProgram.workout_location || 'gym',
        userProgram.level
      )
    : null

  // Get meals for selected day
  const selectedDayOfWeek = selectedDate.getDay()
  const dayData = mealPlan?.meals.find(
    (m) => m.day_of_week === (selectedDayOfWeek === 0 ? 7 : selectedDayOfWeek)
  )

  const mealsForDay = dayData?.meals || []

  // Get workout for selected day
  const workoutData = workouts?.find(
    (w) => w.day_of_week === (selectedDayOfWeek === 0 ? 7 : selectedDayOfWeek)
  )

  // TestoUp tracking for selected day
  const dateKey = getDateKey(selectedDate)
  const testoUpForDay = testoUpTracking[dateKey] || {
    morning: false,
    evening: false,
  }

  const handleTestoUpToggle = async (timeOfDay: 'morning' | 'evening') => {
    const email = localStorage.getItem('quizEmail')
    if (!email) return

    const isCurrentlyTaken = testoUpTracking[dateKey]?.[timeOfDay]

    // Only track if marking as taken (not untaking)
    if (!isCurrentlyTaken) {
      try {
        const response = await fetch('/api/testoup/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            date: dateKey,
            period: timeOfDay,
          }),
        })

        if (response.ok) {
          // Update local tracking state
          setTestoUpTracking((prev) => ({
            ...prev,
            [dateKey]: {
              ...prev[dateKey],
              [timeOfDay]: true,
            },
          }))

          // Refresh inventory after tracking
          const inventoryResponse = await fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
          if (inventoryResponse.ok) {
            const inventoryData = await inventoryResponse.json()
            setTestoUpInventory(inventoryData)
          }
        }
      } catch (error) {
        console.error('Error tracking TestoUp:', error)
      }
    } else {
      // Allow untoggling without API call
      setTestoUpTracking((prev) => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [timeOfDay]: false,
        },
      }))
    }
  }

  const handleTestoUpRefill = async () => {
    const email = localStorage.getItem('quizEmail')
    if (!email) return

    try {
      const response = await fetch('/api/testoup/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        // Refresh inventory after refill
        const inventoryResponse = await fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json()
          setTestoUpInventory(inventoryData)
        }
      }
    } catch (error) {
      console.error('Error refilling TestoUp:', error)
    }
  }

  const handleMealComplete = async (mealNumber: number) => {
    const email = localStorage.getItem('quizEmail')
    if (!email) return

    // Optimistic update
    setCompletedMeals((prev) => {
      const dayMeals = prev[dateKey] || []
      const isCompleted = dayMeals.includes(mealNumber)

      return {
        ...prev,
        [dateKey]: isCompleted
          ? dayMeals.filter((m) => m !== mealNumber)
          : [...dayMeals, mealNumber],
      }
    })

    // Save to database
    try {
      await fetch('/api/meals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          date: dateKey,
          mealNumber,
        }),
      })
    } catch (error) {
      console.error('Error saving meal completion:', error)
      // Revert optimistic update on error
      setCompletedMeals((prev) => {
        const dayMeals = prev[dateKey] || []
        const isCompleted = dayMeals.includes(mealNumber)

        return {
          ...prev,
          [dateKey]: isCompleted
            ? dayMeals.filter((m) => m !== mealNumber)
            : [...dayMeals, mealNumber],
        }
      })
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  // No program loaded (shouldn't reach here due to redirect, but safety check)
  if (!userProgram) {
    return null
  }

  const programName = CATEGORY_NAMES[userProgram.category]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Welcome Guide - First time only */}
      {showWelcome && (
        <WelcomeGuide
          userName={userName}
          onComplete={handleWelcomeComplete}
        />
      )}

      {/* Feedback Modal - Shows on days 7, 14, 21, 28, 30 */}
      {showFeedback && feedbackDay && (
        <FeedbackModal
          day={feedbackDay}
          onComplete={handleFeedbackComplete}
          onSkip={handleFeedbackSkip}
        />
      )}

      {/* Top Navigation */}
      <TopNav programName={programName} userName={userName} />

      {/* Main Content with bottom padding for nav */}
      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Program Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">
                {programName}
              </h1>
              <p className="text-sm text-muted-foreground mb-3">
                30-дневна персонализирана програма
              </p>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    Ден{' '}
                    {Math.min(
                      Math.max(
                        Math.floor(
                          (selectedDate.getTime() -
                            programStartDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + 1,
                        1
                      ),
                      30
                    )}{' '}
                    от 30
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <WeeklyCalendar
          programStartDate={programStartDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Day Content */}
        {mealsForDay.length > 0 ? (
          <DayCard
            date={selectedDate}
            programStartDate={programStartDate}
            meals={mealsForDay}
            workout={workoutData}
            testoUpMorning={testoUpForDay.morning}
            testoUpEvening={testoUpForDay.evening}
            testoUpInventory={testoUpInventory}
            onTestoUpToggle={handleTestoUpToggle}
            onTestoUpRefill={handleTestoUpRefill}
            onMealComplete={handleMealComplete}
            completedMeals={completedMeals[dateKey] || []}
            category={userProgram.category}
            mealsRef={mealsRef}
            workoutRef={workoutRef}
            sleepRef={sleepRef}
            supplementRef={supplementRef}
          />
        ) : (
          <div className="bg-background rounded-2xl p-8 text-center border border-border">
            <p className="text-muted-foreground">
              Няма данни за този ден
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Изберете ден от седмицата с налични хранения
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav onNavigate={handleNavigation} />
    </div>
  )
}
