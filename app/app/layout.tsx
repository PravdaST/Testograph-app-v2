/**
 * App Layout
 * Wraps all /app routes with UserProgramProvider, ToastProvider, ErrorBoundary, and SwipeableLayout
 */

import { UserProgramProvider } from '@/contexts/UserProgramContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { SwipeableLayout } from '@/components/layout/SwipeableLayout'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <UserProgramProvider>
        <ToastProvider>
          <SwipeableLayout>
            {children}
          </SwipeableLayout>
        </ToastProvider>
      </UserProgramProvider>
    </ErrorBoundary>
  )
}
