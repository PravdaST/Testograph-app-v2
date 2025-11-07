'use client'

/**
 * Quiz Slider Component
 * For age and sleep hours questions
 */

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface QuizSliderProps {
  min: number
  max: number
  step: number
  value: number | null
  unit?: string
  onChange: (value: number) => void
}

export function QuizSlider({ min, max, step, value, unit, onChange }: QuizSliderProps) {
  const [currentValue, setCurrentValue] = useState(value || min)

  useEffect(() => {
    if (value !== null) {
      setCurrentValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setCurrentValue(newValue)
    onChange(newValue)
  }

  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div className="space-y-6">
      {/* Value Display */}
      <div className="text-center">
        <div className="text-5xl font-bold text-primary">
          {currentValue}
          {unit && <span className="text-2xl ml-2 text-muted-foreground">{unit}</span>}
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(0 0 0) 0%, rgb(0 0 0) ${percentage}%, rgb(var(--muted)) ${percentage}%, rgb(var(--muted)) 100%)`,
          }}
        />

        {/* Slider Track Markers */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-muted-foreground">{min}</span>
          <span className="text-xs text-muted-foreground">{max}</span>
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-center text-sm text-muted-foreground">
        Плъзни за да избереш
      </div>
    </div>
  )
}
