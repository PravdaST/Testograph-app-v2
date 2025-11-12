import { NextRequest, NextResponse } from 'next/server'
import { generateMealSubstitution } from '@/lib/gemini/client'
import { findMealSubstitute } from '@/lib/utils/meal-substitution'
import { applyDaySubstitutions, type SubstitutedMeal, type DietaryPreference } from '@/lib/utils/dietary-substitution'

// Import meal plans
import { ENERGY_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-low'
import { LIBIDO_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-low'
import { MUSCLE_LOW_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-low'
import { ENERGY_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-normal'
import { LIBIDO_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-normal'
import { MUSCLE_NORMAL_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-normal'
import { ENERGY_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-energy-high'
import { LIBIDO_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-libido-high'
import { MUSCLE_HIGH_MEAL_PLAN } from '@/lib/data/mock-meal-plan-muscle-high'

// Helper to get meal plan
function getMealPlan(category: string, level: string) {
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

/**
 * POST /api/meals/substitute
 * Find alternative meal from existing meal plan, fallback to Gemini AI if needed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      currentMealName,
      calories,
      protein,
      carbs,
      fats,
      mealNumber,
      time,
      dietaryPreference,
      category,
      level,
    } = body

    // Validate required fields
    if (
      !currentMealName ||
      !calories ||
      !protein ||
      !carbs ||
      !fats ||
      !mealNumber ||
      !time ||
      !category ||
      !level
    ) {
      return NextResponse.json(
        { error: 'All meal parameters are required' },
        { status: 400 }
      )
    }

    // Validate dietary preference
    const validPreferences: DietaryPreference[] = ['omnivor', 'vegetarian', 'vegan', 'pescatarian']
    if (!dietaryPreference || !validPreferences.includes(dietaryPreference as DietaryPreference)) {
      return NextResponse.json(
        { error: 'Invalid dietary preference' },
        { status: 400 }
      )
    }

    // Create current meal object
    const currentMeal: SubstitutedMeal = {
      meal_number: mealNumber,
      time,
      name: currentMealName,
      calories,
      protein,
      carbs,
      fats,
      ingredients: [],
      substitution_count: 0,
      name_updated: false,
    }

    // Get meal plan for user's category and level
    const originalMealPlan = getMealPlan(category, level)
    const validPreference = dietaryPreference as DietaryPreference

    // Apply dietary substitutions to the entire meal plan first
    // This ensures we only search among compatible meals
    const processedMealPlan = {
      ...originalMealPlan,
      meals: originalMealPlan.meals.map(day => ({
        ...day,
        meals: validPreference !== 'omnivor'
          ? applyDaySubstitutions(day.meals, validPreference)
          : day.meals.map(meal => ({
              ...meal,
              substitution_count: 0,
              name_updated: false,
              ingredients: meal.ingredients.map(ing => ({
                ...ing,
                substituted: false
              }))
            }))
      }))
    }

    // Try to find substitute from dietary-compatible meals
    const substitute = findMealSubstitute(currentMeal, processedMealPlan)

    if (substitute) {
      // Found a suitable substitute (already dietary-compatible)
      return NextResponse.json({
        success: true,
        source: 'existing',
        meal: {
          name: substitute.name,
          calories: substitute.calories,
          protein: substitute.protein,
          carbs: substitute.carbs,
          fats: substitute.fats,
          ingredients: substitute.ingredients,
          recipe: substitute.recipe,
        },
      })
    }

    // Fallback: No suitable meal found, use Gemini AI
    console.log('No suitable substitute found in meal plan, using Gemini AI')

    const substitutedMeal = await generateMealSubstitution({
      currentMealName,
      calories,
      protein,
      carbs,
      fats,
      mealNumber,
      time,
      dietaryPreference,
    })

    return NextResponse.json({
      success: true,
      source: 'ai',
      meal: substitutedMeal,
    })
  } catch (error) {
    console.error('Error in meals/substitute POST:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate meal substitution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
