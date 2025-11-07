'use client'

/**
 * Workout History Page
 * Displays workout statistics, streaks, and history
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Activity
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

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedEmail = localStorage.getItem('quizEmail')

        if (!storedEmail) {
          router.push('/quiz')
          return
        }

        setEmail(storedEmail)

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
      <TopNav programName="История на тренировки" userName={email?.split('@')[0]} />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Back Button */}
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад към Dashboard
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Workouts */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Общо тренировки</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {stats?.totalWorkouts || 0}
            </div>
          </div>

          {/* Total Time */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Общо минути</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {stats?.totalMinutes || 0}
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-2xl p-6 border-2 border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">Текуща серия</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">
              {stats?.currentStreak || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">последователни дни</div>
          </div>

          {/* Longest Streak */}
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-2xl p-6 border-2 border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-muted-foreground">Най-дълга серия</span>
            </div>
            <div className="text-3xl font-bold text-amber-500">
              {stats?.longestStreak || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">последователни дни</div>
          </div>
        </div>

        {/* Average Duration */}
        {stats && stats.totalWorkouts > 0 && (
          <div className="bg-background rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Средна продължителност</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">
                {stats.averageDuration}
              </div>
              <div className="text-sm text-muted-foreground">минути на тренировка</div>
            </div>
          </div>
        )}

        {/* Workouts by Day of Week */}
        {stats && stats.totalWorkouts > 0 && (
          <div className="bg-background rounded-2xl p-6 border border-border">
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
          <div className="bg-background rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Последни тренировки</h2>
            </div>
            <div className="space-y-3">
              {stats.recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border"
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
