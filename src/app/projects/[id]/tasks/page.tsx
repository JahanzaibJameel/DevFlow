"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProjectTasksPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Project Tasks</h1>
        <p className="text-muted-foreground">Project: {params.id}</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sample Task</CardTitle>
              <Badge>In Progress</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Task description here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
