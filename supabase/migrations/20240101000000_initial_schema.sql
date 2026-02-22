-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'TEAM_MEMBER', 'CLIENT')) DEFAULT 'TEAM_MEMBER',
    timezone TEXT DEFAULT 'UTC',
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subscription_tier TEXT CHECK (subscription_tier IN ('FREE', 'PRO', 'ENTERPRISE')) DEFAULT 'FREE',
    subscription_status TEXT CHECK (subscription_status IN ('ACTIVE', 'PAST_DUE', 'CANCELED')) DEFAULT 'ACTIVE',
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace members (including clients)
CREATE TABLE public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MEMBER', 'CLIENT')) DEFAULT 'MEMBER',
    permissions JSONB DEFAULT '{}'::jsonb,
    invited_by UUID REFERENCES public.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(workspace_id, user_id)
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED')) DEFAULT 'PLANNING',
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')) DEFAULT 'MEDIUM',
    tags TEXT[] DEFAULT '{}',
    start_date DATE,
    due_date DATE,
    budget DECIMAL(10,2),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, slug)
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')) DEFAULT 'BACKLOG',
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')) DEFAULT 'MEDIUM',
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    labels TEXT[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]'::jsonb,
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task assignments
CREATE TABLE public.task_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- Subtasks
CREATE TABLE public.subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    mentions UUID[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File attachments
CREATE TABLE public.file_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    storage_bucket TEXT DEFAULT 'attachments',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('TASK_ASSIGNED', 'MENTION', 'DEADLINE', 'PROJECT_UPDATE', 'COMMENT', 'SYSTEM')),
    title TEXT NOT NULL,
    message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI processing logs
CREATE TABLE public.ai_processing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    feature TEXT NOT NULL CHECK (feature IN ('TASK_DECOMPOSER', 'BUG_ANALYZER', 'DESCRIPTION_ENHANCER', 'DEADLINE_ESTIMATOR', 'STANDUP_GENERATOR')),
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    token_usage INTEGER,
    processing_time_ms INTEGER,
    model_used TEXT,
    cost_cents DECIMAL(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_task_assignments_task ON public.task_assignments(task_id);
CREATE INDEX idx_task_assignments_user ON public.task_assignments(user_id);
CREATE INDEX idx_comments_task ON public.comments(task_id);
CREATE INDEX idx_comments_project ON public.comments(project_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_audit_logs_workspace ON public.audit_logs(workspace_id, created_at DESC);
CREATE INDEX idx_file_attachments_workspace ON public.file_attachments(workspace_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_processing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Workspace policies
CREATE POLICY "Workspace members can view workspace" ON public.workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = workspaces.id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

CREATE POLICY "Workspace admins can update workspace" ON public.workspaces
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = workspaces.id
            AND wm.user_id = auth.uid()
            AND wm.role = 'ADMIN'
            AND wm.is_active = true
        )
    );

-- Workspace members policies
CREATE POLICY "Workspace members can view members" ON public.workspace_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = workspace_members.workspace_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

CREATE POLICY "Workspace admins can manage members" ON public.workspace_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = workspace_members.workspace_id
            AND wm.user_id = auth.uid()
            AND wm.role = 'ADMIN'
            AND wm.is_active = true
        )
    );

-- Project policies
CREATE POLICY "Project members can view projects" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = projects.workspace_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

CREATE POLICY "Workspace members can create projects" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = projects.workspace_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
            AND wm.role IN ('ADMIN', 'MEMBER')
        )
    );

CREATE POLICY "Project members can update projects" ON public.projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = projects.workspace_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
            AND wm.role IN ('ADMIN', 'MEMBER')
        )
    );

-- Task policies
CREATE POLICY "Task visibility for project members" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

CREATE POLICY "Project members can modify tasks" ON public.tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
            AND wm.role IN ('ADMIN', 'MEMBER')
        )
    );

-- Task assignments policies
CREATE POLICY "Project members can view assignments" ON public.task_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.projects p ON p.id = t.project_id
            JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE t.id = task_assignments.task_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

-- Comments policies
CREATE POLICY "Project members can view comments" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM (
                SELECT p.workspace_id FROM public.projects p 
                WHERE p.id = comments.project_id
                UNION
                SELECT p.workspace_id FROM public.tasks t
                JOIN public.projects p ON p.id = t.project_id
                WHERE t.id = comments.task_id
            ) AS workspaces
            JOIN public.workspace_members wm ON wm.workspace_id = workspaces.workspace_id
            WHERE wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

CREATE POLICY "Project members can create comments" ON public.comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM (
                SELECT p.workspace_id FROM public.projects p 
                WHERE p.id = comments.project_id
                UNION
                SELECT p.workspace_id FROM public.tasks t
                JOIN public.projects p ON p.id = t.project_id
                WHERE t.id = comments.task_id
            ) AS workspaces
            JOIN public.workspace_members wm ON wm.workspace_id = workspaces.workspace_id
            WHERE wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- File attachments policies
CREATE POLICY "Workspace members can view attachments" ON public.file_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = file_attachments.workspace_id
            AND wm.user_id = auth.uid()
            AND wm.is_active = true
        )
    );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    workspace_id UUID;
    user_id UUID := auth.uid();
BEGIN
    -- Determine workspace_id based on table
    IF TG_TABLE_NAME = 'workspaces' THEN
        workspace_id := NEW.id;
    ELSIF TG_TABLE_NAME = 'projects' THEN
        workspace_id := NEW.workspace_id;
    ELSIF TG_TABLE_NAME = 'tasks' THEN
        SELECT p.workspace_id INTO workspace_id 
        FROM public.projects p WHERE p.id = NEW.project_id;
    END IF;

    INSERT INTO public.audit_logs (
        workspace_id,
        user_id,
        action,
        resource_type,
        resource_id,
        changes,
        ip_address,
        user_agent
    ) VALUES (
        workspace_id,
        user_id,
        TG_OP,
        TG_TABLE_NAME,
        NEW.id,
        row_to_json(NEW),
        inet_client_addr(),
        current_setting('request.headers')::json->>'user-agent'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER audit_workspaces AFTER INSERT OR UPDATE OR DELETE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_tasks AFTER INSERT OR UPDATE OR DELETE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Create function to update project progress based on tasks
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
    project_id UUID;
    total_tasks INTEGER;
    completed_tasks INTEGER;
    new_progress INTEGER;
BEGIN
    -- Get project_id from the task
    project_id := NEW.project_id;
    
    -- Calculate progress
    SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'DONE' THEN 1 END) as completed
    INTO total_tasks, completed_tasks
    FROM public.tasks
    WHERE project_id = NEW.project_id;
    
    IF total_tasks > 0 THEN
        new_progress := (completed_tasks * 100) / total_tasks;
        
        UPDATE public.projects
        SET progress = new_progress
        WHERE id = project_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_progress_trigger
    AFTER INSERT OR UPDATE OF status ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_project_progress();

-- Create notification function
CREATE OR REPLACE FUNCTION create_task_assignment_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        metadata
    ) VALUES (
        NEW.user_id,
        'TASK_ASSIGNED',
        'New Task Assigned',
        'You have been assigned to a new task',
        jsonb_build_object('task_id', NEW.task_id, 'assigned_by', NEW.assigned_by)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_assignment_notification_trigger
    AFTER INSERT ON public.task_assignments
    FOR EACH ROW
    EXECUTE FUNCTION create_task_assignment_notification();