'use client'

/**
 * Workout History Page
 * Displays workout statistics, streaks, and history
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import {
  Dumbbell,
  Calendar,
  TrendingUp,
  Clock,
  Flame,
  Award,
  ArrowLeft,
  Activity,
  Info,
  X
} from 'lucide-react'
import Link from 'next/link'

interface WorkoutSession {
  id: string
  date: string
  day_of_week: number
  workout_name: string
  target_duration_minutes: number
  actual_duration_minutes: number
  started_at: string
  finished_at: string
}

interface WorkoutStats {
  totalWorkouts: number
  totalMinutes: number
  averageDuration: number
  currentStreak: number
  longestStreak: number
  workoutsByDay: Record<number, number>
  recentWorkouts: WorkoutSession[]
}

const DAY_NAMES = ['Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб', 'Нед']

export default function WorkoutHistoryPage() {
  const router = useRouter()
  const [stats, setStats] = useState<WorkoutStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string>()
  const [userName, setUserName] = useState<string>()
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>()
  const [activeTooltip, setActiveTooltip] = useState<'hero' | 'total' | 'streak' | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedEmail = localStorage.getItem('quizEmail')

        if (!storedEmail) {
          router.push('/quiz')
          return
        }

        setEmail(storedEmail)

        // Fetch user program data for name and profile picture
        const programResponse = await fetch(
          `/api/user/program?email=${encodeURIComponent(storedEmail)}`
        )

        if (programResponse.ok) {
          const programData = await programResponse.json()
          setUserName(programData.first_name || storedEmail.split('@')[0])
          setProfilePictureUrl(programData.profile_picture_url)
        }

        // Fetch workout history
        const response = await fetch(
          `/api/workout/history?email=${encodeURIComponent(storedEmail)}`
        )

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error loading workout history:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [router])

  const handleNavigation = (section: 'meals' | 'workout' | 'sleep' | 'supplement') => {
    router.push('/app')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('bg-BG', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const maxWorkoutsByDay = Math.max(...Object.values(stats?.workoutsByDay || {}))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <TopNav
        programName="История на тренировки"
        userName={userName}
        profilePictureUrl={profilePictureUrl}
      />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Back Button */}
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад към Dashboard
        </Link>

        {/* Hero Section */}
        <div
          className="relative bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30 animate-fade-in"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">История на тренировки</h1>
              <p className="text-sm text-muted-foreground">
                Преглед на твоя прогрес и статистики
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
                  <div className="text-sm font-bold text-foreground">История на тренировки</div>
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
                  Детайлна статистика за всички твои тренировки - общо тренировки, изминали минути, серии и прогрес.
                </p>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* Bento Grid - Stats */}
        {stats && stats.totalWorkouts > 0 && (
          <div className="grid grid-cols-4 gap-3 md:gap-4">
          {/* Total Workouts (2x2) */}
          <div
            className="relative col-span-2 row-span-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30 animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Dumbbell className="w-12 h-12 text-primary mb-4" />
              <div className="text-6xl font-bold text-primary mb-2">
                {stats?.totalWorkouts || 0}
              </div>
              <span className="text-sm text-muted-foreground">Общо тренировки</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'total' ? null : 'total')
              }}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted/50 transition-colors z-10"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'total' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Общо тренировки</div>
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
                    Брой на всички завършени тренировки от началото на програмата. Всяка завършена тренировка те приближава към целта.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Total Time (1x1) */}
          <div
            className="bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <Clock className="w-5 h-5 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1">
              {stats?.totalMinutes || 0}
            </div>
            <div className="text-xs text-muted-foreground">Общо минути</div>
          </div>

          {/* Average Duration (1x1) */}
          <div
            className="bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <Activity className="w-5 h-5 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1">
              {stats?.averageDuration || 0}
            </div>
            <div className="text-xs text-muted-foreground">Средна мин</div>
          </div>

          {/* Current Streak (2x1) */}
          <div
            className="relative col-span-2 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-2xl p-5 border-2 border-orange-500/30 animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-500" />
              <div className="flex-1">
                <div className="text-4xl font-bold text-orange-500 mb-1">
                  {stats?.currentStreak || 0}
                </div>
                <div className="text-xs text-muted-foreground">Текуща серия (дни)</div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'streak' ? null : 'streak')
              }}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted/50 transition-colors z-10"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'streak' && typeof window !== 'undefined' && createPortal(
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
                    <div className="text-sm font-bold text-foreground">Текуща серия</div>
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
                    Брой последователни дни с поне една завършена тренировка. Поддържай серията си за максимални резултати!
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Longest Streak (2x1) */}
          <div
            className="col-span-2 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-2xl p-5 border-2 border-amber-500/30 animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500" />
              <div className="flex-1">
                <div className="text-4xl font-bold text-amber-500 mb-1">
                  {stats?.longestStreak || 0}
                </div>
                <div className="text-xs text-muted-foreground">Най-дълга серия (дни)</div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Workouts by Day of Week */}
        {stats && stats.totalWorkouts > 0 && (
          <div
            className="bg-background rounded-2xl p-6 border border-border animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Тренировки по дни от седмицата</h2>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const count = stats.workoutsByDay[day] || 0
                const percentage = maxWorkoutsByDay > 0 ? (count / maxWorkoutsByDay) * 100 : 0

                return (
                  <div key={day} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{DAY_NAMES[day - 1]}</span>
                      <span className="text-sm font-semibold text-primary">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Workouts */}
        {stats && stats.recentWorkouts.length > 0 && (
          <div
            className="bg-background rounded-2xl p-6 border border-border animate-fade-in"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Последни тренировки</h2>
            </div>
            <div className="space-y-3">
              {stats.recentWorkouts.map((workout, index) => (
                <div
                  key={workout.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border animate-fade-in"
                  style={{ animationDelay: `${0.8 + index * 0.05}s`, animationFillMode: 'both' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{workout.workout_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(workout.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {workout.actual_duration_minutes} мин
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(workout.started_at)} - {formatTime(workout.finished_at)}
                      </p>
                    </div>
                  </div>

                  {/* Progress vs Target */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Цел: {workout.target_duration_minutes} мин
                      </span>
                      <span className="text-xs font-semibold">
                        {Math.round((workout.actual_duration_minutes / workout.target_duration_minutes) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          workout.actual_duration_minutes >= workout.target_duration_minutes
                            ? 'bg-success'
                            : 'bg-primary'
                        }`}
                        style={{
                          width: `${Math.min((workout.actual_duration_minutes / workout.target_duration_minutes) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {stats && stats.totalWorkouts === 0 && (
          <div className="bg-background rounded-2xl p-12 border border-border text-center">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-bold mb-2">Все още няма тренировки</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Започнете първата си тренировка, за да видите статистики тук
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Dumbbell className="w-4 h-4" />
              Започни тренировка
            </Link>
          </div>
        )}
      </div>

      <BottomNav onNavigate={handleNavigation} />
    </div>
  )
}
