"use client"

import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TaskDetailsPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Details</h1>
          <p className="text-muted-foreground">ID: {params.id}</p>
        </div>
        <Button>Edit Task</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>In Progress</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">High</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assigned To</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Team member name</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
