'use client'

/**
 * CycleCompleteModal Component
 * Shows when user completes 30-day cycle and has remaining capsules
 * Offers choice to continue same program or change via Quiz
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PartyPopper, RefreshCw, ClipboardList, Loader2, X } from 'lucide-react'

interface CycleCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  capsulesRemaining: number
  daysRemaining: number
  currentCategory: 'energy' | 'libido' | 'muscle'
}

export function CycleCompleteModal({
  isOpen,
  onClose,
  email,
  capsulesRemaining,
  daysRemaining,
  currentCategory,
}: CycleCompleteModalProps) {
  const router = useRouter()
  const [isRestarting, setIsRestarting] = useState(false)

  if (!isOpen) return null

  const handleContinueSameProgram = async () => {
    try {
      setIsRestarting(true)

      const response = await fetch('/api/user/restart-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to restart cycle')
      }

      // Refresh page to reload with new cycle
      window.location.reload()
    } catch (error) {
      console.error('Error restarting cycle:', error)
      alert('Грешка при рестартиране на цикъла. Опитай отново.')
      setIsRestarting(false)
    }
  }

  const handleChangeProgram = () => {
    // Redirect to quiz to choose new program
    router.push('/quiz')
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'energy':
        return 'Енергия & Витал'
      case 'libido':
        return 'Либидо & Сексуална функция'
      case 'muscle':
        return 'Мускулна маса'
      default:
        return category
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[100] animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-background rounded-2xl shadow-2xl z-[101] animate-scale-in p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Поздравления! 🎉</h2>
          <p className="text-muted-foreground">
            Завърши 30-дневния цикъл на програмата!
          </p>
        </div>

        {/* Info */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Остават капсули:</span>
            <span className="text-lg font-bold">{capsulesRemaining}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Остават дни:</span>
            <span className="text-lg font-bold">{daysRemaining}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Текуща програма:</span>
            <span className="text-sm font-medium">{getCategoryLabel(currentCategory)}</span>
          </div>
        </div>

        {/* Question */}
        <h3 className="font-bold text-lg mb-4 text-center">
          Какво искаш да направиш?
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {/* Continue Same Program */}
          <button
            onClick={handleContinueSameProgram}
            disabled={isRestarting}
            className="w-full bg-primary text-primary-foreground rounded-xl p-4 hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              {isRestarting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <RefreshCw className="w-6 h-6" />
              )}
              <div className="text-left flex-1">
                <div className="font-bold">Продължи със същата програма</div>
                <div className="text-xs text-primary-foreground/80">
                  Започни нов 30-дневен цикъл с {getCategoryLabel(currentCategory)}
                </div>
              </div>
            </div>
          </button>

          {/* Change Program */}
          <button
            onClick={handleChangeProgram}
            disabled={isRestarting}
            className="w-full bg-background border-2 border-primary rounded-xl p-4 hover:bg-primary/5 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-primary" />
              <div className="text-left flex-1">
                <div className="font-bold">Смени програмата</div>
                <div className="text-xs text-muted-foreground">
                  Мини Quiz-а отново за нова програма
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Skip Option */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Реши по-късно
        </button>
      </div>
    </>
  )
}
