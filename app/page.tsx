'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'

function HomePageContent() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const quizEmail = localStorage.getItem('quizEmail')

    if (quizEmail) {
      // User has completed quiz and logged in - redirect to app
      router.push('/app')
    } else {
      // New user - redirect to quiz
      router.push('/quiz')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
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
