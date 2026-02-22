import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <Icons.zap className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-white">DevFlow</h1>
        </div>

        {/* Hero Content */}
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-white leading-tight">
            Project Management for Modern Teams
          </h2>
          <p className="text-xl text-slate-300">
            Streamline your workflow with AI-powered task management, real-time collaboration, and intelligent automation.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          <div className="space-y-2">
            <Icons.zap className="h-6 w-6 text-primary mx-auto" />
            <p className="font-semibold text-white">AI-Powered</p>
            <p className="text-slate-400 text-sm">Intelligent task automation and insights</p>
          </div>
          <div className="space-y-2">
            <Icons.users className="h-6 w-6 text-primary mx-auto" />
            <p className="font-semibold text-white">Collaboration</p>
            <p className="text-slate-400 text-sm">Real-time teamwork and communication</p>
          </div>
          <div className="space-y-2">
            <Icons.layoutDashboard className="h-6 w-6 text-primary mx-auto" />
            <p className="font-semibold text-white">Dashboard</p>
            <p className="text-slate-400 text-sm">Beautiful analytics and insights</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              <Icons.arrowRight className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Sign Up Link */}
        <div className="text-slate-300">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-semibold">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  )
}
