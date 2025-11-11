'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  durationMinutes: number
  onExpire: () => void
}

export function CountdownTimer({ durationMinutes, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60) // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center justify-center gap-2 text-lg font-bold text-destructive">
      <Clock className="w-5 h-5 animate-pulse" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
