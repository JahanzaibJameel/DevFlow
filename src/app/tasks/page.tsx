'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
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
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'
import type { Task, TaskStatus, TaskPriority } from '@/lib/supabase/database.types'

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-800 dark:bg-slate-900',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900',
}

const statusIcons: Record<TaskStatus, string> = {
  BACKLOG: '📋',
  TODO: '📝',
  IN_PROGRESS: '🔄',
  REVIEW: '👀',
  DONE: '✅',
}

export default function TasksPage() {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { currentWorkspace } = useWorkspaceStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL')
  const debouncedSearch = useDebounce(search, 300)

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', currentWorkspace?.id, debouncedSearch, statusFilter, priorityFilter],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter)
      }
      if (priorityFilter !== 'ALL') {
        query = query.eq('priority', priorityFilter)
      }
      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`)
      }

      const { data, error } = await query

      if (error) {
        toast.error('Failed to load tasks')
        throw error
      }

      return data as Task[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete task')
    },
  })

  return (
    <div className="flex flex-col h-full">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage all your tasks in one place</p>
          </div>
          <Button onClick={() => router.push('#')}>
            <Icons.plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                type="search"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | 'ALL')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="REVIEW">Review</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'ALL')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tasks {tasks.length > 0 && <span className="text-muted-foreground">({tasks.length})</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Icons.spinner className="h-6 w-6 animate-spin" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks found. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-xl">{statusIcons[task.status]}</div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => router.push(`/tasks/${task.id}`)}
                          className="text-sm font-medium hover:underline text-left line-clamp-2"
                        >
                          {task.title}
                        </button>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(task.due_date)}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(task.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Icons.trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
