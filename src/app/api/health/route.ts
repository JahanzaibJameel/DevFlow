import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'checking',
      ai: 'checking',
      auth: 'checking',
    },
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  }

  try {
    // Check database connection
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select('count').limit(1)

    if (error) throw error
    health.services.database = 'healthy'
  } catch (error) {
    health.services.database = 'unhealthy'
    health.status = 'degraded'
  }

  // Check AI service
  if (process.env.OPENAI_API_KEY) {
    health.services.ai = 'configured'
  } else {
    health.services.ai = 'not_configured'
    health.status = 'degraded'
  }

  // Check auth
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    health.services.auth = 'configured'
  } else {
    health.services.auth = 'not_configured'
    health.status = 'degraded'
  }

  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}