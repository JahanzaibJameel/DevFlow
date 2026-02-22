import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler } from '@/lib/utils/api-helpers'
import { rateLimit, getRateLimitHeaders } from '@/lib/utils/rate-limit'
import { z } from 'zod'

const estimateSchema = z.object({
  taskTitle: z.string(),
  description: z.string(),
  complexity: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return apiError('Unauthorized', 401)
  }

  const { success, remaining, resetTime } = rateLimit(`ai-estimate-${user.id}`, 30, 60000)

  if (!success) {
    return apiError('Too many requests', 429)
  }

  const body = await parseRequestBody(request)
  const validData = estimateSchema.parse(body)

  // Simple estimation logic (in production, use AI)
  const complexityMap = { LOW: 4, MEDIUM: 8, HIGH: 16 }
  const hours = complexityMap[validData.complexity || 'MEDIUM']
  const deadline = new Date(Date.now() + hours * 3600000).toISOString()

  const response = apiSuccess({
    estimatedHours: hours,
    estimatedDeadline: deadline,
    confidence: 0.75,
  })

  Object.entries(getRateLimitHeaders(remaining, resetTime)).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
})
