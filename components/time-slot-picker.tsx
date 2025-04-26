"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

type TimeSlot = {
    start: string
    end: string
}

interface TimeSlotPickerProps {
    date: Date
    onAddTimeSlot: (date: Date, timeSlot: TimeSlot) => void
}

export function TimeSlotPicker({ date, onAddTimeSlot }: TimeSlotPickerProps) {
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("17:00")
    const [error, setError] = useState<string | null>(null)

    const validateTimeSlot = (start: string, end: string): boolean => {
        // Convert times to comparable format (minutes since midnight)
        const [startHour, startMinute] = start.split(":").map(Number)
        const [endHour, endMinute] = end.split(":").map(Number)

        const startMinutes = startHour * 60 + startMinute
        const endMinutes = endHour * 60 + endMinute

        if (startMinutes >= endMinutes) {
            setError("End time must be after start time")
            return false
        }

        setError(null)
        return true
    }

    const handleAddTimeSlot = () => {
        if (validateTimeSlot(startTime, endTime)) {
            onAddTimeSlot(date, { start: startTime, end: endTime })
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="button" onClick={handleAddTimeSlot} className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Time Slot
            </Button>
        </div>
    )
}
