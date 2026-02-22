'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Icons.layoutDashboard,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: Icons.briefcase,
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: Icons.checkSquare,
  },
  {
    label: 'Team',
    href: '/team',
    icon: Icons.users,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user
    },
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success('Logged out successfully')
  }

  return (
    <div className="fixed inset-y-0 left-0 w-64 border-r bg-white dark:bg-black flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Icons.zap className="h-5 w-5" />
          DevFlow
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t space-y-2">
        {user && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            <p className="font-medium truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <Icons.logOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
