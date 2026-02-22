import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, withErrorHandler } from '@/lib/utils/api-helpers'

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return apiError('Unauthorized', 401)
  }

  // Get form data
  const formData = await request.formData()
  const file = formData.get('file') as File
  const taskId = formData.get('taskId') as string
  const projectId = formData.get('projectId') as string

  if (!file) {
    return apiError('No file provided', 400)
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`
  const filePath = `${user.id}/${fileName}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(filePath, buffer, {
      contentType: file.type,
    })

  if (uploadError) {
    return apiError('Failed to upload file', 500)
  }

  // Save file metadata to database
  const { data: fileRecord, error: dbError } = await supabase
    .from('files')
    .insert({
      task_id: taskId || null,
      project_id: projectId || null,
      user_id: user.id,
      filename: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
    })
    .select()
    .single()

  if (dbError) {
    return apiError('Failed to save file metadata', 500)
  }

  return apiSuccess(fileRecord, 201)
})
