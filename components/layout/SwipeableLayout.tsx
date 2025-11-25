'use client'

/**
 * SwipeableLayout Component
 * Wraps app pages with page transitions (swipe navigation disabled)
 */

import { ReactNode } from 'react'
import { PageTransition } from '@/components/ui/page-transition'

interface SwipeableLayoutProps {
  children: ReactNode
}

export function SwipeableLayout({ children }: SwipeableLayoutProps) {
  // Swipe navigation disabled - users navigate via bottom nav or buttons
  return (
    <div className="min-h-screen">
      <PageTransition>{children}</PageTransition>
    </div>
  )
}
