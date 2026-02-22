'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { KanbanColumn } from './kanban-column'
import { TaskCard } from './task-card'
import { createClient } from '@/lib/supabase/client'
import type { Task, Project } from '@/lib/database.types'

interface KanbanBoardProps {
  projectId: string
}

const COLUMNS = [
  { id: 'BACKLOG', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'TODO', title: 'Todo', color: 'bg-blue-50' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-yellow-50' },
  { id: 'REVIEW', title: 'Review', color: 'bg-purple-50' },
  { id: 'DONE', title: 'Done', color: 'bg-green-50' },
]

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const supabase = createClient()
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      return data
    },
  })

  const { data: fetchedTasks } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, task_assignments(*, users(*))')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data as Task[]
    },
  })

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks)
    }
  }, [fetchedTasks])

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    },
    onError: (error) => {
      toast.error('Failed to update task')
    },
  })

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) {
      setActiveId(null)
      return
    }

    // If dragging from one column to another
    const activeTask = tasks.find(task => task.id === activeId)
    const overColumn = COLUMNS.find(col => col.id === overId)

    if (activeTask && overColumn) {
      // Task moved to a new column
      await updateTaskMutation.mutateAsync({
        taskId: activeId,
        updates: { status: overColumn.id as Task['status'] },
      })
    } else {
      // Reordering within the same column
      const oldIndex = tasks.findIndex(task => task.id === activeId)
      const newIndex = tasks.findIndex(task => task.id === overId)

      if (oldIndex !== newIndex) {
        const newTasks = arrayMove(tasks, oldIndex, newIndex)
        setTasks(newTasks)

        // Update order indices
        for (let i = 0; i < newTasks.length; i++) {
          if (newTasks[i].order_index !== i) {
            await updateTaskMutation.mutateAsync({
              taskId: newTasks[i].id,
              updates: { order_index: i },
            })
          }
        }
      }
    }

    setActiveId(null)
  }

  const getColumnTasks = (columnId: string) => {
    return tasks.filter(task => task.status === columnId)
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">{project.progress}% complete</span>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={getColumnTasks(column.id)}
              projectId={projectId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={tasks.find(task => task.id === activeId)!}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Drag and drop tasks between columns to update their status</p>
      </div>
    </div>
  )
}