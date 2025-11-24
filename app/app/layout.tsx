/**
 * App Layout
 * Wraps all /app routes with SWRProvider, UserProgramProvider, ToastProvider, ErrorBoundary, and SwipeableLayout
 */

import { UserProgramProvider } from '@/contexts/UserProgramContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { SwipeableLayout } from '@/components/layout/SwipeableLayout'
import { SWRProvider } from '@/components/providers/SWRProvider'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <SWRProvider>
        <UserProgramProvider>
          <ToastProvider>
            <SwipeableLayout>
              {children}
            </SwipeableLayout>
          </ToastProvider>
        </UserProgramProvider>
      </SWRProvider>
    </ErrorBoundary>
  )
}
