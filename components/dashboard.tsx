"use client"

import { useState, useEffect, useCallback } from "react"
import EnhancedWeather from "./enhanced-weather"
import EnhancedMap from "./enhanced-map"
import EnhancedFishingPredictions from "./enhanced-fishing-predictions"
import Alerts from "./alerts"
import type { FishingSpot } from "@/lib/marine-data-service"

export default function Dashboard() {
  const [coordinates, setCoordinates] = useState({ lat: 10.7654, lng: 79.8421 })
  const [isOffline, setIsOffline] = useState(false)
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFishingSpots = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/fishing-spots?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=20`)

      if (!response.ok) {
        throw new Error("Failed to fetch fishing spots")
      }

      const data = await response.json()
      setFishingSpots(data)
    } catch (err) {
      console.error("Error fetching fishing spots:", err)
    } finally {
      setLoading(false)
    }
  }, [coordinates])

  useEffect(() => {
    fetchFishingSpots()
  }, [fetchFishingSpots])

  useEffect(() => {
    // Check if user is online
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine)
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isOffline && (
        <div className="col-span-full bg-red-100 p-4 rounded-lg text-red-700 mb-4">
          You are currently offline. Some features may be limited.
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <EnhancedWeather coordinates={coordinates} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <EnhancedFishingPredictions coordinates={coordinates} />
      </div>

      <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Fishing Map</h2>
        <EnhancedMap
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          fishingSpots={fishingSpots}
          refreshFishingSpots={fetchFishingSpots}
        />
      </div>

      <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <Alerts />
      </div>
    </div>
  )
}

