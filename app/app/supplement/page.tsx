'use client'

/**
 * Supplement Page
 * TestoUp tracking and information page
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pill, Sun, Moon, CheckCircle2, ShoppingCart, Clock, Lock, TrendingUp, Package } from 'lucide-react'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  first_name?: string
  profile_picture_url?: string
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
  const [testoUpInventory, setTestoUpInventory] = useState<TestoUpInventory | null>(null)
  const [morningCompleted, setMorningCompleted] = useState(false)
  const [eveningCompleted, setEveningCompleted] = useState(false)
  const [timeUntilReset, setTimeUntilReset] = useState('')
  const [weeklyStats, setWeeklyStats] = useState<Record<number, { morning: boolean; evening: boolean }>>({})

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
        }

        // Load inventory
        const inventoryResponse = await fetch(`/api/testoup/inventory?email=${encodeURIComponent(email)}`)
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json()
          setTestoUpInventory(inventoryData)
        }

        // Load today's tracking
        const today = new Date().toISOString().split('T')[0]
        const trackingResponse = await fetch(`/api/testoup/track?email=${encodeURIComponent(email)}&date=${today}`)
        if (trackingResponse.ok) {
          const trackingData = await trackingResponse.json()
          setMorningCompleted(trackingData.morning_taken)
          setEveningCompleted(trackingData.evening_taken)
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
        {/* Page Header */}
        <div className={`rounded-2xl p-6 border-2 transition-all ${
          bothCompleted ? 'bg-success/5 border-success/30' : 'bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30'
        }`}>
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
        </div>

        {/* Morning and Evening Doses */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDoseToggle('morning')}
            disabled={morningCompleted}
            className={`p-4 rounded-xl border-2 transition-all ${
              morningCompleted
                ? 'bg-success/10 border-success text-success'
                : 'bg-background border-border hover:border-primary'
            }`}
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
            className={`p-4 rounded-xl border-2 transition-all ${
              eveningCompleted
                ? 'bg-success/10 border-success text-success'
                : 'bg-background border-border hover:border-primary'
            }`}
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

        {/* Inventory */}
        {testoUpInventory && (
          <div className="bg-background rounded-2xl p-5 border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Инвентар
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Останали капсули</span>
                <span className="text-lg font-bold">{testoUpInventory.capsules_remaining}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Дни запас</span>
                <span className="text-sm font-medium">{testoUpInventory.days_remaining} дни</span>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${testoUpInventory.percentage_remaining}%` }}
                />
              </div>

              {testoUpInventory.capsules_remaining < 30 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium">
                    ⚠️ Ниски запаси! Поръчай нова опаковка скоро
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Weekly Stats */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Седмична статистика
          </h3>

          <div className="flex justify-between mb-4">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const date = new Date()
              date.setDate(date.getDate() - (6 - dayIndex))
              const stats = weeklyStats[dayIndex] || { morning: false, evening: false }
              const isToday = dayIndex === 6

              return (
                <div key={dayIndex} className={`flex flex-col items-center ${isToday ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="text-xs font-medium mb-2">{DAY_NAMES[date.getDay()]}</div>
                  <div className="space-y-1">
                    <div className={`w-4 h-4 rounded-full ${stats.morning ? 'bg-success' : 'bg-muted'}`} />
                    <div className={`w-4 h-4 rounded-full ${stats.evening ? 'bg-success' : 'bg-muted'}`} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Compliance</span>
              <span className="font-bold text-primary">{compliance}%</span>
            </div>
          </div>
        </div>

        {/* Shop Button */}
        <button
          onClick={handleShopClick}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Поръчай още капсули
        </button>
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
