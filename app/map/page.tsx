import MapFullscreen from "@/components/map-fullscreen"

export default function MapPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Fishing Map</h1>
      <p className="text-gray-500">Explore fishing zones, mark your favorite spots, and view restricted areas.</p>
      <MapFullscreen />
    </div>
  )
}

