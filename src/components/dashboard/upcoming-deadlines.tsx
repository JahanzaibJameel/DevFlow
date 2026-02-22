'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, AlertCircle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface DeadlineItem {
  id: string
  title: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: string
}

interface UpcomingDeadlinesProps {
  deadlines?: DeadlineItem[]
}

const priorityColors = {
  LOW: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

function isDeadlineUrgent(dueDate: string): boolean {
  const now = new Date()
  const deadline = new Date(dueDate)
  const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntil <= 1
}

export function UpcomingDeadlines({
  deadlines = [
    {
      id: '1',
      title: 'Complete API Documentation',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'HIGH',
      status: 'In Progress',
    },
    {
      id: '2',
      title: 'Design Review Session',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'MEDIUM',
      status: 'Pending',
    },
    {
      id: '3',
      title: 'Deploy to Production',
      dueDate: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'URGENT',
      status: 'In Progress',
    },
  ],
}: UpcomingDeadlinesProps) {
  const sortedDeadlines = [...deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDeadlines.length === 0 ? (
            <p className="text-center text-muted-foreground">No upcoming deadlines</p>
          ) : (
            sortedDeadlines.map((deadline) => {
              const isUrgent = isDeadlineUrgent(deadline.dueDate)
              return (
                <div
                  key={deadline.id}
                  className={`flex items-start justify-between gap-4 p-3 rounded-lg border ${
                    isUrgent ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20' : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isUrgent && <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />}
                      <p className="font-medium text-sm line-clamp-1">{deadline.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(deadline.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      className={`text-xs ${
                        priorityColors[deadline.priority] || ''
                      }`}
                    >
                      {deadline.priority}
                    </Badge>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
