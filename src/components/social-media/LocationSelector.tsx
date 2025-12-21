"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X } from "lucide-react"

interface LocationSelectorProps {
    locations: string[]
    selectedLocations: string[]
    onToggle: (location: string) => void
    label?: string
    maxHeight?: string
}

export function LocationSelector({
    locations,
    selectedLocations,
    onToggle,
    label = "Select Locations",
    maxHeight = "h-48",
}: LocationSelectorProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <span className="text-sm text-muted-foreground">
                    {selectedLocations.length} selected
                </span>
            </div>
            <ScrollArea className={`${maxHeight} border rounded-md p-2`}>
                <div className="flex flex-wrap gap-2">
                    {locations.map((location) => {
                        const isSelected = selectedLocations.includes(location)
                        return (
                            <Badge
                                key={location}
                                variant={isSelected ? "default" : "outline"}
                                className="cursor-pointer select-none transition-colors"
                                onClick={() => onToggle(location)}
                            >
                                {isSelected && <Check className="mr-1 h-3 w-3" />}
                                {location}
                                {isSelected && (
                                    <X className="ml-1 h-3 w-3 hover:text-destructive" />
                                )}
                            </Badge>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
