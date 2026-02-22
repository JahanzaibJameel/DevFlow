"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProjectFilesPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Files</h1>
          <p className="text-muted-foreground">Project: {params.id}</p>
        </div>
        <Button>Upload File</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No files uploaded yet</p>
        </CardContent>
      </Card>
    </div>
  )
}
