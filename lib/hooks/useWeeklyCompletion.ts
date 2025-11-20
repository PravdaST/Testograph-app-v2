import { useState, useEffect } from 'react'
import { getWeekStart, getWeekEnd } from '@/lib/utils/date-helpers'

interface CompletionStatus {
  completed: number
  total: number
}

/**
 * Hook to load weekly completion status for calendar
 * Returns a map of dateString -> { completed: number, total: number }
 */
export function useWeeklyCompletion(selectedDate: Date, email: string | null) {
  const [completedDates, setCompletedDates] = useState<Record<string, CompletionStatus>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email) return

    const loadWeeklyCompletion = async () => {
      setLoading(true)
      try {
        const weekStart = getWeekStart(selectedDate)
        const weekEnd = getWeekEnd(weekStart)

        const startDate = weekStart.toISOString().split('T')[0]
        const endDate = weekEnd.toISOString().split('T')[0]

        const response = await fetch(
          `/api/user/daily-completion?email=${encodeURIComponent(email)}&startDate=${startDate}&endDate=${endDate}`
        )

        if (response.ok) {
          const data = await response.json()
          setCompletedDates(data.completionStatus || {})
        }
      } catch (error) {
        console.error('Error loading weekly completion:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWeeklyCompletion()
  }, [selectedDate, email])

  return { completedDates, loading }
}
