/**
 * Script to check if user exists in Supabase Auth
 * and create them if missing
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function checkAndCreateUser(email: string, password: string) {
  console.log(`\n🔍 Checking user: ${email}`)

  // 1. Check if user exists in Auth
  const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    console.error('❌ Error listing users:', listError)
    return
  }

  const existingAuthUser = authUsers.users.find((u) => u.email === email)

  if (existingAuthUser) {
    console.log(`✅ User exists in Supabase Auth`)
    console.log(`   User ID: ${existingAuthUser.id}`)
    console.log(`   Email confirmed: ${existingAuthUser.email_confirmed_at ? 'Yes' : 'No'}`)
    console.log(`   Created at: ${existingAuthUser.created_at}`)

    // Update password if needed
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingAuthUser.id,
      { password }
    )

    if (updateError) {
      console.error('❌ Error updating password:', updateError)
    } else {
      console.log(`✅ Password updated successfully`)
    }
  } else {
    console.log(`⚠️  User does NOT exist in Supabase Auth`)
    console.log(`📝 Creating user...`)

    // Create user in Auth
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (createError) {
      console.error('❌ Error creating user:', createError)
      return
    }

    console.log(`✅ User created successfully`)
    console.log(`   User ID: ${newUser.user.id}`)
  }

  // 2. Check if user exists in quiz_results_v2
  const { data: dbUser, error: dbError } = await supabase
    .from('quiz_results_v2')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (dbError) {
    console.log(`⚠️  User does NOT exist in quiz_results_v2`)
  } else {
    console.log(`✅ User exists in database (quiz_results_v2 table)`)
  }

  // 3. Test login
  console.log(`\n🔐 Testing login...`)
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    console.error('❌ Login failed:', loginError.message)
  } else {
    console.log(`✅ Login successful!`)
    console.log(`   Session valid until: ${loginData.session?.expires_at}`)
  }
}

// Run the check
const email = process.argv[2] || 'caspere63@gmail.com'
const password = process.argv[3] || 'Testo2024!Secure#'

checkAndCreateUser(email, password)
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
