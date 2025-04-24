"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, User, Award, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import Link from "next/link";
// Sample data based on the mentor_profiles table schema
const mentorProfiles = [
  {
    id: 1,
    user_id: 101,
    name: "Dr. Sarah Johnson", // This would come from the users table in a real app
    bio: "Passionate educator with over 10 years of experience in computer science. Specializing in algorithms and data structures.",
    experience:
      "Senior developer at major tech companies including Google and Microsoft. 8 years of mentoring junior developers.",
    availability: {
      Mon: ["14:00", "16:00"],
      Wed: ["10:00", "11:00", "15:00"],
      Fri: ["09:00", "13:00"],
    },
    "subjects": [
      {
        "id": 1,
        "name": "Laravel"
      },
      {
        "id": 2,
        "name": "Vue.js"
      }
    ],
    created_at: "2023-05-15T10:30:00",
    updated_at: "2023-11-22T14:45:00",
  },
  {
    id: 2,
    user_id: 102,
    name: "Prof. Michael Chen",
    bio: "Mathematics enthusiast with a PhD in Applied Mathematics. I believe everyone can understand complex concepts with the right guidance.",
    experience: "PhD in Mathematics from MIT. 5 years teaching experience at undergraduate and graduate levels.",
    availability: {
      Tue: ["09:00", "11:00"],
      Thu: ["13:00", "15:00", "17:00"],
    },
    "subjects": [
      {
        "id": 1,
        "name": "Laravel"
      },
      {
        "id": 2,
        "name": "Vue.js"
      }
    ],
    created_at: "2023-06-20T09:15:00",
    updated_at: "2023-12-05T11:30:00",
  },
  {
    id: 3,
    user_id: 103,
    name: "Dr. Emily Rodriguez",
    bio: "Full-stack developer and coding bootcamp instructor. I specialize in JavaScript, React, and Node.js.",
    experience: "Tech startup founder with 2 successful exits. Mentored over 100 early-career developers.",
    availability: {
      Mon: ["09:00", "11:00"],
      Wed: ["14:00", "16:00"],
      Fri: ["10:00", "15:00"],
    },
    "subjects": [
      {
        "id": 1,
        "name": "Laravel"
      },
      {
        "id": 2,
        "name": "Vue.js"
      }
    ],
    created_at: "2023-04-10T14:20:00",
    updated_at: "2023-10-18T16:45:00",
  },
  {
    id: 4,
    user_id: 104,
    name: "Prof. Robert Brown",
    bio: "Physics researcher and educator. My goal is to make quantum mechanics and relativity accessible to all students.",
    experience: "Research scientist with 20+ published papers. Guest lecturer at multiple universities.",
    availability: {
      Tue: ["13:00", "15:00"],
      Thu: ["10:00", "14:00"],
    },
    "subjects": [
      {
        "id": 1,
        "name": "Laravel"
      },
      {
        "id": 2,
        "name": "Vue.js"
      }
    ],
    created_at: "2023-07-05T11:45:00",
    updated_at: "2023-11-30T09:20:00",
  },
]

// const mentorProfiles:any=[]

// Helper function to format time (24h to 12h format)
const formatTime = (time24h: string) => {
  const [hours, minutes] = time24h.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Days of the week mapping
const daysOfWeek = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
}

export default function MentorProfilesUI() {
  const [selectedDay, setSelectedDay] = useState<keyof typeof daysOfWeek | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<(typeof mentorProfiles)[0] | null>(null)
  const [bookingDay, setBookingDay] = useState<string | null>(null)
  const [subjectname, setSubjectname] = useState<string | null>(null)
  const [bookingTime, setBookingTime] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  // const [mentorProfiles, setMentorProfiles] = useState<any>([])

  useEffect(() => {
    try {
      const handleMentors = async () => {
        let mentors = await axios.get("http://127.0.0.1:8000/api/v1/get-mentors")

        // setMentorProfiles(mentors.data.data)

      }

      handleMentors()
    } catch (error) {
      // setMentorProfiles([])
    }
  }, [])


  // Get all unique days from all mentors
  const allDays = Array.from(new Set(mentorProfiles.flatMap((mentor) => Object.keys(mentor.availability)))).sort(
    (a, b) => {
      const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return order.indexOf(a) - order.indexOf(b)
    },
  ) as (keyof typeof daysOfWeek)[]

  // Filter mentors by selected day and time
  const filteredMentors = selectedDay
    ? mentorProfiles.filter(
      (mentor) =>
        selectedDay in mentor.availability &&
        (!selectedTime ||
          mentor.availability[selectedDay as keyof typeof mentor.availability]?.includes(selectedTime)),
    )
    : mentorProfiles

   

  // Handle booking button click
  const handleBookSession = (mentor: (typeof mentorProfiles)[0]) => {
    setSelectedMentor(mentor)
    setBookingDay(null)
    setBookingTime(null)
    setMessage("")
    setBookingModalOpen(true)
  }

  // Handle booking submission
  const handleSubmitBooking = () => {
    // Here you would typically send the booking data to your backend
    console.log({
      mentorId: selectedMentor?.id,
      mentorName: selectedMentor?.name,
      day: bookingDay,
      time: bookingTime,
      message,
    })

    // Close the modal
    setBookingModalOpen(false)

    // You could show a success message here
    alert("Booking request submitted successfully!")
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 mt-15">
        <div>
          <h1 className="text-3xl font-bold">Mentor Profiles</h1>
          <p className="text-gray-500 mt-1">Find the perfect mentor for your learning journey</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/mentorship/bookinglist" className=" sm:inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              My Request List
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[150px]">
                {selectedDay ? daysOfWeek[selectedDay] : "Select Day"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedDay(null)
                  setSelectedTime(null)
                }}
              >
                All Days
              </DropdownMenuItem>
              {allDays.map((day) => (
                <DropdownMenuItem
                  key={day}
                  onClick={() => {
                    setSelectedDay(day)
                    setSelectedTime(null)
                  }}
                >
                  {daysOfWeek[day]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedDay && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[150px]">
                  {selectedTime ? formatTime(selectedTime) : "Select Time"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedTime(null)}>Any Time</DropdownMenuItem>
                {Array.from(
                  new Set(
                    mentorProfiles
                      .filter((mentor) => selectedDay && selectedDay in mentor.availability)
                      .flatMap((mentor) =>
                        selectedDay && mentor.availability[selectedDay as keyof typeof mentor.availability]
                          ? mentor.availability[selectedDay as keyof typeof mentor.availability]
                          : [],
                      ),
                  ),
                )
                  .sort()
                  .map((time) => (
                    <DropdownMenuItem key={time} onClick={() => time && setSelectedTime(time)}>
                      {time ? formatTime(time) : "Invalid time"}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {mentorProfiles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No mentors available</h3>
          <p className="text-gray-500">Try selecting a different day or time</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={"/placeholder.svg"} alt={mentor.name} />
                    <AvatarFallback>
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{mentor.name}</CardTitle>
                    <CardDescription className="mt-1">Mentor ID: {mentor.id}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-0">
                <Tabs defaultValue="bio" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bio">Bio</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bio" className="h-32 overflow-y-auto">
                    <div className="flex items-start gap-2 text-sm">
                      <User className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <p>{mentor.bio}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="experience" className="h-32 overflow-y-auto">
                    <div className="flex items-start gap-2 text-sm">
                      <Award className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <p>{mentor.experience}</p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Availability
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(mentor.availability)
                      .filter(([_, times]) => times !== undefined)
                      .map(([day, times]) => (
                        <div key={day} className="border rounded-md p-2">
                          <div className="font-medium text-sm">{daysOfWeek[day as keyof typeof daysOfWeek]}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {times.map((time: any) => (
                              <Badge key={time} variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(time)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-4">
                <Button className="w-full" onClick={() => handleBookSession(mentor)}>
                  Book Session
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Book a Session with {selectedMentor?.name}</DialogTitle>
            <DialogDescription>Fill out the form below to book your mentorship session.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="day" className="text-sm font-medium">
                Select Available Day
              </label>
              <Select onValueChange={(value) => setBookingDay(value)} value={bookingDay || ""} >
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {selectedMentor &&
                    Object.keys(selectedMentor.availability).map((day) => (
                      <SelectItem key={day} value={day}>
                        {daysOfWeek[day as keyof typeof daysOfWeek]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>


            <div className="grid gap-2">
              <label htmlFor="day" className="text-sm font-medium">
                Select Subject
              </label>
              <Select onValueChange={(value) => setSubjectname(value)} value={subjectname || ""} >
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {['html', 'css', 'js'].map((subj) => {
                    return (
                      <SelectItem key={subj} value={subj}>
                        {subj}
                      </SelectItem>
                    )
                  })

                  }
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="time" className="text-sm font-medium">
                Select Time
              </label>
              <Select onValueChange={(value) => setBookingTime(value)} value={bookingTime || ""} disabled={!bookingDay}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {bookingDay &&
                    selectedMentor?.availability[bookingDay as keyof typeof selectedMentor.availability]?.map(
                      (time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ),
                    )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Only showing times when this mentor is available
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message to Mentor
              </label>
              <Textarea
                id="message"
                placeholder="Let the mentor know what you'd like to discuss"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmitBooking} disabled={!bookingDay || !bookingTime} className="w-full sm:w-auto">
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
