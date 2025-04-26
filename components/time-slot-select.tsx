"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TimeSlotSelect({
    parsedAvailability,
    selectValue,
    handleChange,
}: {
    parsedAvailability: Array<{ date: string; time_slots: Array<{ start_time: string; end_time: string }> }>
    selectValue: string
    handleChange: (value: string) => void
}) {
    return (
        <Select value={selectValue} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
                {parsedAvailability.map((item) =>
                    item.time_slots.map((slot, index) => {
                        const value = `${item.date} ${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`
                        return (
                            <SelectItem key={`${item.date}-${index}`} value={value}>
                                {value}
                            </SelectItem>
                        )
                    }),
                )}
            </SelectContent>
        </Select>
    )
}
