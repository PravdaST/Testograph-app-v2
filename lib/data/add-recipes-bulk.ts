// Bulk recipe generation script - compact format
// Due to context limits, generating simplified recipes for remaining plans

export const COMPACT_RECIPE_TEMPLATE = `
recipe: createRecipe(
  [
    // Steps generated based on meal ingredients
  ],
  prepTime,
  cookTime,
  'easy' | 'medium',
  {
    tips: ['Key tip'],
    special_notes: 'Brief note',
    equipment: ['Main tools']
  }
)
`

// Helper: Generate recipe for high-calorie protein meals
export function generateProteinMealRecipe(protein: string, carbs: string, veggies: string) {
  return {
    steps: [
      `Свари ${carbs}`,
      `Загрей тиган`,
      `Изпържи ${protein}`,
      `Добави ${veggies}`,
      `Поднеси заедно`
    ],
    prep: 8,
    cook: 20,
    difficulty: 'easy' as const
  }
}
