'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime, getInitials } from '@/lib/utils'

interface ActivityItem {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  timestamp: string
  type?: 'created' | 'updated' | 'completed' | 'commented'
}

interface ActivityFeedProps {
  activities?: ActivityItem[]
}

const activityTypeColors = {
  created: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  updated: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  commented: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
}

export function ActivityFeed({
  activities = [
    {
      id: '1',
      user: { name: 'John Doe' },
      action: 'created',
      target: 'New project "Website Redesign"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'created',
    },
    {
      id: '2',
      user: { name: 'Jane Smith' },
      action: 'updated',
      target: 'Task "Design homepage"',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      type: 'updated',
    },
    {
      id: '3',
      user: { name: 'Bob Johnson' },
      action: 'completed',
      target: 'Task "Setup database"',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'completed',
    },
  ],
}: ActivityFeedProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground">No activities yet</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{activity.user.name}</p>
                    {activity.type && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          activityTypeColors[activity.type] || ''
                        }`}
                      >
                        {activity.action}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.target}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
