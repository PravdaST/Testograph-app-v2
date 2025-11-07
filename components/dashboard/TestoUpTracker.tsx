'use client'

/**
 * TestoUpTracker Component
 * Tracks morning and evening TestoUp intake
 */

import { Pill, Sun, Moon, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'

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
  onToggle: (timeOfDay: 'morning' | 'evening') => void
  onRefill?: () => void
}

export function TestoUpTracker({
  morningCompleted,
  eveningCompleted,
  inventory,
  onToggle,
  onRefill,
}: TestoUpTrackerProps) {
  const bothCompleted = morningCompleted && eveningCompleted

  return (
    <div
      className={`
        rounded-2xl p-6 border-2 transition-all
        ${
          bothCompleted
            ? 'bg-success/5 border-success/30'
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
        </div>
        {bothCompleted && (
          <CheckCircle2 className="w-6 h-6 text-success" />
        )}
      </div>

      {/* Morning and Evening Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Morning */}
        <button
          onClick={() => onToggle('morning')}
          className={`
            p-4 rounded-xl border-2 transition-all
            ${
              morningCompleted
                ? 'bg-success/10 border-success text-success'
                : 'bg-muted/30 border-border hover:border-primary'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <Sun
              className={`w-6 h-6 ${morningCompleted ? 'text-success' : 'text-muted-foreground'}`}
            />
            <div className="text-center">
              <div className="text-sm font-semibold">Сутрин</div>
              <div className="text-xs text-muted-foreground">
                след закуска
              </div>
            </div>
            {morningCompleted && (
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
          </div>
        </button>

        {/* Evening */}
        <button
          onClick={() => onToggle('evening')}
          className={`
            p-4 rounded-xl border-2 transition-all
            ${
              eveningCompleted
                ? 'bg-success/10 border-success text-success'
                : 'bg-muted/30 border-border hover:border-primary'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <Moon
              className={`w-6 h-6 ${eveningCompleted ? 'text-success' : 'text-muted-foreground'}`}
            />
            <div className="text-center">
              <div className="text-sm font-semibold">Вечер</div>
              <div className="text-xs text-muted-foreground">
                след вечеря
              </div>
            </div>
            {eveningCompleted && (
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
          </div>
        </button>
      </div>

      {/* Reminder Text */}
      {!bothCompleted && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Маркирай след приемане
        </p>
      )}

      {/* Inventory Display */}
      {inventory && (
        <div className="mt-4 pt-4 border-t border-border">
          {/* Bottles Purchased */}
          {inventory.bottles_purchased && inventory.bottles_purchased > 1 && (
            <div className="mb-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Закупени опаковки: {inventory.bottles_purchased}
                  </span>
                </div>
                <span className="text-sm font-medium text-primary">
                  {inventory.bottles_purchased * 60} капсули общо
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {inventory.capsules_remaining} капсули останали
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
                {inventory.days_remaining} {inventory.days_remaining === 1 ? 'ден' : 'дни'}
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

          {/* Refill Button */}
          {onRefill && (
            <button
              onClick={onRefill}
              className="mt-3 w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Нова опаковка (60 капсули)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
