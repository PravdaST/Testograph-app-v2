'use client'

/**
 * useHaptic Hook
 * Provides haptic feedback (vibration) for mobile devices
 * Falls back gracefully on unsupported devices
 */

import { useCallback } from 'react'

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

// Vibration patterns in milliseconds
const PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10], // Short-pause-short
  warning: [25, 50, 25], // Medium-pause-medium
  error: [50, 100, 50, 100, 50], // Heavy pattern for errors
}

export function useHaptic() {
  const vibrate = useCallback((type: HapticType = 'light') => {
    // Check if vibration API is supported
    if (typeof window === 'undefined') return
    if (!('vibrate' in navigator)) return

    try {
      const pattern = PATTERNS[type]
      navigator.vibrate(pattern)
    } catch {
      // Silently fail - haptic feedback is enhancement only
    }
  }, [])

  const light = useCallback(() => vibrate('light'), [vibrate])
  const medium = useCallback(() => vibrate('medium'), [vibrate])
  const heavy = useCallback(() => vibrate('heavy'), [vibrate])
  const success = useCallback(() => vibrate('success'), [vibrate])
  const warning = useCallback(() => vibrate('warning'), [vibrate])
  const error = useCallback(() => vibrate('error'), [vibrate])

  return {
    vibrate,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
  }
}
