"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Fish, Waves, Clock } from "lucide-react"

interface FishingPredictionsProps {
  coordinates: {
    lat: number
    lng: number
  }
}

interface Prediction {
  species: string
  probability: number
  bestTime: string
  icon: React.ReactNode
}

export default function FishingPredictions({ coordinates }: FishingPredictionsProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to your backend
    // which might use ML models or historical data to make predictions
    const fetchPredictions = async () => {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data based on coordinates
      const mockPredictions = [
        {
          species: "Seer Fish (Vanjaram)",
          probability: 0.85,
          bestTime: "Early Morning",
          icon: <Fish className="h-8 w-8 text-blue-500" />,
        },
        {
          species: "Indian Mackerel (Kanangeluthi)",
          probability: 0.75,
          bestTime: "Evening",
          icon: <Fish className="h-8 w-8 text-green-500" />,
        },
        {
          species: "Tuna (Choora)",
          probability: 0.65,
          bestTime: "Afternoon",
          icon: <Fish className="h-8 w-8 text-purple-500" />,
        },
      ]

      setPredictions(mockPredictions)
      setLoading(false)
    }

    fetchPredictions()
  }, [coordinates])

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Fishing Predictions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Fishing Predictions</h2>
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {prediction.icon}
                <div className="flex-1">
                  <h3 className="font-medium">{prediction.species}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Waves className="h-4 w-4" />
                      <span>{(prediction.probability * 100).toFixed(0)}% chance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{prediction.bestTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

