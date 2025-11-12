'use client'

/**
 * Main Dashboard Page - Bento Grid Layout
 * Modern, interactive overview with quick stats and navigation
 */

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'
import { WelcomeGuide } from '@/components/dashboard/WelcomeGuide'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { createClient } from '@/lib/supabase/client'
import { useWeeklyCompletion } from '@/lib/hooks/useWeeklyCompletion'
import { Target, TrendingUp, Utensils, Dumbbell, Moon, Pill, Award, CheckCircle2, ArrowRight, Calendar, Info, X } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import type { FeedbackDay, FeedbackResponse } from '@/lib/data/feedback-questions'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  total_score: number
  workout_location?: 'home' | 'gym'
  profile_picture_url?: string
  program_start_date?: string
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

export default function DashboardPage() {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackDay, setFeedbackDay] = useState<FeedbackDay | null>(null)
  const [userName, setUserName] = useState<string>()
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAnimating, setIsAnimating] = useState(false)
  const hasTriggeredConfetti = useRef(false)

  // Today's stats
  const [todayStats, setTodayStats] = useState({
    mealsCompleted: 0,
    totalMeals: 5,
    workoutCompleted: false,
    sleepTracked: false,
    testoUpMorning: false,
    testoUpEvening: false,
  })

  // Weekly stats
  const [weeklyStats, setWeeklyStats] = useState({
    mealsCompleted: 0,
    workoutsCompleted: 0,
    averageSleep: 0,
    testoUpCompliance: 0,
  })

  const [testoUpInventory, setTestoUpInventory] = useState<{
    capsules_remaining: number
    days_remaining: number
    percentage_remaining: number
  } | null>(null)

  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState<'meals' | 'workouts' | 'sleep' | 'testoup' | 'quiz' | 'today' | 'program' | 'calendar' | null>(null)

  // Weekly completion hook
  const email = typeof window !== 'undefined' ? localStorage.getItem('quizEmail') : null
  const { completedDates } = useWeeklyCompletion(selectedDate, email)

  // Check if feedback is due
  const checkFeedbackDue = async (email: string, startDate: Date) => {
    try {
      const today = new Date()
      const daysSinceStart = Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      const currentDay = daysSinceStart + 1

      const feedbackDays: FeedbackDay[] = [7, 14, 21, 28, 30]
      const feedbackDueDay = feedbackDays.find((day) => day === currentDay)

      if (feedbackDueDay) {
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
    }
  }

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const email = localStorage.getItem('quizEmail')

        if (!email) {
          router.push('/login')
          return
        }

        // Check access
        const accessResponse = await fetch(`/api/user/access?email=${encodeURIComponent(email)}`)
        if (accessResponse.ok) {
          const accessData = await accessResponse.json()
          if (!accessData.hasAccess) {
            router.push('/no-access')
            return
          }
        }

        // Fetch user program
        const response = await fetch(`/api/user/program?email=${encodeURIComponent(email)}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/quiz')
            return
          }
          throw new Error('Failed to fetch program')
        }

        const data = await response.json()
        setUserProgram(data)

        if (data.program_start_date) {
          setProgramStartDate(new Date(data.program_start_date))
        }

        if (data.first_name) {
          setUserName(data.first_name)
        } else {
          const emailUsername = email.split('@')[0]
          setUserName(emailUsername)
        }

        // Fetch today's data
        const today = new Date().toISOString().split('T')[0]

        // TestoUp tracking
        const testoUpResponse = await fetch(`/api/testoup/track?email=${encodeURIComponent(email)}&date=${today}`)
        if (testoUpResponse.ok) {
          const testoUpData = await testoUpResponse.json()
          setTodayStats(prev => ({
            ...prev,
            testoUpMorning: testoUpData.morning_taken,
            testoUpEvening: testoUpData.evening_taken,
          }))
        }

        // Meals
        const mealsResponse = await fetch(`/api/meals/complete?email=${encodeURIComponent(email)}&date=${today}`)
        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json()
          setTodayStats(prev => ({
            ...prev,
            mealsCompleted: mealsData.completedMeals?.length || 0,
          }))
        }

        // Workout
        const workoutResponse = await fetch(`/api/workout/check?email=${encodeURIComponent(email)}&date=${today}`)
        if (workoutResponse.ok) {
          const workoutData = await workoutResponse.json()
          setTodayStats(prev => ({
            ...prev,
            workoutCompleted: workoutData.completed || false,
          }))
        }

        // Sleep
        const sleepResponse = await fetch(`/api/sleep/track?email=${encodeURIComponent(email)}&date=${today}`)
        if (sleepResponse.ok) {
          const sleepData = await sleepResponse.json()
          setTodayStats(prev => ({
            ...prev,
            sleepTracked: sleepData.hours > 0,
          }))
        }

        // Fetch weekly stats
        const statsResponse = await fetch(`/api/user/stats?email=${encodeURIComponent(email)}`)
        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          setWeeklyStats({
            mealsCompleted: stats.mealsCompleted || 0,
            workoutsCompleted: stats.workoutsCompleted || 0,
            averageSleep: stats.averageSleepHours || 0,
            testoUpCompliance: stats.testoUpCompliance || 0,
          })
        }

        // Fetch inventory
        const inventoryResponse = await fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json()
          setTestoUpInventory(inventoryData)
        }

        // Check for welcome guide
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
        if (!hasSeenWelcome) {
          setShowWelcome(true)
        } else {
          if (data.program_start_date) {
            await checkFeedbackDue(email, new Date(data.program_start_date))
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        router.push('/quiz')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  // Trigger animations on load
  useEffect(() => {
    if (!loading) {
      setIsAnimating(true)
    }
  }, [loading])

  // Confetti effect when all tasks completed
  useEffect(() => {
    const todayProgress = [
      todayStats.testoUpMorning && todayStats.testoUpEvening,
      todayStats.mealsCompleted >= 3,
      todayStats.workoutCompleted,
      todayStats.sleepTracked,
    ].filter(Boolean).length

    // Trigger confetti when all 4 tasks are completed
    if (todayProgress === 4 && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true

      // Confetti animation
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
    }
  }, [todayStats])

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setShowWelcome(false)
    const email = localStorage.getItem('quizEmail')
    if (email) {
      checkFeedbackDue(email, programStartDate)
    }
  }

  const handleFeedbackComplete = async (responses: FeedbackResponse[]) => {
    if (!feedbackDay) return

    try {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          program_day: feedbackDay,
          responses,
        }),
      })

      if (response.ok) {
        setShowFeedback(false)
        setFeedbackDay(null)
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
    const routes = {
      meals: '/app/nutrition',
      workout: `/app/workout/${selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()}`,
      sleep: '/app/sleep',
      supplement: '/app/supplement',
    }
    router.push(routes[section])
  }

  // Calculate program day
  const currentProgramDay = Math.min(
    Math.max(
      Math.floor((new Date().getTime() - programStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      1
    ),
    30
  )

  // Calculate today's progress
  const todayProgress = [
    todayStats.testoUpMorning && todayStats.testoUpEvening,
    todayStats.mealsCompleted >= 3,
    todayStats.workoutCompleted,
    todayStats.sleepTracked,
  ].filter(Boolean).length

  const todayTotal = 4

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!userProgram) return null

  const programName = CATEGORY_NAMES[userProgram.category]
  const greetingTime = new Date().getHours() < 12 ? 'Добро утро' : new Date().getHours() < 18 ? 'Добър ден' : 'Добър вечер'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {showWelcome && <WelcomeGuide userName={userName} onComplete={handleWelcomeComplete} />}
      {showFeedback && feedbackDay && (
        <FeedbackModal day={feedbackDay} onComplete={handleFeedbackComplete} onSkip={handleFeedbackSkip} />
      )}

      <TopNav programName={programName} userName={userName} profilePictureUrl={userProgram?.profile_picture_url} />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Hero Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {greetingTime}, {userName}!
          </h1>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {/* Quiz Score - Large Tile (2x2) */}
          <div className="relative col-span-2 row-span-2">
            <Link
              href="/app/profile"
              className={`block h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30 hover:scale-[1.02] transition-transform cursor-pointer group animate-fade-in ${
                userProgram.total_score >= 80 ? 'animate-pulse-glow' : ''
              }`}
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <Award className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-6xl font-bold text-primary mb-2">
                  {userProgram.total_score}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Quiz Score
                </div>
                <div className="mt-4 text-xs text-primary font-medium flex items-center gap-1">
                  Виж детайли <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'quiz' ? null : 'quiz')
              }}
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'quiz' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Quiz Score</div>
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
                    Резултат от началния тест, оценяващ твоите симптоми и нива. По-висок резултат означава повече симптоми, които програмата ще адресира.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Today's Progress (1x2) */}
          <div
            className="relative col-span-2 row-span-1 bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Днес</span>
              <span className="text-xs text-muted-foreground">{todayProgress}/{todayTotal}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(todayProgress / todayTotal) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className={`w-full h-1 rounded-full ${todayStats.testoUpMorning && todayStats.testoUpEvening ? 'bg-success' : 'bg-muted'}`} />
              <div className={`w-full h-1 rounded-full ${todayStats.mealsCompleted >= 3 ? 'bg-success' : 'bg-muted'}`} />
              <div className={`w-full h-1 rounded-full ${todayStats.workoutCompleted ? 'bg-success' : 'bg-muted'}`} />
              <div className={`w-full h-1 rounded-full ${todayStats.sleepTracked ? 'bg-success' : 'bg-muted'}`} />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'today' ? null : 'today')
              }}
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'today' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Дневен прогрес</div>
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
                    Дневен прогрес показва колко от 4-те основни задачи си завършил днес: TestoUp добавка, хранения (мин. 3), тренировка и проследяване на сън.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Program Info (2x1) */}
          <div
            className="relative col-span-2 row-span-1 bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Програма</span>
              </div>
              <span className="text-xs text-muted-foreground">Ден {currentProgramDay}/30</span>
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentProgramDay / 30) * 100}%` }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'program' ? null : 'program')
              }}
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'program' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Програма</div>
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
                    30-дневна персонализирана програма за оптимизация на тестостерона. Всеки ден е важен за постигане на най-добри резултати.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Quick Stats - 4 tiles (1x1 each) */}
          <div
            className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            onClick={() => router.push('/app/nutrition')}
          >
            <Utensils className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold">{weeklyStats.mealsCompleted}</div>
            <div className="text-xs text-muted-foreground">хранения</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'meals' ? null : 'meals')
              }}
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'meals' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Хранения</div>
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
                    Брой завършени хранения през последните 30 дни. Следи хранителния си план за оптимални резултати.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          <div
            className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            onClick={() => router.push(`/app/workout/${selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()}`)}
          >
            <Dumbbell className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold">{weeklyStats.workoutsCompleted}</div>
            <div className="text-xs text-muted-foreground">тренировки</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'workouts' ? null : 'workouts')
              }}
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'workouts' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Тренировки</div>
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
                    Брой завършени тренировки през последните 30 дни. Редовните тренировки са ключови за повишаване на тестостерона.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          <div
            className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
            onClick={() => router.push('/app/sleep')}
          >
            <Moon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold">{weeklyStats.averageSleep}ч</div>
            <div className="text-xs text-muted-foreground">сън</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'sleep' ? null : 'sleep')
              }}
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'sleep' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Сън</div>
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
                    Среден брой часове сън през последните 30 дни. Целта е 7-9 часа качествен сън за оптимална хормонална функция.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          <div
            className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
            onClick={() => router.push('/app/supplement')}
          >
            <Pill className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold">{weeklyStats.testoUpCompliance}%</div>
            <div className="text-xs text-muted-foreground">TestoUp</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'testoup' ? null : 'testoup')
              }}
              className="absolute bottom-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'testoup' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">TestoUp Compliance</div>
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
                    Процент на спазване на дозировката. TestoUp се взема 2 пъти дневно (сутрин и вечер). 100% = всички дози са взети през последните 30 дни.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="relative bg-background rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Седмичен календар</h2>
          </div>
          <WeeklyCalendar
            programStartDate={programStartDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            completedDates={completedDates}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveTooltip(activeTooltip === 'calendar' ? null : 'calendar')
            }}
            className="absolute top-5 right-5 p-1 rounded-md hover:bg-muted/50 transition-colors"
          >
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
          {activeTooltip === 'calendar' && typeof window !== 'undefined' && createPortal(
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
                  <div className="text-sm font-bold text-foreground">Седмичен календар</div>
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
                  Проследяване на твоя прогрес през седмицата. Избери ден, за да видиш или редактираш задачите си.
                </p>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* Today's Checklist */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h2 className="font-bold mb-4">Днешни задачи</h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/app/supplement')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${todayStats.testoUpMorning && todayStats.testoUpEvening ? 'bg-success border-success' : 'border-border'}`}>
                  {todayStats.testoUpMorning && todayStats.testoUpEvening && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm">TestoUp (сутрин и вечер)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push('/app/nutrition')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${todayStats.mealsCompleted >= 3 ? 'bg-success border-success' : 'border-border'}`}>
                  {todayStats.mealsCompleted >= 3 && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm">Хранения ({todayStats.mealsCompleted}/5)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push(`/app/workout/${selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()}`)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${todayStats.workoutCompleted ? 'bg-success border-success' : 'border-border'}`}>
                  {todayStats.workoutCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm">Тренировка</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push('/app/sleep')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${todayStats.sleepTracked ? 'bg-success border-success' : 'border-border'}`}>
                  {todayStats.sleepTracked && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm">Сън</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* TestoUp Low Inventory Warning */}
        {testoUpInventory && testoUpInventory.capsules_remaining < 30 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5 animate-shake">
            <div className="flex items-start gap-3">
              <Pill className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-destructive mb-1">Ниски запаси!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Остават {testoUpInventory.capsules_remaining} капсули ({testoUpInventory.days_remaining} дни)
                </p>
                <button
                  onClick={() => window.open('https://shop.testograph.eu', '_blank')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Поръчай сега
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav onNavigate={handleNavigation} />
    </div>
  )
}
