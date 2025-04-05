import { NextResponse } from "next/server"
import { getMarineData } from "@/lib/marine-data-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const data = await getMarineData(Number.parseFloat(lat), Number.parseFloat(lng))
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching marine data:", error)
    return NextResponse.json({ error: "Failed to fetch marine data" }, { status: 500 })
  }
}

