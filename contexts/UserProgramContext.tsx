'use client'

/**
 * UserProgramContext
 * Centralized state management for user program data
 * Prevents duplicate API calls and improves performance
 * Uses Supabase session for authentication
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  first_name?: string
  profile_picture_url?: string
  program_start_date?: string
  program_end_date?: string
  completed_at?: string
  workout_location?: 'home' | 'gym'
  dietary_preference?: 'omnivor' | 'vegetarian' | 'vegan' | 'pescatarian'
  total_score?: number
  goal?: string
}

interface UserProgramContextType {
  userProgram: UserProgram | null
  email: string | null
  loading: boolean
  error: string | null
  refreshUserProgram: () => Promise<void>
  updateUserProgram: (updates: Partial<UserProgram>) => void
}

const UserProgramContext = createContext<UserProgramContextType | undefined>(undefined)

export function UserProgramProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUserProgram = async () => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Get Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
      }

      let userEmail: string | null = null

      // Priority 1: Use session email if exists
      if (session?.user?.email) {
        userEmail = session.user.email
        // Sync with localStorage for compatibility
        localStorage.setItem('quizEmail', userEmail)
      } else {
        // Priority 2: Fallback to localStorage (migration period)
        const storedEmail = localStorage.getItem('quizEmail')
        if (storedEmail) {
          userEmail = storedEmail
          console.warn('⚠️ Using localStorage fallback. Session not found.')
        }
      }

      // If no email from either source, redirect to login
      if (!userEmail) {
        console.log('No session or stored email found. Redirecting to login...')
        router.push('/login')
        return
      }

      setEmail(userEmail)

      const response = await fetch(`/api/user/program?email=${encodeURIComponent(userEmail)}`)

      if (!response.ok) {
        throw new Error('Failed to load user program')
      }

      const data = await response.json()
      setUserProgram(data)
    } catch (err) {
      console.error('Error loading user program:', err)
      // User-friendly Bulgarian error messages
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        setError('Проблем с връзката. Провери интернет връзката си.')
      } else if (err instanceof Error && err.message.includes('401')) {
        setError('Сесията изтече. Моля, влез отново.')
      } else {
        setError('Не можахме да заредим данните. Опитай отново.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserProgram()
  }, [])

  const refreshUserProgram = async () => {
    await loadUserProgram()
  }

  const updateUserProgram = (updates: Partial<UserProgram>) => {
    setUserProgram(prev => prev ? { ...prev, ...updates } : null)
  }

  return (
    <UserProgramContext.Provider
      value={{
        userProgram,
        email,
        loading,
        error,
        refreshUserProgram,
        updateUserProgram,
      }}
    >
      {children}
    </UserProgramContext.Provider>
  )
}

export function useUserProgram() {
  const context = useContext(UserProgramContext)
  if (context === undefined) {
    throw new Error('useUserProgram must be used within a UserProgramProvider')
  }
  return context
}
