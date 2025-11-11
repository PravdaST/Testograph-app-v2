'use client'

/**
 * Nutrition Page
 * Full meal plan and tracking page
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Utensils, CheckCircle2, Clock, Flame } from 'lucide-react'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'

// Meal Plan Imports - LOW level
import { ENERGY_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-low'
import { LIBIDO_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-low'
import { MUSCLE_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-low'

// Meal Plan Imports - NORMAL level
import { ENERGY_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-normal'
import { LIBIDO_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-normal'
import { MUSCLE_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-normal'

// Meal Plan Imports - HIGH level
import { ENERGY_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-high'
import { LIBIDO_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-high'
import { MUSCLE_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-high'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  first_name?: string
  profile_picture_url?: string
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

const DAY_NAMES = ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб']

// Helper function to get meal plan based on category and level
function getMealPlanForCategory(
  category: 'energy' | 'libido' | 'muscle',
  level: string = 'normal'
) {
  const normalizedLevel = level.toLowerCase()

  if (category === 'energy') {
    if (normalizedLevel === 'low') return ENERGY_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return ENERGY_HIGH_MEAL_PLAN
    return ENERGY_NORMAL_MEAL_PLAN
  } else if (category === 'libido') {
    if (normalizedLevel === 'low') return LIBIDO_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return LIBIDO_HIGH_MEAL_PLAN
    return LIBIDO_NORMAL_MEAL_PLAN
  } else {
    if (normalizedLevel === 'low') return MUSCLE_LOW_MEAL_PLAN
    if (normalizedLevel === 'high') return MUSCLE_HIGH_MEAL_PLAN
    return MUSCLE_NORMAL_MEAL_PLAN
  }
}

export default function NutritionPage() {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [completedMeals, setCompletedMeals] = useState<Record<string, number[]>>({})

  // Load user program
  useEffect(() => {
    const loadUserProgram = async () => {
      try {
        const email = localStorage.getItem('quizEmail')
        if (!email) {
          router.push('/quiz')
          return
        }

        const response = await fetch(`/api/user/program?email=${encodeURIComponent(email)}`)
        if (response.ok) {
          const data = await response.json()
          setUserProgram(data)

          if (data.first_name) {
            setUserName(data.first_name)
          } else {
            const emailUsername = email.split('@')[0]
            setUserName(emailUsername)
          }
        }

        // Fetch today's completed meals
        const today = new Date().toISOString().split('T')[0]
        const mealsResponse = await fetch(`/api/meals/complete?email=${encodeURIComponent(email)}&date=${today}`)
        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json()
          const dateKey = today
          setCompletedMeals({
            [dateKey]: mealsData.completedMeals || []
          })
        }
      } catch (error) {
        console.error('Error loading program:', error)
        router.push('/quiz')
      } finally {
        setLoading(false)
      }
    }

    loadUserProgram()
  }, [router])

  const handleMealToggle = async (mealNumber: number) => {
    const email = localStorage.getItem('quizEmail')
    if (!email) return

    const dateKey = selectedDate.toISOString().split('T')[0]
    const currentMeals = completedMeals[dateKey] || []
    const isCompleted = currentMeals.includes(mealNumber)

    if (isCompleted) {
      // Remove meal
      setCompletedMeals({
        ...completedMeals,
        [dateKey]: currentMeals.filter(m => m !== mealNumber)
      })
    } else {
      // Add meal
      try {
        await fetch('/api/meals/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            date: dateKey,
            mealNumber,
          }),
        })

        setCompletedMeals({
          ...completedMeals,
          [dateKey]: [...currentMeals, mealNumber]
        })
      } catch (error) {
        console.error('Error completing meal:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
        <TopNav programName="Зареждане..." userName={userName} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <BottomNav onNavigate={() => router.push('/app')} />
      </div>
    )
  }

  if (!userProgram) return null

  const programName = CATEGORY_NAMES[userProgram.category]
  const mealPlan = getMealPlanForCategory(userProgram.category, userProgram.level)

  const selectedDayOfWeek = selectedDate.getDay()
  const dayData = mealPlan?.meals.find(
    (m) => m.day_of_week === (selectedDayOfWeek === 0 ? 7 : selectedDayOfWeek)
  )
  const mealsForDay = dayData?.meals || []

  const dateKey = selectedDate.toISOString().split('T')[0]
  const completedToday = completedMeals[dateKey] || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      <TopNav
        programName={programName}
        userName={userName}
        profilePictureUrl={userProgram?.profile_picture_url}
      />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Хранителен план</h1>
              <p className="text-sm text-muted-foreground">
                Персонализиран според твоите цели
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="bg-background rounded-2xl p-4 border border-border">
          <h3 className="text-sm font-semibold mb-3">Седмица</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
              const date = new Date()
              date.setDate(date.getDate() + offset)
              const isSelected = date.toDateString() === selectedDate.toDateString()
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <button
                  key={offset}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-14 rounded-xl p-2 transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                      : isToday
                        ? 'bg-primary/10 border-2 border-primary text-primary'
                        : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  <div className="text-xs font-medium">
                    {DAY_NAMES[date.getDay()]}
                  </div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-3">
          {mealsForDay.map((meal) => {
            const isCompleted = completedToday.includes(meal.meal_number)

            return (
              <button
                key={meal.meal_number}
                onClick={() => handleMealToggle(meal.meal_number)}
                className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${
                  isCompleted
                    ? 'bg-success/10 border-success/30'
                    : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-success/20' : 'bg-primary/10'}`}>
                    <Utensils className={`w-5 h-5 ${isCompleted ? 'text-success' : 'text-primary'}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{meal.meal_name}</h3>
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {meal.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{meal.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>{meal.calories} kcal</span>
                      </div>
                      <span className="text-muted-foreground">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Stats */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <h3 className="font-bold mb-3">Днес</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Изядени хранения</span>
              <span className="font-medium">{completedToday.length}/{mealsForDay.length}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(completedToday.length / mealsForDay.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
