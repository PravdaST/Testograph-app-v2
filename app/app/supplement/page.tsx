'use client'

/**
 * Supplement Page
 * TestoUp tracking and information page
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Pill, Sun, Moon, CheckCircle2, ShoppingCart, Clock, Lock, TrendingUp, Package, Info, X } from 'lucide-react'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  first_name?: string
  profile_picture_url?: string
  program_start_date?: string
}

interface TestoUpInventory {
  capsules_remaining: number
  days_remaining: number
  percentage_remaining: number
  bottles_purchased?: number
  bottles_remaining?: number
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

const DAY_NAMES = ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб']

export default function SupplementPage() {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>()
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [testoUpInventory, setTestoUpInventory] = useState<TestoUpInventory | null>(null)
  const [morningCompleted, setMorningCompleted] = useState(false)
  const [eveningCompleted, setEveningCompleted] = useState(false)
  const [timeUntilReset, setTimeUntilReset] = useState('')
  const [weeklyStats, setWeeklyStats] = useState<Record<number, { morning: boolean; evening: boolean }>>({})
  const [activeTooltip, setActiveTooltip] = useState<'hero' | null>(null)

  // Countdown timer to midnight
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)

      const diff = midnight.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilReset(`${hours}ч ${minutes}м ${seconds}с`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  // Load user program and tracking
  useEffect(() => {
    const loadData = async () => {
      try {
        const email = localStorage.getItem('quizEmail')
        if (!email) {
          router.push('/quiz')
          return
        }

        // Load program
        const response = await fetch(`/api/user/program?email=${encodeURIComponent(email)}`)
        if (response.ok) {
          const data = await response.json()
          setUserProgram(data)

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

        // Load inventory
        const inventoryResponse = await fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json()
          setTestoUpInventory(inventoryData)
        }

        // Load weekly stats (last 7 days)
        const weekStats: Record<number, { morning: boolean; evening: boolean }> = {}
        for (let i = 0; i < 7; i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]

          const dayResponse = await fetch(`/api/testoup/track?email=${encodeURIComponent(email)}&date=${dateStr}`)
          if (dayResponse.ok) {
            const dayData = await dayResponse.json()
            weekStats[6 - i] = {
              morning: dayData.morning_taken || false,
              evening: dayData.evening_taken || false
            }
          } else {
            weekStats[6 - i] = { morning: false, evening: false }
          }
        }
        setWeeklyStats(weekStats)

      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Load supplement tracking for selected date
  useEffect(() => {
    const loadTrackingForDate = async () => {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const dateStr = selectedDate.toISOString().split('T')[0]
      const trackingResponse = await fetch(`/api/testoup/track?email=${encodeURIComponent(email)}&date=${dateStr}`)
      if (trackingResponse.ok) {
        const trackingData = await trackingResponse.json()
        setMorningCompleted(trackingData.morning_taken)
        setEveningCompleted(trackingData.evening_taken)
      } else {
        // Reset for date with no data
        setMorningCompleted(false)
        setEveningCompleted(false)
      }
    }

    loadTrackingForDate()
  }, [selectedDate])

  const handleDoseToggle = async (timeOfDay: 'morning' | 'evening') => {
    if (timeOfDay === 'morning' && morningCompleted) return
    if (timeOfDay === 'evening' && eveningCompleted) return

    const email = localStorage.getItem('quizEmail')
    if (!email) return

    try {
      const today = new Date().toISOString().split('T')[0]
      await fetch('/api/testoup/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          date: today,
          period: timeOfDay,
        }),
      })

      if (timeOfDay === 'morning') {
        setMorningCompleted(true)
      } else {
        setEveningCompleted(true)
      }

      // Refresh inventory
      const inventoryResponse = await fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json()
        setTestoUpInventory(inventoryData)
      }
    } catch (error) {
      console.error('Error tracking dose:', error)
    }
  }

  const handleShopClick = () => {
    window.open('https://shop.testograph.eu', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
        <TopNav programName="Зареждане..." userName={userName} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <BottomNav onNavigate={() => router.push('/app')} />
      </div>
    )
  }

  if (!userProgram) return null

  const programName = CATEGORY_NAMES[userProgram.category]
  const bothCompleted = morningCompleted && eveningCompleted

  // Calculate compliance
  const totalDoses = Object.values(weeklyStats).reduce((acc, day) => {
    return acc + (day.morning ? 1 : 0) + (day.evening ? 1 : 0)
  }, 0)
  const compliance = Math.round((totalDoses / 14) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      <TopNav
        programName={programName}
        userName={userName}
        profilePictureUrl={userProgram?.profile_picture_url}
      />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Hero Banner */}
        <div
          className={`relative rounded-2xl p-6 border-2 transition-all animate-fade-in shimmer-effect spotlight-effect ${
            bothCompleted ? 'bg-success/5 border-success/30' : 'bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30'
          }`}
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Pill className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">TestoUp добавка</h1>
              <p className="text-sm text-muted-foreground">2× дневно</p>
              {testoUpInventory && testoUpInventory.bottles_purchased && testoUpInventory.bottles_purchased > 0 && (
                <p className="text-xs text-primary/70 mt-1">
                  {testoUpInventory.bottles_purchased} {testoUpInventory.bottles_purchased === 1 ? 'опаковка' : 'опаковки'} • {testoUpInventory.bottles_purchased * 60} капсули
                </p>
              )}
            </div>
            {bothCompleted && (
              <CheckCircle2 className="w-6 h-6 text-success" />
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveTooltip(activeTooltip === 'hero' ? null : 'hero')
            }}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted/50 transition-colors"
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
                  <div className="text-sm font-bold text-foreground">TestoUp добавка</div>
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
                  Приемай TestoUp добавката 2 пъти дневно - сутрин след закуска и вечер след вечеря. Редовността е ключова за максимални резултати.
                </p>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* Weekly Calendar */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <WeeklyCalendar
            programStartDate={programStartDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Morning and Evening Doses */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDoseToggle('morning')}
            disabled={morningCompleted}
            className={`p-4 rounded-xl border-2 transition-all animate-fade-in shimmer-effect hover-lift ripple-effect ${
              morningCompleted
                ? 'bg-success/10 border-success text-success'
                : 'bg-background border-border hover:border-primary'
            }`}
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="flex flex-col items-center gap-2">
              <Sun className={`w-6 h-6 ${morningCompleted ? 'text-success' : 'text-muted-foreground'}`} />
              <div className="text-center">
                <div className="text-sm font-semibold">Сутрин</div>
                <div className="text-xs text-muted-foreground">след закуска</div>
              </div>
              {morningCompleted && (
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => handleDoseToggle('evening')}
            disabled={eveningCompleted}
            className={`p-4 rounded-xl border-2 transition-all animate-fade-in shimmer-effect hover-lift ripple-effect ${
              eveningCompleted
                ? 'bg-success/10 border-success text-success'
                : 'bg-background border-border hover:border-primary'
            }`}
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <div className="flex flex-col items-center gap-2">
              <Moon className={`w-6 h-6 ${eveningCompleted ? 'text-success' : 'text-muted-foreground'}`} />
              <div className="text-center">
                <div className="text-sm font-semibold">Вечер</div>
                <div className="text-xs text-muted-foreground">след вечеря</div>
              </div>
              {eveningCompleted && (
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Countdown Timer */}
        {bothCompleted && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Заключено до полунощ
              </p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Clock className="w-3 h-3" />
                {timeUntilReset}
              </div>
            </div>
          </div>
        )}

        {/* Bento Grid - Inventory & Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Inventory (2x1) */}
          {testoUpInventory && (
            <div
              className="col-span-2 bg-background rounded-2xl p-5 border border-border animate-fade-in shimmer-effect hover-lift"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Инвентар
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Останали капсули</div>
                  <div className="text-2xl font-bold text-primary animate-count-up">{testoUpInventory.capsules_remaining}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Дни запас</div>
                  <div className="text-2xl font-bold text-primary animate-count-up">{testoUpInventory.days_remaining}</div>
                </div>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${testoUpInventory.percentage_remaining}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-right">{testoUpInventory.percentage_remaining}%</div>

              {testoUpInventory.capsules_remaining < 30 && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium">
                    Ниски запаси! Поръчай нова опаковка скоро
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Compliance (1x1) */}
          <div
            className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-4 border-2 border-primary/30 animate-fade-in shimmer-effect hover-lift"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <TrendingUp className="w-5 h-5 text-primary mb-2" />
            <div className="text-4xl font-bold text-primary mb-1 animate-count-up">{compliance}%</div>
            <div className="text-xs text-muted-foreground">Compliance</div>
          </div>

          {/* Weekly Visualization (1x1) */}
          <div
            className="bg-background rounded-xl p-4 border border-border animate-fade-in shimmer-effect hover-lift"
            style={{ animationDelay: '0.65s', animationFillMode: 'both' }}
          >
            <div className="text-xs font-medium text-muted-foreground mb-3">Последни 7 дни</div>
            <div className="flex justify-between">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                const stats = weeklyStats[dayIndex] || { morning: false, evening: false }
                const isToday = dayIndex === 6
                const bothDone = stats.morning && stats.evening

                return (
                  <div key={dayIndex} className={`flex flex-col items-center gap-1 ${isToday ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-5 h-5 rounded-full ${bothDone ? 'bg-success' : 'bg-muted'}`} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Shop Button */}
        <button
          onClick={handleShopClick}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 animate-fade-in hover-lift ripple-effect"
          style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
        >
          <ShoppingCart className="w-5 h-5" />
          Поръчай още капсули
        </button>
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
