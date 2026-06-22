// Poster and Social Media Types

// Object fit options for background images
export type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down"

// Background image styling
export interface BackgroundStyle {
    objectFit: ObjectFit
    objectPosition: string
}

// Position coordinates
export interface Position {
    x: number
    y: number
}

// Element with content and position
export interface PositionableElement {
    content: string
    position: Position
}

// Date circle state with sub-elements
export interface DateCircleState {
    position: Position
    topText: PositionableElement
    mainText: PositionableElement
    bottomText: PositionableElement
}

// Complete poster state
export interface PosterState {
    topText: string
    heading: PositionableElement
    paragraph: PositionableElement
    backgroundImage: string | null
    backgroundStyle: BackgroundStyle
    headerFooterBackgroundColor: string
    dateCircle: DateCircleState
    topLeftLogo: string | null
    topRightLogo: string | null
    footerLogos: string[]
}

// Crop image for background selection
export interface CropImage {
    id: string
    url: string
    title: string
    description: string
}

// Crop name union type
export type CropName =
    | "BEAN"
    | "CASHEW"
    | "CHICK PEA"
    | "COCOA"
    | "COFFEE"
    | "COTTON"
    | "GEMSTONE"
    | "GROUNDNUT"
    | "GREEN GRAM"
    | "PIGEON PEA"
    | "SESAME"
    | "SOYA"
    | "SUNFLOWER"
    | "COW PEA"

// Poster dimensions
export const POSTER_WIDTH = 1080
export const POSTER_HEIGHT = 1080
