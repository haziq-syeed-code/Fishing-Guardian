"use client"

import React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, Marker, InfoWindow, Polyline, Circle, useLoadScript } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Compass, AlertTriangle, Flag } from "lucide-react"
import { isInInternationalWaters } from "@/lib/marine-data-service"
import type { FishingSpot } from "@/lib/marine-data-service"
import RouteOptimizer from "./route-optimizer"

interface EnhancedMapProps {
  coordinates: {
    lat: number
    lng: number
  }
  setCoordinates: (coords: { lat: number; lng: number }) => void
  fishingSpots: FishingSpot[]
  refreshFishingSpots: () => void
}

// Tamil Nadu coastal boundaries (approximate)
const BOUNDARIES = {
  north: 13.5,
  south: 8.0,
  east: 80.4,
  west: 77.5,
}

interface ReportedArea {
  id: string
  lat: number
  lng: number
  type: "overfished" | "unsafe"
  reportedBy: string
  reportedAt: string
  description?: string
  radius: number
}

export default function EnhancedMap({
  coordinates,
  setCoordinates,
  fishingSpots,
  refreshFishingSpots,
}: EnhancedMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null)
  const [reportedAreas, setReportedAreas] = useState<ReportedArea[]>([])
  const [isReporting, setIsReporting] = useState<"none" | "overfished" | "unsafe">("none")
  const [reportDescription, setReportDescription] = useState("")
  const [route, setRoute] = useState<{ lat: number; lng: number }[]>([])
  const [showTerritorialWarning, setShowTerritorialWarning] = useState(false)

  // Using environment variable for API key
  const { isLoaded, google } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  // Load reported areas from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reportedFishingAreas")
      if (saved) {
        try {
          setReportedAreas(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse reported areas", e)
        }
      }
    }
  }, [])

  // Save reported areas to localStorage when updated
  useEffect(() => {
    if (typeof window !== "undefined" && reportedAreas.length > 0) {
      localStorage.setItem("reportedFishingAreas", JSON.stringify(reportedAreas))
    }
  }, [reportedAreas])

  // Check for international waters
  useEffect(() => {
    const isInternational = isInInternationalWaters(coordinates.lat, coordinates.lng)
    setShowTerritorialWarning(isInternational)
  }, [coordinates])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return

      const lat = e.latLng.lat()
      const lng = e.latLng.lng()

      if (isReporting !== "none") {
        setSelectedLocation({ lat, lng })
      } else {
        // Check if within Tamil Nadu coastal boundaries
        if (lat > BOUNDARIES.south && lat < BOUNDARIES.north && lng > BOUNDARIES.west && lng < BOUNDARIES.east) {
          setCoordinates({ lat, lng })
          setSelectedMarker(null)
          setSelectedSpot(null)
          setRoute([])
        }
      }
    },
    [isReporting, setCoordinates],
  )

  const submitReport = useCallback(() => {
    if (selectedLocation && isReporting !== "none") {
      const newReport: ReportedArea = {
        id: Date.now().toString(),
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        type: isReporting,
        reportedBy: "Current User", // In a real app, this would be the user's name
        reportedAt: new Date().toISOString(),
        description: reportDescription,
        radius: isReporting === "overfished" ? 2000 : 1000, // 2km for overfished, 1km for unsafe
      }

      setReportedAreas((prev) => [...prev, newReport])
      setSelectedLocation(null)
      setReportDescription("")
      setIsReporting("none")

      // Refresh fishing spots to reflect the new reported area
      refreshFishingSpots()
    }
  }, [selectedLocation, isReporting, reportDescription, refreshFishingSpots])

  const cancelReport = useCallback(() => {
    setSelectedLocation(null)
    setReportDescription("")
    setIsReporting("none")
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
  }, [setCoordinates])

  const handleRouteCalculated = useCallback((routeData: { lat: number; lng: number }[]) => {
    setRoute(routeData)
  }, [])

  if (!isLoaded) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
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

        <Button
          variant={isReporting === "overfished" ? "default" : "outline"}
          onClick={() => setIsReporting(isReporting === "overfished" ? "none" : "overfished")}
          className="flex items-center gap-2"
        >
          <Flag size={16} />
          <span>Report Overfished Area</span>
        </Button>

        <Button
          variant={isReporting === "unsafe" ? "default" : "outline"}
          onClick={() => setIsReporting(isReporting === "unsafe" ? "none" : "unsafe")}
          className="flex items-center gap-2"
        >
          <AlertTriangle size={16} />
          <span>Report Unsafe Area</span>
        </Button>
      </div>

      {showTerritorialWarning && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 rounded-lg text-red-800 dark:text-red-300 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">International Waters Warning</h3>
            <p className="text-sm">
              You are approaching or have entered international waters. Please be aware of maritime boundaries and
              regulations.
            </p>
          </div>
        </div>
      )}

      {selectedLocation && isReporting !== "none" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium">
                {isReporting === "overfished" ? "Report Overfished Area" : "Report Unsafe Area"}
              </h3>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder={
                  isReporting === "overfished"
                    ? "Describe why this area is overfished (optional)"
                    : "Describe the unsafe conditions (optional)"
                }
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelReport}>
                  Cancel
                </Button>
                <Button onClick={submitReport}>Submit Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSpot && (
        <RouteOptimizer
          coordinates={coordinates}
          selectedSpot={selectedSpot}
          onRouteCalculated={handleRouteCalculated}
        />
      )}

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
          {/* Current location */}
          <Marker
            position={coordinates}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: google ? new google.maps.Size(40, 40) : { width: 40, height: 40 },
            }}
          />

          {/* Selected location for reporting */}
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              icon={{
                url:
                  isReporting === "overfished"
                    ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: google ? new google.maps.Size(40, 40) : { width: 40, height: 40 },
              }}
            />
          )}

          {/* Fishing spots */}
          {fishingSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.lat, lng: spot.lng }}
              onClick={() => {
                setSelectedMarker(spot)
                setSelectedSpot(spot)
              }}
              icon={{
                url: spot.isRestricted
                  ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  : spot.isOverfished
                    ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: google ? new google.maps.Size(36, 36) : { width: 36, height: 36 },
              }}
            />
          ))}

          {/* Reported areas */}
          {reportedAreas.map((area) => (
            <React.Fragment key={area.id}>
              <Circle
                center={{ lat: area.lat, lng: area.lng }}
                radius={area.radius}
                options={{
                  fillColor: area.type === "overfished" ? "#FFC107" : "#FF5252",
                  fillOpacity: 0.2,
                  strokeColor: area.type === "overfished" ? "#FFC107" : "#FF5252",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
              <Marker
                position={{ lat: area.lat, lng: area.lng }}
                onClick={() => setSelectedMarker(area)}
                icon={{
                  url:
                    area.type === "overfished"
                      ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: google ? new google.maps.Size(36, 36) : { width: 36, height: 36 },
                }}
              />
            </React.Fragment>
          ))}

          {/* Route line */}
          {route.length > 0 && (
            <Polyline
              path={route}
              options={{
                strokeColor: "#2196F3",
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }}
            />
          )}

          {/* Info windows */}
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.lat,
                lng: selectedMarker.lng,
              }}
              onCloseClick={() => {
                setSelectedMarker(null)
                if (selectedMarker.id === selectedSpot?.id) {
                  setSelectedSpot(null)
                  setRoute([])
                }
              }}
            >
              <div className="p-2 max-w-xs">
                {/* Fishing spot */}
                {selectedMarker.species && (
                  <div>
                    <h3 className="font-bold">{selectedMarker.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedMarker.isRestricted
                        ? "Restricted Area"
                        : selectedMarker.isOverfished
                          ? "Overfished Area"
                          : "Recommended Fishing Spot"}
                    </p>
                    {selectedMarker.species && (
                      <>
                        <p className="text-sm mt-1">Common species:</p>
                        <ul className="text-xs list-disc pl-4">
                          {selectedMarker.species.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedMarker.isRestricted && (
                      <p className="text-xs mt-1 text-red-600">Reason: {selectedMarker.restrictionReason}</p>
                    )}
                    <div className="mt-2 text-xs text-gray-500">Last updated: {selectedMarker.lastReported}</div>
                    {!selectedMarker.isRestricted && (
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedSpot(selectedMarker)
                            setRoute([])
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Get Route
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Reported area */}
                {selectedMarker.reportedBy && (
                  <div>
                    <h3 className="font-bold">
                      {selectedMarker.type === "overfished" ? "Overfished Area" : "Unsafe Area"}
                    </h3>
                    <p className="text-sm text-gray-600">Reported by: {selectedMarker.reportedBy}</p>
                    {selectedMarker.description && <p className="text-sm mt-1">{selectedMarker.description}</p>}
                    <div className="mt-2 text-xs text-gray-500">
                      Reported on: {new Date(selectedMarker.reportedAt).toLocaleDateString()}
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
          Good fishing spots
        </p>
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
          Overfished areas
        </p>
        <p>
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
          Restricted or unsafe areas
        </p>
      </div>
    </div>
  )
}

