'use client'

/**
 * Sleep Page
 * Sleep tracking and analysis page
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Moon, Star, Sun, CloudRain, Battery, TrendingUp, CheckCircle2 } from 'lucide-react'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  first_name?: string
  profile_picture_url?: string
  program_start_date?: string
}

interface SleepData {
  hours: number
  quality: number
  feeling: 'energetic' | 'neutral' | 'tired' | null
  notes: string | null
}

interface WeeklySleep {
  date: string
  hours: number
  quality: number
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

const DAY_NAMES = ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб']

const FEELINGS = [
  { id: 'energetic' as const, label: 'Енергичен', icon: Sun, color: 'text-success' },
  { id: 'neutral' as const, label: 'Нормален', icon: CloudRain, color: 'text-muted-foreground' },
  { id: 'tired' as const, label: 'Уморен', icon: Battery, color: 'text-destructive' },
]

export default function SleepPage() {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>()
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Today's sleep tracking
  const [sleepHours, setSleepHours] = useState(7.5)
  const [quality, setQuality] = useState(0)
  const [feeling, setFeeling] = useState<'energetic' | 'neutral' | 'tired' | null>(null)
  const [notes, setNotes] = useState('')
  const [hasTrackedToday, setHasTrackedToday] = useState(false)

  // Weekly stats
  const [weeklyStats, setWeeklyStats] = useState<WeeklySleep[]>([])

  // Load user program and sleep data
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

        // Load weekly stats (last 7 days)
        const weekStats: WeeklySleep[] = []
        for (let i = 0; i < 7; i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]

          const dayResponse = await fetch(`/api/sleep/track?email=${encodeURIComponent(email)}&date=${dateStr}`)
          if (dayResponse.ok) {
            const dayData: SleepData = await dayResponse.json()
            weekStats.unshift({
              date: dateStr,
              hours: dayData.hours || 0,
              quality: dayData.quality || 0,
            })
          } else {
            weekStats.unshift({
              date: dateStr,
              hours: 0,
              quality: 0,
            })
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

  // Load sleep data when selected date changes
  useEffect(() => {
    const loadSleepForDate = async () => {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const dateStr = selectedDate.toISOString().split('T')[0]
      const sleepResponse = await fetch(`/api/sleep/track?email=${encodeURIComponent(email)}&date=${dateStr}`)
      if (sleepResponse.ok) {
        const sleepData: SleepData = await sleepResponse.json()
        if (sleepData.hours > 0) {
          setSleepHours(sleepData.hours)
          setQuality(sleepData.quality)
          setFeeling(sleepData.feeling)
          setNotes(sleepData.notes || '')
          setHasTrackedToday(true)
        } else {
          // Reset form for date with no data
          setSleepHours(7.5)
          setQuality(0)
          setFeeling(null)
          setNotes('')
          setHasTrackedToday(false)
        }
      }
    }

    loadSleepForDate()
  }, [selectedDate])

  const handleSave = async () => {
    const email = localStorage.getItem('quizEmail')
    if (!email) return

    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      await fetch('/api/sleep/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          date: dateStr,
          hours: sleepHours,
          quality,
          feeling: feeling || 'neutral',
          notes: notes || null,
        }),
      })

      setHasTrackedToday(true)

      // Refresh weekly stats
      const weekStats: WeeklySleep[] = []
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStrLoop = date.toISOString().split('T')[0]

        const dayResponse = await fetch(`/api/sleep/track?email=${encodeURIComponent(email)}&date=${dateStrLoop}`)
        if (dayResponse.ok) {
          const dayData: SleepData = await dayResponse.json()
          weekStats.unshift({
            date: dateStrLoop,
            hours: dayData.hours || 0,
            quality: dayData.quality || 0,
          })
        }
      }
      setWeeklyStats(weekStats)

    } catch (error) {
      console.error('Error saving sleep data:', error)
    }
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

  // Calculate average sleep from weekly stats
  const totalHours = weeklyStats.reduce((sum, day) => sum + day.hours, 0)
  const daysWithData = weeklyStats.filter(day => day.hours > 0).length
  const avgSleep = daysWithData > 0 ? (totalHours / daysWithData).toFixed(1) : '0'

  // Calculate average quality
  const totalQuality = weeklyStats.reduce((sum, day) => sum + day.quality, 0)
  const avgQuality = daysWithData > 0 ? Math.round(totalQuality / daysWithData) : 0

  const isToday = selectedDate.toDateString() === new Date().toDateString()

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
          hasTrackedToday && isToday ? 'bg-success/5 border-success/30' : 'bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30'
        }`}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Сън и Възстановяване</h1>
              <p className="text-sm text-muted-foreground">
                Следи качеството на съня си
              </p>
            </div>
            {hasTrackedToday && isToday && (
              <CheckCircle2 className="w-6 h-6 text-success" />
            )}
          </div>
        </div>

        {/* Weekly Calendar */}
        <WeeklyCalendar
          programStartDate={programStartDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Sleep Hours Slider */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h3 className="font-bold mb-4">Часове сън</h3>

          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {sleepHours.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">часа</div>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0ч</span>
            <span>6ч</span>
            <span>12ч</span>
          </div>
        </div>

        {/* Quality Rating */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h3 className="font-bold mb-4">Качество на съня</h3>

          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setQuality(star)}
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= quality
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>

          {quality > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-3">
              {quality === 1 && 'Много лошо'}
              {quality === 2 && 'Лошо'}
              {quality === 3 && 'Средно'}
              {quality === 4 && 'Добро'}
              {quality === 5 && 'Отлично'}
            </p>
          )}
        </div>

        {/* Feeling Selector */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h3 className="font-bold mb-4">Как се чувстваш след съня?</h3>

          <div className="grid grid-cols-3 gap-3">
            {FEELINGS.map((item) => {
              const Icon = item.icon
              const isSelected = feeling === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setFeeling(item.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted/30 border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : item.color}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h3 className="font-bold mb-4">Бележки (опционално)</h3>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Напр. трудно заспиване, събуждане през нощта..."
            className="w-full min-h-[100px] p-3 rounded-lg bg-muted border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Запази
        </button>

        {/* Weekly Stats */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Седмична статистика
          </h3>

          <div className="flex justify-between mb-4">
            {weeklyStats.map((dayStat, index) => {
              const date = new Date(dayStat.date)
              const dayOfWeek = date.getDay()
              const isCurrentDay = date.toDateString() === new Date().toDateString()

              return (
                <div key={index} className={`flex flex-col items-center ${isCurrentDay ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="text-xs font-medium mb-2">{DAY_NAMES[dayOfWeek]}</div>
                  <div className="relative">
                    <div
                      className={`w-8 h-24 rounded-full ${
                        dayStat.hours === 0
                          ? 'bg-muted'
                          : dayStat.hours < 6
                          ? 'bg-destructive/30'
                          : dayStat.hours < 7.5
                          ? 'bg-warning/30'
                          : 'bg-success/30'
                      }`}
                    >
                      <div
                        className={`absolute bottom-0 w-full rounded-full transition-all ${
                          dayStat.hours === 0
                            ? 'bg-muted'
                            : dayStat.hours < 6
                            ? 'bg-destructive'
                            : dayStat.hours < 7.5
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ height: `${Math.min((dayStat.hours / 12) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs font-bold mt-2">
                    {dayStat.hours > 0 ? `${dayStat.hours.toFixed(1)}ч` : '-'}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Среден сън</span>
              <span className="font-bold text-primary">{avgSleep}ч</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Средно качество</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-bold text-primary">{avgQuality}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Препоръки
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Целта за възрастни мъже е 7-9 часа качествен сън</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Заспивай и ставай по едно и също време всеки ден</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Избягвай тежка храна 2-3 часа преди сън</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Тъмна и хладна стая (18-20°C) за по-добър сън</span>
            </li>
          </ul>
        </div>
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
