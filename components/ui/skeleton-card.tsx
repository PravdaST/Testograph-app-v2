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
