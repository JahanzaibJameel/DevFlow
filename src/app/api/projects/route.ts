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

const projectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.number().optional(),
  workspace_id: z.string(),
})

const createProjectSchema = projectSchema.pick({
  name: true,
  description: true,
  workspace_id: true,
  budget: true,
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return apiError('Unauthorized', 401)
  }

  // Parse and validate body
  const body = await parseRequestBody(request)
  const validData = createProjectSchema.parse(body)

  //Create project
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: validData.name,
      description: validData.description,
      workspace_id: validData.workspace_id,
      owner_id: user.id,
      budget: validData.budget,
      status: 'ACTIVE',
      priority: 'MEDIUM',
    })
    .select('*')
    .single()

  if (error) {
    return apiError('Failed to create project', 500, error.code)
  }

  return apiSuccess(data, 201)
})

export const GET = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return apiError('Unauthorized', 401)
  }

  // Get workspace_id from query
  const { searchParams } = new URL(request.url)
  const workspaceId = searchParams.get('workspace_id')

  let query = supabase.from('projects').select('*').order('created_at', { ascending: false })

  if (workspaceId) {
    query = query.eq('workspace_id', workspaceId)
  }

  const { data, error } = await query

  if (error) {
    return apiError('Failed to fetch projects', 500, error.code)
  }

  return apiSuccess(data)
})
