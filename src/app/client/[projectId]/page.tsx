'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUpload } from '@/components/files/file-upload'
import { CommentSection } from '@/components/comments/comment-section'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

export default function ClientPortalPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const projectId = params.projectId as string

  const [activeTab, setActiveTab] = useState('overview')

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['client-project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks(
            id,
            title,
            status,
            priority,
            due_date,
            estimated_hours,
            actual_hours
          ),
          file_attachments(*)
        `)
        .eq('id', projectId)
        .single()

      if (error) throw error
      return data
    },
  })

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (projectLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Project not found</h3>
              <p className="text-muted-foreground mt-2">
                You don&apos;t have access to this project or it doesn&apos;t exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0
  const totalTasks = project.tasks?.length || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {project.status.replace('_', ' ')}
          </Badge>
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            <Icons.printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Start Date</span>
                <span className="text-sm font-medium">
                  {project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Due Date</span>
                <span className="text-sm font-medium">
                  {project.due_date ? format(new Date(project.due_date), 'MMM d, yyyy') : 'Not set'}
                </span>
              </div>
              {project.budget && (
                <div className="flex justify-between">
                  <span className="text-sm">Budget</span>
                  <span className="text-sm font-medium">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((status) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{status.toLowerCase().replace('_', ' ')}</span>
                  <Badge variant="outline">
                    {project.tasks?.filter(t => t.status === status).length || 0}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-muted-foreground mb-6">{project.description}</p>
                
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {project.tasks?.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Status: <Badge variant="outline" className="ml-1">{task.status}</Badge>
                        </p>
                      </div>
                      {task.due_date && (
                        <div className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.due_date), 'MMM d')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks?.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            task.priority === 'URGENT' ? 'destructive' :
                            task.priority === 'HIGH' ? 'default' :
                            'secondary'
                          }>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {task.estimated_hours && `Est: ${task.estimated_hours}h`}
                        </div>
                        {task.due_date && (
                          <div className="text-sm">
                            Due: {format(new Date(task.due_date), 'MMM d')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                projectId={projectId}
                workspaceId={project.workspace_id}
                clientMode={true}
              />
              <div className="mt-6 space-y-3">
                {project.file_attachments?.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icons.file className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{file.file_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {(file.file_size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.file_path, '_blank')}
                    >
                      <Icons.download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentSection
                resourceId={projectId}
                resourceType="project"
                clientMode={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}