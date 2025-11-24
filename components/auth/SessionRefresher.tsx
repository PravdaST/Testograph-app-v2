'use client'

/**
 * Session Refresher Component
 * Automatically refreshes Supabase session when access token expires
 * Prevents unexpected logouts after 1 hour
 */

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SessionRefresher() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Listen for auth state changes (token refresh, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth State Change]', event, session ? 'Session active' : 'No session')

      if (event === 'SIGNED_OUT') {
        // User signed out - clear localStorage and redirect to login
        localStorage.clear()
        router.push('/login')
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('✅ Session refreshed automatically')
      }

      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in')
      }
    })

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('✅ Session active, expires at:', new Date(session.expires_at! * 1000))
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return null // This component doesn't render anything
}
