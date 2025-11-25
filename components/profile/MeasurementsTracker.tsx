'use client'

/**
 * Body Measurements Tracker Component
 * Track weight, body fat %, and circumferences over time
 */

import { useState, useEffect } from 'react'
import { Scale, Plus, Trash2, Loader2, TrendingDown, TrendingUp, Calendar, Edit2, X, Check } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface BodyMeasurement {
  id: string
  email: string
  date: string
  weight?: number
  body_fat_pct?: number
  waist?: number
  chest?: number
  arms?: number
  legs?: number
  notes?: string
  created_at: string
}

interface MeasurementsTrackerProps {
  email: string
}

export function MeasurementsTracker({ email }: MeasurementsTrackerProps) {
  const toast = useToast()

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedView, setSelectedView] = useState<'table' | 'chart'>('table')

  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formWeight, setFormWeight] = useState('')
  const [formBodyFat, setFormBodyFat] = useState('')
  const [formWaist, setFormWaist] = useState('')
  const [formChest, setFormChest] = useState('')
  const [formArms, setFormArms] = useState('')
  const [formLegs, setFormLegs] = useState('')
  const [formNotes, setFormNotes] = useState('')

  useEffect(() => {
    loadMeasurements()
  }, [email])

  const loadMeasurements = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/measurements?limit=30')
      const data = await response.json()

      if (response.ok && data.success) {
        setMeasurements(data.measurements)
      } else {
        console.error('Error loading measurements:', data.error)
      }
    } catch (error) {
      console.error('Error fetching measurements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMeasurement = async () => {
    // Validate at least one field
    if (!formWeight && !formBodyFat && !formWaist && !formChest && !formArms && !formLegs) {
      toast.error('Моля въведете поне едно измерване')
      return
    }

    setIsSaving(true)

    try {
      const payload: any = { date: formDate }
      if (formWeight) payload.weight = parseFloat(formWeight)
      if (formBodyFat) payload.body_fat_pct = parseFloat(formBodyFat)
      if (formWaist) payload.waist = parseFloat(formWaist)
      if (formChest) payload.chest = parseFloat(formChest)
      if (formArms) payload.arms = parseFloat(formArms)
      if (formLegs) payload.legs = parseFloat(formLegs)
      if (formNotes) payload.notes = formNotes

      const response = await fetch('/api/user/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Измерването е запазено!')
        setShowAddModal(false)
        resetForm()
        await loadMeasurements()
      } else {
        toast.error(data.error || 'Грешка при запазване')
      }
    } catch (error) {
      console.error('Error saving measurement:', error)
      toast.error('Грешка при запазване на измерването')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMeasurement = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете това измерване?')) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/user/measurements?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Измерването е изтрито')
        setMeasurements(measurements.filter((m) => m.id !== id))
      } else {
        toast.error(data.error || 'Грешка при изтриване')
      }
    } catch (error) {
      console.error('Error deleting measurement:', error)
      toast.error('Грешка при изтриване')
    } finally {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setFormDate(new Date().toISOString().split('T')[0])
    setFormWeight('')
    setFormBodyFat('')
    setFormWaist('')
    setFormChest('')
    setFormArms('')
    setFormLegs('')
    setFormNotes('')
  }

  const prepareChartData = () => {
    // Reverse to show oldest first in chart
    return measurements
      .slice()
      .reverse()
      .map((m) => ({
        date: new Date(m.date).toLocaleDateString('bg-BG', {
          day: 'numeric',
          month: 'short',
        }),
        weight: m.weight || null,
        bodyFat: m.body_fat_pct || null,
        waist: m.waist || null,
      }))
  }

  const calculateTrend = (field: keyof BodyMeasurement) => {
    const validMeasurements = measurements.filter((m) => m[field] !== null && m[field] !== undefined)
    if (validMeasurements.length < 2) return null

    const latest = validMeasurements[0][field] as number
    const previous = validMeasurements[1][field] as number
    const diff = latest - previous

    return diff
  }

  if (loading) {
    return (
      <div className="bg-background rounded-2xl p-5 border border-border">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const weightTrend = calculateTrend('weight')
  const bodyFatTrend = calculateTrend('body_fat_pct')
  const chartData = prepareChartData()

  return (
    <div className="bg-background rounded-2xl p-3 sm:p-5 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="font-bold text-sm sm:text-base">Body Measurements</h2>
          <span className="text-[10px] sm:text-xs text-muted-foreground">({measurements.length})</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Toggle */}
          {measurements.length > 0 && (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-muted/30 rounded-lg p-0.5 sm:p-1">
              <button
                onClick={() => setSelectedView('table')}
                className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs transition-colors ${
                  selectedView === 'table'
                    ? 'bg-background shadow-sm'
                    : 'hover:bg-background/50'
                }`}
              >
                Таблица
              </button>
              <button
                onClick={() => setSelectedView('chart')}
                className={`px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs transition-colors ${
                  selectedView === 'chart'
                    ? 'bg-background shadow-sm'
                    : 'hover:bg-background/50'
                }`}
              >
                Графика
              </button>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 sm:px-3 sm:py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            title="Добави измерване"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Добави</span>
          </button>
        </div>
      </div>

      {/* Trend Summary */}
      {measurements.length > 1 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {weightTrend !== null && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Тегло</span>
                <div className="flex items-center gap-1">
                  {weightTrend < 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  )}
                  <span className={`text-sm font-medium ${weightTrend < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                    {weightTrend > 0 ? '+' : ''}{weightTrend.toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>
          )}
          {bodyFatTrend !== null && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Мазнини %</span>
                <div className="flex items-center gap-1">
                  {bodyFatTrend < 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  )}
                  <span className={`text-sm font-medium ${bodyFatTrend < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                    {bodyFatTrend > 0 ? '+' : ''}{bodyFatTrend.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chart View */}
      {selectedView === 'chart' && measurements.length > 0 && (
        <div className="mb-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="Тегло (kg)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" name="Мазнини (%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="waist" stroke="#10b981" name="Талия (cm)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table View - Cards on mobile, Table on desktop */}
      {selectedView === 'table' && measurements.length > 0 && (
        <>
          {/* Mobile: Cards */}
          <div className="sm:hidden space-y-2">
            {measurements.map((m) => (
              <div key={m.id} className="p-3 bg-muted/20 rounded-xl border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-medium">
                    {new Date(m.date).toLocaleDateString('bg-BG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <button
                    onClick={() => handleDeleteMeasurement(m.id)}
                    disabled={deletingId === m.id}
                    className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors disabled:opacity-50"
                  >
                    {deletingId === m.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {m.weight && (
                    <div>
                      <span className="text-muted-foreground">Тегло</span>
                      <div className="font-medium">{m.weight} kg</div>
                    </div>
                  )}
                  {m.body_fat_pct && (
                    <div>
                      <span className="text-muted-foreground">Мазнини</span>
                      <div className="font-medium">{m.body_fat_pct}%</div>
                    </div>
                  )}
                  {m.waist && (
                    <div>
                      <span className="text-muted-foreground">Талия</span>
                      <div className="font-medium">{m.waist} cm</div>
                    </div>
                  )}
                  {m.chest && (
                    <div>
                      <span className="text-muted-foreground">Гърди</span>
                      <div className="font-medium">{m.chest} cm</div>
                    </div>
                  )}
                  {m.arms && (
                    <div>
                      <span className="text-muted-foreground">Ръце</span>
                      <div className="font-medium">{m.arms} cm</div>
                    </div>
                  )}
                  {m.legs && (
                    <div>
                      <span className="text-muted-foreground">Крака</span>
                      <div className="font-medium">{m.legs} cm</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-muted-foreground">Дата</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Тегло</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Мазнини</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Талия</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Гърди</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Ръце</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Крака</th>
                  <th className="text-right p-2"></th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-2">
                      {new Date(m.date).toLocaleDateString('bg-BG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="text-right p-2">{m.weight ? `${m.weight} kg` : '-'}</td>
                    <td className="text-right p-2">{m.body_fat_pct ? `${m.body_fat_pct}%` : '-'}</td>
                    <td className="text-right p-2">{m.waist ? `${m.waist} cm` : '-'}</td>
                    <td className="text-right p-2">{m.chest ? `${m.chest} cm` : '-'}</td>
                    <td className="text-right p-2">{m.arms ? `${m.arms} cm` : '-'}</td>
                    <td className="text-right p-2">{m.legs ? `${m.legs} cm` : '-'}</td>
                    <td className="text-right p-2">
                      <button
                        onClick={() => handleDeleteMeasurement(m.id)}
                        disabled={deletingId === m.id}
                        className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors disabled:opacity-50"
                      >
                        {deletingId === m.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Empty State */}
      {measurements.length === 0 && (
        <div className="py-12 text-center">
          <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Все още нямате записани измервания
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавете първото си измерване
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-4 pb-24 sm:p-6 sm:pb-6 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Добави измерване</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Date */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Дата
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="text-sm font-medium mb-2 block">Тегло (кг)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  placeholder="Напр. 75.5"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Body Fat % */}
              <div>
                <label className="text-sm font-medium mb-2 block">Мазнини (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formBodyFat}
                  onChange={(e) => setFormBodyFat(e.target.value)}
                  placeholder="Напр. 15.5"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Circumferences */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Талия (см)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    placeholder="85"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Гърди (см)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ръце (см)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formArms}
                    onChange={(e) => setFormArms(e.target.value)}
                    placeholder="35"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Крака (см)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formLegs}
                    onChange={(e) => setFormLegs(e.target.value)}
                    placeholder="55"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">Бележки (опционално)</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Допълнителни бележки..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={isSaving}
                >
                  Отказ
                </button>
                <button
                  onClick={handleSaveMeasurement}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Запазване...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Запази
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
