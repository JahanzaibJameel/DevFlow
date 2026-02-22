import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler } from '@/lib/utils/api-helpers'
import { rateLimit, getRateLimitHeaders } from '@/lib/utils/rate-limit'
import { z } from 'zod'

const standupSchema = z.object({
  projectId: z.string(),
  period: z.enum(['daily', 'weekly']).optional(),
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return apiError('Unauthorized', 401)
  }

  const { success, remaining, resetTime } = rateLimit(`ai-standup-${user.id}`, 10, 60000)

  if (!success) {
    return apiError('Too many requests', 429)
  }

  const body = await parseRequestBody(request)
  const { projectId, period = 'daily' } = standupSchema.parse(body)

  // Get recent tasks for the project
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false })
    .limit(10)

  // Generate standup report
  const standup = {
    period,
    summary: 'No tasks completed',
    completed: [],
    inProgress: tasks?.filter((t) => t.status === 'IN_PROGRESS').map((t) => t.title) || [],
    blockers: [],
    nextSteps: [],
  }

  const response = apiSuccess(standup)
  Object.entries(getRateLimitHeaders(remaining, resetTime)).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
})
