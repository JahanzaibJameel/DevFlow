import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler } from '@/lib/utils/api-helpers'
import { rateLimit, getRateLimitHeaders } from '@/lib/utils/rate-limit'
import { AIService } from '@/lib/ai/service'
import { z } from 'zod'

const decomposeSchema = z.object({
  projectBrief: z.string().min(1),
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

  // Rate limiting
  const { success, remaining, resetTime } = rateLimit(`ai-decompose-${user.id}`, 10, 60000) // 10 calls per minute
  const headers = getRateLimitHeaders(remaining, resetTime)

  if (!success) {
    return apiError('Too many requests', 429)
  }

  // Parse and validate
  const body = await parseRequestBody(request)
  const { projectBrief } = decomposeSchema.parse(body)

  // Call AI Service
  const result = await AIService.decomposeProject(projectBrief, {
    userId: user.id,
  })


  const response = apiSuccess(result)
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
})