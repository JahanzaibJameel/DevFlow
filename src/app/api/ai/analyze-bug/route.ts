import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler, API_ERRORS } from '@/lib/utils/api-helpers'
import { rateLimit, getRateLimitHeaders } from '@/lib/utils/rate-limit'
import { AIService } from '@/lib/ai/service'
import { z } from 'zod'

const analyzeBugSchema = z.object({
  errorLog: z.string().min(1),
  codeContext: z.string().optional(),
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

  // Rate limiting per user
  const { success, remaining, resetTime } = rateLimit(`ai-analyze-${user.id}`, 20, 60000) // 20 calls per minute
  const headers = getRateLimitHeaders(remaining, resetTime)

  if (!success) {
    return apiError('Too many requests', 429, headers)
  }

  // Parse and validate request body
  const body = await parseRequestBody(request)
  const { errorLog, codeContext } = analyzeBugSchema.parse(body)

  // Call AI Service
  const result = await AIService.analyzeBug(errorLog, codeContext, {
    userId: user.id,
  })

  const response = apiSuccess(result)
  // Add rate limit headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
})
