"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground">Configure how you receive notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Project updates</span>
            <Button variant="outline">Enabled</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Task assignments</span>
            <Button variant="outline">Enabled</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
