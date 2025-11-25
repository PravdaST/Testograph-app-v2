'use client'

/**
 * Active Sessions Component
 * Shows current session information and allows signing out from all devices
 */

import { useState, useEffect } from 'react'
import { LogOut, Smartphone, Calendar, Clock, Loader2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'

interface SessionInfo {
  userId: string
  email: string
  createdAt: string
  lastSignInAt: string
  expiresAt: number
  userAgent: string
}

interface ActiveSessionsProps {
  email: string
}

export function ActiveSessions({ email }: ActiveSessionsProps) {
  const router = useRouter()
  const toast = useToast()
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    loadSessionInfo()
  }, [email])

  const loadSessionInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/sessions')
      const data = await response.json()

      if (response.ok && data.success) {
        setSessionInfo(data.currentSession)
      } else {
        console.error('Error loading session info:', data.error)
      }
    } catch (error) {
      console.error('Error fetching session info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOutAllDevices = async () => {
    const confirmed = confirm(
      'Сигурни ли сте, че искате да излезете от всички устройства?\n\n' +
      'Това ще прекрати всички активни сесии и ще трябва да влезете отново на всяко устройство.'
    )

    if (!confirmed) return

    setIsSigningOut(true)

    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Излязохте от всички устройства')
        // Redirect to login after global logout
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } else {
        toast.error(data.error || 'Грешка при излизане')
        setIsSigningOut(false)
      }
    } catch (error) {
      console.error('Error signing out from all devices:', error)
      toast.error('Грешка при излизане от всички устройства')
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-background rounded-2xl p-3 sm:p-5 border border-border">
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!sessionInfo) {
    return null
  }

  // Format dates
  const lastSignIn = new Date(sessionInfo.lastSignInAt).toLocaleString('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const expiresAt = new Date(sessionInfo.expiresAt * 1000).toLocaleString('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Parse user agent for basic device info
  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return { type: 'Mobile', icon: Smartphone }
    }
    return { type: 'Desktop', icon: Smartphone }
  }

  const deviceInfo = getDeviceInfo(sessionInfo.userAgent)
  const DeviceIcon = deviceInfo.icon

  return (
    <div className="bg-background rounded-2xl p-3 sm:p-5 border border-border">
      {/* Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h2 className="font-bold text-sm sm:text-base">Активни сесии</h2>
      </div>

      {/* Current Session Card */}
      <div className="bg-muted/30 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DeviceIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm sm:text-base">{deviceInfo.type}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Текуща сесия</div>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded">
            Активна
          </span>
        </div>

        {/* Session Details */}
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Вход: {lastSignIn}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Изтича: {expiresAt}</span>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 sm:p-3 mb-3 sm:mb-4">
        <div className="flex items-start gap-1.5 sm:gap-2">
          <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">
            Supabase показва само текущата сесия. Използвайте бутона за излизане от всички устройства.
          </p>
        </div>
      </div>

      {/* Sign Out All Devices Button */}
      <button
        onClick={handleSignOutAllDevices}
        disabled={isSigningOut}
        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSigningOut ? (
          <>
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            <span className="text-xs sm:text-sm font-medium">Излизане...</span>
          </>
        ) : (
          <>
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Излез от всички устройства</span>
          </>
        )}
      </button>
    </div>
  )
}
