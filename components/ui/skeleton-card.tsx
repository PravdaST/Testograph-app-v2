'use client'

/**
 * Skeleton Card Component
 * Loading placeholder for Dashboard stat cards
 * Provides perceived performance improvement
 */

import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
  animationDelay?: string
}

export function SkeletonCard({ className, animationDelay = '0s' }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'relative col-span-1 bg-background rounded-xl p-4 border border-border animate-fade-in',
        className
      )}
      style={{ animationDelay, animationFillMode: 'both' }}
    >
      {/* Icon and value skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Icon placeholder */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted rounded-lg" />
          <div className="h-6 w-16 bg-muted rounded" />
        </div>

        {/* Status text placeholder */}
        <div className="h-3 w-24 bg-muted rounded" />
      </div>

      {/* Info button placeholder */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-muted rounded-md" />
    </div>
  )
}

interface SkeletonProgressBarProps {
  className?: string
}

export function SkeletonProgressBar({ className }: SkeletonProgressBarProps) {
  return (
    <div
      className={cn(
        'col-span-4 bg-background rounded-xl p-4 border border-border animate-pulse',
        className
      )}
    >
      {/* Label and percentage */}
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-3 w-8 bg-muted rounded" />
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-muted-foreground/20 rounded-full" />
      </div>
    </div>
  )
}

interface SkeletonQuizScoreProps {
  className?: string
}

export function SkeletonQuizScore({ className }: SkeletonQuizScoreProps) {
  return (
    <div
      className={cn(
        'col-span-4 bg-background rounded-xl p-4 border border-border animate-pulse',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Left: Icon + Label */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-muted rounded-lg" />
          <div>
            <div className="h-3 w-20 bg-muted rounded mb-1" />
            <div className="h-2 w-16 bg-muted rounded" />
          </div>
        </div>

        {/* Center: Scores */}
        <div className="flex items-center gap-4 flex-1">
          <div>
            <div className="h-2 w-12 bg-muted rounded mb-1" />
            <div className="h-8 w-12 bg-muted rounded" />
          </div>
          <div className="w-4 h-4 bg-muted rounded" />
          <div>
            <div className="h-2 w-12 bg-muted rounded mb-1" />
            <div className="h-10 w-16 bg-muted rounded" />
          </div>
        </div>

        {/* Right: Chart + Info */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-10 bg-muted rounded" />
          <div>
            <div className="h-2 w-16 bg-muted rounded mb-1" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for Hero Banner (used in multiple pages)
 */
export function SkeletonHeroBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 border-2 border-border bg-background animate-pulse',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-muted rounded-xl" />
        <div className="flex-1">
          <div className="h-6 w-40 bg-muted rounded mb-2" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for Meal Card (Nutrition page)
 */
export function SkeletonMealCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-background rounded-xl p-4 border border-border animate-pulse',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Image placeholder */}
        <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-muted rounded mb-2" />
          <div className="h-3 w-full bg-muted rounded mb-1" />
          <div className="h-3 w-2/3 bg-muted rounded mb-3" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-muted rounded-full" />
            <div className="h-5 w-16 bg-muted rounded-full" />
            <div className="h-5 w-16 bg-muted rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for Sleep/Supplement stat boxes
 */
export function SkeletonStatBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-background rounded-xl p-4 border border-border animate-pulse',
        className
      )}
    >
      <div className="w-5 h-5 bg-muted rounded mb-2" />
      <div className="h-8 w-16 bg-muted rounded mb-1" />
      <div className="h-3 w-20 bg-muted rounded" />
    </div>
  )
}

/**
 * Skeleton for Weekly Calendar
 */
export function SkeletonWeeklyCalendar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-background rounded-xl p-4 border border-border animate-pulse',
        className
      )}
    >
      <div className="flex justify-between mb-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
      <div className="flex justify-between gap-1">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-3 w-6 bg-muted rounded" />
            <div className="w-10 h-10 bg-muted rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Full page skeleton wrapper with TopNav and BottomNav placeholders
 */
export function SkeletonPageWrapper({
  children,
  showNav = true
}: {
  children: React.ReactNode
  showNav?: boolean
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {showNav && (
        <div className="h-16 border-b border-border bg-background/80 backdrop-blur animate-pulse">
          <div className="container-mobile h-full flex items-center justify-between">
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="w-8 h-8 bg-muted rounded-full" />
          </div>
        </div>
      )}
      <div className="container-mobile py-6 pb-24 space-y-4">
        {children}
      </div>
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-border bg-background animate-pulse">
          <div className="flex justify-around items-center h-full px-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-12 h-12 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
