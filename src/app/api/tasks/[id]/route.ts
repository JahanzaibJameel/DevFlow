import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler } from '@/lib/utils/api-helpers'
import { z } from 'zod'

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigned_to: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  estimated_hours: z.number().optional().nullable(),
  actual_hours: z.number().optional().nullable(),
})

export const GET = withErrorHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return apiError('Unauthorized', 401)
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return apiError('Task not found', 404)
    }

    return apiSuccess(data)
  }
)

export const PUT = withErrorHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return apiError('Unauthorized', 401)
    }

    const body = await parseRequestBody(request)
    const validData = updateTaskSchema.parse(body)

    const { data, error } = await supabase
      .from('tasks')
      .update(validData)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) {
      return apiError('Failed to update task', 500, error.code)
    }

    return apiSuccess(data)
  }
)

export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return apiError('Unauthorized', 401)
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)

    if (error) {
      return apiError('Failed to delete task', 500, error.code)
    }

    return apiSuccess({ message: 'Task deleted successfully' })
  }
)
