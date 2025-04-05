"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, AlertTriangle, Info, Calendar, Wind, Waves } from "lucide-react"

interface AlertItem {
  id: string
  type: "warning" | "error" | "info"
  title: string
  description: string
  date: string
  source?: string
}

interface ForecastItem {
  date: string
  day: string
  windSpeed: string
  windDirection: string
  waveHeight: string
  temperature: string
  conditions: string
}

export default function AlertsFullPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch these from an API
    const fetchData = async () => {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock alerts data
      const mockAlerts = [
        {
          id: "1",
          type: "warning",
          title: "High Tide Warning",
          description:
            "High tide expected between 2:00 PM and 4:00 PM today. Small boats advised to return to shore by 1:00 PM.",
          date: "2023-11-15",
          source: "Tamil Nadu Fisheries Department",
        },
        {
          id: "2",
          type: "error",
          title: "Storm Alert",
          description:
            "Severe storm expected in the Bay of Bengal on November 18-19. All fishing activities suspended during this period.",
          date: "2023-11-15",
          source: "Indian Meteorological Department",
        },
        {
          id: "3",
          type: "info",
          title: "Fishing Festival",
          description:
            "Annual fishing festival starts next week in Nagapattinam. Registration open for boat decoration competition.",
          date: "2023-11-14",
          source: "Nagapattinam Municipality",
        },
        {
          id: "4",
          type: "warning",
          title: "Naval Exercise",
          description:
            "Naval exercise scheduled from November 20-22 in the eastern waters. Fishing restricted in marked zones.",
          date: "2023-11-13",
          source: "Indian Navy",
        },
        {
          id: "5",
          type: "info",
          title: "New Subsidy Program",
          description: "Government announces new subsidy for fishing equipment. Applications open from December 1.",
          date: "2023-11-12",
          source: "Ministry of Fisheries",
        },
      ]

      // Mock forecast data
      const mockForecast = [
        {
          date: "2023-11-15",
          day: "Today",
          windSpeed: "15-20 km/h",
          windDirection: "Northeast",
          waveHeight: "1.2-1.5m",
          temperature: "29°C",
          conditions: "Partly cloudy",
        },
        {
          date: "2023-11-16",
          day: "Tomorrow",
          windSpeed: "10-15 km/h",
          windDirection: "East",
          waveHeight: "0.8-1.2m",
          temperature: "30°C",
          conditions: "Sunny",
        },
        {
          date: "2023-11-17",
          day: "Friday",
          windSpeed: "20-25 km/h",
          windDirection: "Southeast",
          waveHeight: "1.5-2.0m",
          temperature: "28°C",
          conditions: "Cloudy with showers",
        },
        {
          date: "2023-11-18",
          day: "Saturday",
          windSpeed: "30-40 km/h",
          windDirection: "Southeast",
          waveHeight: "2.5-3.0m",
          temperature: "27°C",
          conditions: "Stormy",
        },
        {
          date: "2023-11-19",
          day: "Sunday",
          windSpeed: "25-35 km/h",
          windDirection: "South",
          waveHeight: "2.0-2.5m",
          temperature: "26°C",
          conditions: "Stormy",
        },
      ]

      setAlerts(mockAlerts)
      setForecast(mockForecast)
      setLoading(false)
    }

    fetchData()
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Tabs defaultValue="alerts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="alerts">Alerts & Warnings</TabsTrigger>
        <TabsTrigger value="forecast">Marine Forecast</TabsTrigger>
      </TabsList>

      <TabsContent value="alerts" className="mt-4">
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-gray-500">No current alerts</p>
          ) : (
            alerts.map((alert) => (
              <Alert
                key={alert.id}
                className={
                  alert.type === "error"
                    ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                    : alert.type === "warning"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                      : "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                }
              >
                <div className="flex items-start gap-2">
                  {getIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle
                      className={
                        alert.type === "error"
                          ? "text-red-700 dark:text-red-400"
                          : alert.type === "warning"
                            ? "text-amber-700 dark:text-amber-400"
                            : "text-blue-700 dark:text-blue-400"
                      }
                    >
                      {alert.title}
                    </AlertTitle>
                    <AlertDescription className="mt-1">{alert.description}</AlertDescription>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>Source: {alert.source}</span>
                      <span>Posted: {alert.date}</span>
                    </div>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="forecast" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forecast.map((day, index) => (
            <Card
              key={index}
              className={day.conditions.toLowerCase().includes("storm") ? "border-red-200 dark:border-red-800" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{day.day}</CardTitle>
                    <CardDescription>{day.date}</CardDescription>
                  </div>
                  <div className="text-2xl font-bold">{day.temperature}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <span className="font-medium">Wind:</span> {day.windSpeed}, {day.windDirection}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <span className="font-medium">Waves:</span> {day.waveHeight}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <span className="font-medium">Conditions:</span> {day.conditions}
                    </div>
                  </div>
                </div>

                {day.conditions.toLowerCase().includes("storm") && (
                  <div className="mt-4 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Dangerous conditions for fishing</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

