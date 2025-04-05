"use client"

import React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, Marker, InfoWindow, useLoadScript, Circle } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Compass, Save, AlertTriangle } from "lucide-react"

// Tamil Nadu coastal boundaries (approximate)
const BOUNDARIES = {
  north: 13.5,
  south: 8.0,
  east: 80.4,
  west: 77.5,
}

// Restricted zones (example data)
const RESTRICTED_ZONES = [
  { lat: 10.6, lng: 79.9, radius: 5000, reason: "Marine sanctuary" },
  { lat: 10.2, lng: 79.5, radius: 3000, reason: "Naval exercise area" },
  { lat: 11.1, lng: 79.8, radius: 4000, reason: "Coral reef protection" },
]

// Recommended fishing spots (example data)
const RECOMMENDED_SPOTS = [
  { lat: 10.8, lng: 79.7, name: "Vanjaram Point", species: ["Seer Fish", "Tuna"] },
  { lat: 10.4, lng: 79.6, name: "Mathi Reef", species: ["Sardine", "Mackerel"] },
  { lat: 10.9, lng: 80.1, name: "Koduva Deep", species: ["Sea Bass", "Red Snapper"] },
]

interface SavedLocation {
  id: string
  lat: number
  lng: number
  name: string
  notes?: string
}

export default function MapFullscreen() {
  const [coordinates, setCoordinates] = useState({ lat: 10.7654, lng: 79.8421 })
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [locationName, setLocationName] = useState("")
  const mapRef = useRef<google.maps.Map | null>(null)

  // Using environment variable for API key
  const { isLoaded, google } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  // Load saved locations from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedFishingLocations")
      if (saved) {
        try {
          setSavedLocations(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse saved locations", e)
        }
      }
    }
  }, [])

  // Save locations to localStorage when updated
  useEffect(() => {
    if (typeof window !== "undefined" && savedLocations.length > 0) {
      localStorage.setItem("savedFishingLocations", JSON.stringify(savedLocations))
    }
  }, [savedLocations])

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
      setLocationName("")
    }
  }, [])

  const saveLocation = useCallback(() => {
    if (selectedLocation && locationName.trim()) {
      const newLocation: SavedLocation = {
        id: Date.now().toString(),
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        name: locationName.trim(),
      }

      setSavedLocations((prev) => [...prev, newLocation])
      setSelectedLocation(null)
      setLocationName("")
    }
  }, [selectedLocation, locationName])

  const deleteLocation = useCallback((id: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id))
    setSelectedMarker(null)
  }, [])

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
  }, [])

  if (!isLoaded) {
    return (
      <div className="h-[calc(100vh-12rem)] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={centerOnCurrentLocation} className="flex items-center gap-2">
          <Compass size={16} />
          <span>Current Location</span>
        </Button>

        {selectedLocation && (
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Save this location</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Location name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button onClick={saveLocation} disabled={!locationName.trim()} className="flex items-center gap-2">
                    <Save size={16} />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="h-[calc(100vh-12rem)] rounded-lg overflow-hidden border border-gray-200">
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
          {/* Current location */}
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

          {/* Saved locations */}
          {savedLocations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedMarker(location)}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                scaledSize: google ? new google.maps.Size(36, 36) : { width: 36, height: 36 },
              }}
            />
          ))}

          {/* Recommended fishing spots */}
          {RECOMMENDED_SPOTS.map((spot, index) => (
            <Marker
              key={`spot-${index}`}
              position={{ lat: spot.lat, lng: spot.lng }}
              onClick={() => setSelectedMarker(spot)}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: google ? new google.maps.Size(36, 36) : { width: 36, height: 36 },
              }}
            />
          ))}

          {/* Restricted zones */}
          {RESTRICTED_ZONES.map((zone, index) => (
            <React.Fragment key={`zone-${index}`}>
              <Circle
                center={{ lat: zone.lat, lng: zone.lng }}
                radius={zone.radius}
                options={{
                  fillColor: "#FF0000",
                  fillOpacity: 0.2,
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
              <Marker
                position={{ lat: zone.lat, lng: zone.lng }}
                onClick={() => setSelectedMarker(zone)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: google ? new google.maps.Size(36, 36) : { width: 36, height: 36 },
                }}
              />
            </React.Fragment>
          ))}

          {/* Info windows */}
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.lat,
                lng: selectedMarker.lng,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 max-w-xs">
                {/* Saved location */}
                {selectedMarker.id && (
                  <div>
                    <h3 className="font-bold">{selectedMarker.name}</h3>
                    <p className="text-sm text-gray-600">Your saved location</p>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => deleteLocation(selectedMarker.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Recommended spot */}
                {selectedMarker.species && (
                  <div>
                    <h3 className="font-bold">{selectedMarker.name}</h3>
                    <p className="text-sm text-gray-600">Recommended fishing spot</p>
                    <p className="text-sm mt-1">Common species:</p>
                    <ul className="text-xs list-disc pl-4">
                      {selectedMarker.species.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Restricted zone */}
                {selectedMarker.radius && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-red-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-red-600">Restricted Zone</h3>
                      <p className="text-sm">{selectedMarker.reason}</p>
                      <p className="text-xs mt-1">Fishing is prohibited in this area.</p>
                    </div>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      <div className="text-sm text-gray-500">
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
          Current location
        </p>
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
          Recommended fishing spots
        </p>
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
          Your saved locations
        </p>
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
          Restricted zones - No fishing allowed
        </p>
      </div>
    </div>
  )
}

