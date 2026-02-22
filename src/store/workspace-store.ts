import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { Workspace, User } from '@/lib/database.types'

interface WorkspaceState {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  members: User[]
  isLoading: boolean
  error: string | null
  setCurrentWorkspace: (workspace: Workspace | null) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setMembers: (members: User[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set) => ({
        currentWorkspace: null,
        workspaces: [],
        members: [],
        isLoading: false,
        error: null,
        setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
        setWorkspaces: (workspaces) => set({ workspaces }),
        setMembers: (members) => set({ members }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: 'workspace-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentWorkspace: state.currentWorkspace,
          workspaces: state.workspaces,
        }),
      }
    )
  )
)

interface TaskState {
  selectedTask: any | null
  taskFilters: {
    status: string[]
    priority: string[]
    assignee: string[]
    project: string[]
  }
  viewMode: 'list' | 'kanban' | 'calendar'
  setSelectedTask: (task: any | null) => void
  setTaskFilters: (filters: Partial<TaskState['taskFilters']>) => void
  setViewMode: (mode: TaskState['viewMode']) => void
}

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      (set) => ({
        selectedTask: null,
        taskFilters: {
          status: [],
          priority: [],
          assignee: [],
          project: [],
        },
        viewMode: 'kanban',
        setSelectedTask: (task) => set({ selectedTask: task }),
        setTaskFilters: (filters) =>
          set((state) => ({
            taskFilters: { ...state.taskFilters, ...filters },
          })),
        setViewMode: (mode) => set({ viewMode: mode }),
      }),
      {
        name: 'task-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: any[]
  unreadCount: number
  toggleSidebar: () => void
  setTheme: (theme: UIState['theme']) => void
  addNotification: (notification: any) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        theme: 'system',
        notifications: [],
        unreadCount: 0,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          })),
        markAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          })),
        clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
      }),
      {
        name: 'ui-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    )
  )
)