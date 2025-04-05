"use client"

import { useState, useEffect } from "react"
import { Cloud, Wind, Droplets, Thermometer } from "lucide-react"

interface WeatherProps {
  coordinates: {
    lat: number
    lng: number
  }
}

interface WeatherData {
  main: {
    temp: number
    humidity: number
  }
  wind: {
    speed: number
  }
  weather: {
    main: string
    description: string
  }[]
}

export default function Weather({ coordinates }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        // In a real app, you would use an environment variable for the API key
        // and proxy this request through your backend
        const response = await fetch(`/api/weather?lat=${coordinates.lat}&lon=${coordinates.lng}`)

        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const data = await response.json()
        setWeather(data)
        setError(null)
      } catch (err) {
        setError("Could not load weather data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [coordinates])

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-xl font-bold mb-4">Current Weather</h2>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h2 className="text-xl font-bold mb-2">Current Weather</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Current Weather</h2>
      {weather && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Temperature</p>
              <p className="font-medium">{(weather.main.temp - 273.15).toFixed(1)}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Wind Speed</p>
              <p className="font-medium">{weather.wind.speed} m/s</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="text-blue-400" />
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-medium">{weather.main.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cloud className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Conditions</p>
              <p className="font-medium">{weather.weather[0].description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

