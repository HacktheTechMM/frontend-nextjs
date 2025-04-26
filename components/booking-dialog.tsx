"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface BookingFormData {
    subject_id: number;
    availability: string;
    message: string;
}

interface Subject {
    id: number
    name: string
}

interface Mentor {
    id: number
    user_id: number
    mentor_name: string
    bio: string
    experience: string
    availability: any
    subjects: Subject[]
}

interface BookingDialogProps {
    mentor: Mentor;
    parsedAvailability: Array<{ date: string; time_slots: Array<{ start_time: string; end_time: string }> }>;
    onSubmit: (bookingForm: BookingFormData, e: React.FormEvent) => void;
}

export default function BookingDialog({ mentor, parsedAvailability, onSubmit }: BookingDialogProps) {
    const [open, setOpen] = useState(false)
    const [typeMessage, setTypeMessage] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [subjectId, setSubjectId] = useState<number | "">(mentor.subjects[0]?.id || "") // Default to the first subject or empty string if none available;

    const handleChangeTime = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTime(value ? value : "");  // parse to number
    };


    const handleChangeSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSubjectId(value ? parseInt(value) : "");  // parse to number
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const bookingForm = {
            subject_id: subjectId,  // or get the selected subject later if you have subject select
            availability: selectedTime,
            message: typeMessage,
        };

        onSubmit(bookingForm, e);
        setOpen(false); // Close after submission
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Book a Session</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book a Session</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4 py-2">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Select subject to discuss</h3>
                            <select
                                className="border p-2 rounded w-full bg-accent"
                                value={subjectId}
                                onChange={handleChangeSubject}
                            >
                                <option value="" disabled>
                                    Select a time slot
                                </option>
                                {mentor.subjects.map((item) =>
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                )}
                            </select>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2">Select a Time Slot</h3>
                            <select
                                className="border p-2 rounded w-full bg-accent"
                                value={selectedTime}
                                onChange={handleChangeTime}
                            >
                                <option value="" disabled>
                                    Select a time slot
                                </option>
                                {parsedAvailability.map((item) =>
                                    item.time_slots.map((slot, idx) => (
                                        <option
                                            key={`${item.date}-${idx}`}
                                            value={`${item.date} ${slot.start_time}-${slot.end_time}`}
                                        >
                                            {item.date} {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                onChange={(e) => setTypeMessage(e.target.value)}
                                className="min-h-[100px]"
                                placeholder="Enter your booking message"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Book Session</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
