'use client'

import { useState, useEffect } from 'react'

interface BMIInputProps {
  value: { height: number; weight: number; bmi: number } | null
  onChange: (value: { height: number; weight: number; bmi: number }) => void
}

export function BMIInput({ value, onChange }: BMIInputProps) {
  const [height, setHeight] = useState(value?.height || 170)
  const [weight, setWeight] = useState(value?.weight || 70)
  const [bmi, setBmi] = useState(value?.bmi || 0)

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100
      const calculatedBMI = weight / (heightInMeters * heightInMeters)
      const roundedBMI = Math.round(calculatedBMI * 10) / 10
      setBmi(roundedBMI)

      onChange({
        height,
        weight,
        bmi: roundedBMI,
      })
    }
  }, [height, weight, onChange])

  // Get BMI category and color
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Поднормено тегло', color: '#3B82F6' }
    if (bmi < 25) return { label: 'Нормално тегло', color: '#10B981' }
    if (bmi < 30) return { label: 'Наднормено тегло', color: '#F59E0B' }
    return { label: 'Затлъстяване', color: '#EF4444' }
  }

  const category = getBMICategory(bmi)

  return (
    <div className="space-y-6">
      {/* Height Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Височина: {height} см
        </label>
        <input
          type="range"
          min="140"
          max="220"
          step="1"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>140 см</span>
          <span>220 см</span>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Тегло: {weight} кг
        </label>
        <input
          type="range"
          min="40"
          max="150"
          step="1"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>40 кг</span>
          <span>150 кг</span>
        </div>
      </div>

      {/* BMI Display */}
      {bmi > 0 && (
        <div
          className="rounded-lg p-6 text-center border-2"
          style={{ borderColor: category.color, backgroundColor: `${category.color}10` }}
        >
          <p className="text-sm text-muted-foreground mb-2">Твоят BMI:</p>
          <p className="text-4xl font-bold mb-2" style={{ color: category.color }}>
            {bmi}
          </p>
          <p className="text-sm font-medium" style={{ color: category.color }}>
            {category.label}
          </p>
        </div>
      )}
    </div>
  )
}
