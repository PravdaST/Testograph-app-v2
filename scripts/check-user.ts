import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const email = 'caspere63@gmail.com'

  // Check if user exists in auth.users (via admin API)
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('Error:', error.message)
    return
  }

  const user = users.find(u => u.email === email)
  
  if (user) {
    console.log('✅ User found in Supabase Auth:')
    console.log('  - ID:', user.id)
    console.log('  - Email:', user.email)
    console.log('  - Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No')
    console.log('  - Created at:', user.created_at)
    console.log('  - Last sign in:', user.last_sign_in_at || 'Never')
    console.log('  - Provider:', user.app_metadata?.provider || 'email')
  } else {
    console.log('❌ User NOT found with email:', email)
    console.log('\nTo create user, run:')
    console.log('npx tsx scripts/create-user.ts')
  }
}

checkUser()
