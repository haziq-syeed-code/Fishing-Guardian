"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Check, Fish, Flag, AlertCircle, Anchor, SirenIcon as SOS } from "lucide-react"

interface ReportActivityProps {
  currentLocation: { lat: number; lng: number }
  onReportSubmitted: (report: any) => void
}

export default function ReportActivity({ currentLocation, onReportSubmitted }: ReportActivityProps) {
  const [reportType, setReportType] = useState("overfished")
  const [location, setLocation] = useState({ lat: "", lng: "" })
  const [description, setDescription] = useState("")
  const [useCurrentLocation, setUseCurrentLocation] = useState(true)
  const [urgency, setUrgency] = useState("normal")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reportHistory, setReportHistory] = useState<any[]>([
    {
      id: 1,
      type: "danger",
      description: "Strong underwater currents",
      location: { lat: 10.5654, lng: 79.7421 },
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reportedBy: "Current User",
    },
    {
      id: 2,
      type: "overfished",
      description: "Area has been overfished in the past week",
      location: { lat: 9.1582, lng: 79.2129 },
      reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      reportedBy: "Current User",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Get coordinates
    const reportLocation = useCurrentLocation
      ? currentLocation
      : { lat: Number.parseFloat(location.lat), lng: Number.parseFloat(location.lng) }

    // Create report object
    const newReport = {
      id: Date.now(),
      type: reportType,
      description,
      location: reportLocation,
      reportedAt: new Date().toISOString(),
      reportedBy: "Current User", // In a real app, this would be the user's name
      urgency,
    }

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)

      // Add to history
      setReportHistory((prev) => [newReport, ...prev])

      // Notify parent component
      onReportSubmitted(newReport)

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setDescription("")
        setUrgency("normal")
      }, 3000)
    }, 1500)
  }

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "overfished":
        return "Overfished Area"
      case "danger":
        return "Dangerous Conditions"
      case "unsafe":
        return "Unsafe Area"
      case "help":
        return "Need Assistance"
      default:
        return "Other Activity"
    }
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "overfished":
        return <Fish className="h-4 w-4 text-yellow-500" />
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "unsafe":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "help":
        return <SOS className="h-4 w-4 text-blue-500" />
      default:
        return <Flag className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="report" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="report">Report Activity</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Help</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            {submitted ? (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-600 dark:text-green-400">Report Submitted</AlertTitle>
                <AlertDescription>
                  Thank you for your report. It has been submitted successfully and will be shared with other fishermen
                  in the area.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Report Type</Label>
                    <RadioGroup
                      value={reportType}
                      onValueChange={setReportType}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="overfished" id="overfished" />
                        <Label htmlFor="overfished" className="flex items-center cursor-pointer">
                          <Fish className="h-4 w-4 mr-2 text-yellow-500" />
                          Overfished Area
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="danger" id="danger" />
                        <Label htmlFor="danger" className="flex items-center cursor-pointer">
                          <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                          Dangerous Conditions
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex items-center cursor-pointer">
                          <Flag className="h-4 w-4 mr-2 text-blue-500" />
                          Other Activity
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Location</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="use-current" checked={useCurrentLocation} onCheckedChange={setUseCurrentLocation} />
                        <Label htmlFor="use-current" className="text-sm">
                          Use current location
                        </Label>
                      </div>
                    </div>

                    {!useCurrentLocation && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="latitude" className="sr-only">
                            Latitude
                          </Label>
                          <Input
                            id="latitude"
                            placeholder="Latitude"
                            value={location.lat}
                            onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude" className="sr-only">
                            Longitude
                          </Label>
                          <Input
                            id="longitude"
                            placeholder="Longitude"
                            value={location.lng}
                            onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {useCurrentLocation && (
                      <div className="text-sm text-muted-foreground">
                        Using current location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide details about what you're reporting..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Urgency Level</Label>
                    <RadioGroup value={urgency} onValueChange={setUrgency} className="grid grid-cols-3 gap-2 mt-2">
                      <div className="flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low" className="cursor-pointer">
                          Low
                        </Label>
                      </div>
                      <div className="flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal" className="cursor-pointer">
                          Normal
                        </Label>
                      </div>
                      <div className="flex items-center justify-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high" className="cursor-pointer">
                          High
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    <>Submit Report</>
                  )}
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="emergency">
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Emergency Assistance</AlertTitle>
                <AlertDescription>
                  Use this feature only in case of emergency. This will alert nearby fishermen and authorities.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="destructive" size="lg" className="h-24 text-lg">
                  <SOS className="h-6 w-6 mr-2" />
                  Request Immediate Help
                </Button>

                <Button variant="outline" size="lg" className="h-24 text-lg">
                  <Anchor className="h-6 w-6 mr-2" />
                  Engine/Boat Failure
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency-details">Additional Details (Optional)</Label>
                <Textarea id="emergency-details" placeholder="Describe your emergency situation..." rows={4} />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Your Current Location</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This information will be shared with emergency responders:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Latitude:</span> {currentLocation.lat.toFixed(4)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Longitude:</span> {currentLocation.lng.toFixed(4)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nearest Landmark:</span> Calculating...
                  </div>
                  <div>
                    <span className="text-muted-foreground">Distance to Shore:</span> Calculating...
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {reportHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No reports have been submitted yet.</div>
              ) : (
                reportHistory.map((report) => (
                  <div key={report.id} className="border rounded-md p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div
                          className={`bg-${report.type === "overfished" ? "yellow" : report.type === "danger" ? "orange" : "blue"}-100 p-1 rounded-full mr-2 dark:bg-${report.type === "overfished" ? "yellow" : report.type === "danger" ? "orange" : "blue"}-900/20`}
                        >
                          {getReportTypeIcon(report.type)}
                        </div>
                        <h3 className="font-medium">{getReportTypeLabel(report.type)}</h3>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {report.description || "No description provided"}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Location: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

