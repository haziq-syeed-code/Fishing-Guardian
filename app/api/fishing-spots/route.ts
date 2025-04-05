import { NextResponse } from "next/server"
import { getNearbyFishingSpots } from "@/lib/marine-data-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius")

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const data = await getNearbyFishingSpots(
      Number.parseFloat(lat),
      Number.parseFloat(lng),
      radius ? Number.parseFloat(radius) : undefined,
    )
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching fishing spots:", error)
    return NextResponse.json({ error: "Failed to fetch fishing spots" }, { status: 500 })
  }
}

