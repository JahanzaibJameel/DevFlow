import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

/**
 * Create a successful API response
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Create an error API response
 */
export function apiError(
  message: string,
  status: number = 400,
  error?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: error || message,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Handle common API errors
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number = 400,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const API_ERRORS = {
  UNAUTHORIZED: new ApiError('Unauthorized', 401, 'UNAUTHORIZED'),
  FORBIDDEN: new ApiError('Forbidden', 403, 'FORBIDDEN'),
  NOT_FOUND: new ApiError('Not found', 404, 'NOT_FOUND'),
  CONFLICT: new ApiError('Resource already exists', 409, 'CONFLICT'),
  TOO_MANY_REQUESTS: new ApiError('Too many requests', 429, 'TOO_MANY_REQUESTS'),
  INTERNAL_ERROR: new ApiError('Internal server error', 500, 'INTERNAL_ERROR'),
  INVALID_REQUEST: new ApiError('Invalid request', 400, 'INVALID_REQUEST'),
  VALIDATION_ERROR: new ApiError('Validation error', 400, 'VALIDATION_ERROR'),
}

/**
 * Safely parse request body with error handling
 */
export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const text = await request.text()
    if (!text) throw new Error('Empty body')
    return JSON.parse(text) as T
  } catch (error) {
    throw new ApiError('Invalid request body', 400, 'INVALID_JSON')
  }
}

/**
 * Validate required fields in an object
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  obj: T,
  requiredFields: (keyof T)[]
): void {
  const missing = requiredFields.filter((field) => obj[field] === undefined || obj[field] === null)
  if (missing.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missing.join(', ')}`,
      400,
      'MISSING_REQUIRED_FIELDS'
    )
  }
}

/**
 * Wrap async route handlers with error handling
 */
export function withErrorHandler(
  handler: (request: Request) => Promise<NextResponse>
): (request: Request) => Promise<NextResponse> {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('[API Error]', error)
      if (error instanceof ApiError) {
        return apiError(error.message, error.status, error.code)
      }
      return apiError('Internal server error', 500)
    }
  }
}
