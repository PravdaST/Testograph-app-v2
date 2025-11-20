/**
 * Generate AI meal images using OpenRouter Gemini 2.5 Flash Image
 *
 * This script:
 * 1. Extracts all unique meal names from meal plan files
 * 2. Generates realistic food images via OpenRouter API
 * 3. Optimizes images with sharp (resize, compress)
 * 4. Uploads to Supabase Storage
 * 5. Creates a mapping file for meal name -> image URL
 */

import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const OUTPUT_DIR = path.join(process.cwd(), 'generated-meal-images')
const OPTIMIZED_DIR = path.join(OUTPUT_DIR, 'optimized')
const MAPPING_FILE = path.join(process.cwd(), 'lib/data/meal-images-mapping.json')

// Image settings
const IMAGE_WIDTH = 800
const IMAGE_HEIGHT = 600
const IMAGE_QUALITY = 85
const MAX_FILE_SIZE_KB = 150 // Target max file size
const TEST_LIMIT = 0 // 0 = generate all images

interface MealImage {
  name: string
  slug: string
  imageUrl: string
  localPath?: string
}

/**
 * Extract all unique meal names from meal plan files
 */
async function extractMealNames(): Promise<string[]> {
  const mealPlanDir = path.join(process.cwd(), 'lib/data')
  const mealPlanFiles = fs
    .readdirSync(mealPlanDir)
    .filter((f) => f.startsWith('mock-meal-plan-') && f.endsWith('.ts'))

  const mealNames = new Set<string>()

  for (const file of mealPlanFiles) {
    const filePath = path.join(mealPlanDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Extract meal names using regex
    const nameMatches = content.matchAll(/\s+name:\s*['"]([^'"]+)['"]/g)
    for (const match of nameMatches) {
      const name = match[1]
      // Skip ingredient names (they're usually shorter and don't start with capital)
      if (
        name.length > 10 &&
        !name.match(/^\d/) &&
        !name.match(/^(г|мл|с\.л\.|ч\.л\.)/)
      ) {
        mealNames.add(name)
      }
    }
  }

  return Array.from(mealNames).sort()
}

/**
 * Create a URL-safe slug from meal name
 * Transliterates Bulgarian Cyrillic to Latin characters
 */
function createSlug(name: string): string {
  // Bulgarian to Latin transliteration map
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
    'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya'
  }

  return name
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Generate food image using OpenRouter Google Gemini 2.5 Flash Image
 */
async function generateImage(mealName: string): Promise<Buffer | null> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in .env')
  }

  // Enhanced prompt for realistic food photography
  const prompt = `Create a professional food photography image of "${mealName}".
Requirements:
- High quality, photorealistic food photography
- Appetizing presentation on a white ceramic plate
- Natural daylight lighting from above
- Overhead view (top-down angle)
- Restaurant-style professional plating
- Vibrant, natural colors
- Sharp focus on the food
- Clean, minimal background
- Food should look fresh and delicious

Style: Professional food magazine photography, similar to Bon Appétit or Jamie Oliver cookbooks.`

  try {
    console.log(`  🎨 Generating image for: ${mealName}`)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://testograph.com',
        'X-Title': 'Testograph Meal Images',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        // Add image generation parameters if supported
        max_tokens: 4096,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`  ❌ API Error (${response.status}): ${errorText}`)
      return null
    }

    const data = await response.json()
    console.log(`  📦 Response received`)

    // Gemini 2.5 Flash Image returns images in message.images array
    if (data.choices && data.choices[0]?.message?.images && data.choices[0].message.images.length > 0) {
      const imageData = data.choices[0].message.images[0]

      if (imageData.image_url && imageData.image_url.url) {
        const imageUrl = imageData.image_url.url

        // Check if it's a base64 data URL
        if (imageUrl.startsWith('data:image/')) {
          console.log(`  📥 Found base64 encoded image`)
          const base64Data = imageUrl.split(',')[1]
          const buffer = Buffer.from(base64Data, 'base64')
          console.log(`  ✅ Decoded ${(buffer.length / 1024).toFixed(1)}KB`)
          return buffer
        }

        // Otherwise it's a URL to download
        console.log(`  📥 Downloading from URL: ${imageUrl}`)
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          console.error(`  ❌ Failed to download image (${imageResponse.status})`)
          return null
        }

        const arrayBuffer = await imageResponse.arrayBuffer()
        console.log(`  ✅ Downloaded ${(arrayBuffer.byteLength / 1024).toFixed(1)}KB`)
        return Buffer.from(arrayBuffer)
      }
    }

    console.error(`  ❌ No image found in response`)
    console.error(`  Response structure:`, JSON.stringify(data, null, 2).substring(0, 500))
    return null
  } catch (error) {
    console.error(`  ❌ Error generating image:`, error)
    return null
  }
}

/**
 * Optimize image with sharp
 */
async function optimizeImage(
  inputBuffer: Buffer,
  outputPath: string
): Promise<void> {
  await sharp(inputBuffer)
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({
      quality: IMAGE_QUALITY,
      progressive: true,
      mozjpeg: true,
    })
    .toFile(outputPath)

  // Check file size and compress more if needed
  const stats = fs.statSync(outputPath)
  const sizeKB = stats.size / 1024

  if (sizeKB > MAX_FILE_SIZE_KB) {
    console.log(`  🔄 Image too large (${sizeKB.toFixed(0)}KB), compressing more...`)
    const newQuality = Math.floor(IMAGE_QUALITY * (MAX_FILE_SIZE_KB / sizeKB))
    await sharp(inputBuffer)
      .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: Math.max(newQuality, 60),
        progressive: true,
        mozjpeg: true,
      })
      .toFile(outputPath)

    const newStats = fs.statSync(outputPath)
    const newSizeKB = newStats.size / 1024
    console.log(`  ✅ Compressed to ${newSizeKB.toFixed(0)}KB`)
  } else {
    console.log(`  ✅ Optimized image: ${sizeKB.toFixed(0)}KB`)
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadToSupabase(
  filePath: string,
  slug: string
): Promise<string | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const fileBuffer = fs.readFileSync(filePath)
  const fileName = `${slug}.jpg`

  const { data, error } = await supabase.storage
    .from('meal-images')
    .upload(fileName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (error) {
    console.error(`  ❌ Upload failed:`, error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('meal-images').getPublicUrl(fileName)

  console.log(`  ✅ Uploaded to Supabase: ${publicUrl}`)
  return publicUrl
}

/**
 * Main execution
 */
async function main() {
  console.log('🍽️  Meal Image Generator\n')
  console.log('=' .repeat(60))

  // Create output directories
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true })
  }

  // Extract meal names
  console.log('\n📋 Extracting meal names...')
  const mealNames = await extractMealNames()
  console.log(`✅ Found ${mealNames.length} unique meals\n`)

  // Load existing mapping if it exists
  let existingMapping: Record<string, MealImage> = {}
  if (fs.existsSync(MAPPING_FILE)) {
    existingMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'))
    console.log(`📂 Loaded ${Object.keys(existingMapping).length} existing mappings\n`)
  }

  const mealImages: Record<string, MealImage> = { ...existingMapping }
  let generated = 0
  let skipped = 0
  let failed = 0

  // Process each meal (limited to TEST_LIMIT for testing, 0 = all)
  const mealsToProcess = TEST_LIMIT > 0 ? mealNames.slice(0, TEST_LIMIT) : mealNames
  if (TEST_LIMIT > 0) {
    console.log(`\n🎯 Processing first ${TEST_LIMIT} meals for testing\n`)
  } else {
    console.log(`\n🎯 Processing all ${mealNames.length} meals\n`)
  }

  for (let i = 0; i < mealsToProcess.length; i++) {
    const mealName = mealsToProcess[i]
    const slug = createSlug(mealName)

    console.log(`\n[${i + 1}/${mealsToProcess.length}] ${mealName}`)

    // Skip if already exists
    if (existingMapping[slug]) {
      console.log(`  ⏭️  Already exists, skipping...`)
      skipped++
      continue
    }

    // Generate image
    const imageBuffer = await generateImage(mealName)
    if (!imageBuffer) {
      failed++
      continue
    }

    // Save raw image
    const rawPath = path.join(OUTPUT_DIR, `${slug}-raw.jpg`)
    fs.writeFileSync(rawPath, imageBuffer)

    // Optimize image
    const optimizedPath = path.join(OPTIMIZED_DIR, `${slug}.jpg`)
    await optimizeImage(imageBuffer, optimizedPath)

    // Upload to Supabase
    const publicUrl = await uploadToSupabase(optimizedPath, slug)
    if (!publicUrl) {
      failed++
      continue
    }

    // Save to mapping
    mealImages[slug] = {
      name: mealName,
      slug,
      imageUrl: publicUrl,
      localPath: optimizedPath,
    }

    generated++

    // Save mapping after each successful generation
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mealImages, null, 2))

    // Rate limiting (to avoid hitting API limits)
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  // Final summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary:')
  console.log(`   Total meals found: ${mealNames.length}`)
  console.log(`   Processed (test): ${mealsToProcess.length}`)
  console.log(`   ✅ Generated: ${generated}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`\n📁 Mapping saved to: ${MAPPING_FILE}`)
  console.log('=' .repeat(60))
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
