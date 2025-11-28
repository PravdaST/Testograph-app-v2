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
    <div className={cn('relative group h-full p-[2px] rounded-xl bg-gradient-to-r', borderColor, className, animated && 'animate-pulse')}>
      {/* Content with background to cover the gradient */}
      <div className="relative h-full bg-background rounded-[10px]">
        {children}
      </div>
    </div>
  )
}
