'use client'

/**
 * Top Navigation Bar
 * Shows app branding and user profile
 */

import { User } from 'lucide-react'
import Link from 'next/link'

interface TopNavProps {
  programName: string
  userName?: string
}

export function TopNav({ programName, userName }: TopNavProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-mobile py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Left: Branding + Program Name */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-muted-foreground truncate">
              Testograph
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {programName}
            </p>
          </div>

          {/* Right: User Profile */}
          <Link
            href="/app/profile"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <User className="w-5 h-5 text-primary" />
          </Link>
        </div>
      </div>
    </div>
  )
}
