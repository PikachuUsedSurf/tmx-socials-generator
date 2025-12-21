"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { ImageUpload } from "./ImageUpload"

interface LogoManagerProps {
    footerLogos: string[]
    onLogoChange: (index: number, value: string | null) => void
    onAddLogo: () => void
    onRemoveLogo: (index: number) => void
    maxLogos?: number
}

export function LogoManager({
    footerLogos,
    onLogoChange,
    onAddLogo,
    onRemoveLogo,
    maxLogos = 6,
}: LogoManagerProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Footer Logos</Label>
                <span className="text-sm text-muted-foreground">
                    {footerLogos.length}/{maxLogos}
                </span>
            </div>

            <div className="space-y-3">
                {footerLogos.map((logo, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded-md"
                    >
                        <span className="text-sm font-medium w-8">#{index + 1}</span>
                        <div className="flex-1">
                            <ImageUpload
                                label={`Logo ${index + 1}`}
                                onUpload={(url) => onLogoChange(index, url)}
                                currentImage={logo}
                                isCompact
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveLogo(index)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {footerLogos.length < maxLogos && (
                <Button
                    onClick={onAddLogo}
                    variant="outline"
                    className="w-full"
                    size="sm"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Logo
                </Button>
            )}
        </div>
    )
}
