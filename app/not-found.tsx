import Link from 'next/link'
import { HomeIcon, ArrowLeft } from 'lucide-react'

/**
 * 404 Not Found Page
 * Shown when user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Graphic */}
        <div className="relative">
          <div className="text-9xl font-bold text-primary/20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <HomeIcon className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Страницата не е намерена
          </h1>
          <p className="text-muted-foreground">
            Съжаляваме, но страницата която търсите не съществува или е била преместена.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <HomeIcon className="w-5 h-5" />
            Към Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background text-foreground rounded-lg hover:bg-muted transition-colors border border-border"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}
