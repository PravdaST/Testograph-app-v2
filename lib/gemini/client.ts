import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Get Gemini model instance
 */
export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
}

/**
 * Generate meal substitution using Gemini
 */
export async function generateMealSubstitution(params: {
  currentMealName: string
  calories: number
  protein: number
  carbs: number
  fats: number
  mealNumber: number
  time: string
  dietaryPreference: 'omnivor' | 'vegetarian' | 'vegan' | 'pescatarian'
}) {
  const model = getGeminiModel()

  const prompt = `Генерирай ново българско хранене като алтернатива на "${params.currentMealName}".

ВАЖНИ ИЗИСКВАНИЯ:
- Калории: ${params.calories} kcal (±50 kcal е допустимо)
- Протеин: ${params.protein}г (±3г)
- Въглехидрати: ${params.carbs}г (±5г)
- Мазнини: ${params.fats}г (±3г)
- Диетарно предпочитание: ${params.dietaryPreference}
- Време на деня: ${params.time} (Хранене ${params.mealNumber})
- Храната трябва да е РАЗЛИЧНА от "${params.currentMealName}"
- Използвай български съставки и традиционни български рецепти където е възможно

Отговори САМО със JSON в следния формат (без markdown, без обяснения):
{
  "name": "Име на храната на български",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "ingredients": [
    {
      "name": "име на съставка",
      "quantity": "количество с мярка",
      "calories": number
    }
  ],
  "recipe": {
    "total_time": number,
    "difficulty": "easy" | "medium" | "hard",
    "steps": [
      "Стъпка 1 на български",
      "Стъпка 2 на български"
    ],
    "tips": [
      "Съвет 1",
      "Съвет 2"
    ],
    "special_notes": "Специални бележки ако има"
  }
}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()

    const meal = JSON.parse(cleanText)
    return meal
  } catch (error) {
    console.error('Error generating meal substitution:', error)
    throw new Error('Failed to generate meal substitution')
  }
}
