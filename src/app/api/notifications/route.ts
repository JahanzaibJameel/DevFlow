import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, parseRequestBody, withErrorHandler } from '@/lib/utils/api-helpers'

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return apiError('Unauthorized', 401)
  }

  const body = await parseRequestBody(request)
  const { type, title, message, related_id } = body

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      type,
      title,
      message,
      related_id,
    })
    .select()
    .single()

  if (error) {
    return apiError('Failed to create notification', 500)
  }

  return apiSuccess(data, 201)
})

export const GET = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return apiError('Unauthorized', 401)
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return apiError('Failed to fetch notifications', 500)
  }

  return apiSuccess(data)
})
