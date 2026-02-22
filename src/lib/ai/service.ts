import OpenAI from 'openai'
import { createServiceRoleClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AIProcessingOptions {
  workspaceId?: string
  userId?: string
  maxTokens?: number
  temperature?: number
}

export class AIService {
  private static async logProcessing(
    feature: string,
    input: string,
    output: string,
    options: {
      workspaceId?: string
      userId?: string
      tokenUsage?: number
      processingTime?: number
      model?: string
      cost?: number
    }
  ) {
    const supabase = createServiceRoleClient()

    await supabase.from('ai_processing_logs').insert({
      workspace_id: options.workspaceId,
      user_id: options.userId,
      feature,
      input,
      output,
      token_usage: options.tokenUsage,
      processing_time_ms: options.processingTime,
      model_used: options.model,
      cost_cents: options.cost,
    })
  }

  static async decomposeProject(
    projectBrief: string,
    options: AIProcessingOptions = {}
  ): Promise<{
    tasks: Array<{
      title: string
      description: string
      estimated_hours: number
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      subtasks: string[]
    }>
    total_hours: number
    timeline: Array<{
      week: number
      focus: string
      tasks: string[]
    }>
  }> {
    const startTime = Date.now()

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a senior project manager with 15+ years of experience in software development.
            Your task is to break down project briefs into structured, actionable tasks with realistic time estimates.
            Return a valid JSON object with the following structure:
            {
              "tasks": [
                {
                  "title": "Task title",
                  "description": "Detailed description",
                  "estimated_hours": number,
                  "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
                  "subtasks": ["subtask 1", "subtask 2", ...]
                }
              ],
              "total_hours": number,
              "timeline": [
                {
                  "week": number,
                  "focus": "Main focus for the week",
                  "tasks": ["task1 title", "task2 title", ...]
                }
              ]
            }`,
          },
          {
            role: 'user',
            content: `Break down this project brief into structured tasks:\n\n${projectBrief}`,
          },
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      const result = JSON.parse(content)

      const endTime = Date.now()
      const processingTime = endTime - startTime
      const tokenUsage = response.usage?.total_tokens || 0
      const cost = (tokenUsage / 1000) * 0.01 // $0.01 per 1K tokens for gpt-4-turbo

      await this.logProcessing('TASK_DECOMPOSER', projectBrief, content, {
        workspaceId: options.workspaceId,
        userId: options.userId,
        tokenUsage,
        processingTime,
        model: 'gpt-4-turbo-preview',
        cost: cost * 100, // Convert to cents
      })

      return result
    } catch (error) {
      console.error('AI Task Decomposition error:', error)
      
      // Fallback to simple task breakdown if AI service is unavailable
      return {
        tasks: [
          {
            title: 'Initial Setup & Planning',
            description: 'Set up project structure and initial planning',
            estimated_hours: 8,
            priority: 'HIGH' as const,
            subtasks: ['Define requirements', 'Set up development environment', 'Create project plan'],
          },
        ],
        total_hours: 8,
        timeline: [
          {
            week: 1,
            focus: 'Project Setup',
            tasks: ['Initial Setup & Planning'],
          },
        ],
      }
    }
  }

  static async analyzeBug(
    errorLog: string,
    codeContext?: string,
    options: AIProcessingOptions = {}
  ): Promise<{
    explanation: string
    root_cause: string
    suggested_fixes: string[]
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    confidence: number
  }> {
    const startTime = Date.now()

    try {
      const prompt = codeContext
        ? `Error log:\n${errorLog}\n\nCode context:\n${codeContext}`
        : `Error log:\n${errorLog}`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a senior software engineer specializing in debugging and error analysis.
            Analyze the provided error log and provide:
            1. A human-readable explanation of the error
            2. The likely root cause
            3. Suggested fixes with code examples if applicable
            4. Severity assessment (LOW, MEDIUM, HIGH, CRITICAL)
            5. Confidence level (0-100%)
            
            Return a valid JSON object.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      const result = JSON.parse(content)

      const endTime = Date.now()
      await this.logProcessing('BUG_ANALYZER', errorLog, content, {
        workspaceId: options.workspaceId,
        userId: options.userId,
        tokenUsage: response.usage?.total_tokens,
        processingTime: endTime - startTime,
        model: 'gpt-4',
      })

      return result
    } catch (error) {
      console.error('AI Bug Analysis error:', error)
      
      return {
        explanation: 'Unable to analyze error due to service unavailability',
        root_cause: 'Service connectivity issue',
        suggested_fixes: [
          'Check internet connection',
          'Verify API key is valid',
          'Retry analysis',
        ],
        severity: 'MEDIUM',
        confidence: 0,
      }
    }
  }

  static async enhanceDescription(
    bulletPoints: string,
    options: AIProcessingOptions = {}
  ): Promise<string> {
    const startTime = Date.now()

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a technical writer. Convert bullet points or rough notes into professional,
            well-structured project or task descriptions. Maintain technical accuracy while improving
            clarity and professionalism.`,
          },
          {
            role: 'user',
            content: `Enhance this description:\n\n${bulletPoints}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content || bulletPoints

      const endTime = Date.now()
      await this.logProcessing('DESCRIPTION_ENHANCER', bulletPoints, content, {
        workspaceId: options.workspaceId,
        userId: options.userId,
        tokenUsage: response.usage?.total_tokens,
        processingTime: endTime - startTime,
        model: 'gpt-3.5-turbo',
      })

      return content
    } catch (error) {
      console.error('AI Description Enhancement error:', error)
      return bulletPoints // Return original if AI fails
    }
  }

  static async estimateDeadline(
    taskDetails: string,
    historicalData?: Array<{ task: string; actual_hours: number }>,
    options: AIProcessingOptions = {}
  ): Promise<{
    estimated_hours: number
    confidence: number
    factors: string[]
    recommended_deadline: string
    risks: string[]
  }> {
    const startTime = Date.now()

    try {
      const historicalContext = historicalData
        ? `Historical completion data:\n${JSON.stringify(historicalData, null, 2)}`
        : 'No historical data available'

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a project manager with expertise in software development estimation.
            Based on the task details and historical data (if available), provide a realistic time estimate.
            Consider complexity, dependencies, and potential risks.
            
            Return a valid JSON object with:
            - estimated_hours: number
            - confidence: number (0-100%)
            - factors: string[] (key considerations)
            - recommended_deadline: string (ISO date)
            - risks: string[] (potential risks)`,
          },
          {
            role: 'user',
            content: `Task details:\n${taskDetails}\n\n${historicalContext}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      const result = JSON.parse(content)

      const endTime = Date.now()
      await this.logProcessing('DEADLINE_ESTIMATOR', taskDetails, content, {
        workspaceId: options.workspaceId,
        userId: options.userId,
        tokenUsage: response.usage?.total_tokens,
        processingTime: endTime - startTime,
        model: 'gpt-4',
      })

      return result
    } catch (error) {
      console.error('AI Deadline Estimation error:', error)
      
      const defaultDeadline = new Date()
      defaultDeadline.setDate(defaultDeadline.getDate() + 7)

      return {
        estimated_hours: 8,
        confidence: 50,
        factors: ['Basic estimation due to service unavailability'],
        recommended_deadline: defaultDeadline.toISOString(),
        risks: ['Unclear requirements', 'Potential dependencies'],
      }
    }
  }

  static async generateStandup(
    previousTasks: Array<{ title: string; status: string }>,
    todayPlan: string[],
    blockers: string[],
    options: AIProcessingOptions = {}
  ): Promise<{
    summary: string
    focus_points: string[]
    recommendations: string[]
    questions_for_team: string[]
  }> {
    const startTime = Date.now()

    try {
      const context = `
        Previous work:
        ${previousTasks.map(t => `- ${t.title}: ${t.status}`).join('\n')}
        
        Today's plan:
        ${todayPlan.join('\n')}
        
        Blockers:
        ${blockers.join('\n') || 'None'}
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a scrum master. Generate a professional daily standup report that:
            1. Summarizes progress clearly
            2. Highlights focus areas
            3. Provides actionable recommendations
            4. Suggests questions for team discussion
            
            Return a valid JSON object.`,
          },
          {
            role: 'user',
            content: context,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      const result = JSON.parse(content)

      const endTime = Date.now()
      await this.logProcessing('STANDUP_GENERATOR', context, content, {
        workspaceId: options.workspaceId,
        userId: options.userId,
        tokenUsage: response.usage?.total_tokens,
        processingTime: endTime - startTime,
        model: 'gpt-3.5-turbo',
      })

      return result
    } catch (error) {
      console.error('AI Standup Generation error:', error)
      
      return {
        summary: 'Daily standup report generation unavailable',
        focus_points: ['Complete pending tasks', 'Address blockers'],
        recommendations: ['Prioritize high-impact tasks', 'Schedule team sync'],
        questions_for_team: ['Any blockers?', 'Need help with anything?'],
      }
    }
  }
}