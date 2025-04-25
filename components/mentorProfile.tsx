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
    const mentorId = useRef(null);
    const selectDayTime = useRef("");
    const [selectSubject,setSelectSubject] = useState("");
    const [typeMessage,setTypeMessage] = useState("");
    // Sample mentor data (in a real app, this would come from props or API)


    // Parse availability JSON string to object
    const availabilityObj: any = mentor.availability

    // Form setup
    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
    })

    // Get selected day's available times
    const selectedDay = form.watch("day")

    // Handle form submission
    async function onSubmit(e) {
        e.preventDefault();
        toast({
            title: "Booking requested",
            description: `You've requested session on ${selectDayTime.current.value}`,
        })

        let user = JSON.parse(localStorage.getItem("user"));



        let mentorRequest = {
            mentor_id: mentorId.current.value,
            subject_id: selectSubject,
            learner_id: user.id,
            message: typeMessage,
            requested_time: selectDayTime.current.value
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div  className="flex items-center p-3 border rounded-md">
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    <div>
                                        <div className="font-medium">{mentor.availability.split(" ")[0]}</div>
                                        <div className="text-sm text-muted-foreground">{mentor.availability.split(" ")[1]}</div>
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
                                        <input type="text" value={mentor.availability} ref={selectDayTime} disabled className="w-full bg-gray-800 rounded p-2" />
                                    </div>


                                    <div>
                                        <label htmlFor="subject">Subject</label>
                                        <select name="subject" id="subject" onChange={(e)=>setSelectSubject(e.target.value)} className="w-full bg-gray-800 p-2 rounded">
                                            <option defaultValue="" disabled selected>Select a subject</option>
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
                                        <textarea name="message" id="" onChange={(e)=>setTypeMessage(e.target.value)} className="w-full bg-gray-800 rounded p-2" placeholder="Enter your booking message" rows={4} >

                                        </textarea>
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
