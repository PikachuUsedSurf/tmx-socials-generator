"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy } from "lucide-react"

interface ContentDisplayProps {
    label: string
    content: string
    onCopy: () => void
    showCharCount?: boolean
    charLimit?: number
    height?: string
}

export function ContentDisplay({
    label,
    content,
    onCopy,
    showCharCount = false,
    charLimit = 100,
    height = "h-64",
}: ContentDisplayProps) {
    const charCount = content.length
    const isOverLimit = charLimit && charCount > charLimit

    return (
        <div className="relative flex-1 space-y-2">
            <Label
                htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
                className="flex justify-between items-center"
            >
                <span>{label}</span>
                {showCharCount && (
                    <span
                        className={`text-sm ${isOverLimit ? "text-red-500" : "text-green-500"}`}
                    >
                        {charCount} characters
                    </span>
                )}
            </Label>
            <div className="relative">
                <Textarea
                    id={label.toLowerCase().replace(/\s+/g, "-")}
                    value={content}
                    readOnly
                    className={`${height} pr-10 resize-none`}
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2"
                    onClick={onCopy}
                    title="Copy to clipboard"
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
