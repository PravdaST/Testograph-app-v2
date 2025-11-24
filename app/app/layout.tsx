/**
 * App Layout
 * Wraps all /app routes with UserProgramProvider, ToastProvider, and ErrorBoundary
 */

import { UserProgramProvider } from '@/contexts/UserProgramContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <UserProgramProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </UserProgramProvider>
    </ErrorBoundary>
  )
}
