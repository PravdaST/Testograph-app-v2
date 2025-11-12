'use client'

/**
 * ExerciseProgressChartLazy Component
 * Dynamic import wrapper for ExerciseProgressChart to reduce bundle size
 * Saves ~107 KB by loading Recharts only when needed
 */

import dynamic from 'next/dynamic'
import { Activity } from 'lucide-react'

interface ExerciseProgressChartProps {
  exerciseName: string
  email: string
  days?: number
}

const ExerciseProgressChart = dynamic(
  () =>
    import('./ExerciseProgressChart').then((mod) => ({
      default: mod.ExerciseProgressChart,
    })),
  {
    loading: () => (
      <div className="w-full h-64 flex items-center justify-center bg-muted/30 rounded-2xl">
        <div className="text-muted-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 animate-pulse" />
          <span>Зареждане на графика...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
)

export function ExerciseProgressChartLazy(props: ExerciseProgressChartProps) {
  return <ExerciseProgressChart {...props} />
}
