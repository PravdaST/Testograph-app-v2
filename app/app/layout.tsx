/**
 * App Layout
 * Wraps all /app routes with UserProgramProvider for centralized state
 */

import { UserProgramProvider } from '@/contexts/UserProgramContext'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProgramProvider>
      {children}
    </UserProgramProvider>
  )
}
