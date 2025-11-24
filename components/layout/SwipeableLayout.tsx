'use client'

/**
 * SwipeableLayout Component
 * Wraps app pages with swipe navigation and page transitions
 */

import { ReactNode } from 'react'
import { Swipeable } from '@/components/ui/swipeable'
import { PageTransition } from '@/components/ui/page-transition'
import { useSwipeNavigation } from '@/lib/hooks/useSwipeNavigation'

interface SwipeableLayoutProps {
  children: ReactNode
}

export function SwipeableLayout({ children }: SwipeableLayoutProps) {
  const { canSwipeLeft, canSwipeRight, swipeLeft, swipeRight } = useSwipeNavigation()

  return (
    <Swipeable
      onSwipeLeft={canSwipeLeft ? swipeLeft : undefined}
      onSwipeRight={canSwipeRight ? swipeRight : undefined}
      showIndicators={true}
      className="min-h-screen"
    >
      <PageTransition>{children}</PageTransition>
    </Swipeable>
  )
}
