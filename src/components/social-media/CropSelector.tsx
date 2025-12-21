"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"
import type { CropName } from "@/lib/types"
import { CROP_NAMES_EN } from "@/lib/constants"

interface CropSelectorProps {
    crops: CropName[]
    selectedCrop: CropName | ""
    onSelect: (crop: CropName) => void
    label?: string
    maxHeight?: string
}

export function CropSelector({
    crops,
    selectedCrop,
    onSelect,
    label = "Select Crop",
    maxHeight = "h-32",
}: CropSelectorProps) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <ScrollArea className={`${maxHeight} border rounded-md p-2`}>
                <div className="flex flex-wrap gap-2">
                    {crops.map((crop) => {
                        const isSelected = selectedCrop === crop
                        return (
                            <Badge
                                key={crop}
                                variant={isSelected ? "default" : "outline"}
                                className="cursor-pointer select-none transition-colors"
                                onClick={() => onSelect(crop)}
                            >
                                {isSelected && <Check className="mr-1 h-3 w-3" />}
                                {CROP_NAMES_EN[crop] || crop}
                            </Badge>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
