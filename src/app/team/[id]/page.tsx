"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Team Member</h1>
        <p className="text-muted-foreground">ID: {params.id}</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Member Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold">Team Member Name</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge>Developer</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
