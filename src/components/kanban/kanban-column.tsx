'use client'

import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from './task-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/lib/supabase/database.types'

interface KanbanColumnProps {
  columnId: string
  columnTitle: string
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  color?: string
}

export function KanbanColumn({
  columnId,
  columnTitle,
  tasks,
  onTaskClick,
  color = 'bg-gray-50',
}: KanbanColumnProps) {
  const { setNodeRef } = useSortable({
    id: columnId,
    data: {
      type: 'Column',
      column: columnId,
    },
  })

  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[300px] rounded-lg p-4 ${color}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground">
          {columnTitle} <span className="text-xs text-gray-400 ml-2">({tasks.length})</span>
        </h3>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              No tasks
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick?.(task)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
