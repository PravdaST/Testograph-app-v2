import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function resetPassword() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const userId = 'e4ea078b-30b2-4347-801f-6d26a87318b6'
  const newPassword = 'Testo2024!Secure#'

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword
  })

  if (error) {
    console.error('❌ Error resetting password:', error.message)
    return
  }

  console.log('✅ Password reset successful!')
  console.log('Email: caspere63@gmail.com')
  console.log('New password: Testo2024!Secure#')
}

resetPassword()
