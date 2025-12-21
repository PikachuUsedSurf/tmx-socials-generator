"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PositionSlider } from "./PositionSlider"
import type { DateCircleState } from "@/lib/types"
import { POSTER_WIDTH, POSTER_HEIGHT } from "@/lib/types"

interface DateCircleEditorProps {
    dateCircle: DateCircleState
    onChange: (dateCircle: DateCircleState) => void
}

export function DateCircleEditor({
    dateCircle,
    onChange,
}: DateCircleEditorProps) {
    const updatePosition = (axis: "x" | "y", value: number) => {
        onChange({
            ...dateCircle,
            position: { ...dateCircle.position, [axis]: value },
        })
    }

    const updateTopText = (content: string) => {
        onChange({
            ...dateCircle,
            topText: { ...dateCircle.topText, content },
        })
    }

    const updateMainText = (content: string) => {
        onChange({
            ...dateCircle,
            mainText: { ...dateCircle.mainText, content },
        })
    }

    const updateBottomText = (content: string) => {
        onChange({
            ...dateCircle,
            bottomText: { ...dateCircle.bottomText, content },
        })
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm">Date Circle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Position Controls */}
                <div className="grid grid-cols-2 gap-4">
                    <PositionSlider
                        label="X Position"
                        value={dateCircle.position.x}
                        onChange={(value) => updatePosition("x", value)}
                        max={POSTER_WIDTH}
                    />
                    <PositionSlider
                        label="Y Position"
                        value={dateCircle.position.y}
                        onChange={(value) => updatePosition("y", value)}
                        max={POSTER_HEIGHT}
                    />
                </div>

                {/* Content Controls */}
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label className="text-xs">Top Text (e.g., "Tarehe")</Label>
                        <Input
                            value={dateCircle.topText.content}
                            onChange={(e) => updateTopText(e.target.value)}
                            placeholder="Tarehe"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs">Main Text (Day Number)</Label>
                        <Input
                            value={dateCircle.mainText.content}
                            onChange={(e) => updateMainText(e.target.value)}
                            placeholder="23"
                            className="text-2xl font-bold text-center"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs">Bottom Text (Month & Year)</Label>
                        <Input
                            value={dateCircle.bottomText.content}
                            onChange={(e) => updateBottomText(e.target.value)}
                            placeholder="Julai\n2025"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
