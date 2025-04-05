"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fish, Clock, Calendar, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { FishingSpot } from "@/lib/marine-data-service"

interface EnhancedFishingPredictionsProps {
  coordinates: {
    lat: number
    lng: number
  }
}

export default function EnhancedFishingPredictions({ coordinates }: EnhancedFishingPredictionsProps) {
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFishingSpots = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/fishing-spots?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=20`)

        if (!response.ok) {
          throw new Error("Failed to fetch fishing spots")
        }

        const data = await response.json()
        setFishingSpots(data)
        setError(null)
      } catch (err) {
        setError("Could not load fishing spots")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFishingSpots()
  }, [coordinates])

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-xl font-bold mb-4">Fishing Predictions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h2 className="text-xl font-bold mb-2">Fishing Predictions</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (fishingSpots.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Fishing Predictions</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No fishing spots found in this area.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sort spots by rating (highest first)
  const sortedSpots = [...fishingSpots].sort((a, b) => b.currentRating - a.currentRating)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Fishing Predictions</h2>
      <div className="space-y-4">
        {sortedSpots.map((spot) => (
          <Card
            key={spot.id}
            className={`${
              spot.isRestricted
                ? "border-red-300 dark:border-red-800"
                : spot.isOverfished
                  ? "border-amber-300 dark:border-amber-800"
                  : spot.currentRating >= 8
                    ? "border-green-300 dark:border-green-800"
                    : ""
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>{spot.name}</span>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm font-medium ${
                      spot.currentRating >= 8
                        ? "text-green-600"
                        : spot.currentRating >= 6
                          ? "text-green-500"
                          : spot.currentRating >= 4
                            ? "text-yellow-500"
                            : spot.currentRating >= 2
                              ? "text-orange-500"
                              : "text-red-500"
                    }`}
                  >
                    Rating: {spot.currentRating}/10
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {spot.species.map((species, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950/20">
                      <Fish className="h-3 w-3 mr-1" />
                      {species}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Best time: {spot.bestTimeOfDay}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Seasons: {spot.bestSeasons.join(", ")}</span>
                  </div>
                </div>

                {(spot.isRestricted || spot.isOverfished) && (
                  <div
                    className={`mt-2 p-2 rounded text-sm ${
                      spot.isRestricted
                        ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                        : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        {spot.isRestricted
                          ? `Restricted area: ${spot.restrictionReason}`
                          : "This area has been reported as overfished"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2">Last updated: {spot.lastReported}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

