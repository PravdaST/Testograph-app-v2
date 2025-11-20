/**
 * Test single image generation with google/gemini-2.5-flash-image
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import sharp from 'sharp'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

async function testGeneration() {
  console.log('🧪 Testing google/gemini-2.5-flash-image\n')

  const testMeal = 'Пиле с кафяв ориз и зеленчуци'

  const prompt = `Create a professional food photography image of "${testMeal}".
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

  console.log(`📝 Meal: ${testMeal}`)
  console.log(`🎨 Generating with google/gemini-2.5-flash-image...`)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://testograph.com',
        'X-Title': 'Testograph Meal Images Test',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ API Error (${response.status}):`)
      console.error(errorText)
      return
    }

    const data = await response.json()
    console.log(`✅ Response received`)
    console.log('\n📦 Full Response:')
    console.log(JSON.stringify(data, null, 2))

    // Gemini 2.5 Flash Image returns images in message.images array
    if (data.choices && data.choices[0]?.message?.images && data.choices[0].message.images.length > 0) {
      console.log(`\n📥 Found ${data.choices[0].message.images.length} image(s)`)
      const imageData = data.choices[0].message.images[0]

      if (imageData.image_url && imageData.image_url.url) {
        const imageUrl = imageData.image_url.url

        // Check if it's a base64 data URL
        if (imageUrl.startsWith('data:image/')) {
          console.log(`📥 Processing base64 encoded image`)
          const base64Data = imageUrl.split(',')[1]
          const buffer = Buffer.from(base64Data, 'base64')
          console.log(`📊 Size: ${(buffer.length / 1024).toFixed(1)}KB`)

          const testDir = path.join(process.cwd(), 'test-images')
          if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true })
          }

          const rawPath = path.join(testDir, 'test-meal-raw.png')
          const optimizedPath = path.join(testDir, 'test-meal-optimized.jpg')

          fs.writeFileSync(rawPath, buffer)
          console.log(`✅ Saved raw image: ${rawPath}`)

          // Optimize
          await sharp(buffer)
            .resize(800, 600, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85, progressive: true, mozjpeg: true })
            .toFile(optimizedPath)

          const optimizedStats = fs.statSync(optimizedPath)
          console.log(`✅ Saved optimized image: ${optimizedPath}`)
          console.log(`📊 Optimized size: ${(optimizedStats.size / 1024).toFixed(1)}KB`)
          console.log(`\n🎉 SUCCESS! Check the images in the test-images folder`)
          return
        }

        // Otherwise it's a URL to download
        console.log(`📥 Downloading from URL: ${imageUrl}`)
        const imageResponse = await fetch(imageUrl)
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          const testDir = path.join(process.cwd(), 'test-images')
          if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true })
          }

          const rawPath = path.join(testDir, 'test-meal-raw.jpg')
          const optimizedPath = path.join(testDir, 'test-meal-optimized.jpg')

          fs.writeFileSync(rawPath, buffer)
          console.log(`✅ Saved raw image: ${rawPath}`)

          await sharp(buffer)
            .resize(800, 600, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85, progressive: true, mozjpeg: true })
            .toFile(optimizedPath)

          console.log(`✅ Saved optimized image: ${optimizedPath}`)
          console.log(`\n🎉 SUCCESS! Check the images in the test-images folder`)
          return
        }
      }
    }

    console.error('\n❌ Could not find image in response')
    console.error('The model might not support image generation, or the response format is different.')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testGeneration()
