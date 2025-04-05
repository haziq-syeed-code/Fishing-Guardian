"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    language: "english",
    units: "metric",
    darkMode: false,
    boatName: "",
    phoneNumber: "",
  })

  const handleSwitchChange = (field: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveSettings = () => {
    // In a real app, you would save these to a database or localStorage
    localStorage.setItem("fishingAppSettings", JSON.stringify(settings))
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your preferences and account settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your app experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-gray-500">Receive alerts about weather and fishing conditions.</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={() => handleSwitchChange("notifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-gray-500">Use dark theme for better visibility at night.</p>
            </div>
            <Switch id="darkMode" checked={settings.darkMode} onCheckedChange={() => handleSwitchChange("darkMode")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => handleSelectChange("language", value)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="telugu">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="units">Units</Label>
            <Select value={settings.units} onValueChange={(value) => handleSelectChange("units", value)}>
              <SelectTrigger id="units">
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (°C, km/h)</SelectItem>
                <SelectItem value="imperial">Imperial (°F, mph)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details for emergency services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="boatName">Boat Name/Registration</Label>
            <Input
              id="boatName"
              value={settings.boatName}
              onChange={(e) => handleInputChange("boatName", e.target.value)}
              placeholder="Enter your boat name or registration number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Emergency Contact Number</Label>
            <Input
              id="phoneNumber"
              value={settings.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="Enter emergency contact number"
            />
            <p className="text-xs text-gray-500">This number will be used for emergency alerts.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

