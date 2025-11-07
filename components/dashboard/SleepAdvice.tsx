'use client'

/**
 * Sleep Advice Component
 * Displays personalized sleep recommendations based on program
 */

import { Moon, Clock, Pill, Check } from 'lucide-react'
import { getSleepRecommendations } from '@/lib/data/sleep-recommendations'

interface SleepAdviceProps {
  category: 'energy' | 'libido' | 'muscle'
}

export function SleepAdvice({ category }: SleepAdviceProps) {
  const advice = getSleepRecommendations(category)

  return (
    <div className="bg-background rounded-2xl p-6 border-2 border-border">
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
        <div className="bg-muted/30 rounded-xl p-4">
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
    </div>
  )
}
