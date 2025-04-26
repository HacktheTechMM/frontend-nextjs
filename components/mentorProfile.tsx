"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import { z } from "zod"
import { SelectValue } from "@radix-ui/react-select"
import TimeSlotSelect from "./time-slot-select"

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
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("USER");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const parsedAvailability = typeof mentor.availability === "string"
        ? JSON.parse(mentor.availability)
        : mentor.availability;

    // Check if running in the browser and fetch user data
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
        }
    }, [])

    const handleShowBookingForm = (show: boolean) => {
        console.log('user:', user)
        if (user.role === "mentor" || user.role === "user") {
            toast({
                title: "Error",
                description: "You can't make a booking as a mentor.",
                variant: "destructive",
            })
            return
        }
        setShowBookingForm(show)
    }

    // Handle form submission
    async function onSubmit(e) {
        e.preventDefault()




        let mentorRequest = {
            mentor_id: parseInt(mentorId.current.value),
            subject_id: parseInt(selectSubject),
            learner_id: parseInt(user.id),
            message: typeMessage,
            requested_time: selectedValue,
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
            toast({
                title: "Booking requested",
                description: `You've requested session on ${selectDayTime.current.value}`,
            })
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: `booking failed ${error}`,
            })
        }

        // Reset form after submission
        setShowBookingForm(false)
    }

    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

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

                    {showBookingForm && (
                        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                            <h3 className="text-lg font-medium mb-4">Book a Session</h3>
                            <form onSubmit={onSubmit} className="space-y-4">
                                {/* <TimeSlotSelect parsedAvailability={parsedAvailability} selectValue={setSelectedValue} handleChange={handleChange} /> */}
                                <div>
                                    <label htmlFor="subject">Select Subject</label>

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
                                    <Button type="button" variant="outline" onClick={() => handleShowBookingForm(false)}>
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
