'use client'

/**
 * UserProgramContext
 * Centralized state management for user program data
 * Prevents duplicate API calls and improves performance
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  first_name?: string
  profile_picture_url?: string
  program_start_date?: string
  workout_location?: 'home' | 'gym'
  dietary_preference?: 'omnivor' | 'vegetarian' | 'vegan' | 'pescatarian'
  total_score?: number
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

      const storedEmail = localStorage.getItem('quizEmail')
      if (!storedEmail) {
        router.push('/quiz')
        return
      }

      setEmail(storedEmail)

      const response = await fetch(`/api/user/program?email=${encodeURIComponent(storedEmail)}`)

      if (!response.ok) {
        throw new Error('Failed to load user program')
      }

      const data = await response.json()
      setUserProgram(data)
    } catch (err) {
      console.error('Error loading user program:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
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
