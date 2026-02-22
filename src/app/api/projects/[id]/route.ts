import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler } from '@/lib/utils/api-helpers'
import { z } from 'zod'

const updateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  budget: z.number().optional().nullable(),
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
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return apiError('Project not found', 404)
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
    const validData = updateProjectSchema.parse(body)

    const { data, error } = await supabase
      .from('projects')
      .update(validData)
      .eq('id', params.id)
      .eq('owner_id', user.id)
      .select('*')
      .single()

    if (error) {
      return apiError('Failed to update project', 500, error.code)
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
      .from('projects')
      .delete()
      .eq('id', params.id)
      .eq('owner_id', user.id)

    if (error) {
      return apiError('Failed to delete project', 500, error.code)
    }

    return apiSuccess({ message: 'Project deleted successfully' })
  }
)
