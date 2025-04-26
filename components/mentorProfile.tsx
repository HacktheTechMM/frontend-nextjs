"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import { z } from "zod"

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
    availability: string
    subjects: Subject[]
}

// Form schema for booking validation
const bookingFormSchema = z.object({
    availability: z.string({
        required_error: "Please select a day.",
    }),
    time: z.string({
        required_error: "Please select a time.",
    }),
    subject: z.string({
        required_error: "Please select a subject.",
    }),
    message: z.string({
        required_error: "Please enter message.",
    }),
})

export default function MentorProfile({ mentor }: { mentor: Mentor }) {
    const [showBookingForm, setShowBookingForm] = useState(false)
    const mentorId = useRef(null)
    const selectDayTime = useRef("")
    const [selectSubject, setSelectSubject] = useState("")
    const [typeMessage, setTypeMessage] = useState("")
    const [user, setUser] = useState(null) // To store user data after it loads

    // Check if running in the browser and fetch user data
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
        }
    }, [])

    // Handle form submission
    async function onSubmit(e) {
        e.preventDefault()
        toast({
            title: "Booking requested",
            description: `You've requested session on ${selectDayTime.current.value}`,
        })

        if (!user) {
            toast({
                title: "Error",
                description: "User data is not available.",
                variant: "destructive",
            })
            return
        }

        let mentorRequest = {
            mentor_id: parseInt(mentorId.current.value),
            subject_id: parseInt(selectSubject),
            learner_id: parseInt(user.id),
            message: typeMessage,
            requested_time: selectDayTime.current.value,
        }

        try {
            let response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentor-request`,
                mentorRequest,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }

        // Reset form after submission
        setShowBookingForm(false)
    }

    return (
        <div className="container mx-auto py-8 px-4">
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
                        <div className="">
                            <div className="w-full items-center p-3 border rounded-md">
                                <CalendarDays className="h-4 w-4 mr-2" />
                                <div className="w-full">
                                    <div className="font-medium">{mentor.availability.split(" ")[0]}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {mentor.availability.split(" ")[1]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showBookingForm && (
                        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                            <h3 className="text-lg font-medium mb-4">Book a Session</h3>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="Day">Day</label>
                                    <input
                                        type="text"
                                        value={mentor.availability}
                                        ref={selectDayTime}
                                        disabled
                                        className="w-full bg-gray-800 rounded p-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject">Subject</label>
                                    <select
                                        name="subject"
                                        id="subject"
                                        onChange={(e) => setSelectSubject(e.target.value)}
                                        className="w-full bg-gray-800 p-2 rounded"
                                    >
                                        <option defaultValue="" disabled selected>
                                            Select a subject
                                        </option>
                                        {mentor.subjects.map((subject) => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input type="text" hidden value={mentor.id} ref={mentorId} />

                                <div>
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        name="message"
                                        id=""
                                        onChange={(e) => setTypeMessage(e.target.value)}
                                        className="w-full bg-gray-800 rounded p-2"
                                        placeholder="Enter your booking message"
                                        rows={4}
                                    ></textarea>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Book Session</Button>
                                </div>
                            </form>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {!showBookingForm && (
                        <Button className="w-full" onClick={() => setShowBookingForm(true)}>
                            Book Session
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
