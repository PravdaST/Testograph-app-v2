'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for mobile override in URL (for testing with DevTools)
    const mobileOverride = searchParams.get('mobile') === 'true'

    // Check if DevTools mobile emulation is active
    const isDevToolsMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent)

    // Check window width
    const isMobile = window.innerWidth <= 768

    // Allow mobile view if: actual mobile, DevTools emulation, or override param
    const shouldShowMobile = isMobile || isDevToolsMobile || mobileOverride

    if (!shouldShowMobile) {
      // Desktop detected - redirect to mobile-only page
      router.push('/mobile-only')
    } else {
      // Mobile detected - redirect to quiz (entry point)
      router.push('/quiz')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  )
}
