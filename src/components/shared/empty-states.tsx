'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon = Icons.inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground text-center text-sm mb-4 max-w-sm">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function EmptyProjects() {
  return (
    <EmptyState
      icon={Icons.folder}
      title="No projects yet"
      description="Create your first project to get started with DevFlow"
      action={{
        label: 'Create Project',
        onClick: () => window.location.href = '/projects/new',
      }}
    />
  )
}

export function EmptyTasks() {
  return (
    <EmptyState
      icon={Icons.checkSquare}
      title="No tasks found"
      description="Create a task or adjust your filters to see tasks"
      action={{
        label: 'Create Task',
        onClick: () => window.location.href = '/tasks',
      }}
    />
  )
}

export function EmptySearchResults() {
  return (
    <EmptyState
      icon={Icons.search}
      title="No results found"
      description="Try adjusting your search criteria or filters"
    />
  )
}

export function ErrorState() {
  return (
    <EmptyState
      icon={Icons.alertCircle}
      title="Something went wrong"
      description="An error occurred while loading this content. Please try again."
      action={{
        label: 'Retry',
        onClick: () => window.location.reload(),
      }}
    />
  )
}
