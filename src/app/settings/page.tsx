"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SettingsPage() {
  const settings = [
    { name: "Profile", href: "/settings/profile", description: "Manage your profile information" },
    { name: "Notifications", href: "/settings/notifications", description: "Configure notification preferences" },
    { name: "Workspace", href: "/settings/workspace", description: "Manage workspace settings" },
    { name: "Billing", href: "/settings/billing", description: "View and manage billing" },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-4">
        {settings.map((setting) => (
          <Link key={setting.href} href={setting.href}>
            <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{setting.name}</CardTitle>
                <CardDescription>{setting.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
