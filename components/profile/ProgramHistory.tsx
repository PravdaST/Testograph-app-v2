'use client'

/**
 * Program History Component
 * Shows user's previous quiz programs and completion stats
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { History, Loader2, CheckCircle2, Clock, XCircle, Trash2, Plus } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface Program {
  id: string
  email: string
  category: 'energy' | 'libido' | 'muscle'
  level: string
  total_score: number
  first_name?: string
  completed_at?: string
  program_start_date?: string
  program_end_date?: string
  workout_location?: 'home' | 'gym'
  dietary_preference?: 'omnivor' | 'pescatarian' | 'vegetarian' | 'vegan'
  goal?: string
  daysInProgram: number
  progressPct: number
  status: 'active' | 'completed' | 'abandoned'
  created_at: string
}

interface ProgramHistoryProps {
  email: string
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

const STATUS_CONFIG = {
  active: {
    label: 'Активна',
    icon: Clock,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-900',
  },
  completed: {
    label: 'Завършена',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900',
  },
  abandoned: {
    label: 'Неактивна',
    icon: XCircle,
    color: 'text-muted-foreground',
    bg: 'bg-muted/30',
    border: 'border-border',
  },
}

export function ProgramHistory({ email }: ProgramHistoryProps) {
  const router = useRouter()
  const toast = useToast()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadPrograms()
  }, [email])

  const loadPrograms = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/program-history')
      const data = await response.json()

      if (response.ok && data.success) {
        setPrograms(data.programs)
      } else {
        console.error('Error loading program history:', data.error)
      }
    } catch (error) {
      console.error('Error fetching program history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази програма?')) {
      return
    }

    setDeletingId(programId)

    try {
      const response = await fetch(`/api/user/program-history?id=${programId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Програмата е изтрита')
        setPrograms(programs.filter((p) => p.id !== programId))
      } else {
        toast.error(data.error || 'Грешка при изтриване')
      }
    } catch (error) {
      console.error('Error deleting program:', error)
      toast.error('Грешка при изтриване на програмата')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddProgram = () => {
    router.push('/quiz')
  }

  if (loading) {
    return (
      <div className="bg-background rounded-2xl p-3 sm:p-5 border border-border">
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background rounded-2xl p-3 sm:p-5 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="font-bold text-sm sm:text-base">Програми</h2>
          <span className="text-[10px] sm:text-xs text-muted-foreground">({programs.length})</span>
        </div>
        <button
          onClick={handleAddProgram}
          className="p-2 sm:px-3 sm:py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          title="Добави нова програма"
        >
          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Нова</span>
        </button>
      </div>

      {/* Programs List - Horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
        {programs.map((program, index) => {
          const isCurrentProgram = index === 0
          const statusConfig = STATUS_CONFIG[program.status]
          const StatusIcon = statusConfig.icon

          return (
            <div
              key={program.id}
              className={`flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(50%-8px)] snap-start border rounded-xl overflow-hidden transition-all ${
                isCurrentProgram
                  ? 'border-primary/50 bg-primary/5'
                  : statusConfig.border + ' ' + statusConfig.bg
              }`}
            >
              {/* Program Card */}
              <div className="p-3 sm:p-4">
                {/* Header with delete button */}
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
                    <StatusIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${statusConfig.color}`} />
                  </div>
                  {!isCurrentProgram && (
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      disabled={deletingId === program.id}
                      className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors disabled:opacity-50"
                      title="Изтрий програмата"
                    >
                      {deletingId === program.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Category Name */}
                <div className="mb-1">
                  <span className="font-medium text-xs sm:text-sm line-clamp-2">
                    {CATEGORY_NAMES[program.category]}
                  </span>
                  {isCurrentProgram && (
                    <span className="ml-1 text-[8px] sm:text-[10px] px-1 py-0.5 bg-primary text-primary-foreground rounded">
                      Текуща
                    </span>
                  )}
                </div>

                {/* Date */}
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                  {program.completed_at &&
                    new Date(program.completed_at).toLocaleDateString('bg-BG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Score</span>
                    <div className="font-medium">{program.total_score}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Дни</span>
                    <div className="font-medium">{program.daysInProgram}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
