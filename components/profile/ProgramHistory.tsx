'use client'

/**
 * Program History Component
 * Shows user's previous quiz programs and completion stats
 */

import { useState, useEffect } from 'react'
import { History, ChevronDown, ChevronRight, Calendar, Target, Award, TrendingUp, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react'

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
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
        // Auto-expand first program if multiple programs exist
        if (data.programs.length > 1) {
          setExpandedId(data.programs[0].id)
        }
      } else {
        console.error('Error loading program history:', data.error)
      }
    } catch (error) {
      console.error('Error fetching program history:', error)
    } finally {
      setLoading(false)
    }
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

  // Only show if user has more than 1 program (show history)
  if (programs.length <= 1) {
    return null
  }

  return (
    <div className="bg-background rounded-2xl p-3 sm:p-5 border border-border">
      {/* Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h2 className="font-bold text-sm sm:text-base">Program History</h2>
        <span className="text-[10px] sm:text-xs text-muted-foreground">({programs.length} програми)</span>
      </div>

      {/* Programs List */}
      <div className="space-y-2 sm:space-y-3">
        {programs.map((program, index) => {
          const isExpanded = expandedId === program.id
          const isCurrentProgram = index === 0
          const statusConfig = STATUS_CONFIG[program.status]
          const StatusIcon = statusConfig.icon

          return (
            <div
              key={program.id}
              className={`border rounded-xl overflow-hidden transition-all ${
                isCurrentProgram
                  ? 'border-primary/50 bg-primary/5'
                  : statusConfig.border + ' ' + statusConfig.bg
              }`}
            >
              {/* Header - Always Visible */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : program.id)}
                className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Status Icon */}
                  <div className={`p-1.5 sm:p-2 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
                    <StatusIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${statusConfig.color}`} />
                  </div>

                  {/* Program Info */}
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-medium text-sm sm:text-base">{CATEGORY_NAMES[program.category]}</span>
                      {isCurrentProgram && (
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-primary text-primary-foreground rounded">
                          Текуща
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      {program.completed_at &&
                        new Date(program.completed_at).toLocaleDateString('bg-BG', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3 border-t border-border/50">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-3">
                    {/* Quiz Score */}
                    <div className="p-2 sm:p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Score</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold">{program.total_score}</div>
                    </div>

                    {/* Days in Program */}
                    <div className="p-2 sm:p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Дни</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold">{program.daysInProgram}</div>
                    </div>

                    {/* Progress % */}
                    <div className="p-2 sm:p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Прогрес</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold">{program.progressPct}%</div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    {program.level && (
                      <div className="flex items-center justify-between py-0.5 sm:py-1">
                        <span className="text-muted-foreground">Ниво:</span>
                        <span className="font-medium">{program.level}</span>
                      </div>
                    )}
                    {program.workout_location && (
                      <div className="flex items-center justify-between py-0.5 sm:py-1">
                        <span className="text-muted-foreground">Локация:</span>
                        <span className="font-medium">
                          {program.workout_location === 'home' ? 'Вкъщи' : 'Фитнес'}
                        </span>
                      </div>
                    )}
                    {program.dietary_preference && (
                      <div className="flex items-center justify-between py-0.5 sm:py-1">
                        <span className="text-muted-foreground">Диета:</span>
                        <span className="font-medium capitalize">{program.dietary_preference}</span>
                      </div>
                    )}
                  </div>

                  {/* Goal */}
                  {program.goal && (
                    <div className="pt-2 sm:pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                        <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        <span className="text-[10px] sm:text-xs font-medium">Цел:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{program.goal}</p>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-center pt-1 sm:pt-2">
                    <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
                      <StatusIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${statusConfig.color}`} />
                      <span className={`text-xs sm:text-sm font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
