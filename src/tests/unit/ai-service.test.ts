import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIService } from '@/lib/ai/service'

describe('AIService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('decomposeProject', () => {
    it('should return structured tasks from project brief', async () => {
      const mockProjectBrief = 'Build a todo app with React and Node.js'
      
      const result = await AIService.decomposeProject(mockProjectBrief, {
        workspaceId: 'test-workspace',
        userId: 'test-user',
      })

      expect(result).toHaveProperty('tasks')
      expect(result).toHaveProperty('total_hours')
      expect(result).toHaveProperty('timeline')
      expect(Array.isArray(result.tasks)).toBe(true)
      expect(Array.isArray(result.timeline)).toBe(true)
      
      // Check task structure
      if (result.tasks.length > 0) {
        const task = result.tasks[0]
        expect(task).toHaveProperty('title')
        expect(task).toHaveProperty('description')
        expect(task).toHaveProperty('estimated_hours')
        expect(task).toHaveProperty('priority')
        expect(task).toHaveProperty('subtasks')
      }
    })

    it('should handle AI service failures gracefully', async () => {
      // Mock OpenAI failure
      vi.mock('openai', () => ({
        default: vi.fn().mockImplementation(() => ({
          chat: {
            completions: {
              create: vi.fn().mockRejectedValue(new Error('API Error')),
            },
          },
        })),
      }))

      const result = await AIService.decomposeProject('test brief', {})
      
      // Should return fallback structure
      expect(result).toHaveProperty('tasks')
      expect(result.tasks).toBeInstanceOf(Array)
    })
  })

  describe('enhanceDescription', () => {
    it('should enhance bullet points', async () => {
      const bulletPoints = '- login page\n- user auth\n- dashboard'
      
      const result = await AIService.enhanceDescription(bulletPoints, {})
      
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(bulletPoints.length)
    })
  })
})