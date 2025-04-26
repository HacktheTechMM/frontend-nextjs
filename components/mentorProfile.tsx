"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import { z } from "zod"
import BookingDialog from "./booking-dialog"

// Define the mentor data structure
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

export default function MentorProfile({ mentor, user }: { mentor: Mentor; user: any }) {
    const mentorId = useRef(null)
    const selectDayTime = useRef("")
    

    const parsedAvailability = typeof mentor.availability === "string"
        ? JSON.parse(mentor.availability)
        : mentor.availability;


    // Handle form submission
    async function handleSubmit(booking_form: { subject_id: number; availability: string; message: string; }, e: React.FormEvent) {
        e.preventDefault()

        if (user.role == 'user') {
            toast({
                title: "Error",
                description: `Please upgrade your account ro learner to book sessions`,
            })
            return
        }

        if (user.role == 'mentor') {
            toast({
                title: "Error",
                description: `Mentors cannot book sessions`,
            })
            return
        }
        console.log("Booking form data:", booking_form)

        const mentorRequest = {
            mentor_id: mentor.id,
            subject_id: booking_form.subject_id,
            requested_time: booking_form.availability,
            // learner_id: user ? parseInt(user.id) : 0,
            message: booking_form.message,
        }

        console.log("Mentor request data:", JSON.stringify(mentorRequest))

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentor-request`,
                mentorRequest,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            console.log(response.data)
            toast({
                title: "Booking requested",
                description: `You've requested session on ${selectDayTime.current || ""}`,
            })
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: `booking failed ${error}`,
            })
        }
    }

    return (
        <div className="container mx-auto">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">{mentor.mentor_name}</CardTitle>
                    <CardDescription>{mentor.bio}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Experience</h3>
                        <p>{mentor.experience}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                            {mentor.subjects.map((subject) => (
                                <Badge key={subject.id} variant="secondary">
                                    {subject.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Availability</h3>
                        <ul className="space-y-4 grid grid-cols-2 gap-2">
                            {parsedAvailability.map((item, index) => (
                                <li key={index} className="border p-4 rounded-lg shadow">
                                    <div className="text-sm font-semibold">
                                        {item.date}
                                    </div>
                                    <ul className="mt-2 space-y-2 text-sm">
                                        {item.time_slots.map((slot, idx) => (
                                            <li key={idx} className="text-gray-700 dark:text-gray-400">
                                                {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <BookingDialog mentor={mentor} parsedAvailability={parsedAvailability} onSubmit={handleSubmit} />
                </CardContent>
            </Card>
        </div>
    )
}
