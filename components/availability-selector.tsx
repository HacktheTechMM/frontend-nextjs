"use client"

import { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, CalendarDays, Clock, Save, Code } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TimeSlotPicker } from "./time-slot-picker"

type TimeSlot = {
    start: string
    end: string
}

type DateAvailability = {
    date: Date
    timeSlots: TimeSlot[]
}

// Updated format for JSON storage in Laravel
interface LaravelJsonFormat {
    availabilities: {
        date: string // YYYY-MM-DD format
        time_slots: {
            start_time: string // HH:MM:SS format
            end_time: string // HH:MM:SS format
        }[]
    }[]
}

export function AvailabilitySelector({ setAvailableTime }:any) {
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [availability, setAvailability] = useState<DateAvailability[]>([])
    const [currentDate, setCurrentDate] = useState<Date | null>(null)
    const [laravelFormat, setLaravelFormat] = useState<LaravelJsonFormat>({
        availabilities: [],
    })

    // Convert availability data to Laravel JSON format whenever it changes
    useEffect(() => {
        const formattedData: LaravelJsonFormat = {
            availabilities: availability.map((item) => ({
                date: format(item.date, "yyyy-MM-dd"),
                time_slots: item.timeSlots.map((slot) => ({
                    start_time: `${slot.start}:00`,
                    end_time: `${slot.end}:00`,
                })),
            })),
        }
        setLaravelFormat(formattedData)
        setAvailableTime(formattedData.availabilities) // Pass the formatted data to the parent component
    }, [availability])

    // Handle date selection from calendar
    const handleSelect = (dates: Date[] | undefined) => {
        if (!dates) return

        // Update selected dates
        setSelectedDates(dates)

        // Find dates that were added (not in availability yet)
        const currentDates = availability.map((item) => item.date.toISOString().split("T")[0])

        // Create new availability entries for newly selected dates
        const newAvailability = [...availability]

        dates.forEach((date) => {
            const dateString = date.toISOString().split("T")[0]
            if (!currentDates.includes(dateString)) {
                newAvailability.push({
                    date: new Date(date),
                    timeSlots: [],
                })
            }
        })

        // Remove dates that were unselected
        const updatedAvailability = newAvailability.filter((item) =>
            dates.some((date) => date.toISOString().split("T")[0] === item.date.toISOString().split("T")[0]),
        )

        setAvailability(updatedAvailability)

        // Set current date to the most recently selected date
        if (dates.length > 0) {
            setCurrentDate(dates[dates.length - 1])
        } else {
            setCurrentDate(null)
        }
    }

    // Add time slot to a specific date
    const addTimeSlot = (date: Date, timeSlot: TimeSlot) => {
        setAvailability(
            availability.map((item) => {
                if (format(item.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")) {
                    return {
                        ...item,
                        timeSlots: [...item.timeSlots, timeSlot],
                    }
                }
                return item
            }),
        )
    }

    // Remove time slot from a specific date
    const removeTimeSlot = (date: Date, index: number) => {
        setAvailability(
            availability.map((item) => {
                if (format(item.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")) {
                    return {
                        ...item,
                        timeSlots: item.timeSlots.filter((_, i) => i !== index),
                    }
                }
                return item
            }),
        )
    }

    // Handle form submission
   

    // Change the current date for time slot editing
    const selectDateForTimeSlots = (date: Date) => {
        setCurrentDate(date)
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Select Dates
                    </CardTitle>
                    <CardDescription>Choose the dates when you're available</CardDescription>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={handleSelect}
                        className="rounded-md border"
                        fromDate={new Date()}
                        toDate={addDays(new Date(), 60)}
                    />
                </CardContent>
                <CardFooter>
                    <div className="flex flex-wrap gap-2">
                        {selectedDates.length > 0 ? (
                            selectedDates.map((date, index) => (
                                <Badge
                                    key={index}
                                    variant={
                                        currentDate && format(currentDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                                            ? "default"
                                            : "outline"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => selectDateForTimeSlots(date)}
                                >
                                    {format(date, "MMM dd, yyyy")}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No dates selected</p>
                        )}
                    </div>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Select Time Slots
                    </CardTitle>
                    <CardDescription>
                        {currentDate
                            ? `Add time slots for ${format(currentDate, "MMMM dd, yyyy")}`
                            : "Select a date to add time slots"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {currentDate ? (
                        <TimeSlotPicker date={currentDate} onAddTimeSlot={addTimeSlot} />
                    ) : (
                        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                            Select a date from the calendar to add time slots
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Your Availability</CardTitle>
                    <CardDescription>Review and submit your available dates and times</CardDescription>
                </CardHeader>
                <CardContent>
                    {availability.length > 0 ? (
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                            <div className="space-y-6">
                                {availability.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="font-medium">{format(item.date, "EEEE, MMMM dd, yyyy")}</h3>
                                        {item.timeSlots.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {item.timeSlots.map((slot, slotIndex) => (
                                                    <Badge key={slotIndex} className="flex items-center gap-1">
                                                        {slot.start} - {slot.end}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-4 w-4 rounded-full p-0 text-primary-foreground"
                                                            onClick={() => removeTimeSlot(item.date, slotIndex)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No time slots added yet</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                            No availability set yet. Select dates and add time slots.
                        </div>
                    )}
                </CardContent>
                {/* <CardFooter className="flex justify-between gap-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={availability.length === 0 || availability.every((item) => item.timeSlots.length === 0)}
                        className="flex-1"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Availability
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                                <Code className="mr-2 h-4 w-4" />
                                View JSON Format
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Laravel JSON Format</DialogTitle>
                            </DialogHeader>
                            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                                <pre className="text-sm">{JSON.stringify(laravelFormat, null, 2)}</pre>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardFooter> */}
            </Card>
        </div>
    )
}
