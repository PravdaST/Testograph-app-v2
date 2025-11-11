'use client'

/**
 * TestoUpTracker Component
 * Tracks morning and evening TestoUp intake with confirmation
 */

import { useState, useEffect } from 'react'
import { Pill, Sun, Moon, CheckCircle2, AlertTriangle, ShoppingCart, Lock, Clock } from 'lucide-react'

interface TestoUpTrackerProps {
  morningCompleted: boolean
  eveningCompleted: boolean
  inventory?: {
    capsules_remaining: number
    days_remaining: number
    percentage_remaining: number
    bottles_purchased?: number
    bottles_remaining?: number
  } | null
  onConfirm: (morning: boolean, evening: boolean) => void
  onRefill?: () => void
  isLocked?: boolean
}

export function TestoUpTracker({
  morningCompleted,
  eveningCompleted,
  inventory,
  onConfirm,
  onRefill,
  isLocked = false,
}: TestoUpTrackerProps) {
  // Local state for pending selections
  const [pendingMorning, setPendingMorning] = useState(morningCompleted)
  const [pendingEvening, setPendingEvening] = useState(eveningCompleted)
  const [timeUntilReset, setTimeUntilReset] = useState('')

  // Update pending state when props change
  useEffect(() => {
    setPendingMorning(morningCompleted)
    setPendingEvening(eveningCompleted)
  }, [morningCompleted, eveningCompleted])

  // Countdown timer to midnight (00:00 Bulgarian time)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0) // Next midnight

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

  const bothCompleted = morningCompleted && eveningCompleted

  const handleToggle = (timeOfDay: 'morning' | 'evening') => {
    // Check if specific dose is already completed (locked individually)
    if (timeOfDay === 'morning' && morningCompleted) return
    if (timeOfDay === 'evening' && eveningCompleted) return

    // Instant confirmation when toggling
    if (timeOfDay === 'morning') {
      const newValue = !pendingMorning
      setPendingMorning(newValue)
      // Immediately confirm the change
      onConfirm(newValue, eveningCompleted)
    } else {
      const newValue = !pendingEvening
      setPendingEvening(newValue)
      // Immediately confirm the change
      onConfirm(morningCompleted, newValue)
    }
  }

  return (
    <div
      className={`
        rounded-2xl p-6 border-2 transition-all shimmer-effect spotlight-effect
        ${
          bothCompleted
            ? 'bg-success/5 border-success/30 glow-border'
            : 'bg-background border-border'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Pill className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">TestoUp приемане</h3>
          <p className="text-sm text-muted-foreground">2× дневно</p>
          {/* Bottles Info - Minimalistic */}
          {inventory && inventory.bottles_purchased && inventory.bottles_purchased > 0 && (
            <p className="text-xs text-primary/70 mt-1">
              {inventory.bottles_purchased} {inventory.bottles_purchased === 1 ? 'опаковка' : 'опаковки'} • {inventory.bottles_purchased * 60} капсули
            </p>
          )}
        </div>
        {bothCompleted && (
          <CheckCircle2 className="w-6 h-6 text-success" />
        )}
      </div>

      {/* Morning and Evening Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Morning */}
        <button
          onClick={() => handleToggle('morning')}
          disabled={isLocked}
          className={`
            p-4 rounded-xl border-2 transition-all relative hover-lift ripple-effect
            ${
              pendingMorning
                ? 'bg-success/10 border-success text-success'
                : 'bg-muted/30 border-border hover:border-primary'
            }
            ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <Sun
              className={`w-6 h-6 ${pendingMorning ? 'text-success' : 'text-muted-foreground'}`}
            />
            <div className="text-center">
              <div className="text-sm font-semibold">Сутрин</div>
              <div className="text-xs text-muted-foreground">
                след закуска
              </div>
            </div>
            {pendingMorning && (
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {isLocked && morningCompleted && (
              <Lock className="w-4 h-4 absolute top-2 right-2 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Evening */}
        <button
          onClick={() => handleToggle('evening')}
          disabled={isLocked}
          className={`
            p-4 rounded-xl border-2 transition-all relative hover-lift ripple-effect
            ${
              pendingEvening
                ? 'bg-success/10 border-success text-success'
                : 'bg-muted/30 border-border hover:border-primary'
            }
            ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <Moon
              className={`w-6 h-6 ${pendingEvening ? 'text-success' : 'text-muted-foreground'}`}
            />
            <div className="text-center">
              <div className="text-sm font-semibold">Вечер</div>
              <div className="text-xs text-muted-foreground">
                след вечеря
              </div>
            </div>
            {pendingEvening && (
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {isLocked && eveningCompleted && (
              <Lock className="w-4 h-4 absolute top-2 right-2 text-muted-foreground" />
            )}
          </div>
        </button>
      </div>

      {/* Locked Message with Countdown */}
      {bothCompleted && (
        <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
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

      {/* Inventory Display */}
      {inventory && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                <span className="animate-count-up inline-block">{inventory.capsules_remaining}</span> капсули останали
              </span>
            </div>
            <div className="flex items-center gap-2">
              {inventory.capsules_remaining < 10 && (
                <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
              )}
              <span className={`text-sm font-medium ${
                inventory.capsules_remaining < 10
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }`}>
                <span className="animate-count-up inline-block">{inventory.days_remaining}</span> {inventory.days_remaining === 1 ? 'ден' : 'дни'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                inventory.capsules_remaining < 10
                  ? 'bg-destructive'
                  : inventory.capsules_remaining < 20
                  ? 'bg-warning'
                  : 'bg-primary'
              }`}
              style={{ width: `${inventory.percentage_remaining}%` }}
            />
          </div>

          {/* Low Inventory Warning */}
          {inventory.capsules_remaining < 10 && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-xs text-destructive font-medium text-center">
                Остават само {inventory.capsules_remaining} капсули! Поръчай нова опаковка.
              </p>
            </div>
          )}

          {/* Shop Button */}
          {onRefill && (
            <button
              onClick={onRefill}
              className="mt-3 w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Поръчай още капсули
            </button>
          )}
        </div>
      )}
    </div>
  )
}
