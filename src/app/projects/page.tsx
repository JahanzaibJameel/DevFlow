'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useWorkspaceStore } from '@/store/workspace-store'
import { useDebounce } from '@/lib/hooks'
import { formatRelativeTime, formatCurrency } from '@/lib/utils'
import type { Project, ProjectStatus } from '@/lib/supabase/database.types'

const statusColors: Record<ProjectStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900',
  ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900',
}

const statusIcons: Record<ProjectStatus, string> = {
  ACTIVE: '🚀',
  ARCHIVED: '📦',
  COMPLETED: '✨',
}

export default function ProjectsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { currentWorkspace } = useWorkspaceStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')
  const debouncedSearch = useDebounce(search, 300)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', currentWorkspace?.id, debouncedSearch, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter)
      }
      if (debouncedSearch) {
        query = query.or(`name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`)
      }

      const { data, error } = await query

      if (error) throw error

      return data as Project[]
    },
  })

  return (
    <div className="flex flex-col h-full">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage all your projects</p>
          </div>
          <Button onClick={() => router.push('/projects/new')}>
            <Icons.plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectStatus | 'ALL')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Icons.spinner className="h-6 w-6 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icons.folder className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No projects found</p>
              <Button onClick={() => router.push('/projects/new')}>
                <Icons.plus className="mr-2 h-4 w-4" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">
                        {statusIcons[project.status]} {project.name}
                      </CardTitle>
                    </div>
                    <Badge className={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
                    {project.budget && (
                      <div>
                        <p className="font-medium text-foreground">{formatCurrency(project.budget)}</p>
                        <p>Budget</p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {formatRelativeTime(project.created_at)}
                      </p>
                      <p>Created</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/projects/${project.id}`)
                    }}
                  >
                    View Details
                    <Icons.chevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
