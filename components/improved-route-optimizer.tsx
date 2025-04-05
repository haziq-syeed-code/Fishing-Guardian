"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Navigation, Anchor, Fuel, RotateCcw, Route, Clock } from "lucide-react"
import type { FishingSpot } from "@/lib/marine-data-service"

// Tamil Nadu harbors/ports
const HARBORS = [
  { id: "nagapattinam_port", name: "Nagapattinam Port", coordinates: { lat: 10.7654, lng: 79.8421 } },
  { id: "rameswaram_port", name: "Rameswaram Harbor", coordinates: { lat: 9.2882, lng: 79.3129 } },
  { id: "cuddalore_port", name: "Cuddalore Port", coordinates: { lat: 11.748, lng: 79.7714 } },
  { id: "tuticorin_port", name: "Tuticorin Harbor", coordinates: { lat: 8.7642, lng: 78.1348 } },
  { id: "chennai_port", name: "Chennai Harbor", coordinates: { lat: 13.0827, lng: 80.2707 } },
]

interface ImprovedRouteOptimizerProps {
  currentLocation: { lat: number; lng: number }
  fishingSpots: FishingSpot[]
  onRouteCalculated: (route: any) => void
}

export default function ImprovedRouteOptimizer({
  currentLocation,
  fishingSpots,
  onRouteCalculated,
}: ImprovedRouteOptimizerProps) {
  const [startLocation, setStartLocation] = useState("current")
  const [endLocation, setEndLocation] = useState("")
  const [customStartLat, setCustomStartLat] = useState("")
  const [customStartLng, setCustomStartLng] = useState("")
  const [customEndLat, setCustomEndLat] = useState("")
  const [customEndLng, setCustomEndLng] = useState("")
  const [boatSpeed, setBoatSpeed] = useState(20) // km/h
  const [fuelEfficiency, setFuelEfficiency] = useState(5) // liters per hour
  const [routeResult, setRouteResult] = useState<any>(null)
  const [calculating, setCalculating] = useState(false)

  // Set current location as default start
  useEffect(() => {
    if (currentLocation && startLocation === "current") {
      setCustomStartLat(currentLocation.lat.toString())
      setCustomStartLng(currentLocation.lng.toString())
    }
  }, [currentLocation, startLocation])

  const calculateRoute = async () => {
    // Validate inputs
    if (startLocation === "custom" && (!customStartLat || !customStartLng)) return
    if (endLocation === "custom" && (!customEndLat || !customEndLng)) return
    if (!endLocation) return

    setCalculating(true)

    try {
      // Get start coordinates
      let startLat = currentLocation.lat
      let startLng = currentLocation.lng

      if (startLocation !== "current") {
        if (startLocation === "custom") {
          startLat = Number.parseFloat(customStartLat)
          startLng = Number.parseFloat(customStartLng)
        } else {
          const harbor = HARBORS.find((h) => h.id === startLocation)
          if (harbor) {
            startLat = harbor.coordinates.lat
            startLng = harbor.coordinates.lng
          }
        }
      }

      // Get end coordinates
      let endLat: number
      let endLng: number

      if (endLocation === "custom") {
        endLat = Number.parseFloat(customEndLat)
        endLng = Number.parseFloat(customEndLng)
      } else {
        // Check if it's a fishing spot
        const spot = fishingSpots.find((s) => s.id === endLocation)
        if (spot) {
          endLat = spot.lat
          endLng = spot.lng
        } else {
          // Check if it's a harbor
          const harbor = HARBORS.find((h) => h.id === endLocation)
          if (harbor) {
            endLat = harbor.coordinates.lat
            endLng = harbor.coordinates.lng
          } else {
            throw new Error("Invalid destination")
          }
        }
      }

      // In a real app, we would call the API
      // For now, we'll simulate with our route optimization function
      const response = await fetch(
        `/api/route-optimization?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`,
      )

      if (!response.ok) {
        throw new Error("Failed to calculate route")
      }

      const routeData = await response.json()

      // Adjust for boat speed and fuel efficiency
      const speedFactor = boatSpeed / 12 // Default speed is 12 km/h
      const fuelFactor = fuelEfficiency / 12 // Default consumption is 12 L/h

      const adjustedTime = routeData.estimatedTime / speedFactor
      const adjustedFuel = (routeData.estimatedFuel * fuelFactor) / speedFactor

      // Generate waypoints for display
      const waypoints = [
        { lat: startLat, lng: startLng, name: "Start" },
        ...routeData.route.slice(1, -1).map((point: any, index: number) => ({
          ...point,
          name: `Waypoint ${index + 1}`,
        })),
        { lat: endLat, lng: endLng, name: "Destination" },
      ]

      const result = {
        ...routeData,
        estimatedTime: adjustedTime,
        estimatedFuel: adjustedFuel,
        waypoints,
        startCoordinates: { lat: startLat, lng: startLng },
        endCoordinates: { lat: endLat, lng: endLng },
      }

      setRouteResult(result)
      onRouteCalculated(result)
    } catch (error) {
      console.error("Error calculating route:", error)
    } finally {
      setCalculating(false)
    }
  }

  const resetForm = () => {
    setStartLocation("current")
    setEndLocation("")
    setCustomStartLat("")
    setCustomStartLng("")
    setCustomEndLat("")
    setCustomEndLng("")
    setBoatSpeed(20)
    setFuelEfficiency(5)
    setRouteResult(null)
    onRouteCalculated([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Route Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-location">Starting Point</Label>
              <Select value={startLocation} onValueChange={setStartLocation}>
                <SelectTrigger id="start-location">
                  <SelectValue placeholder="Select starting point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Location</SelectItem>
                  <SelectItem value="custom">Custom Coordinates</SelectItem>
                  <SelectItem value="_divider_harbors" disabled>
                    ─── Harbors ───
                  </SelectItem>
                  {HARBORS.map((harbor) => (
                    <SelectItem key={harbor.id} value={harbor.id}>
                      {harbor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {startLocation === "custom" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-lat">Latitude</Label>
                  <Input
                    id="start-lat"
                    placeholder="e.g. 10.7654"
                    value={customStartLat}
                    onChange={(e) => setCustomStartLat(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="start-lng">Longitude</Label>
                  <Input
                    id="start-lng"
                    placeholder="e.g. 79.8421"
                    value={customStartLng}
                    onChange={(e) => setCustomStartLng(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="end-location">Destination</Label>
              <Select value={endLocation} onValueChange={setEndLocation}>
                <SelectTrigger id="end-location">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Coordinates</SelectItem>
                  <SelectItem value="_divider_fishing" disabled>
                    ─── Fishing Spots ───
                  </SelectItem>
                  {fishingSpots.map((spot) => (
                    <SelectItem key={spot.id} value={spot.id}>
                      {spot.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="_divider_harbors" disabled>
                    ─── Harbors ───
                  </SelectItem>
                  {HARBORS.map((harbor) => (
                    <SelectItem key={harbor.id} value={harbor.id}>
                      {harbor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {endLocation === "custom" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="end-lat">Latitude</Label>
                  <Input
                    id="end-lat"
                    placeholder="e.g. 9.2882"
                    value={customEndLat}
                    onChange={(e) => setCustomEndLat(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-lng">Longitude</Label>
                  <Input
                    id="end-lng"
                    placeholder="e.g. 79.3129"
                    value={customEndLng}
                    onChange={(e) => setCustomEndLng(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="boat-speed">Boat Speed (km/h)</Label>
                <span className="text-sm">{boatSpeed} km/h</span>
              </div>
              <Slider
                id="boat-speed"
                min={5}
                max={40}
                step={1}
                value={[boatSpeed]}
                onValueChange={(value) => setBoatSpeed(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="fuel-efficiency">Fuel Consumption (L/h)</Label>
                <span className="text-sm">{fuelEfficiency} L/h</span>
              </div>
              <Slider
                id="fuel-efficiency"
                min={1}
                max={20}
                step={0.5}
                value={[fuelEfficiency]}
                onValueChange={(value) => setFuelEfficiency(value[0])}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateRoute} disabled={!endLocation || calculating} className="flex-1">
                {calculating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Route className="mr-2 h-4 w-4" />
                    Calculate Route
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={calculating}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div>
            {routeResult ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Optimized Route</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                    <Navigation className="h-5 w-5 mb-1 text-primary" />
                    <span className="text-sm text-muted-foreground">Distance</span>
                    <span className="font-medium">{routeResult.distance.toFixed(1)} km</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                    <Clock className="h-5 w-5 mb-1 text-primary" />
                    <span className="text-sm text-muted-foreground">Est. Time</span>
                    <span className="font-medium">
                      {Math.floor(routeResult.estimatedTime)} h {Math.round((routeResult.estimatedTime % 1) * 60)} min
                    </span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                    <Fuel className="h-5 w-5 mb-1 text-primary" />
                    <span className="text-sm text-muted-foreground">Fuel</span>
                    <span className="font-medium">{routeResult.estimatedFuel.toFixed(1)} L</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Waypoints</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {routeResult.waypoints.map((waypoint: any, index: number) => (
                      <div key={index} className="flex items-center p-2 border rounded-md">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                            index === 0
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                              : index === routeResult.waypoints.length - 1
                                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{waypoint.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Anchor className="mr-2 h-4 w-4" />
                    Start Navigation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed rounded-md p-8">
                <div className="text-center">
                  <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Route Optimizer</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select your starting point and destination to calculate the most fuel-efficient route.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    The optimizer considers weather conditions, currents, and the most direct path to save fuel.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

