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
import { CycleCompleteModal } from '@/components/dashboard/CycleCompleteModal'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { ElectricBorder } from '@/components/ui/electric-border'
import { SkeletonCard, SkeletonProgressBar, SkeletonQuizScore } from '@/components/ui/skeleton-card'
import { createClient } from '@/lib/supabase/client'
import { useWeeklyCompletion } from '@/lib/hooks/useWeeklyCompletion'
import { Target, TrendingUp, Utensils, Dumbbell, Moon, Pill, CheckCircle2, ArrowRight, Calendar, Info, X, MapPin, CalendarDays, PartyPopper, ThumbsUp, Sparkles, AlertTriangle } from 'lucide-react'
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
  const [showCycleComplete, setShowCycleComplete] = useState(false)
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

  // Selected day stats (for calendar selection)
  const [selectedDayStats, setSelectedDayStats] = useState({
    mealsCompleted: 0,
    totalMeals: 5,
    workoutCompleted: false,
    workoutName: null as string | null,
    workoutDuration: null as number | null,
    sleepTracked: false,
    sleepHours: null as number | null,
    sleepQuality: null as number | null,
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

  // Weekly completion rate data for sparkline
  const [weeklyCompletionRates, setWeeklyCompletionRates] = useState<number[]>([])
  const [avgCompletionRate, setAvgCompletionRate] = useState(0)

  // Quiz score improvement tracking
  const [estimatedCurrentScore, setEstimatedCurrentScore] = useState(0)
  const [scoreReduction, setScoreReduction] = useState(0)
  const [selectedDayScore, setSelectedDayScore] = useState(0)
  const [selectedDayCompliance, setSelectedDayCompliance] = useState(0)

  // Weekly completion hook
  const email = typeof window !== 'undefined' ? localStorage.getItem('quizEmail') : null
  const { completedDates } = useWeeklyCompletion(selectedDate, email)

  // Check if selected date is today
  const isSelectedDateToday = selectedDate.toDateString() === new Date().toDateString()

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

        // Fetch today's data - PARALLEL API CALLS for 2.5x speed boost
        const today = new Date().toISOString().split('T')[0]

        // Execute all independent API calls in parallel
        const [
          testoUpResponse,
          mealsResponse,
          workoutResponse,
          sleepResponse,
          statsResponse,
          inventoryResponse
        ] = await Promise.all([
          fetch(`/api/testoup/track?email=${encodeURIComponent(email)}&date=${today}`),
          fetch(`/api/meals/complete?email=${encodeURIComponent(email)}&date=${today}`),
          fetch(`/api/workout/check?email=${encodeURIComponent(email)}&date=${today}`),
          fetch(`/api/sleep/track?email=${encodeURIComponent(email)}&date=${today}`),
          fetch(`/api/user/stats?email=${encodeURIComponent(email)}`),
          fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
        ])

        // Process TestoUp data
        if (testoUpResponse.ok) {
          const testoUpData = await testoUpResponse.json()
          setTodayStats(prev => ({
            ...prev,
            testoUpMorning: testoUpData.morning_taken,
            testoUpEvening: testoUpData.evening_taken,
          }))
        }

        // Process Meals data
        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json()
          setTodayStats(prev => ({
            ...prev,
            mealsCompleted: mealsData.completedMeals?.length || 0,
          }))
        }

        // Process Workout data
        if (workoutResponse.ok) {
          const workoutData = await workoutResponse.json()
          setTodayStats(prev => ({
            ...prev,
            workoutCompleted: workoutData.completed || false,
          }))
        }

        // Process Sleep data
        if (sleepResponse.ok) {
          const sleepData = await sleepResponse.json()
          setTodayStats(prev => ({
            ...prev,
            sleepTracked: sleepData.hours > 0,
          }))
        }

        // Process weekly stats
        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          setWeeklyStats({
            mealsCompleted: stats.mealsCompleted || 0,
            workoutsCompleted: stats.workoutsCompleted || 0,
            averageSleep: stats.averageSleepHours || 0,
            testoUpCompliance: stats.testoUpCompliance || 0,
          })
        }

        // Process inventory data
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

  // Load selected day data when date changes
  useEffect(() => {
    const loadSelectedDayData = async () => {
      if (!email) return

      try {
        const dateString = selectedDate.toISOString().split('T')[0]

        // Fetch day details from API
        const response = await fetch(
          `/api/user/day-details?email=${encodeURIComponent(email)}&date=${dateString}`
        )

        if (response.ok) {
          const data = await response.json()
          setSelectedDayStats({
            mealsCompleted: data.tasks.meals.completed,
            totalMeals: data.tasks.meals.total,
            workoutCompleted: data.tasks.workout.status === 'completed',
            workoutName: data.tasks.workout.name,
            workoutDuration: data.tasks.workout.duration,
            sleepTracked: data.tasks.sleep.status === 'completed',
            sleepHours: data.tasks.sleep.hours,
            sleepQuality: data.tasks.sleep.quality,
            testoUpMorning: data.tasks.testoup.morning,
            testoUpEvening: data.tasks.testoup.evening,
          })
        }
      } catch (error) {
        console.error('Error loading selected day data:', error)
      }
    }

    loadSelectedDayData()
  }, [selectedDate, email])

  // Calculate weekly completion rates for sparkline
  useEffect(() => {
    if (!completedDates || Object.keys(completedDates).length === 0) return

    const today = new Date()
    const last7Days: number[] = []

    // Get last 7 days completion rates
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]

      const dayData = completedDates[dateString]
      if (dayData) {
        const rate = (dayData.completed / dayData.total) * 100
        last7Days.push(rate)
      } else {
        last7Days.push(0)
      }
    }

    setWeeklyCompletionRates(last7Days)

    // Calculate average
    const avg = last7Days.length > 0
      ? last7Days.reduce((sum, rate) => sum + rate, 0) / last7Days.length
      : 0
    setAvgCompletionRate(Math.round(avg))
  }, [completedDates])

  // Fetch progressive score for selected day
  useEffect(() => {
    const fetchProgressiveScore = async () => {
      if (!email || !userProgram) return

      try {
        const dateString = selectedDate.toISOString().split('T')[0]
        const response = await fetch(
          `/api/user/progressive-score?email=${encodeURIComponent(email)}&date=${dateString}`
        )

        if (response.ok) {
          const data = await response.json()
          setSelectedDayScore(data.score)
          setSelectedDayCompliance(data.compliancePercentage)

          // Also set current score if it's today
          if (isSelectedDateToday) {
            setEstimatedCurrentScore(data.score)
          }
        } else {
          // Fallback to initial score
          setSelectedDayScore(userProgram.total_score)
          setSelectedDayCompliance(0)
        }
      } catch (error) {
        console.error('Error fetching progressive score:', error)
        setSelectedDayScore(userProgram.total_score)
        setSelectedDayCompliance(0)
      }
    }

    fetchProgressiveScore()
  }, [selectedDate, email, userProgram, isSelectedDateToday])

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

  // Check if user completed 30-day cycle and has remaining capsules
  useEffect(() => {
    if (!userProgram || !testoUpInventory) return

    const currentProgramDay = Math.max(
      Math.floor((new Date().getTime() - programStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      1
    )

    // Check if cycle is complete and user has capsules for at least 1 more day
    const isCycleComplete = currentProgramDay >= 30
    const hasRemainingCapsules = testoUpInventory.capsules_remaining >= 2

    if (isCycleComplete && hasRemainingCapsules) {
      // Check if modal was already shown today
      const today = new Date().toISOString().split('T')[0]
      const lastShown = localStorage.getItem('cycleModalShownDate')

      if (lastShown !== today) {
        setShowCycleComplete(true)
        localStorage.setItem('cycleModalShownDate', today)
      }
    }
  }, [userProgram, testoUpInventory, programStartDate])

  // Helper function to get score color based on new thresholds
  // 0-50: Red (low progress)
  // 51-80: Orange (good progress)
  // 81-100: Green (excellent progress)
  const getScoreColor = (score: number) => {
    if (score >= 81) return 'success'
    if (score >= 51) return 'warning'
    return 'destructive'
  }

  const getScoreColorClass = (score: number) => {
    const color = getScoreColor(score)
    return color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-destructive'
  }

  const getScoreColorBg = (score: number) => {
    const color = getScoreColor(score)
    return color === 'success' ? 'bg-success/20' : color === 'warning' ? 'bg-warning/20' : 'bg-destructive/20'
  }

  const getScoreColorHSL = (score: number) => {
    if (score >= 81) return 'hsl(142, 76%, 36%)'
    if (score >= 51) return 'hsl(38, 92%, 50%)'
    return 'hsl(0, 84%, 60%)'
  }

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

  // Calculate selected day's progress
  const selectedDayProgress = [
    selectedDayStats.testoUpMorning && selectedDayStats.testoUpEvening,
    selectedDayStats.mealsCompleted >= 3,
    selectedDayStats.workoutCompleted,
    selectedDayStats.sleepTracked,
  ].filter(Boolean).length

  const selectedDayTotal = 4

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
      {showCycleComplete && testoUpInventory && (
        <CycleCompleteModal
          isOpen={showCycleComplete}
          onClose={() => setShowCycleComplete(false)}
          email={localStorage.getItem('quizEmail') || ''}
          capsulesRemaining={testoUpInventory.capsules_remaining}
          daysRemaining={testoUpInventory.days_remaining}
          currentCategory={userProgram.category}
        />
      )}

      <TopNav programName={programName} userName={userName} profilePictureUrl={userProgram?.profile_picture_url} />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Hero Section */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">
            {greetingTime}
          </h1>
          <div className="flex flex-col items-end gap-1.5">
            <div className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
              <span className="text-xs font-bold text-primary">Ден {currentProgramDay}/30</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {loading ? (
            <>
              <SkeletonQuizScore />
              <SkeletonCard animationDelay="0.1s" />
              <SkeletonCard animationDelay="0.2s" />
              <SkeletonCard animationDelay="0.3s" />
              <SkeletonCard animationDelay="0.4s" />
              <SkeletonProgressBar />
            </>
          ) : (
            <>
              {/* Quiz Score - 2 Row Layout */}
              <div className="relative col-span-4">
            {/* Single Smooth Wave Background */}
            <svg className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 0,50 C 20,30 30,30 50,50 C 70,70 80,70 100,50 L 100,100 L 0,100 Z"
                fill={(() => {
                  const s = selectedDayScore || userProgram.total_score
                  if (s >= 81) return 'hsl(142, 76%, 36%, 0.08)'
                  if (s >= 51) return 'hsl(38, 92%, 50%, 0.08)'
                  return 'hsl(0, 84%, 60%, 0.08)'
                })()}
              >
                <animate
                  attributeName="d"
                  dur="15s"
                  repeatCount="indefinite"
                  values="
                    M 0,50 C 20,30 30,30 50,50 C 70,70 80,70 100,50 L 100,100 L 0,100 Z;
                    M 0,50 C 20,70 30,70 50,50 C 70,30 80,30 100,50 L 100,100 L 0,100 Z;
                    M 0,50 C 20,30 30,30 50,50 C 70,70 80,70 100,50 L 100,100 L 0,100 Z
                  "
                />
              </path>
            </svg>

            <Link
              href="/app/profile"
              className="relative block bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all group animate-fade-in cursor-pointer overflow-hidden"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              <div className="space-y-4">
                {/* Row 1: Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColorBg(selectedDayScore || userProgram.total_score)}`}>
                      <Target className={`w-6 h-6 ${getScoreColorClass(selectedDayScore || userProgram.total_score)}`} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-muted-foreground">Симптоми Score</div>
                      <div className="text-sm text-muted-foreground/70 mt-0.5">
                        {isSelectedDateToday ? 'Днес' : selectedDate.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* TestoUp Info - Top Right */}
                  {testoUpInventory && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      testoUpInventory.capsules_remaining < 30
                        ? 'bg-destructive/10 border border-destructive/30'
                        : 'bg-muted/30 border border-border'
                    }`}>
                      <Pill className={`w-5 h-5 ${testoUpInventory.capsules_remaining < 30 ? 'text-destructive' : 'text-muted-foreground'}`} />
                      <div>
                        <div className={`text-lg font-bold ${testoUpInventory.capsules_remaining < 30 ? 'text-destructive' : 'text-foreground'}`}>
                          {testoUpInventory.capsules_remaining}
                        </div>
                        <div className="text-xs text-muted-foreground">капсули</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 2: Scores & Chart */}
                <div className="flex items-center justify-between">
                  {/* Score Comparison */}
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="text-sm text-muted-foreground">Начален</div>
                      <div className={`text-4xl font-bold ${getScoreColorClass(userProgram.total_score)}`}>
                        {userProgram.total_score}
                      </div>
                    </div>
                    <ArrowRight className={`w-6 h-6 ${getScoreColorClass(selectedDayScore || userProgram.total_score)}`} />
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="text-sm text-muted-foreground">Текущ</div>
                      <div className={`text-5xl font-bold ${getScoreColorClass(selectedDayScore || userProgram.total_score)}`}>
                        {selectedDayScore || userProgram.total_score}
                      </div>
                    </div>
                  </div>

                  {/* Chart & Status */}
                  <div className="flex flex-col items-center gap-3">
                    {weeklyCompletionRates.length > 0 && (
                      <svg width="140" height="60" viewBox="0 0 140 60" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="score-gradient-mini" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={getScoreColorHSL(selectedDayScore || userProgram.total_score)} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={getScoreColorHSL(selectedDayScore || userProgram.total_score)} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={(() => {
                          const w = 140, h = 60, p = 6
                          const pts = weeklyCompletionRates.map((r, i) => {
                            const x = (i / (weeklyCompletionRates.length - 1)) * w
                            const y = h - p - ((r / 100) * (h - p * 2))
                            return `${x},${y}`
                          })
                          return `M 0,${h} L ${pts.join(' L ')} L ${w},${h} Z`
                        })()}
                        fill="url(#score-gradient-mini)"
                      />
                      <polyline
                        points={weeklyCompletionRates.map((r, i) => {
                          const w = 140, h = 60, p = 6
                          const x = (i / (weeklyCompletionRates.length - 1)) * w
                          const y = h - p - ((r / 100) * (h - p * 2))
                          return `${x},${y}`
                        }).join(' ')}
                        fill="none"
                        stroke={getScoreColorHSL(selectedDayScore || userProgram.total_score)}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                    <div className={`text-sm font-bold ${getScoreColorClass(selectedDayScore || userProgram.total_score)}`}>
                      {(() => {
                        const s = selectedDayScore || userProgram.total_score
                        if (s >= 81) return 'Отлично!'
                        if (s >= 51) return 'Добър прогрес'
                        return 'Следвай плана'
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'quiz' ? null : 'quiz')
              }}
              className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                    Начален резултат от теста показва тежестта на симптомите. Колкото по-добре следваш програмата, толкова повече намаляват симптомите. Процентът показва estimated подобрение базирано на твоя compliance.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Daily Tasks Header & Progress */}
          <div className="col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isSelectedDateToday ? (
                  <>
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-muted-foreground">ДНЕС - Твоите задачи</h3>
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      {selectedDate.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
                    </h3>
                  </>
                )}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{selectedDayProgress}/{selectedDayTotal}</span>
            </div>
          </div>

          {/* Quick Stats - 4 tiles (1x1 each) - Enhanced */}
          {/* Meals Card - Critical if < 3 meals */}
          {isSelectedDateToday && selectedDayStats.mealsCompleted < 3 ? (
            <ElectricBorder borderColor="from-orange-500 via-red-500 to-pink-500" className="col-span-1">
              <div
                className="relative bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
                onClick={() => router.push('/app/nutrition')}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-lg font-bold">{selectedDayStats.mealsCompleted}/{selectedDayStats.totalMeals}</div>
                  </div>
                  {selectedDayStats.mealsCompleted >= 3 ? (
                    <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Цел постигната</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">
                      Още {3 - selectedDayStats.mealsCompleted} до цел
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTooltip(activeTooltip === 'meals' ? null : 'meals')
                  }}
                  className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                        Брой завършени хранения за избрания ден. Целта е минимум 3 от 5 хранения дневно за оптимални резултати.
                      </p>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            </ElectricBorder>
          ) : (
            <div
              className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
              onClick={() => router.push('/app/nutrition')}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-lg font-bold">{selectedDayStats.mealsCompleted}/{selectedDayStats.totalMeals}</div>
                </div>
                {selectedDayStats.mealsCompleted >= 3 ? (
                  <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Цел постигната</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground">
                    Още {3 - selectedDayStats.mealsCompleted} до цел
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(activeTooltip === 'meals' ? null : 'meals')
                }}
                className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                    Брой завършени хранения за избрания ден. Целта е минимум 3 от 5 хранения дневно за оптимални резултати.
                  </p>
                </div>
              </>,
              document.body
            )}
            </div>
          )}

          {/* Workout Card - Critical if not completed */}
          {isSelectedDateToday && !selectedDayStats.workoutCompleted ? (
            <ElectricBorder borderColor="from-blue-500 via-cyan-500 to-teal-500" className="col-span-1">
              <div
                className="relative bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
                style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
                onClick={() => router.push(`/app/workout/${selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()}`)}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-lg font-bold">
                      {selectedDayStats.workoutCompleted ? '1' : '0'}/1
                    </div>
                  </div>
                  {selectedDayStats.workoutCompleted ? (
                    <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{selectedDayStats.workoutDuration ? `${selectedDayStats.workoutDuration} мин` : 'Завършено'}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Не е завършено</div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTooltip(activeTooltip === 'workouts' ? null : 'workouts')
                  }}
                  className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                        Статус на тренировката за избрания ден. Редовните тренировки са ключови за повишаване на тестостерона.
                      </p>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            </ElectricBorder>
          ) : (
            <div
              className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
              onClick={() => router.push(`/app/workout/${selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()}`)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-lg font-bold">
                    {selectedDayStats.workoutCompleted ? '1' : '0'}/1
                  </div>
                </div>
                {selectedDayStats.workoutCompleted ? (
                  <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{selectedDayStats.workoutDuration ? `${selectedDayStats.workoutDuration} мин` : 'Завършено'}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground">Не е завършено</div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(activeTooltip === 'workouts' ? null : 'workouts')
                }}
                className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                      Статус на тренировката за избрания ден. Редовните тренировки са ключови за повишаване на тестостерона.
                    </p>
                  </div>
                </>,
                document.body
              )}
            </div>
          )}

          {/* Sleep Card - Critical if not tracked */}
          {isSelectedDateToday && !selectedDayStats.sleepTracked ? (
            <ElectricBorder borderColor="from-purple-500 via-indigo-500 to-violet-500" className="col-span-1">
              <div
                className="relative bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
                style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
                onClick={() => router.push('/app/sleep')}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-lg font-bold">
                      {selectedDayStats.sleepTracked ? (
                        `${selectedDayStats.sleepHours}ч`
                      ) : (
                        <span className="text-destructive">•</span>
                      )}
                    </div>
                  </div>
                  {selectedDayStats.sleepTracked ? (
                    <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Качество: {selectedDayStats.sleepQuality || 'N/A'}/10</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Не е проследен</div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTooltip(activeTooltip === 'sleep' ? null : 'sleep')
                  }}
                  className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                        Брой часове сън за избрания ден. Целта е 7-9 часа качествен сън за оптимална хормонална функция.
                      </p>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            </ElectricBorder>
          ) : (
            <div
              className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
              style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
              onClick={() => router.push('/app/sleep')}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-lg font-bold">
                    {selectedDayStats.sleepTracked ? (
                      `${selectedDayStats.sleepHours}ч`
                    ) : (
                      <span className="text-destructive">•</span>
                    )}
                  </div>
                </div>
                {selectedDayStats.sleepTracked ? (
                  <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Качество: {selectedDayStats.sleepQuality || 'N/A'}/10</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground">Не е проследен</div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(activeTooltip === 'sleep' ? null : 'sleep')
                }}
                className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                      Брой часове сън за избрания ден. Целта е 7-9 часа качествен сън за оптимална хормонална функция.
                    </p>
                  </div>
                </>,
                document.body
              )}
            </div>
          )}

          {/* TestoUp Card - Critical if not fully taken (both doses) */}
          {isSelectedDateToday && (!selectedDayStats.testoUpMorning || !selectedDayStats.testoUpEvening) ? (
            <ElectricBorder borderColor="from-green-500 via-emerald-500 to-lime-500" className="col-span-1">
              <div
                className="relative bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
                style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
                onClick={() => router.push('/app/supplement')}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-lg font-bold">
                      {(selectedDayStats.testoUpMorning ? 1 : 0) + (selectedDayStats.testoUpEvening ? 1 : 0)}/2
                    </div>
                  </div>
                  {selectedDayStats.testoUpMorning && selectedDayStats.testoUpEvening ? (
                    <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Пълен прием</span>
                    </div>
                  ) : selectedDayStats.testoUpMorning || selectedDayStats.testoUpEvening ? (
                    <div className="text-[10px] text-warning font-medium">Частичен прием</div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Не е взет</div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTooltip(activeTooltip === 'testoup' ? null : 'testoup')
                  }}
                  className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                        Брой взети дози за избрания ден. TestoUp се взема 2 пъти дневно (сутрин и вечер).
                      </p>
                    </div>
                  </>,
                  document.body
                )}
              </div>
            </ElectricBorder>
          ) : (
            <div
              className="relative col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 hover:scale-105 transition-all group animate-fade-in cursor-pointer"
              style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
              onClick={() => router.push('/app/supplement')}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-lg font-bold">
                    {(selectedDayStats.testoUpMorning ? 1 : 0) + (selectedDayStats.testoUpEvening ? 1 : 0)}/2
                  </div>
                </div>
                {selectedDayStats.testoUpMorning && selectedDayStats.testoUpEvening ? (
                  <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Пълен прием</span>
                  </div>
                ) : selectedDayStats.testoUpMorning || selectedDayStats.testoUpEvening ? (
                  <div className="text-[10px] text-warning font-medium">Частичен прием</div>
                ) : (
                  <div className="text-[10px] text-muted-foreground">Не е взет</div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(activeTooltip === 'testoup' ? null : 'testoup')
                }}
                className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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
                      Брой взети дози за избрания ден. TestoUp се взема 2 пъти дневно (сутрин и вечер).
                    </p>
                  </div>
                </>,
                document.body
              )}
            </div>
          )}

          {/* Overall Progress Bar */}
          <div className="col-span-4 bg-background rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Дневен прогрес</span>
              <span className="text-xs font-bold text-primary">{Math.round((selectedDayProgress / selectedDayTotal) * 100)}%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  selectedDayProgress === selectedDayTotal
                    ? 'bg-success'
                    : selectedDayProgress >= 3
                      ? 'bg-primary'
                      : selectedDayProgress >= 2
                        ? 'bg-warning'
                        : 'bg-destructive'
                }`}
                style={{ width: `${(selectedDayProgress / selectedDayTotal) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                {selectedDayProgress === selectedDayTotal ? (
                  <>
                    <PartyPopper className="w-3.5 h-3.5 text-success" />
                    <span className="text-[10px] text-success font-medium">Перфектен ден!</span>
                  </>
                ) : selectedDayProgress >= 3 ? (
                  <>
                    <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] text-muted-foreground">Добра работа!</span>
                  </>
                ) : selectedDayProgress >= 2 ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-warning" />
                    <span className="text-[10px] text-muted-foreground">Продължавай!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-[10px] text-destructive">Нужно е повече усилие</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{selectedDayProgress}/{selectedDayTotal} задачи</span>
            </div>
          </div>
            </>
          )}
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
            capsulesRemaining={testoUpInventory?.capsules_remaining}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveTooltip(activeTooltip === 'calendar' ? null : 'calendar')
            }}
            className="absolute top-2 right-2 rounded-md hover:bg-muted/50 transition-colors"
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

        {/* Progress Section with Sparkline */}
        <Link
          href="/app/progress"
          className="block bg-background rounded-2xl p-5 border border-border hover:border-primary/50 hover:scale-[1.02] transition-all group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold">Седмичен прогрес</h3>
              </div>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">{avgCompletionRate}%</div>
                <div className="text-xs text-muted-foreground">среден completion rate</div>
              </div>

              {/* Sparkline */}
              {weeklyCompletionRates.length > 0 && (
                <svg width="120" height="40" className="group-hover:scale-105 transition-transform">
                  <defs>
                    <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area under the line */}
                  <path
                    d={(() => {
                      const width = 120
                      const height = 40
                      const padding = 4
                      const points = weeklyCompletionRates.map((rate, i) => {
                        const x = (i / (weeklyCompletionRates.length - 1)) * width
                        const y = height - padding - ((rate / 100) * (height - padding * 2))
                        return `${x},${y}`
                      })
                      return `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`
                    })()}
                    fill="url(#sparkline-gradient)"
                  />

                  {/* Line */}
                  <polyline
                    points={weeklyCompletionRates.map((rate, i) => {
                      const width = 120
                      const height = 40
                      const padding = 4
                      const x = (i / (weeklyCompletionRates.length - 1)) * width
                      const y = height - padding - ((rate / 100) * (height - padding * 2))
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots on data points */}
                  {weeklyCompletionRates.map((rate, i) => {
                    const width = 120
                    const height = 40
                    const padding = 4
                    const x = (i / (weeklyCompletionRates.length - 1)) * width
                    const y = height - padding - ((rate / 100) * (height - padding * 2))
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2"
                        fill="hsl(var(--primary))"
                      />
                    )
                  })}
                </svg>
              )}
            </div>
          </div>
        </Link>

        {/* Selected Day Tasks */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h2 className="font-bold mb-4 capitalize">
            {selectedDate.toLocaleDateString('bg-BG', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/app/supplement')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                selectedDayStats.testoUpMorning && selectedDayStats.testoUpEvening
                  ? 'bg-success/10 hover:bg-success/20'
                  : selectedDate < new Date(new Date().setHours(0, 0, 0, 0))
                    ? 'bg-destructive/10 hover:bg-destructive/20'
                    : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedDayStats.testoUpMorning && selectedDayStats.testoUpEvening ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-success border-success">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : selectedDate < new Date(new Date().setHours(0, 0, 0, 0)) ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-destructive border-destructive">
                    <X className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-border" />
                )}
                <span className="text-sm">TestoUp (сутрин и вечер)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push('/app/nutrition')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                selectedDayStats.mealsCompleted >= 3
                  ? 'bg-success/10 hover:bg-success/20'
                  : selectedDate < new Date(new Date().setHours(0, 0, 0, 0))
                    ? 'bg-destructive/10 hover:bg-destructive/20'
                    : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedDayStats.mealsCompleted >= 3 ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-success border-success">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : selectedDate < new Date(new Date().setHours(0, 0, 0, 0)) ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-destructive border-destructive">
                    <X className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-border" />
                )}
                <span className="text-sm">Хранения ({selectedDayStats.mealsCompleted}/5)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push(`/app/workout/${selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()}`)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                selectedDayStats.workoutCompleted
                  ? 'bg-success/10 hover:bg-success/20'
                  : selectedDate < new Date(new Date().setHours(0, 0, 0, 0))
                    ? 'bg-destructive/10 hover:bg-destructive/20'
                    : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedDayStats.workoutCompleted ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-success border-success">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : selectedDate < new Date(new Date().setHours(0, 0, 0, 0)) ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-destructive border-destructive">
                    <X className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-border" />
                )}
                <span className="text-sm">Тренировка</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push('/app/sleep')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                selectedDayStats.sleepTracked
                  ? 'bg-success/10 hover:bg-success/20'
                  : selectedDate < new Date(new Date().setHours(0, 0, 0, 0))
                    ? 'bg-destructive/10 hover:bg-destructive/20'
                    : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedDayStats.sleepTracked ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-success border-success">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : selectedDate < new Date(new Date().setHours(0, 0, 0, 0)) ? (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-destructive border-destructive">
                    <X className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-border" />
                )}
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
