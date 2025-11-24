'use client'

/**
 * Empty State Component
 * Reusable component for displaying empty/no-data states
 * Provides better UX than blank screens
 */

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  iconClassName?: string
  children?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
  children,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8 space-y-4', className)}>
      {/* Icon */}
      <div className="p-6 rounded-full bg-muted/30">
        <Icon className={cn('w-12 h-12 text-muted-foreground', iconClassName)} />
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}

      {/* Custom Children */}
      {children}
    </div>
  )
}

/**
 * Preset Empty States for common scenarios
 */
import {
  Utensils,
  Dumbbell,
  Moon,
  Pill,
  Calendar,
  TrendingUp,
  FileText,
  Search,
  Inbox,
} from 'lucide-react'

export const EmptyStatePresets = {
  noMeals: {
    icon: Utensils,
    title: 'Няма завършени хранения',
    description: 'Започни да следиш храненията си, за да видиш прогреса тук',
  },
  noWorkouts: {
    icon: Dumbbell,
    title: 'Няма завършени тренировки',
    description: 'Завърши първата си тренировка, за да видиш статистиките',
  },
  noSleep: {
    icon: Moon,
    title: 'Няма данни за сън',
    description: 'Започни да проследяваш съня си, за да видиш анализ на качеството',
  },
  noSupplements: {
    icon: Pill,
    title: 'Няма приети добавки',
    description: 'Проследявай дневния прием на TestoUp, за да видиш compliance',
  },
  noHistory: {
    icon: Calendar,
    title: 'Няма история',
    description: 'Историята ще се появи, след като започнеш да използваш приложението',
  },
  noProgress: {
    icon: TrendingUp,
    title: 'Няма данни за прогрес',
    description: 'Следвай програмата, за да видиш подобрението си',
  },
  noFeedback: {
    icon: FileText,
    title: 'Няма обратна връзка',
    description: 'Попълни дневните анкети, за да видиш историята си',
  },
  noResults: {
    icon: Search,
    title: 'Няма резултати',
    description: 'Опитай с различни филтри или критерии за търсене',
  },
  emptyInbox: {
    icon: Inbox,
    title: 'Всичко е наред',
    description: 'Нямаш нови известия или задачи за момента',
  },
} as const

/**
 * Preset Empty State Components
 * Ready-to-use components for common scenarios
 */
export function NoMealsEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noMeals} action={action} iconClassName="text-orange-500">{children}</EmptyState>
}

export function NoWorkoutsEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noWorkouts} action={action} iconClassName="text-blue-500">{children}</EmptyState>
}

export function NoSleepEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noSleep} action={action} iconClassName="text-purple-500">{children}</EmptyState>
}

export function NoSupplementsEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noSupplements} action={action} iconClassName="text-green-500">{children}</EmptyState>
}

export function NoHistoryEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noHistory} action={action}>{children}</EmptyState>
}

export function NoProgressEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noProgress} action={action} iconClassName="text-emerald-500">{children}</EmptyState>
}

export function NoFeedbackEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noFeedback} action={action}>{children}</EmptyState>
}

export function NoResultsEmptyState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.noResults} action={action}>{children}</EmptyState>
}

export function EmptyInboxState({ action, children }: { action?: EmptyStateProps['action']; children?: ReactNode }) {
  return <EmptyState {...EmptyStatePresets.emptyInbox} action={action} iconClassName="text-gray-400">{children}</EmptyState>
}
