'use client'

/**
 * Top Navigation Bar
 * Shows app branding and user profile
 */

import { User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface TopNavProps {
  programName: string
  userName?: string
  profilePictureUrl?: string
}

export function TopNav({ programName, userName, profilePictureUrl }: TopNavProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-mobile py-3 px-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo + Branding + Program Name */}
          <Link href="/app" className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/testograph_colorede_logo.png"
                alt="Testograph"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate">
                Testograph
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {programName}
              </p>
            </div>
          </Link>

          {/* Right: User Name + Profile Picture */}
          <Link
            href="/app/profile"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title={userName ? `Профил: ${userName}` : 'Профил'}
          >
            {/* User Name */}
            {userName && (
              <div className="text-right">
                <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {userName}
                </p>
              </div>
            )}

            {/* Profile Picture or Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt={userName || 'Profile'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
