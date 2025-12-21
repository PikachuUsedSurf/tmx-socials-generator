"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ImageIcon } from "lucide-react"
import type { CropName, CropImage } from "@/lib/types"
import { CROP_BACKGROUND_IMAGES, CROP_NAMES_EN } from "@/lib/constants"

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
    if (!selectedCrop) {
        return (
            <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a crop to see relevant background images</p>
            </div>
        )
    }

    const cropImages: CropImage[] = CROP_BACKGROUND_IMAGES[selectedCrop] || []

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                    {CROP_NAMES_EN[selectedCrop]} Background Images ({cropImages.length}{" "}
                    available)
                </Label>
                <Badge variant="outline" className="text-xs">
                    {selectedCrop}
                </Badge>
            </div>

            <ScrollArea className="h-64 w-full border rounded-md p-2">
                <div className="grid grid-cols-2 gap-2">
                    {cropImages.map((image) => (
                        <div
                            key={image.id}
                            className={`relative group cursor-pointer border rounded-md overflow-hidden transition-colors ${currentImage === image.url
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "hover:border-blue-500"
                                }`}
                            onClick={() => onImageSelect(image.url)}
                        >
                            <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.title}
                                className="w-full h-24 object-cover"
                                crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                                <Button
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {currentImage === image.url ? "Selected" : "Select"}
                                </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                                <div className="truncate font-medium" title={image.title}>
                                    {image.title}
                                </div>
                                <div
                                    className="text-gray-300 text-xs truncate"
                                    title={image.description}
                                >
                                    {image.description}
                                </div>
                            </div>
                            {currentImage === image.url && (
                                <div className="absolute top-1 right-1">
                                    <Check className="h-4 w-4 text-blue-500 bg-white rounded-full p-0.5" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p>
                    💡 <strong>Tip:</strong> These images are specifically curated for{" "}
                    {CROP_NAMES_EN[selectedCrop]} auctions. You can also upload your own
                    custom image using the upload button above.
                </p>
            </div>
        </div>
    )
}
