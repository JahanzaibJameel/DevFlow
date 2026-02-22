'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Zap, CheckCircle2 } from 'lucide-react'
import { formatNumber, formatPercentage } from '@/lib/utils'

interface KpiCardsProps {
  activeProjects?: number
  totalTasks?: number
  completedTasks?: number
  teamMembers?: number
}

export function KpiCards({
  activeProjects = 0,
  totalTasks = 0,
  completedTasks = 0,
  teamMembers = 0,
}: KpiCardsProps) {
  const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0

  const kpis = [
    {
      title: 'Active Projects',
      value: formatNumber(activeProjects),
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Total Tasks',
      value: formatNumber(totalTasks),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Completion Rate',
      value: formatPercentage(completionRate),
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Team Members',
      value: formatNumber(teamMembers),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.title} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`${kpi.bgColor} rounded-lg p-2`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
