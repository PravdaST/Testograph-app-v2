'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface SocialProofGridProps {
  count: number // The number to display (e.g., 1300)
}

// European-looking male portrait IDs from randomuser.me (curated selection)
const europeanMaleIds = [
  1, 3, 5, 7, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33,
  35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65,
  67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97
]

// Double the array for seamless infinite scroll
const doubledIds = [...europeanMaleIds, ...europeanMaleIds]

export function SocialProofGrid({ count }: SocialProofGridProps) {
  // Format number with space separator (Bulgarian style)
  const formattedCount = count.toLocaleString('bg-BG')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Motivational Text Above Photos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center max-w-md px-4"
      >
        <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          Разбирам. Не сте сам в това.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Знам, че може да изглежда непреодолимо. Но досега над{' '}
          <span className="font-bold text-primary">{formattedCount}</span> мъже са използвали
          тази система, за да възстановят своята енергия и виталност.
          Вие можете да бъдете следващият.
        </p>
      </motion.div>

      {/* Infinite Scrolling Photo Strip */}
      <div className="w-full max-w-sm overflow-hidden relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

        {/* First row - scrolling left */}
        <div className="flex gap-2 mb-2 animate-scroll-left">
          {doubledIds.slice(0, 24).map((id, index) => (
            <div
              key={`row1-${index}`}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted shadow-md flex-shrink-0 ring-2 ring-background"
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

        {/* Second row - scrolling right */}
        <div className="flex gap-2 mb-2 animate-scroll-right">
          {doubledIds.slice(12, 36).map((id, index) => (
            <div
              key={`row2-${index}`}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted shadow-md flex-shrink-0 ring-2 ring-background"
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

        {/* Third row - scrolling left (slower) */}
        <div className="flex gap-2 animate-scroll-left-slow">
          {doubledIds.slice(24, 48).map((id, index) => (
            <div
              key={`row3-${index}`}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted shadow-md flex-shrink-0 ring-2 ring-background"
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

      {/* Certificate Badge with Laurel Wreath */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative flex items-center justify-center gap-3 py-4"
      >
        {/* Left Laurel */}
        <svg className="w-10 h-14 sm:w-12 sm:h-16 text-amber-500" viewBox="0 0 40 60" fill="currentColor">
          <ellipse cx="8" cy="12" rx="6" ry="10" transform="rotate(-30 8 12)" opacity="0.9"/>
          <ellipse cx="12" cy="22" rx="5" ry="9" transform="rotate(-20 12 22)" opacity="0.8"/>
          <ellipse cx="14" cy="32" rx="5" ry="8" transform="rotate(-10 14 32)" opacity="0.7"/>
          <ellipse cx="14" cy="42" rx="4" ry="7" transform="rotate(0 14 42)" opacity="0.6"/>
          <ellipse cx="12" cy="50" rx="4" ry="6" transform="rotate(10 12 50)" opacity="0.5"/>
        </svg>

        {/* Center Content */}
        <div className="text-center px-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Тестван от над</p>
          <p className="text-3xl sm:text-4xl font-bold text-foreground leading-none">{formattedCount}</p>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">мъже в България</p>
        </div>

        {/* Right Laurel (mirrored) */}
        <svg className="w-10 h-14 sm:w-12 sm:h-16 text-amber-500 scale-x-[-1]" viewBox="0 0 40 60" fill="currentColor">
          <ellipse cx="8" cy="12" rx="6" ry="10" transform="rotate(-30 8 12)" opacity="0.9"/>
          <ellipse cx="12" cy="22" rx="5" ry="9" transform="rotate(-20 12 22)" opacity="0.8"/>
          <ellipse cx="14" cy="32" rx="5" ry="8" transform="rotate(-10 14 32)" opacity="0.7"/>
          <ellipse cx="14" cy="42" rx="4" ry="7" transform="rotate(0 14 42)" opacity="0.6"/>
          <ellipse cx="12" cy="50" rx="4" ry="6" transform="rotate(10 12 50)" opacity="0.5"/>
        </svg>
      </motion.div>
    </motion.div>
  )
}
