'use client'

/**
 * Nutrition Page - Bento Grid Layout
 * Modern meal plan tracking with Bento Grid design
 * Now with dietary preference substitutions
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Utensils, Flame, TrendingUp, Award, Info, X, Leaf } from 'lucide-react'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar'
import { MealCard } from '@/components/dashboard/MealCard'
import { applyDaySubstitutions, type SubstitutedMeal, type SubstitutedIngredient } from '@/lib/utils/dietary-substitution'
import type { DietaryPreference } from '@/lib/data/dietary-substitutions'

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
  program_start_date?: string
  dietary_preference?: DietaryPreference
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

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
  const [programStartDate, setProgramStartDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [completedMeals, setCompletedMeals] = useState<Record<string, number[]>>({})
  const [activeTooltip, setActiveTooltip] = useState<'hero' | 'progress' | 'calories' | 'protein' | null>(null)
  const [substitutedMeals, setSubstitutedMeals] = useState<Record<string, Record<number, SubstitutedMeal>>>({})
  const [substitutingMeals, setSubstitutingMeals] = useState<Record<string, boolean>>({})

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

          // Set program start date
          if (data.program_start_date) {
            setProgramStartDate(new Date(data.program_start_date))
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

  // Load meals and substitutions for selected date
  useEffect(() => {
    const loadMealsForDate = async () => {
      const email = localStorage.getItem('quizEmail')
      if (!email) return

      const dateKey = selectedDate.toISOString().split('T')[0]

      // Load completed meals
      const mealsResponse = await fetch(`/api/meals/complete?email=${encodeURIComponent(email)}&date=${dateKey}`)
      if (mealsResponse.ok) {
        const mealsData = await mealsResponse.json()
        setCompletedMeals(prev => ({
          ...prev,
          [dateKey]: mealsData.completedMeals || []
        }))
      }

      // Load meal substitutions
      const subsResponse = await fetch(`/api/meals/substitutions?email=${encodeURIComponent(email)}&date=${dateKey}`)
      if (subsResponse.ok) {
        const subsData = await subsResponse.json()
        setSubstitutedMeals(prev => ({
          ...prev,
          [dateKey]: subsData.substitutions || {}
        }))
      }
    }

    loadMealsForDate()
  }, [selectedDate])

  const handleMealToggle = async (mealNumber: number) => {
    const email = localStorage.getItem('quizEmail')
    if (!email) return

    const dateKey = selectedDate.toISOString().split('T')[0]
    const currentMeals = completedMeals[dateKey] || []
    const isCompleted = currentMeals.includes(mealNumber)

    try {
      // Always send POST request - API will toggle the state
      const response = await fetch('/api/meals/complete', {
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

      if (!response.ok) {
        throw new Error('Failed to toggle meal')
      }

      // Update local state based on previous state
      if (isCompleted) {
        // Was completed, now uncomplete
        setCompletedMeals({
          ...completedMeals,
          [dateKey]: currentMeals.filter(m => m !== mealNumber)
        })
      } else {
        // Was not completed, now complete
        setCompletedMeals({
          ...completedMeals,
          [dateKey]: [...currentMeals, mealNumber]
        })
      }
    } catch (error) {
      console.error('Error toggling meal:', error)
      alert('Не успяхме да запазим промяната. Моля опитайте отново.')
    }
  }

  const handleUndo = async (mealNumber: number) => {
    const email = localStorage.getItem('quizEmail')
    if (!email) return

    const dateKey = selectedDate.toISOString().split('T')[0]

    try {
      // Delete substitution from database
      const response = await fetch(
        `/api/meals/substitutions?email=${encodeURIComponent(email)}&date=${dateKey}&mealNumber=${mealNumber}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to undo substitution')
      }

      // Remove substituted meal to restore original
      setSubstitutedMeals(prev => {
        const updated = { ...prev }
        if (updated[dateKey]) {
          const { [mealNumber]: _removed, ...rest } = updated[dateKey]
          if (Object.keys(rest).length === 0) {
            delete updated[dateKey]
          } else {
            updated[dateKey] = rest
          }
        }
        return updated
      })
    } catch (error) {
      console.error('Error undoing substitution:', error)
      alert('Не успяхме да възстановим оригиналната храна. Моля опитайте отново.')
    }
  }

  const handleSubstitute = async (meal: SubstitutedMeal) => {
    if (!userProgram) return

    const dateKey = selectedDate.toISOString().split('T')[0]
    const mealKey = `${dateKey}-${meal.meal_number}`

    // Set loading state
    setSubstitutingMeals(prev => ({ ...prev, [mealKey]: true }))

    try {
      const response = await fetch('/api/meals/substitute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentMealName: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          mealNumber: meal.meal_number,
          time: meal.time,
          dietaryPreference: userProgram.dietary_preference || 'omnivor',
          category: userProgram.category,
          level: userProgram.level,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to substitute meal')
      }

      const data = await response.json()
      const newMeal: SubstitutedMeal = {
        meal_number: meal.meal_number,
        time: meal.time,
        name: data.meal.name,
        calories: data.meal.calories,
        protein: data.meal.protein,
        carbs: data.meal.carbs,
        fats: data.meal.fats,
        ingredients: data.meal.ingredients.map((ing: SubstitutedIngredient) => ({
          ...ing,
          substituted: true,
        })),
        recipe: data.meal.recipe,
        substitution_count: (meal.substitution_count || 0) + 1,
        name_updated: true,
      }

      // Save substitution to database
      const email = localStorage.getItem('quizEmail')
      if (email) {
        await fetch('/api/meals/substitutions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            date: dateKey,
            mealNumber: meal.meal_number,
            substitutedMeal: newMeal,
          }),
        })
      }

      // Update substituted meals state
      setSubstitutedMeals(prev => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [meal.meal_number]: newMeal,
        },
      }))
    } catch (error) {
      console.error('Error substituting meal:', error)
      alert('Не успяхме да заменим храната. Моля опитайте отново.')
    } finally {
      // Clear loading state
      setSubstitutingMeals(prev => {
        const updated = { ...prev }
        delete updated[mealKey]
        return updated
      })
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
  const originalMeals = dayData?.meals || []

  // Apply dietary substitutions if needed
  const dietaryPreference = userProgram.dietary_preference || 'omnivor'
  const baseMeals: SubstitutedMeal[] = dietaryPreference !== 'omnivor'
    ? applyDaySubstitutions(originalMeals, dietaryPreference)
    : originalMeals.map(meal => ({
        ...meal,
        substitution_count: 0,
        name_updated: false,
        ingredients: meal.ingredients.map(ing => ({
          ...ing,
          substituted: false
        }))
      }))

  const dateKey = selectedDate.toISOString().split('T')[0]

  // Merge AI-substituted meals
  const substitutedForToday = substitutedMeals[dateKey] || {}
  const mealsForDay: SubstitutedMeal[] = baseMeals.map(meal =>
    substitutedForToday[meal.meal_number] || meal
  )

  const completedToday = completedMeals[dateKey] || []

  // Calculate total calories and protein
  const totalCalories = mealsForDay
    .filter(meal => completedToday.includes(meal.meal_number))
    .reduce((sum, meal) => sum + meal.calories, 0)

  const totalProtein = mealsForDay
    .filter(meal => completedToday.includes(meal.meal_number))
    .reduce((sum, meal) => sum + meal.protein, 0)

  // Dietary preference display names
  const dietaryPreferenceNames: Record<DietaryPreference, string> = {
    omnivor: 'Omnivore',
    pescatarian: 'Pescatarian',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan'
  }

  const hasDietarySubstitutions = dietaryPreference !== 'omnivor'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted safe-area-inset">
      <TopNav
        programName={programName}
        userName={userName}
        profilePictureUrl={userProgram?.profile_picture_url}
      />

      <div className="container-mobile py-6 pb-24 space-y-4">
        {/* Dietary Preference Badge (if active) */}
        {hasDietarySubstitutions && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
            <div className="p-2 rounded-lg bg-green-100">
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">
                {dietaryPreferenceNames[dietaryPreference]} План
              </p>
              <p className="text-xs text-green-700">
                Съставките са адаптирани според твоите предпочитания
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div
          className="relative bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30 animate-fade-in"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
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
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveTooltip(activeTooltip === 'hero' ? null : 'hero')
            }}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted/50 transition-colors"
          >
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
          {activeTooltip === 'hero' && typeof window !== 'undefined' && createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 z-[99998] animate-fade-in"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(null)
                }}
              />
              <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 p-4 bg-white border-2 border-primary/20 rounded-xl shadow-2xl z-[99999] animate-fade-in">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-bold text-foreground">Хранителен план</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTooltip(null)
                    }}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Персонализиран хранителен план според твоята цел и ниво. Всеки ден получаваш балансирани хранения с точни калории и макрос.
                </p>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* Weekly Calendar */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <WeeklyCalendar
            programStartDate={programStartDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Bento Grid - Stats */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {/* Meals Progress (2x1) */}
          <div
            className="relative col-span-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-5 border-2 border-primary/30 animate-fade-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Прогрес</h3>
            </div>

            <div className="text-4xl font-bold text-primary mb-2">
              {completedToday.length}/{mealsForDay.length}
            </div>
            <div className="text-xs text-muted-foreground mb-3">Изядени хранения</div>

            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(completedToday.length / mealsForDay.length) * 100}%` }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'progress' ? null : 'progress')
              }}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'progress' && typeof window !== 'undefined' && createPortal(
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-[99998] animate-fade-in"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTooltip(null)
                  }}
                />
                <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 p-4 bg-white border-2 border-primary/20 rounded-xl shadow-2xl z-[99999] animate-fade-in">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-sm font-bold text-foreground">Прогрес на хранения</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTooltip(null)
                      }}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Проследи колко хранения си завършил за избрания ден. Маркирай всяко хранене като завършено, за да следиш прогреса си.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Calories (1x1) */}
          <div
            className="relative bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <Flame className="w-5 h-5 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1">{totalCalories}</div>
            <div className="text-xs text-muted-foreground">Калории</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'calories' ? null : 'calories')
              }}
              className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'calories' && typeof window !== 'undefined' && createPortal(
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-[99998] animate-fade-in"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTooltip(null)
                  }}
                />
                <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 p-4 bg-white border-2 border-primary/20 rounded-xl shadow-2xl z-[99999] animate-fade-in">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-sm font-bold text-foreground">Дневни калории</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTooltip(null)
                      }}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Общ брой калории от завършените хранения за избрания ден. Помага ти да поддържаш енергийния си баланс.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Protein (1x1) */}
          <div
            className="relative bg-background rounded-2xl p-4 border border-border animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <Award className="w-5 h-5 text-primary mb-2" />
            <div className="text-3xl font-bold text-primary mb-1">{totalProtein}g</div>
            <div className="text-xs text-muted-foreground">Протеин</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveTooltip(activeTooltip === 'protein' ? null : 'protein')
              }}
              className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </button>
            {activeTooltip === 'protein' && typeof window !== 'undefined' && createPortal(
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-[99998] animate-fade-in"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTooltip(null)
                  }}
                />
                <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 p-4 bg-white border-2 border-primary/20 rounded-xl shadow-2xl z-[99999] animate-fade-in">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-sm font-bold text-foreground">Дневен протеин</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTooltip(null)
                      }}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Общо грамове протеин от завършените хранения. Протеинът е ключов за производството на тестостерон и мускулната маса.
                  </p>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-3">
          <h3
            className="font-bold text-lg px-1 animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            Твоите хранения
          </h3>

          {mealsForDay.map((meal, index) => {
            const isCompleted = completedToday.includes(meal.meal_number)

            return (
              <div
                key={meal.meal_number}
                className="animate-fade-in"
                style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'both' }}
              >
                <MealCard
                  mealNumber={meal.meal_number}
                  time={meal.time}
                  name={meal.name}
                  calories={meal.calories}
                  protein={meal.protein}
                  carbs={meal.carbs}
                  fats={meal.fats}
                  ingredients={meal.ingredients}
                  recipe={meal.recipe}
                  isCompleted={isCompleted}
                  onToggleComplete={() => handleMealToggle(meal.meal_number)}
                  onSubstitute={() => handleSubstitute(meal)}
                  onUndo={() => handleUndo(meal.meal_number)}
                  isSubstituting={substitutingMeals[`${dateKey}-${meal.meal_number}`] || false}
                  isSubstituted={!!substitutedForToday[meal.meal_number]}
                />
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
