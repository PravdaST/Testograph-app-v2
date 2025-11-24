/**
 * App Layout
 * Wraps all /app routes with UserProgramProvider, ToastProvider, ErrorBoundary, and PageTransition
 */

import { UserProgramProvider } from '@/contexts/UserProgramContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { PageTransition } from '@/components/ui/page-transition'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <UserProgramProvider>
        <ToastProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </ToastProvider>
      </UserProgramProvider>
    </ErrorBoundary>
  )
}
