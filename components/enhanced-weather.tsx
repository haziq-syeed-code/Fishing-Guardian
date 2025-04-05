"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Wind, Droplets, Waves, Compass, Clock, Gauge, Sun } from "lucide-react"
import type { MarineData } from "@/lib/marine-data-service"

interface EnhancedWeatherProps {
  coordinates: {
    lat: number
    lng: number
  }
}

export default function EnhancedWeather({ coordinates }: EnhancedWeatherProps) {
  const [marineData, setMarineData] = useState<MarineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarineData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/marine-data?lat=${coordinates.lat}&lng=${coordinates.lng}`)

        if (!response.ok) {
          throw new Error("Failed to fetch marine data")
        }

        const data = await response.json()
        setMarineData(data)
        setError(null)
      } catch (err) {
        setError("Could not load marine data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMarineData()
  }, [coordinates])

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-xl font-bold mb-4">Marine Conditions</h2>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h2 className="text-xl font-bold mb-2">Marine Conditions</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!marineData) return null

  // Determine fishing quality text and color
  let fishingQualityText = "Poor"
  let fishingQualityColor = "text-red-500"

  if (marineData.fishingIndex >= 8) {
    fishingQualityText = "Excellent"
    fishingQualityColor = "text-green-600"
  } else if (marineData.fishingIndex >= 6) {
    fishingQualityText = "Good"
    fishingQualityColor = "text-green-500"
  } else if (marineData.fishingIndex >= 4) {
    fishingQualityText = "Fair"
    fishingQualityColor = "text-yellow-500"
  } else if (marineData.fishingIndex >= 2) {
    fishingQualityText = "Poor"
    fishingQualityColor = "text-orange-500"
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Marine Conditions</h2>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Current Conditions</span>
            <div className={`text-lg ${fishingQualityColor}`}>Fishing Quality: {fishingQualityText}</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="text-red-500 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="font-medium">{marineData.temperature.toFixed(1)}°C</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="text-blue-500 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">Wind</p>
                <p className="font-medium">
                  {marineData.windSpeed.toFixed(1)} km/h {marineData.windDirection}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Waves className="text-blue-400 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">Wave Height</p>
                <p className="font-medium">{marineData.waveHeight.toFixed(1)} m</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-gray-500 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">Tide</p>
                <p className="font-medium">{marineData.tideTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Compass className="text-indigo-500 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">Current</p>
                <p className="font-medium">
                  {marineData.currentSpeed?.toFixed(1)} knots {marineData.currentDirection}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Gauge className="text-purple-500 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">Pressure</p>
                <p className="font-medium">{marineData.pressure.toFixed(0)} hPa</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="text-blue-400 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">Visibility</p>
                <p className="font-medium">{marineData.visibility.toFixed(1)} km</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="text-yellow-500 h-8 w-8" />
              <div>
                <p className="text-sm text-gray-500">UV Index</p>
                <p className="font-medium">{marineData.uvIndex}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fishing Conditions</span>
              <span className="text-sm text-gray-500">{marineData.fishingIndex}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className={`h-2.5 rounded-full ${
                  marineData.fishingIndex >= 8
                    ? "bg-green-600"
                    : marineData.fishingIndex >= 6
                      ? "bg-green-500"
                      : marineData.fishingIndex >= 4
                        ? "bg-yellow-500"
                        : marineData.fishingIndex >= 2
                          ? "bg-orange-500"
                          : "bg-red-500"
                }`}
                style={{ width: `${marineData.fishingIndex * 10}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

