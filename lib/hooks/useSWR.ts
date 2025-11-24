'use client'

/**
 * Custom SWR Hooks
 * Centralized data fetching with caching, revalidation, and optimistic updates
 */

import useSWR from 'swr'
import { useUserProgram } from '@/contexts/UserProgramContext'

// Generic fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

/**
 * User Stats Hook
 * Fetches and caches user statistics
 */
export function useUserStats() {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email ? `/api/user/stats?email=${encodeURIComponent(email)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    stats: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Daily Completion Hook
 * Fetches completion status for a specific date
 */
export function useDailyCompletion(date?: string) {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email && date
      ? `/api/user/daily-completion?email=${encodeURIComponent(email)}&date=${date}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000, // 30 seconds
    }
  )

  return {
    completion: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Progressive Score Hook
 * Fetches progressive score for a specific date
 */
export function useProgressiveScore(date?: string) {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email && date
      ? `/api/user/progressive-score?email=${encodeURIComponent(email)}&date=${date}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    score: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * TestoUp Inventory Hook
 * Fetches TestoUp capsule inventory
 */
export function useTestoUpInventory() {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email ? `/api/testoup/inventory?email=${encodeURIComponent(email)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
    }
  )

  return {
    inventory: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Meal Completion Hook
 * Fetches meal completion status for a date
 */
export function useMealCompletion(date?: string) {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email && date
      ? `/api/meals/complete?email=${encodeURIComponent(email)}&date=${date}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )

  return {
    meals: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Workout Check Hook
 * Fetches workout completion status for a date
 */
export function useWorkoutCheck(date?: string) {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email && date
      ? `/api/workout/check?email=${encodeURIComponent(email)}&date=${date}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )

  return {
    workout: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Sleep Track Hook
 * Fetches sleep tracking for a date
 */
export function useSleepTrack(date?: string) {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email && date
      ? `/api/sleep/track?email=${encodeURIComponent(email)}&date=${date}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )

  return {
    sleep: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * TestoUp Track Hook
 * Fetches TestoUp tracking for a date
 */
export function useTestoUpTrack(date?: string) {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email && date
      ? `/api/testoup/track?email=${encodeURIComponent(email)}&date=${date}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )

  return {
    testoup: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

/**
 * Feedback History Hook
 * Fetches user feedback submissions
 */
export function useFeedbackHistory() {
  const { email } = useUserProgram()

  const { data, error, isLoading, mutate } = useSWR(
    email ? `/api/feedback/history?email=${encodeURIComponent(email)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    submissions: data?.submissions || [],
    isLoading,
    isError: error,
    refresh: mutate,
  }
}
