"use client"

import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Trash2 } from "lucide-react"

interface ImageUploadProps {
    label: string
    onUpload: (url: string | null) => void
    currentImage: string | null
    isCompact?: boolean
}

export function ImageUpload({
    label,
    onUpload,
    currentImage,
    isCompact = false,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onUpload(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const triggerFileSelect = () => inputRef.current?.click()

    return (
        <div className={`space-y-2 ${isCompact ? "flex items-center gap-2" : ""}`}>
            {!isCompact && <Label className="text-sm font-medium">{label}</Label>}
            <div className={`flex items-center gap-2 ${isCompact ? "flex-1" : ""}`}>
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button
                    onClick={triggerFileSelect}
                    variant="outline"
                    className={`${isCompact ? "flex-1" : "w-full"} justify-center`}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    {isCompact ? "Change" : "Upload Image"}
                </Button>
                {currentImage && (
                    <div className="flex items-center gap-2">
                        <img
                            src={currentImage || "/placeholder.svg"}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded-md border"
                        />
                        <Button
                            onClick={() => onUpload(null)}
                            variant="destructive"
                            size="sm"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
