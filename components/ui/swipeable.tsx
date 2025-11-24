'use client'

/**
 * Swipeable Component
 * Touch-friendly swipe gestures for mobile navigation
 * Supports left/right swipes with visual feedback
 */

import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SwipeableProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number // Swipe distance threshold (default: 50px)
  showIndicators?: boolean // Show left/right indicators
  disabled?: boolean
  className?: string
}

export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  showIndicators = true,
  disabled = false,
  className,
}: SwipeableProps) {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)

  // Transform x position to opacity for indicators
  const leftOpacity = useTransform(x, [0, threshold], [0, 1])
  const rightOpacity = useTransform(x, [0, -threshold], [0, 1])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    const offset = info.offset.x

    // Swipe right (drag to right)
    if (offset > threshold && onSwipeRight) {
      onSwipeRight()
    }

    // Swipe left (drag to left)
    if (offset < -threshold && onSwipeLeft) {
      onSwipeLeft()
    }
  }

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn('relative overflow-hidden touch-pan-y', className)}>
      {/* Left indicator */}
      {showIndicators && onSwipeRight && (
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-start pl-4 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none z-10"
        >
          <ChevronRight className="w-8 h-8 text-primary" />
        </motion.div>
      )}

      {/* Right indicator */}
      {showIndicators && onSwipeLeft && (
        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-end pr-4 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none z-10"
        >
          <ChevronLeft className="w-8 h-8 text-primary" />
        </motion.div>
      )}

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          'cursor-grab active:cursor-grabbing',
          isDragging && 'select-none'
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Day Swiper Component
 * Specialized swipeable for navigating between days
 */
interface DaySwiperProps {
  currentDay: number
  totalDays: number
  onDayChange: (day: number) => void
  children: ReactNode
  className?: string
}

export function DaySwiper({
  currentDay,
  totalDays,
  onDayChange,
  children,
  className,
}: DaySwiperProps) {
  const handleSwipeLeft = () => {
    // Swipe left = next day
    if (currentDay < totalDays) {
      onDayChange(currentDay + 1)
    }
  }

  const handleSwipeRight = () => {
    // Swipe right = previous day
    if (currentDay > 1) {
      onDayChange(currentDay - 1)
    }
  }

  return (
    <Swipeable
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      disabled={totalDays === 1}
      className={className}
    >
      {children}
    </Swipeable>
  )
}

/**
 * Page Swiper Component
 * Swipeable navigation between pages (BottomNav integration)
 */
interface PageSwiperProps {
  pages: string[] // Array of page paths
  currentPage: string
  onPageChange: (page: string) => void
  children: ReactNode
  className?: string
}

export function PageSwiper({
  pages,
  currentPage,
  onPageChange,
  children,
  className,
}: PageSwiperProps) {
  const currentIndex = pages.indexOf(currentPage)

  const handleSwipeLeft = () => {
    // Swipe left = next page
    if (currentIndex < pages.length - 1) {
      onPageChange(pages[currentIndex + 1])
    }
  }

  const handleSwipeRight = () => {
    // Swipe right = previous page
    if (currentIndex > 0) {
      onPageChange(pages[currentIndex - 1])
    }
  }

  return (
    <Swipeable
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      disabled={pages.length <= 1}
      className={className}
    >
      {children}
    </Swipeable>
  )
}
