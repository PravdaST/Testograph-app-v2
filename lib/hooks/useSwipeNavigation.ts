'use client'

/**
 * useSwipeNavigation Hook
 * Provides swipe navigation between main app pages
 */

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

// Define main app pages in order
const APP_PAGES = [
  { path: '/app', name: 'Dashboard' },
  { path: '/app/nutrition', name: 'Nutrition' },
  { path: '/app/workout', name: 'Workout' },
  { path: '/app/sleep', name: 'Sleep' },
  { path: '/app/supplement', name: 'Supplement' },
] as const

export function useSwipeNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  // Find current page index
  const currentIndex = useMemo(() => {
    // Exact match first
    const exactIndex = APP_PAGES.findIndex((page) => page.path === pathname)
    if (exactIndex !== -1) return exactIndex

    // Partial match for workout pages (e.g., /app/workout/1)
    if (pathname.startsWith('/app/workout')) return 2

    // Default to dashboard
    return 0
  }, [pathname])

  const canSwipeLeft = currentIndex < APP_PAGES.length - 1
  const canSwipeRight = currentIndex > 0

  const swipeLeft = useCallback(() => {
    if (canSwipeLeft) {
      const nextPage = APP_PAGES[currentIndex + 1]

      // Special handling for workout page - navigate to today's workout
      if (nextPage.path === '/app/workout') {
        const today = new Date()
        let dayOfWeek = today.getDay()
        if (dayOfWeek === 0) dayOfWeek = 7
        router.push(`/app/workout/${dayOfWeek}`)
      } else {
        router.push(nextPage.path)
      }
    }
  }, [canSwipeLeft, currentIndex, router])

  const swipeRight = useCallback(() => {
    if (canSwipeRight) {
      const prevPage = APP_PAGES[currentIndex - 1]

      // Special handling for workout page - navigate to today's workout
      if (prevPage.path === '/app/workout') {
        const today = new Date()
        let dayOfWeek = today.getDay()
        if (dayOfWeek === 0) dayOfWeek = 7
        router.push(`/app/workout/${dayOfWeek}`)
      } else {
        router.push(prevPage.path)
      }
    }
  }, [canSwipeRight, currentIndex, router])

  return {
    canSwipeLeft,
    canSwipeRight,
    swipeLeft,
    swipeRight,
    currentPage: APP_PAGES[currentIndex],
    nextPage: canSwipeLeft ? APP_PAGES[currentIndex + 1] : null,
    prevPage: canSwipeRight ? APP_PAGES[currentIndex - 1] : null,
  }
}
