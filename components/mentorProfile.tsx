"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarDays } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "./ui/textarea"
import axios from "axios"


// Define the mentor data structure
interface Subject {
    id: number
    name: string
}

interface Availability {
    [key: string]: string[]
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
    day: z.string({
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
    const mentorId = useRef(null);
    // Sample mentor data (in a real app, this would come from props or API)


    // Parse availability JSON string to object
    const availabilityObj: Availability = JSON.parse(mentor.availability)
    const availableDays = Object.keys(availabilityObj)

    // Form setup
    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
    })

    // Get selected day's available times
    const selectedDay = form.watch("day")
    const availableTimes = selectedDay ? availabilityObj[selectedDay] : []

    // Handle form submission
    async function onSubmit(data: z.infer<typeof bookingFormSchema>) {
        toast({
            title: "Booking requested",
            description: `You've requested session on ${data.day} at ${data.time}`,
        })

        let user = JSON.parse(localStorage.getItem("user"));



        let mentorRequest = {
            mentor_id: mentorId.current.value,
            subject_id: data.subject,
            learner_id: user.id,
            message: data.message,
            requested_time: {
            [data.day]: [data.time]
            }
        }
        
        console.log(mentorRequest);
        

        try {
            let response = await  axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentor-request`,mentorRequest,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            console.log(response.data);
            
            
        } catch (error) {
            console.log(error);
            
        }
        
        
        // Here you would typically send this data to your backend
        setShowBookingForm(false)
        form.reset()
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {availableDays.map((day) => (
                                <div key={day} className="flex items-center p-3 border rounded-md">
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    <div>
                                        <div className="font-medium">{day}</div>
                                        <div className="text-sm text-muted-foreground">{availabilityObj[day].join(", ")}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showBookingForm && (
                        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                            <h3 className="text-lg font-medium mb-4">Book a Session</h3>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="day"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Day</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl className="w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a day" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableDays.map((day) => (
                                                            <SelectItem key={day} value={day}>
                                                                {day}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDay}>
                                                    <FormControl className="w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={selectedDay ? "Select a time" : "Select a day first"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableTimes.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value} // should be subject.id
                                                >
                                                    <FormControl className="w-full">
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder="Select a subject"
                                                                // Convert subject ID back to subject name for display
                                                                defaultValue={field.value}
                                                            >
                                                                {
                                                                    mentor.subjects.find((s) => s.id === Number(field.value))?.name ??
                                                                    "Select a subject"
                                                                }
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mentor.subjects.map((subject) => (
                                                            <SelectItem key={subject.id} value={subject.id}>
                                                                {subject.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    
                                    <input type="text" hidden value={mentor.id} ref={mentorId} />


                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Additional Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Please share any specific topics or questions you'd like to discuss during the session..."
                                                        className="resize-none min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Book Session</Button>
                                    </div>
                                </form>
                            </Form>
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
