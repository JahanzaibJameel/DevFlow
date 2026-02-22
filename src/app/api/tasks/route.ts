import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  apiSuccess,
  apiError,
  parseRequestBody,
  validateRequiredFields,
  withErrorHandler,
} from '@/lib/utils/api-helpers'
import { z } from 'zod'

const taskSchema = z.object({
  project_id: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigned_to: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  estimated_hours: z.number().optional().nullable(),
  actual_hours: z.number().optional().nullable(),
})

const createTaskSchema = taskSchema.pick({
  project_id: true,
  title: true,
  description: true,
  priority: true,
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return apiError('Unauthorized', 401)
  }

  const body = await parseRequestBody(request)
  const validData = createTaskSchema.parse(body)

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: validData.project_id,
      title: validData.title,
      description: validData.description,
      priority: validData.priority || 'MEDIUM',
      status: 'TODO',
      created_by: user.id,
    })
    .select('*')
    .single()

  if (error) {
    return apiError('Failed to create task', 500, error.code)
  }

  return apiSuccess(data, 201)
})

export const GET = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return apiError('Unauthorized', 401)
  }

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')

  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })

  if (projectId) {
    query = query.eq('project_id', projectId)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (priority) {
    query = query.eq('priority', priority)
  }

  const { data, error } = await query

  if (error) {
    return apiError('Failed to fetch tasks', 500, error.code)
  }

  return apiSuccess(data)
})
