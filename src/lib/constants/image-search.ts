import type { CropName } from "@/lib/types"

// Optimized search terms for each crop to get better Pexels results
export const CROP_SEARCH_TERMS: Record<CropName, string> = {
    BEAN: "beans farming harvest",
    CASHEW: "cashew nuts tree",
    "CHICK PEA": "chickpea field harvest",
    COCOA: "cocoa beans plantation",
    COFFEE: "coffee beans plantation",
    COTTON: "cotton field harvest",
    GEMSTONE: "gemstone mining tanzanite",
    GROUNDNUT: "peanut groundnut farming",
    "GREEN GRAM": "mung bean green gram",
    "PIGEON PEA": "pigeon pea field",
    SESAME: "sesame seeds field",
    SOYA: "soybean field harvest",
    SUNFLOWER: "sunflower field golden",
}

// Pexels API configuration
export const PEXELS_CONFIG = {
    baseUrl: "https://api.pexels.com/v1",
    perPage: 8, // Number of images to fetch
    orientation: "square" as const, // Best for 1080x1080 posters
}
