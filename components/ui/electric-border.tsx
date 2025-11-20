'use client'

import { cn } from '@/lib/utils'

interface ElectricBorderProps {
  children: React.ReactNode
  className?: string
  borderColor?: string
  glowColor?: string
  animated?: boolean
}

export function ElectricBorder({
  children,
  className,
  borderColor = 'from-blue-500 via-purple-500 to-pink-500',
  glowColor = 'shadow-blue-500/50',
  animated = true,
}: ElectricBorderProps) {
  return (
    <div className={cn('relative group', className)}>
      {/* Electric border */}
      <div
        className={cn(
          'absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-75 blur-sm',
          borderColor,
          glowColor,
          animated && 'animate-pulse group-hover:opacity-100 transition duration-1000'
        )}
      />

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
