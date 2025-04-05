"use client"

import { useState, useEffect } from "react"
import ReportActivity from "@/components/report-activity"

export default function ReportPage() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 10.7654, lng: 79.8421 })

  useEffect(() => {
    // Get current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleReportSubmitted = (report: any) => {
    console.log("Report submitted:", report)
    // In a real app, you would send this to your backend
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Report Activity</h1>
        <p className="text-gray-500">Report overfished areas, dangerous conditions, or request assistance</p>
      </div>

      <ReportActivity currentLocation={currentLocation} onReportSubmitted={handleReportSubmitted} />
    </div>
  )
}

