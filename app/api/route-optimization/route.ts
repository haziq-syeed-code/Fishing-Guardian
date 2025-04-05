import { NextResponse } from "next/server"
import { calculateOptimalRoute, getMarineData } from "@/lib/marine-data-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startLat = searchParams.get("startLat")
  const startLng = searchParams.get("startLng")
  const endLat = searchParams.get("endLat")
  const endLng = searchParams.get("endLng")

  if (!startLat || !startLng || !endLat || !endLng) {
    return NextResponse.json({ error: "Start and end coordinates are required" }, { status: 400 })
  }

  try {
    // Get current marine data for the midpoint to consider currents
    const midLat = (Number.parseFloat(startLat) + Number.parseFloat(endLat)) / 2
    const midLng = (Number.parseFloat(startLng) + Number.parseFloat(endLng)) / 2

    const marineData = await getMarineData(midLat, midLng)

    const routeData = calculateOptimalRoute(
      Number.parseFloat(startLat),
      Number.parseFloat(startLng),
      Number.parseFloat(endLat),
      Number.parseFloat(endLng),
      marineData.currentSpeed,
      marineData.currentDirection,
    )

    return NextResponse.json(routeData)
  } catch (error) {
    console.error("Error calculating optimal route:", error)
    return NextResponse.json({ error: "Failed to calculate optimal route" }, { status: 500 })
  }
}

