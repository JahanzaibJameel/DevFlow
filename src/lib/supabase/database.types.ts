export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: 'admin' | 'user' | 'member'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user' | 'member'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'user' | 'member'
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      projects: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          start_date: string | null
          end_date: string | null
          owner_id: string
          budget: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          status?: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          start_date?: string | null
          end_date?: string | null
          owner_id: string
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          status?: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          start_date?: string | null
          end_date?: string | null
          owner_id?: string
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          assigned_to: string | null
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          assigned_to?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          assigned_to?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          task_id: string | null
          project_id: string | null
          user_id: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id?: string | null
          project_id?: string | null
          user_id: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string | null
          project_id?: string | null
          user_id?: string
          filename?: string
          file_path?: string
          file_size?: number
          file_type?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          related_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          related_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          related_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      ai_processing_logs: {
        Row: {
          id: string
          workspace_id: string | null
          user_id: string | null
          feature: string
          input: string
          output: string
          token_usage: number | null
          processing_time_ms: number | null
          model_used: string | null
          cost_cents: number | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          user_id?: string | null
          feature: string
          input: string
          output: string
          token_usage?: number | null
          processing_time_ms?: number | null
          model_used?: string | null
          cost_cents?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          user_id?: string | null
          feature?: string
          input?: string
          output?: string
          token_usage?: number | null
          processing_time_ms?: number | null
          model_used?: string | null
          cost_cents?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
      task_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      project_status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
      user_role: 'admin' | 'user' | 'member'
    }
  }
}

// Derived Types
export type Workspace = Database['public']['Tables']['workspaces']['Row']
export type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert']
export type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type TaskComment = Database['public']['Tables']['comments']['Row']
export type TaskCommentInsert = Database['public']['Tables']['comments']['Insert']

export type ProjectFile = Database['public']['Tables']['files']['Row']
export type ProjectFileInsert = Database['public']['Tables']['files']['Insert']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

export type User = Database['public']['Tables']['users']['Row']

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
export type UserRole = 'admin' | 'user' | 'member'
