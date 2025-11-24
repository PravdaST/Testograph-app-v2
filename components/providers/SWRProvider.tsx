'use client'

/**
 * SWR Provider Component
 * Configures global SWR settings for the app
 */

import { ReactNode } from 'react'
import { SWRConfig } from 'swr'

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global fetcher function
        fetcher: async (url: string) => {
          const response = await fetch(url)
          if (!response.ok) {
            const error = new Error('An error occurred while fetching the data.')
            throw error
          }
          return response.json()
        },

        // Revalidation settings
        revalidateOnFocus: false, // Don't revalidate on window focus by default
        revalidateOnReconnect: true, // Revalidate when reconnecting to network
        revalidateIfStale: true, // Revalidate if data is stale
        dedupingInterval: 10000, // 10 seconds default deduping

        // Error retry
        errorRetryCount: 3, // Retry failed requests 3 times
        errorRetryInterval: 5000, // Wait 5 seconds between retries

        // Cache settings
        shouldRetryOnError: true,
        focusThrottleInterval: 60000, // 1 minute

        // Loading delay (prevents loading flash for fast requests)
        loadingTimeout: 3000,

        // Callback when error occurs
        onError: (error, key) => {
          console.error('[SWR Error]', key, error)
        },

        // Success callback
        onSuccess: (data, key) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[SWR Success]', key)
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
