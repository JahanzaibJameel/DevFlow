"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectTimelinePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Project Timeline</h1>
        <p className="text-muted-foreground">Project: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Project created</p>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
