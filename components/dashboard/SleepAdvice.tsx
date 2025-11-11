'use client'

/**
 * Sleep Advice Component
 * Displays personalized sleep recommendations based on program
 * With tracking and locking functionality
 */

import { useState, useEffect } from 'react'
import { Moon, Clock, Pill, Check, Lock, CheckCircle2 } from 'lucide-react'
import { getSleepRecommendations } from '@/lib/data/sleep-recommendations'

interface SleepAdviceProps {
  category: 'energy' | 'libido' | 'muscle'
  isCompleted?: boolean
  isLocked?: boolean
  onConfirm?: (completed: boolean) => void
}

export function SleepAdvice({
  category,
  isCompleted = false,
  isLocked = false,
  onConfirm,
}: SleepAdviceProps) {
  const advice = getSleepRecommendations(category)

  // Local state for pending selection
  const [pendingCompleted, setPendingCompleted] = useState(isCompleted)

  // Update pending state when props change
  useEffect(() => {
    setPendingCompleted(isCompleted)
  }, [isCompleted])

  const hasChanges = pendingCompleted !== isCompleted
  const canConfirm = !isLocked && hasChanges && onConfirm

  const handleToggle = () => {
    if (isLocked) return
    setPendingCompleted(!pendingCompleted)
  }

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(pendingCompleted)
    }
  }

  return (
    <div className="bg-background rounded-2xl p-6 border-2 border-border shimmer-effect spotlight-effect hover-lift">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Moon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">{advice.title}</h3>
          <p className="text-sm text-muted-foreground">
            Препоръчителна продължителност
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="bg-primary/10 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">{advice.duration}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{advice.timing}</p>
      </div>

      {/* Tips */}
      <div className="mb-4">
        <h4 className="font-semibold mb-3 text-sm">Съвети за качествен сън:</h4>
        <div className="space-y-2">
          {advice.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-success" />
              </div>
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supplements */}
      {advice.supplements && advice.supplements.length > 0 && (
        <div className="bg-muted/30 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Допълнителна подкрепа:</h4>
          </div>
          <div className="space-y-1">
            {advice.supplements.map((supplement, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                • {supplement}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Sleep Tracking */}
      {onConfirm && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={handleToggle}
            disabled={isLocked}
            className={`
              w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ripple-effect
              ${
                pendingCompleted
                  ? 'bg-success/10 border-success'
                  : 'bg-muted/30 border-border hover:border-primary'
              }
              ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${
                  pendingCompleted
                    ? 'bg-success border-success text-white'
                    : 'border-muted-foreground/30'
                }
              `}>
                {pendingCompleted && (
                  <Check className="w-4 h-4" />
                )}
              </div>
              <span className="font-medium">
                Спах препоръчителното време
              </span>
            </div>

            {isLocked && isCompleted && (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}

            {pendingCompleted && !isLocked && (
              <CheckCircle2 className="w-5 h-5 text-success" />
            )}
          </button>

          {/* Confirm Button */}
          {canConfirm && (
            <button
              onClick={handleConfirm}
              className="mt-3 w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all ripple-effect hover-lift"
            >
              Потвърди сън
            </button>
          )}

          {/* Locked Message */}
          {isLocked && isCompleted && (
            <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Заключено до полунощ (00:00)
              </p>
            </div>
          )}

          {/* Helper Text */}
          {!isLocked && !isCompleted && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Маркирай след като се събудиш и натисни &quot;Потвърди сън&quot;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
