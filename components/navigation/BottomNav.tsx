'use client'

/**
 * Bottom Navigation Bar
 * Quick access to main features
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Utensils, Dumbbell, Moon, Pill } from 'lucide-react'

interface BottomNavProps {
  onNavigate?: (section: 'meals' | 'workout' | 'sleep' | 'supplement') => void
}

export function BottomNav({ onNavigate }: BottomNavProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('meals')

  const handleClick = (tab: 'meals' | 'workout' | 'sleep' | 'supplement') => {
    setActiveTab(tab)

    // Navigate to dedicated pages
    if (tab === 'meals') {
      router.push('/app/nutrition')
      return
    }

    if (tab === 'workout') {
      // Get today's day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
      const today = new Date()
      let dayOfWeek = today.getDay()

      // Convert Sunday (0) to 7 to match our 1-7 system
      if (dayOfWeek === 0) dayOfWeek = 7

      router.push(`/app/workout/${dayOfWeek}`)
      return
    }

    if (tab === 'supplement') {
      router.push('/app/supplement')
      return
    }

    if (tab === 'sleep') {
      router.push('/app/sleep')
      return
    }

    // Fallback for any other navigation
    onNavigate?.(tab)
  }

  const tabs = [
    {
      id: 'meals' as const,
      label: 'Хранене',
      icon: Utensils,
    },
    {
      id: 'workout' as const,
      label: 'Тренировка',
      icon: Dumbbell,
    },
    {
      id: 'sleep' as const,
      label: 'Сън',
      icon: Moon,
    },
    {
      id: 'supplement' as const,
      label: 'TestoUp',
      icon: Pill,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border safe-area-inset-bottom">
      <div className="container-mobile">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => handleClick(tab.id)}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-2 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-xs font-medium truncate">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
