'use client'

/**
 * Confirm Modal Component
 * Reusable confirmation dialog with customizable actions
 */

import { createPortal } from 'react-dom'
import { AlertTriangle, LogOut, Trash2, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ConfirmVariant = 'danger' | 'warning' | 'default'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  icon?: 'trash' | 'logout' | 'warning'
  isLoading?: boolean
}

const ICONS = {
  trash: Trash2,
  logout: LogOut,
  warning: AlertTriangle,
}

const VARIANT_STYLES = {
  danger: {
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    buttonBg: 'bg-destructive hover:bg-destructive/90',
    buttonText: 'text-destructive-foreground',
  },
  warning: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    buttonBg: 'bg-amber-500 hover:bg-amber-600',
    buttonText: 'text-white',
  },
  default: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    buttonBg: 'bg-primary hover:bg-primary/90',
    buttonText: 'text-primary-foreground',
  },
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Потвърди',
  cancelText = 'Отказ',
  variant = 'default',
  icon = 'warning',
  isLoading = false,
}: ConfirmModalProps) {
  const Icon = ICONS[icon]
  const styles = VARIANT_STYLES[variant]

  const handleConfirm = async () => {
    await onConfirm()
  }

  const handleClose = () => {
    if (isLoading) return
    onClose()
  }

  if (!isOpen || typeof window === 'undefined') return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[99998] animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-background rounded-2xl shadow-2xl z-[99999] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center">
          <div className={cn('w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center', styles.iconBg)}>
            <Icon className={cn('w-7 h-7', styles.iconColor)} />
          </div>
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/30 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50 font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 px-4 py-3 rounded-xl transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2',
              styles.buttonBg,
              styles.buttonText
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Зареждане...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
