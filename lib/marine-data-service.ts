// This service combines data from multiple APIs to provide comprehensive marine information

// For wave height and ocean data, we'll use Stormglass API
// https://stormglass.io/ offers marine & weather data including wave height, currents, etc.
const STORMGLASS_API_KEY = process.env.STORMGLASS_API_KEY || ""

// For fishing predictions, we'll use a combination of weather, tide, and historical catch data
export interface MarineData {
  temperature: number
  windSpeed: number
  windDirection: string
  waveHeight: number
  tideLevel: string
  tideTime: string
  visibility: number
  pressure: number
  uvIndex: number
  currentSpeed?: number
  currentDirection?: string
  fishingIndex: number // 0-10 scale indicating how good conditions are for fishing
}

export interface FishingSpot {
  id: string
  name: string
  lat: number
  lng: number
  species: string[]
  bestTimeOfDay: string
  bestSeasons: string[]
  currentRating: number // 0-10 scale
  lastReported: string
  isOverfished: boolean
  isRestricted: boolean
  restrictionReason?: string
}

export async function getMarineData(lat: number, lng: number): Promise<MarineData> {
  try {
    // In a production app, you would call the Stormglass API here
    // For now, we'll simulate the response with realistic data

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate realistic data based on location and current date
    const now = new Date()
    const hour = now.getHours()
    const month = now.getMonth()

    // Seasonal variations
    const isSummer = month >= 3 && month <= 8 // April to September
    const baseTemp = isSummer ? 28 : 24

    // Time of day variations
    const isDaytime = hour >= 6 && hour <= 18
    const tempVariation = isDaytime ? 4 : -2

    // Location-based variations (coastal areas have more stable temperatures)
    const isCoastal = Math.abs(lng - 80) < 0.5 // Approximate coastal longitude
    const coastalFactor = isCoastal ? 0.7 : 1

    // Calculate values with some randomness for realism
    const temperature = baseTemp + tempVariation * coastalFactor + (Math.random() * 2 - 1)
    const windSpeed = (isSummer ? 10 : 15) + (Math.random() * 10 - 5)
    const waveHeight = (isSummer ? 0.8 : 1.5) + (Math.random() * 0.8 - 0.4)

    // Determine tide based on time (simplified model)
    const tideHour = hour % 12
    let tideLevel = "mid"
    let tideTime = ""

    if (tideHour < 3) {
      tideLevel = "rising"
      tideTime = "incoming"
    } else if (tideHour < 6) {
      tideLevel = "high"
      tideTime = "high tide"
    } else if (tideHour < 9) {
      tideLevel = "falling"
      tideTime = "outgoing"
    } else {
      tideLevel = "low"
      tideTime = "low tide"
    }

    // Calculate fishing index based on all factors
    // Best conditions: moderate temperature, moderate wind, rising tide, early morning or evening
    const timeQuality = hour < 9 || hour > 16 ? 2 : 0
    const tideQuality = tideLevel === "rising" ? 2 : tideLevel === "high" ? 1 : 0
    const windQuality = windSpeed > 5 && windSpeed < 20 ? 2 : windSpeed < 30 ? 1 : 0
    const waveQuality = waveHeight < 1.5 ? 2 : waveHeight < 2.5 ? 1 : 0

    const fishingIndex = Math.min(10, Math.max(0, 4 + timeQuality + tideQuality + windQuality + waveQuality))

    return {
      temperature,
      windSpeed,
      windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      waveHeight,
      tideLevel,
      tideTime,
      visibility: isDaytime ? 10 + (Math.random() * 5 - 2.5) : 5 + (Math.random() * 3 - 1.5),
      pressure: 1010 + (Math.random() * 10 - 5),
      uvIndex: isDaytime ? Math.floor(Math.random() * 10) + 1 : 0,
      currentSpeed: 0.5 + Math.random() * 1,
      currentDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      fishingIndex,
    }
  } catch (error) {
    console.error("Error fetching marine data:", error)
    throw new Error("Failed to fetch marine data")
  }
}

export async function getNearbyFishingSpots(lat: number, lng: number, radius = 20): Promise<FishingSpot[]> {
  try {
    // In a production app, you would query a database or API
    // For now, we'll generate spots around the given coordinates

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Common fish species in Tamil Nadu waters
    const tamilNaduSpecies = [
      "Seer Fish (Vanjaram)",
      "Indian Mackerel (Kanangeluthi)",
      "Tuna (Choora)",
      "Sardine (Mathi)",
      "Pomfret (Vavval)",
      "Red Snapper (Sankara)",
      "Barracuda (Sheela)",
      "Kingfish (Neimeen)",
      "Anchovy (Nethili)",
      "Shark (Sura)",
      "Crab (Nandu)",
      "Prawn (Eral)",
    ]

    // Generate 5-8 fishing spots around the given coordinates
    const numSpots = 5 + Math.floor(Math.random() * 4)
    const spots: FishingSpot[] = []

    for (let i = 0; i < numSpots; i++) {
      // Generate coordinates within the radius (approximate)
      // 0.01 degrees is roughly 1 km
      const latOffset = (Math.random() * 2 - 1) * radius * 0.01
      const lngOffset = (Math.random() * 2 - 1) * radius * 0.01

      // Select 1-3 random fish species
      const numSpecies = 1 + Math.floor(Math.random() * 3)
      const species: string[] = []
      for (let j = 0; j < numSpecies; j++) {
        const randomSpecies = tamilNaduSpecies[Math.floor(Math.random() * tamilNaduSpecies.length)]
        if (!species.includes(randomSpecies)) {
          species.push(randomSpecies)
        }
      }

      // Determine if spot is overfished (10% chance)
      const isOverfished = Math.random() < 0.1

      // Determine if spot is restricted (5% chance)
      const isRestricted = Math.random() < 0.05

      // Generate a name based on location and species
      const locationPrefixes = ["North", "South", "East", "West", "Deep", "Shallow", "Rocky", "Sandy"]
      const locationSuffixes = ["Point", "Reef", "Bank", "Shoal", "Ridge", "Channel", "Bay"]
      const name = `${locationPrefixes[Math.floor(Math.random() * locationPrefixes.length)]} ${
        species[0].split(" ")[0]
      } ${locationSuffixes[Math.floor(Math.random() * locationSuffixes.length)]}`

      // Best time of day
      const bestTimes = ["Early Morning", "Morning", "Noon", "Afternoon", "Evening", "Night"]
      const bestTimeOfDay = bestTimes[Math.floor(Math.random() * bestTimes.length)]

      // Best seasons
      const seasons = ["Spring", "Summer", "Monsoon", "Winter"]
      const numSeasons = 1 + Math.floor(Math.random() * 3)
      const bestSeasons: string[] = []
      for (let j = 0; j < numSeasons; j++) {
        const randomSeason = seasons[Math.floor(Math.random() * seasons.length)]
        if (!bestSeasons.includes(randomSeason)) {
          bestSeasons.push(randomSeason)
        }
      }

      // Current rating (influenced by overfishing)
      const baseRating = 5 + Math.floor(Math.random() * 6)
      const currentRating = isOverfished ? Math.max(1, baseRating - 4) : baseRating

      // Last reported date (within the last month)
      const daysAgo = Math.floor(Math.random() * 30)
      const lastReported = new Date()
      lastReported.setDate(lastReported.getDate() - daysAgo)

      spots.push({
        id: `spot-${i}`,
        name,
        lat: lat + latOffset,
        lng: lng + lngOffset,
        species,
        bestTimeOfDay,
        bestSeasons,
        currentRating,
        lastReported: lastReported.toISOString().split("T")[0],
        isOverfished,
        isRestricted,
        restrictionReason: isRestricted
          ? ["Marine sanctuary", "Naval exercise area", "International waters", "Coral reef protection"][
              Math.floor(Math.random() * 4)
            ]
          : undefined,
      })
    }

    return spots
  } catch (error) {
    console.error("Error fetching fishing spots:", error)
    throw new Error("Failed to fetch fishing spots")
  }
}

// International waters boundary check (simplified)
// In reality, this would use precise maritime boundary data
export function isInInternationalWaters(lat: number, lng: number): boolean {
  // Simplified check: Tamil Nadu coastal waters extend roughly 12 nautical miles (22.2 km)
  // We'll use a simple distance calculation from the coastline
  // This is a very simplified model - real implementation would use proper maritime boundaries

  // Approximate Tamil Nadu coastline points
  const coastlinePoints = [
    { lat: 13.05, lng: 80.25 }, // Chennai
    { lat: 12.62, lng: 80.18 }, // Mahabalipuram
    { lat: 11.93, lng: 79.83 }, // Pondicherry
    { lat: 11.42, lng: 79.7 }, // Cuddalore
    { lat: 10.77, lng: 79.84 }, // Nagapattinam
    { lat: 10.39, lng: 79.85 }, // Vedaranyam
    { lat: 9.28, lng: 79.31 }, // Rameswaram
    { lat: 8.08, lng: 77.55 }, // Kanyakumari
  ]

  // Find minimum distance to coastline
  let minDistance = Number.MAX_VALUE

  for (let i = 0; i < coastlinePoints.length; i++) {
    const distance = calculateDistance(lat, lng, coastlinePoints[i].lat, coastlinePoints[i].lng)
    minDistance = Math.min(minDistance, distance)
  }

  // Convert km to nautical miles (1 km ≈ 0.539957 nautical miles)
  const distanceNM = minDistance * 0.539957

  // International waters start at 12 nautical miles from coastline
  return distanceNM > 12
}

// Calculate distance between two points in km using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate optimal route between two points
// In a real app, this would use a proper routing algorithm with ocean currents, obstacles, etc.
export function calculateOptimalRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  currentSpeed?: number,
  currentDirection?: string,
): {
  route: { lat: number; lng: number }[]
  distance: number
  estimatedFuel: number
  estimatedTime: number
} {
  // For now, we'll create a simple route with a few points
  // A real implementation would consider currents, obstacles, and fuel efficiency

  // Create a slightly curved route between start and end
  const route = []
  const numPoints = 5 // Number of points in the route

  // Direct distance
  const directDistance = calculateDistance(startLat, startLng, endLat, endLng)

  // Add some curvature based on currents if available
  let curveFactor = 0.1 // Default slight curve

  if (currentSpeed && currentDirection) {
    // Adjust curve based on current strength and direction
    curveFactor = Math.min(0.3, currentSpeed / 10)

    // Direction adjustment would be more complex in a real implementation
    // This is a simplified version
  }

  // Generate route points
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints

    // Linear interpolation between start and end
    const lat = startLat + (endLat - startLat) * fraction
    const lng = startLng + (endLng - startLng) * fraction

    // Add some curvature (simplified)
    const curveAdjustment = Math.sin(fraction * Math.PI) * curveFactor

    // Perpendicular offset
    const dx = endLng - startLng
    const dy = endLat - startLat
    const perpLat = -dx * curveAdjustment
    const perpLng = dy * curveAdjustment

    route.push({
      lat: lat + perpLat,
      lng: lng + perpLng,
    })
  }

  // Calculate total distance along the route
  let totalDistance = 0
  for (let i = 1; i < route.length; i++) {
    totalDistance += calculateDistance(route[i - 1].lat, route[i - 1].lng, route[i].lat, route[i].lng)
  }

  // Estimate fuel consumption (very simplified)
  // Assuming a small fishing boat uses about 10-15 liters per hour
  // and travels at about 10-15 km/h
  const averageSpeed = 12 // km/h
  const fuelConsumptionPerHour = 12 // liters/hour

  const estimatedTime = totalDistance / averageSpeed // hours
  const estimatedFuel = estimatedTime * fuelConsumptionPerHour // liters

  return {
    route,
    distance: totalDistance,
    estimatedFuel,
    estimatedTime,
  }
}

