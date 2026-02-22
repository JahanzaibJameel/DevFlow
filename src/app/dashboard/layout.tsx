import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/shared/error-boundary'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto pt-16">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
