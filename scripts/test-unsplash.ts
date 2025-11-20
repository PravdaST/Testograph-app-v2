/**
 * Test Unsplash API for meal images
 * Check if we can find good quality images for Bulgarian meals
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

// Test with variety of Bulgarian meals
const TEST_MEALS = [
  'Овесена каша с боровинки и ленено семе',
  'Пиле с кафяв ориз и зеленчуци',
  'Сьомга с киноа и аспержи',
  'Протеинови палачинки с плодове',
  'Говеждо със зеленчуци',
  'Бъркани яйца с авокадо',
  'Скумрия с картофи и салата',
  'Омлет със спанак и сирене',
]

async function searchUnsplash(query: string) {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('UNSPLASH_ACCESS_KEY not found in .env.local')
  }

  const searchQuery = translateToEnglish(query)
  console.log(`\n🔍 Searching for: "${query}"`)
  console.log(`   English query: "${searchQuery}"`)

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    searchQuery
  )}&per_page=5&orientation=landscape`

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`❌ Error: ${error}`)
    return null
  }

  const data = await response.json()

  if (data.results && data.results.length > 0) {
    console.log(`✅ Found ${data.results.length} images`)
    const topResult = data.results[0]
    console.log(`   📸 Best match: ${topResult.description || topResult.alt_description || 'No description'}`)
    console.log(`   👤 By: ${topResult.user.name}`)
    console.log(`   🔗 URL: ${topResult.urls.regular}`)
    console.log(`   ❤️  Likes: ${topResult.likes}`)
    return topResult
  } else {
    console.log(`❌ No results found`)
    return null
  }
}

/**
 * Translate Bulgarian meal name to English search query
 * Simplified translation focusing on main ingredients
 */
function translateToEnglish(bulgarianMeal: string): string {
  const translations: Record<string, string> = {
    // Grains & Carbs
    'овесена каша': 'oatmeal',
    'овес': 'oats',
    'кафяв ориз': 'brown rice',
    'бял ориз': 'white rice',
    'ориз': 'rice',
    'киноа': 'quinoa',
    'булгур': 'bulgur',
    'паста': 'pasta',
    'макарони': 'pasta',
    'картофи': 'potatoes',
    'картофено пюре': 'mashed potatoes',
    'сладък картоф': 'sweet potato',
    'батат': 'sweet potato',
    'палачинки': 'pancakes',
    'тост': 'toast',
    'хляб': 'bread',

    // Proteins
    'пиле': 'chicken',
    'пилешки': 'chicken',
    'пилешко': 'chicken',
    'говеждо': 'beef',
    'говежди': 'beef',
    'телешко': 'veal',
    'телешки': 'veal',
    'агнешко': 'lamb',
    'пуешко': 'turkey',
    'пуешки': 'turkey',
    'сьомга': 'salmon',
    'скумрия': 'mackerel',
    'риба тон': 'tuna',
    'тон': 'tuna',
    'риба': 'fish',
    'сардини': 'sardines',
    'сафрид': 'sprats fish',
    'скариди': 'shrimp',
    'яйца': 'eggs',
    'яйце': 'egg',
    'омлет': 'omelet',
    'бъркани яйца': 'scrambled eggs',
    'протеин': 'protein',
    'протеинов': 'protein',

    // Vegetables
    'зеленчуци': 'vegetables',
    'броколи': 'broccoli',
    'спанак': 'spinach',
    'аспержи': 'asparagus',
    'моркови': 'carrots',
    'домати': 'tomatoes',
    'авокадо': 'avocado',
    'салата': 'salad',
    'гъби': 'mushrooms',
    'чушки': 'peppers',
    'зелен фасул': 'green beans',

    // Fruits & Nuts
    'банан': 'banana',
    'ябълка': 'apple',
    'боровинки': 'blueberries',
    'ягоди': 'strawberries',
    'плодове': 'fruit',
    'портокал': 'orange',
    'орехи': 'walnuts',
    'бадеми': 'almonds',
    'кашу': 'cashew',
    'бразилски орехи': 'brazil nuts',
    'лешници': 'hazelnuts',

    // Dairy
    'кисело мляко': 'yogurt',
    'извара': 'cottage cheese',
    'сирене': 'cheese',
    'мляко': 'milk',

    // Other
    'смути': 'smoothie',
    'супа': 'soup',
    'на фурна': 'baked',
    'на скара': 'grilled',
    'печени': 'roasted',
    'варени': 'boiled',
  }

  let english = bulgarianMeal.toLowerCase()

  // Replace Bulgarian words with English
  for (const [bg, en] of Object.entries(translations)) {
    english = english.replace(new RegExp(bg, 'g'), en)
  }

  // Clean up and focus on main ingredients
  english = english
    .replace(/\s+с\s+/g, ' ') // Remove "с" (with)
    .replace(/\s+и\s+/g, ' ') // Remove "и" (and)
    .replace(/\s+от\s+/g, ' ')
    .replace(/\s+за\s+/g, ' ')
    .trim()

  // Keep only first 3-4 words for better search
  const words = english.split(/\s+/).filter((w) => w.length > 0)
  return words.slice(0, 4).join(' ')
}

async function main() {
  console.log('🖼️  Unsplash API Test\n')
  console.log('Testing with sample Bulgarian meals...')
  console.log('=' .repeat(60))

  let successCount = 0
  let failCount = 0

  for (const meal of TEST_MEALS) {
    const result = await searchUnsplash(meal)
    if (result) {
      successCount++
    } else {
      failCount++
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Results:')
  console.log(`   ✅ Success: ${successCount}/${TEST_MEALS.length}`)
  console.log(`   ❌ Failed: ${failCount}/${TEST_MEALS.length}`)
  console.log(`   📈 Success rate: ${((successCount / TEST_MEALS.length) * 100).toFixed(1)}%`)

  if (successCount < TEST_MEALS.length * 0.7) {
    console.log('\n⚠️  Warning: Low success rate!')
    console.log('   Consider using AI image generation instead (DALL-E 3 or Stable Diffusion)')
  } else {
    console.log('\n✅ Good success rate! Unsplash is a viable option.')
  }
}

main().catch(console.error)
