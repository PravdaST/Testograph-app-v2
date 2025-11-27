'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface SocialProofGridProps {
  count: number
}

// Curated European-only male portrait IDs from randomuser.me
const avatarIds = [
  1, 3, 4, 5, 6, 10, 11, 14, 15, 16,
  18, 20, 21, 22, 25, 32, 34, 40, 41, 43,
  46, 50, 52, 53, 55, 57, 60, 62, 64, 68
]

export function SocialProofGrid({ count }: SocialProofGridProps) {
  const formattedCount = count.toLocaleString('bg-BG')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 px-4 py-2"
    >
      {/* Main Message - Compact */}
      <div className="text-center">
        <p className="text-base font-semibold text-foreground mb-1">
          Не сте сам в това.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
          Над <span className="font-bold text-primary">{formattedCount}</span> мъже вече
          използват тази система за по-добро здраве.
        </p>
      </div>

      {/* Avatar Strip - 2 rows only, smaller avatars */}
      <div className="w-full max-w-[280px] overflow-hidden relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Row 1 */}
        <div className="flex gap-1 mb-1 animate-scroll-left">
          {[...avatarIds, ...avatarIds].map((id, i) => (
            <div
              key={`r1-${i}`}
              className="relative w-7 h-7 rounded-full overflow-hidden bg-muted flex-shrink-0"
            >
              <Image
                src={`https://randomuser.me/api/portraits/men/${id}.jpg`}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-1 animate-scroll-right">
          {[...avatarIds.slice(10), ...avatarIds.slice(0, 10), ...avatarIds].map((id, i) => (
            <div
              key={`r2-${i}`}
              className="relative w-7 h-7 rounded-full overflow-hidden bg-muted flex-shrink-0"
            >
              <Image
                src={`https://randomuser.me/api/portraits/men/${id}.jpg`}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Badge - Minimal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2"
      >
        <div className="flex -space-x-2">
          {[1, 4, 11].map((id) => (
            <div
              key={id}
              className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-background"
            >
              <Image
                src={`https://randomuser.me/api/portraits/men/${id}.jpg`}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
        <div className="text-xs">
          <span className="font-bold text-foreground">{formattedCount}+</span>
          <span className="text-muted-foreground ml-1">мъже</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
