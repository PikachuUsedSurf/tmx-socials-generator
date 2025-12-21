"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"

interface DateTimePickerProps {
    date: string
    time: string
    onDateChange: (date: string) => void
    onTimeChange: (time: string) => void
    dateLabel?: string
    timeLabel?: string
}

export function DateTimePicker({
    date,
    time,
    onDateChange,
    onTimeChange,
    dateLabel = "Date",
    timeLabel = "Time",
}: DateTimePickerProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {dateLabel}
                </Label>
                <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {timeLabel}
                </Label>
                <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => onTimeChange(e.target.value)}
                />
            </div>
        </div>
    )
}
