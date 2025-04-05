"use client"

import { useState, useEffect } from "react"
import ImprovedRouteOptimizer from "@/components/improved-route-optimizer"
import { getNearbyFishingSpots } from "@/lib/marine-data-service"
import type { FishingSpot } from "@/lib/marine-data-service"

export default function RouteOptimizerPage() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 10.7654, lng: 79.8421 })
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState<any>(null)

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

    // Fetch fishing spots
    const fetchFishingSpots = async () => {
      try {
        setLoading(true)
        const spots = await getNearbyFishingSpots(currentLocation.lat, currentLocation.lng, 30)
        setFishingSpots(spots)
      } catch (error) {
        console.error("Error fetching fishing spots:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFishingSpots()
  }, [currentLocation.lat, currentLocation.lng])

  const handleRouteCalculated = (routeData: any) => {
    setRoute(routeData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Route Optimizer</h1>
        <p className="text-gray-500">Plan the most fuel-efficient route to your fishing destination</p>
      </div>

      <ImprovedRouteOptimizer
        currentLocation={currentLocation}
        fishingSpots={fishingSpots}
        onRouteCalculated={handleRouteCalculated}
      />
    </div>
  )
}

