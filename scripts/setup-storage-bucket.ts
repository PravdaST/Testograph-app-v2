/**
 * Setup Supabase Storage Bucket for meal images
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function setupBucket() {
  console.log('🪣 Setting up Supabase Storage bucket...\n')

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Create bucket
  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('❌ Error listing buckets:', listError)
    return
  }

  const bucketExists = existingBuckets?.some((b) => b.name === 'meal-images')

  if (bucketExists) {
    console.log('✅ Bucket "meal-images" already exists')
  } else {
    console.log('Creating bucket "meal-images"...')
    const { data, error } = await supabase.storage.createBucket('meal-images', {
      public: true,
      fileSizeLimit: 512000, // 500KB max
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    })

    if (error) {
      console.error('❌ Error creating bucket:', error)
      return
    }

    console.log('✅ Bucket created successfully')
  }

  // Set bucket policy to public read
  console.log('\n📋 Setting bucket policy...')
  console.log('⚠️  Please ensure the bucket has public read access in Supabase Dashboard:')
  console.log('   1. Go to: https://supabase.com/dashboard/project/mrpsaqtmucxpawajfxfn/storage/buckets')
  console.log('   2. Click on "meal-images" bucket')
  console.log('   3. Go to "Policies" tab')
  console.log('   4. Add policy: "Enable read access for all users"')
  console.log('      SQL: SELECT, public = true\n')
}

setupBucket().catch(console.error)
