'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GripVertical, Calendar } from 'lucide-react'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import type { Task } from '@/lib/supabase/database.types'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

const priorityColors = {
  LOW: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          isDragging && 'shadow-lg ring-2 ring-primary'
        )}
        onClick={onClick}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-2">{task.title}</p>
            </div>
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground flex-shrink-0 p-1"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1">
              <Badge
                variant="secondary"
                className={`text-xs ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </Badge>
            </div>

            {task.assigned_to && (
              <Avatar className="h-5 w-5">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {getInitials(task.assigned_to)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t">
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeTime(task.due_date)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
