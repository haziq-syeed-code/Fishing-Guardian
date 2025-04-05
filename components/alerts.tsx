"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

export default function Alerts() {
  const [alerts, setAlerts] = useState<
    {
      type: "warning" | "error" | "info"
      title: string
      description: string
    }[]
  >([])

  useEffect(() => {
    // In a real app, you might fetch these from an API
    // or use a real-time service like Firebase
    setAlerts([
      {
        type: "warning",
        title: "High Tide Warning",
        description: "High tide expected between 2:00 PM and 4:00 PM today.",
      },
      {
        type: "info",
        title: "Fishing Festival",
        description: "Annual fishing festival starts next week in Nagapattinam.",
      },
    ])
  }, [])

  const getIcon = (type: "warning" | "error" | "info") => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Alerts & Notifications</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-500">No current alerts</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index}>
              <div className="flex items-start gap-2">
                {getIcon(alert.type)}
                <div>
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.description}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  )
}

