"use client"

import { useState, useCallback, useRef } from "react"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"

interface FishingMapProps {
  coordinates: {
    lat: number
    lng: number
  }
  setCoordinates: (coords: { lat: number; lng: number }) => void
}

// Tamil Nadu coastal boundaries (approximate)
const BOUNDARIES = {
  north: 13.5,
  south: 8.0,
  east: 80.4,
  west: 77.5,
}

export default function FishingMap({ coordinates, setCoordinates }: FishingMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Using environment variable for API key
  const { isLoaded, google } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    // Check if within Tamil Nadu coastal boundaries
    if (lat > BOUNDARIES.south && lat < BOUNDARIES.north && lng > BOUNDARIES.west && lng < BOUNDARIES.east) {
      setSelectedLocation({ lat, lng })
    }
  }, [])

  const confirmLocation = useCallback(() => {
    if (selectedLocation) {
      setCoordinates(selectedLocation)
      setSelectedLocation(null)
    }
  }, [selectedLocation, setCoordinates])

  const centerOnCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          setCoordinates(currentPosition)

          if (mapRef.current) {
            mapRef.current.panTo(currentPosition)
            mapRef.current.setZoom(12)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [setCoordinates])

  if (!isLoaded) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Fishing Map</h2>
        <Button variant="outline" onClick={centerOnCurrentLocation} className="flex items-center gap-2">
          <Compass size={16} />
          <span>Current Location</span>
        </Button>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={coordinates}
          zoom={10}
          onClick={handleMapClick}
          onLoad={onMapLoad}
          options={{
            mapTypeId: "hybrid",
            mapTypeControl: true,
            streetViewControl: false,
          }}
        >
          {/* Current selected location */}
          <Marker
            position={coordinates}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: google ? new google.maps.Size(40, 40) : { width: 40, height: 40 },
            }}
          />

          {/* New selected location */}
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: google ? new google.maps.Size(40, 40) : { width: 40, height: 40 },
              }}
            />
          )}

          {/* Restricted fishing zones (example) */}
          <Marker
            position={{ lat: 10.6, lng: 79.9 }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: google ? new google.maps.Size(40, 40) : { width: 40, height: 40 },
            }}
          />
        </GoogleMap>
      </div>

      {selectedLocation && (
        <div className="flex justify-end">
          <Button onClick={confirmLocation}>Set as Fishing Location</Button>
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>
          Current coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </p>
        <p>Click on the map to select a fishing location.</p>
      </div>
    </div>
  )
}

