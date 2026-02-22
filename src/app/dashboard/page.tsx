'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { ProjectProgressChart } from '@/components/dashboard/project-progress-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines'
import { createClient } from '@/lib/supabase/client'
import { useWorkspaceStore } from '@/store/workspace-store'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore()

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
  })

  const { data: workspace } = useQuery({
    queryKey: ['workspace', currentWorkspace?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const { data: projects } = useQuery({
    queryKey: ['projects', workspace?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workspace_id', workspace?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!workspace,
  })

  const { data: tasks } = useQuery({
    queryKey: ['tasks', workspace?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projects?.map(p => p.id) || [])
        .order('due_date', { ascending: true })

      if (error) throw error
      return data
    },
    enabled: !!projects,
  })

  useEffect(() => {
    if (workspace) {
      setCurrentWorkspace(workspace)
    }
  }, [workspace, setCurrentWorkspace])

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push('/projects/new')}>
            <Icons.plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <KpiCards projects={projects || []} tasks={tasks || []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectProgressChart projects={projects || []} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingDeadlines tasks={tasks || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed workspaceId={workspace?.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}