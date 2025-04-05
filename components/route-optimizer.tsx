"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Compass, Fuel, Clock, Route } from "lucide-react"
import type { FishingSpot } from "@/lib/marine-data-service"

interface RouteOptimizerProps {
  coordinates: {
    lat: number
    lng: number
  }
  selectedSpot: FishingSpot | null
  onRouteCalculated: (route: { lat: number; lng: number }[]) => void
}

interface RouteData {
  route: { lat: number; lng: number }[]
  distance: number
  estimatedFuel: number
  estimatedTime: number
}

export default function RouteOptimizer({ coordinates, selectedSpot, onRouteCalculated }: RouteOptimizerProps) {
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateRoute = async () => {
    if (!selectedSpot) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/route-optimization?startLat=${coordinates.lat}&startLng=${coordinates.lng}&endLat=${selectedSpot.lat}&endLng=${selectedSpot.lng}`,
      )

      if (!response.ok) {
        throw new Error("Failed to calculate route")
      }

      const data = await response.json()
      setRouteData(data)
      onRouteCalculated(data.route)
    } catch (err) {
      setError("Could not calculate route")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Clear route data when selected spot changes
  useEffect(() => {
    setRouteData(null)
  }, [selectedSpot])

  if (!selectedSpot) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Route to {selectedSpot.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!routeData && (
          <div className="flex justify-center">
            <Button onClick={calculateRoute} disabled={loading} className="flex items-center gap-2">
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Route className="h-4 w-4" />
                  <span>Calculate Optimal Route</span>
                </>
              )}
            </Button>
          </div>
        )}

        {error && <div className="text-red-500 text-center mt-2">{error}</div>}

        {routeData && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Compass className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-xs text-gray-500">Distance</span>
                <span className="font-medium">{routeData.distance.toFixed(1)} km</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Fuel className="h-5 w-5 text-green-500 mb-1" />
                <span className="text-xs text-gray-500">Est. Fuel</span>
                <span className="font-medium">{routeData.estimatedFuel.toFixed(1)} L</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="h-5 w-5 text-purple-500 mb-1" />
                <span className="text-xs text-gray-500">Est. Time</span>
                <span className="font-medium">
                  {Math.floor(routeData.estimatedTime)} h {Math.round((routeData.estimatedTime % 1) * 60)} min
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>This route is optimized for fuel efficiency based on current marine conditions.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

