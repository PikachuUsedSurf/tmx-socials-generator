"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, ImageIcon, Globe, HardDrive, AlertCircle } from "lucide-react"
import type { CropName, CropImage } from "@/lib/types"
import { CROP_BACKGROUND_IMAGES, CROP_NAMES_EN } from "@/lib/constants"

interface WebImage {
    id: string
    url: string
    title: string
    description: string
    photographer: string
    photographerUrl: string
    source: "pexels"
}

interface CropImageSelectorProps {
    selectedCrop: CropName | ""
    onImageSelect: (imageUrl: string) => void
    currentImage: string | null
}

export function CropImageSelector({
    selectedCrop,
    onImageSelect,
    currentImage,
}: CropImageSelectorProps) {
    const [webImages, setWebImages] = useState<WebImage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch web images when crop changes
    useEffect(() => {
        if (!selectedCrop) {
            setWebImages([])
            return
        }

        const fetchWebImages = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/images?crop=${encodeURIComponent(selectedCrop)}`)
                const data = await response.json()

                if (data.images) {
                    setWebImages(data.images)
                } else {
                    setWebImages([])
                }
            } catch (err) {
                console.error("Failed to fetch web images:", err)
                setError("Failed to load web images")
                setWebImages([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchWebImages()
    }, [selectedCrop])

    if (!selectedCrop) {
        return (
            <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a crop to see relevant background images</p>
            </div>
        )
    }

    const localImages: CropImage[] = CROP_BACKGROUND_IMAGES[selectedCrop] || []

    // Render an image card
    const renderImageCard = (
        id: string,
        url: string,
        title: string,
        description: string,
        isWeb: boolean = false
    ) => (
        <div
            key={id}
            className={`relative group cursor-pointer border rounded-md overflow-hidden transition-colors ${currentImage === url
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "hover:border-blue-500"
                }`}
            onClick={() => onImageSelect(url)}
        >
            <img
                src={url || "/placeholder.svg"}
                alt={title}
                className="w-full h-24 object-cover"
                crossOrigin="anonymous"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {currentImage === url ? "Selected" : "Select"}
                </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                <div className="truncate font-medium flex items-center gap-1" title={title}>
                    {isWeb && <Globe className="h-3 w-3 flex-shrink-0" />}
                    {title}
                </div>
                <div className="text-gray-300 text-xs truncate" title={description}>
                    {description}
                </div>
            </div>
            {currentImage === url && (
                <div className="absolute top-1 right-1">
                    <Check className="h-4 w-4 text-blue-500 bg-white rounded-full p-0.5" />
                </div>
            )}
        </div>
    )

    // Loading skeleton for web images
    const renderSkeleton = () => (
        <>
            {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full h-24 rounded-md" />
            ))}
        </>
    )

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                    {CROP_NAMES_EN[selectedCrop]} Background Images
                </Label>
                <Badge variant="outline" className="text-xs">
                    {selectedCrop}
                </Badge>
            </div>

            <ScrollArea className="h-80 w-full border rounded-md p-2">
                {/* Local Images Section */}
                {localImages.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <HardDrive className="h-4 w-4" />
                            <span>Local Images ({localImages.length})</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {localImages.map((image) =>
                                renderImageCard(
                                    image.id,
                                    image.url,
                                    image.title,
                                    image.description,
                                    false
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Web Images Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                        <Globe className="h-4 w-4" />
                        <span>
                            Web Images {!isLoading && `(${webImages.length})`}
                            {isLoading && "..."}
                        </span>
                        {webImages.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                Pexels
                            </Badge>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-2">{renderSkeleton()}</div>
                    ) : error ? (
                        <div className="flex items-center gap-2 text-sm text-orange-600 p-2 bg-orange-50 rounded">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    ) : webImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {webImages.map((image) =>
                                renderImageCard(
                                    image.id,
                                    image.url,
                                    image.title,
                                    image.description,
                                    true
                                )
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded text-center">
                            No web images found
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Footer tip */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p>
                    💡 <strong>Tip:</strong> Local images are curated for{" "}
                    {CROP_NAMES_EN[selectedCrop]} auctions. Web images are fetched from
                    Pexels. You can also upload your own custom image.
                </p>
            </div>
        </div>
    )
}
