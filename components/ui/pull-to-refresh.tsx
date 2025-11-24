'use client'

/**
 * PullToRefresh Component
 * Mobile-friendly pull-to-refresh gesture with visual feedback
 */

import { useState, useRef, useCallback, ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHaptic } from '@/lib/hooks/useHaptic'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  className?: string
  threshold?: number // Pull distance to trigger refresh (default: 80px)
  maxPull?: number // Maximum pull distance (default: 120px)
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  threshold = 80,
  maxPull = 120,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  const hasVibrated = useRef(false)
  const haptic = useHaptic()

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only allow pull-to-refresh when scrolled to top
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return

    currentY.current = e.touches[0].clientY
    const diff = currentY.current - startY.current

    // Only pull down, not up
    if (diff > 0) {
      // Apply resistance - pull gets harder as you pull more
      const resistance = 0.5
      const pull = Math.min(diff * resistance, maxPull)
      setPullDistance(pull)

      // Haptic feedback when threshold is reached
      if (pull >= threshold && !hasVibrated.current) {
        haptic.light()
        hasVibrated.current = true
      } else if (pull < threshold) {
        hasVibrated.current = false
      }
    }
  }, [isPulling, isRefreshing, maxPull, threshold, haptic])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return
    setIsPulling(false)
    hasVibrated.current = false

    if (pullDistance >= threshold && !isRefreshing) {
      // Trigger refresh with haptic
      haptic.success()
      setIsRefreshing(true)
      setPullDistance(60) // Keep spinner visible during refresh

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      // Snap back
      setPullDistance(0)
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, haptic])

  // Calculate progress (0 to 1)
  const progress = Math.min(pullDistance / threshold, 1)
  const rotation = progress * 180

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-auto', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance - 50}px)`,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div
          className={cn(
            'w-10 h-10 rounded-full bg-background shadow-lg border border-border flex items-center justify-center',
            isRefreshing && 'animate-pulse'
          )}
        >
          <RefreshCw
            className={cn(
              'w-5 h-5 text-primary transition-transform',
              isRefreshing && 'animate-spin'
            )}
            style={{
              transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
            }}
          />
        </div>
      </div>

      {/* Content with pull offset */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        }}
      >
        {children}
      </div>

      {/* Pull hint text */}
      {pullDistance > 20 && !isRefreshing && (
        <div
          className="absolute left-0 right-0 top-2 flex justify-center pointer-events-none z-10"
          style={{
            opacity: Math.min((pullDistance - 20) / 30, 1),
          }}
        >
          <span className="text-xs text-muted-foreground">
            {progress >= 1 ? 'Пусни за опресняване' : 'Дръпни надолу'}
          </span>
        </div>
      )}
    </div>
  )
}
