import { NextRequest, NextResponse } from "next/server"
import { CROP_SEARCH_TERMS, PEXELS_CONFIG } from "@/lib/constants/image-search"
import type { CropName } from "@/lib/types"

// In-memory cache for API responses (1 hour TTL)
const cache = new Map<string, { data: PexelsImage[]; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

interface PexelsPhoto {
    id: number
    width: number
    height: number
    url: string
    photographer: string
    photographer_url: string
    alt: string
    src: {
        original: string
        large2x: string
        large: string
        medium: string
        small: string
        portrait: string
        landscape: string
        tiny: string
    }
}

interface PexelsResponse {
    total_results: number
    page: number
    per_page: number
    photos: PexelsPhoto[]
}

export interface PexelsImage {
    id: string
    url: string
    title: string
    description: string
    photographer: string
    photographerUrl: string
    source: "pexels"
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const crop = searchParams.get("crop") as CropName | null

    if (!crop) {
        return NextResponse.json(
            { error: "Missing crop parameter" },
            { status: 400 }
        )
    }

    // Check cache first
    const cacheKey = crop
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({ images: cached.data, cached: true })
    }

    const apiKey = process.env.PEXELS_API_KEY
    if (!apiKey) {
        return NextResponse.json(
            { error: "Pexels API key not configured", images: [] },
            { status: 200 } // Return 200 with empty array so UI doesn't break
        )
    }

    const searchTerm = CROP_SEARCH_TERMS[crop] || crop.toLowerCase()

    try {
        const response = await fetch(
            `${PEXELS_CONFIG.baseUrl}/search?query=${encodeURIComponent(searchTerm)}&per_page=${PEXELS_CONFIG.perPage}&orientation=${PEXELS_CONFIG.orientation}`,
            {
                headers: {
                    Authorization: apiKey,
                },
            }
        )

        if (!response.ok) {
            console.error("Pexels API error:", response.status, response.statusText)
            return NextResponse.json(
                { error: "Failed to fetch images", images: [] },
                { status: 200 }
            )
        }

        const data: PexelsResponse = await response.json()

        const images: PexelsImage[] = data.photos.map((photo) => ({
            id: `pexels-${photo.id}`,
            url: photo.src.large, // Good quality for posters
            title: photo.alt || `${crop} image`,
            description: `Photo by ${photo.photographer}`,
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
            source: "pexels" as const,
        }))

        // Cache the results
        cache.set(cacheKey, { data: images, timestamp: Date.now() })

        return NextResponse.json({ images, cached: false })
    } catch (error) {
        console.error("Error fetching Pexels images:", error)
        return NextResponse.json(
            { error: "Failed to fetch images", images: [] },
            { status: 200 }
        )
    }
}
