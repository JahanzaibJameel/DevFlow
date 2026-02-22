import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler } from '@/lib/utils/api-helpers'
import { rateLimit, getRateLimitHeaders } from '@/lib/utils/rate-limit'
import { AIService } from '@/lib/ai/service'
import { z } from 'zod'

const enhanceDescriptionSchema = z.object({
  description: z.string().min(1),
  context: z.string().optional(),
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return apiError('Unauthorized', 401)
  }

  const { success, remaining, resetTime } = rateLimit(`ai-enhance-${user.id}`, 20, 60000)

  if (!success) {
    return apiError('Too many requests', 429)
  }

  const body = await parseRequestBody(request)
  const { description, context } = enhanceDescriptionSchema.parse(body)

  // For now, return the original description
  // In production, call an AI service to enhance it
  const enhanced = {
    original: description,
    enhanced: description,
    suggestions: [],
  }

  const response = apiSuccess(enhanced)
  Object.entries(getRateLimitHeaders(remaining, resetTime)).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
})
