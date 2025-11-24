/**
 * App Layout
 * Wraps all /app routes with UserProgramProvider and ToastProvider
 */

import { UserProgramProvider } from '@/contexts/UserProgramContext'
import { ToastProvider } from '@/contexts/ToastContext'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProgramProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </UserProgramProvider>
  )
}
