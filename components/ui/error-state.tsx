'use client'

/**
 * Error State Component
 * Reusable error display with retry functionality
 */

import { AlertCircle, RefreshCw, WifiOff, ServerCrash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
  variant?: 'default' | 'network' | 'server' | 'inline'
}

const ERROR_MESSAGES = {
  default: {
    title: 'Възникна грешка',
    message: 'Нещо се обърка. Моля, опитай отново.',
  },
  network: {
    title: 'Проблем с връзката',
    message: 'Провери интернет връзката си и опитай отново.',
  },
  server: {
    title: 'Сървърна грешка',
    message: 'Сървърът не отговаря. Опитай отново след малко.',
  },
}

const ICONS = {
  default: AlertCircle,
  network: WifiOff,
  server: ServerCrash,
  inline: AlertCircle,
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
  variant = 'default',
}: ErrorStateProps) {
  const Icon = ICONS[variant]
  const defaults = ERROR_MESSAGES[variant === 'inline' ? 'default' : variant]

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30',
          className
        )}
      >
        <Icon className="w-5 h-5 text-destructive flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-destructive font-medium">
            {message || defaults.message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Опитай
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        {title || defaults.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {message || defaults.message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Опитай отново
        </button>
      )}
    </div>
  )
}

/**
 * Empty State Component
 * For when there's no data to display
 */
interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title = 'Няма данни',
  message = 'Все още няма записи за показване.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
