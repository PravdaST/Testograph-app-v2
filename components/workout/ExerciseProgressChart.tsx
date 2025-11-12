'use client'

/**
 * ExerciseProgressChart Component
 * Displays exercise progress over time with weight, volume, and RPE tracking
 */

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, BarChart3, Activity, Calendar } from 'lucide-react'

interface ProgressData {
  date: string
  maxWeight: number
  totalVolume: number
  avgRpe: number
  totalReps: number
  sets: number
}

interface ExerciseProgressChartProps {
  exerciseName: string
  email: string
  days?: number
}

export function ExerciseProgressChart({
  exerciseName,
  email,
  days = 90,
}: ExerciseProgressChartProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'volume' | 'rpe'>('weight')
  const [totalWorkouts, setTotalWorkouts] = useState(0)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/workout/progress?email=${email}&exerciseName=${encodeURIComponent(
            exerciseName
          )}&days=${days}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch progress data')
        }

        const data = await response.json()
        setProgressData(data.progressData || [])
        setTotalWorkouts(data.totalWorkouts || 0)
      } catch (error) {
        console.error('Error fetching progress:', error)
        setProgressData([])
      } finally {
        setLoading(false)
      }
    }

    if (email && exerciseName) {
      fetchProgress()
    }
  }, [email, exerciseName, days])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    if (progressData.length < 2) return 0
    const firstWorkout = progressData[0]
    const lastWorkout = progressData[progressData.length - 1]

    if (selectedMetric === 'weight') {
      return ((lastWorkout.maxWeight - firstWorkout.maxWeight) / firstWorkout.maxWeight) * 100
    } else if (selectedMetric === 'volume') {
      return ((lastWorkout.totalVolume - firstWorkout.totalVolume) / firstWorkout.totalVolume) * 100
    }
    return 0
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-muted/30 rounded-2xl">
        <div className="text-muted-foreground">Зареждане на графика...</div>
      </div>
    )
  }

  if (progressData.length === 0) {
    return (
      <div className="w-full p-6 bg-muted/30 rounded-2xl border-2 border-border">
        <div className="text-center">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Все още няма данни за това упражнение
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Започни да тренираш и проследи прогреса си!
          </p>
        </div>
      </div>
    )
  }

  const progress = calculateProgress()

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{exerciseName}</h3>
          <p className="text-sm text-muted-foreground">
            {totalWorkouts} тренировки за последните {days} дни
          </p>
        </div>
        {progress !== 0 && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            progress > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold">
              {progress > 0 ? '+' : ''}{Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedMetric('weight')}
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
            selectedMetric === 'weight'
              ? 'bg-primary text-white border-primary'
              : 'bg-muted/30 border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">Тежест</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedMetric('volume')}
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
            selectedMetric === 'volume'
              ? 'bg-primary text-white border-primary'
              : 'bg-muted/30 border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">Обем</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedMetric('rpe')}
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
            selectedMetric === 'rpe'
              ? 'bg-primary text-white border-primary'
              : 'bg-muted/30 border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium">RPE</span>
          </div>
        </button>
      </div>

      {/* Chart */}
      <div className="bg-background border-2 border-border rounded-2xl p-4">
        <ResponsiveContainer width="100%" height={300}>
          {selectedMetric === 'volume' ? (
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '2px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(label) => `Дата: ${label}`}
                formatter={(value: number) => [`${value} kg`, 'Общ обем']}
              />
              <Bar dataKey="totalVolume" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '2px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(label) => `Дата: ${label}`}
                formatter={(value: number) => [
                  selectedMetric === 'weight' ? `${value} kg` : `${value}`,
                  selectedMetric === 'weight' ? 'Макс тежест' : 'Средно RPE',
                ]}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric === 'weight' ? 'maxWeight' : 'avgRpe'}
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/30 rounded-lg p-3 border-2 border-border">
          <div className="text-xs text-muted-foreground mb-1">Макс тежест</div>
          <div className="font-bold text-lg">
            {Math.max(...progressData.map((d) => d.maxWeight))} kg
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 border-2 border-border">
          <div className="text-xs text-muted-foreground mb-1">Общ обем</div>
          <div className="font-bold text-lg">
            {progressData.reduce((sum, d) => sum + d.totalVolume, 0).toLocaleString()} kg
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 border-2 border-border">
          <div className="text-xs text-muted-foreground mb-1">Общо сетове</div>
          <div className="font-bold text-lg">
            {progressData.reduce((sum, d) => sum + d.sets, 0)}
          </div>
        </div>
      </div>
    </div>
  )
}
