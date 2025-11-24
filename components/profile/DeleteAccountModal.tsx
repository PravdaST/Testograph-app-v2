'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const CONFIRMATION_WORD = 'ИЗТРИЙ'
  const isConfirmValid = confirmText === CONFIRMATION_WORD

  const handleDelete = async () => {
    if (!isConfirmValid || isDeleting) return

    setIsDeleting(true)
    setError(null)

    try {
      await onConfirm()
    } catch (err) {
      setError('Възникна грешка при изтриването. Моля, опитайте отново.')
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (isDeleting) return
    setConfirmText('')
    setError(null)
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
      <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-background rounded-2xl shadow-2xl z-[99999] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-destructive/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-lg font-bold text-destructive">Изтриване на профил</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Warning */}
          <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/30">
            <p className="text-sm text-destructive font-medium mb-2">
              Това действие е необратимо!
            </p>
            <p className="text-sm text-muted-foreground">
              Изтриването на профила ще премахне всички ваши данни, включително:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                Резултати от quiz-а
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                История на тренировки
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                Записи за хранене и сън
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                TestoUp проследяване
              </li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              За потвърждение напишете <span className="font-bold text-destructive">{CONFIRMATION_WORD}</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder={CONFIRMATION_WORD}
              disabled={isDeleting}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-destructive/50 disabled:opacity-50 text-center font-bold tracking-widest"
              autoComplete="off"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/10 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/30 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50 font-medium"
          >
            Отказ
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="flex-1 px-4 py-3 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Изтриване...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Изтрий завинаги
              </>
            )}
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
