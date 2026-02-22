'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ProjectProgressChartProps {
  data?: Array<{
    name: string
    progress: number
    target?: number
  }>
}

export function ProjectProgressChart({
  data = [
    { name: 'Project A', progress: 65, target: 100 },
    { name: 'Project B', progress: 45, target: 100 },
    { name: 'Project C', progress: 90, target: 100 },
    { name: 'Project D', progress: 30, target: 100 },
  ],
}: ProjectProgressChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
