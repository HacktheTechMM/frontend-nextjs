"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function MentorProfileForm({ role }: { role?: string }) {
    const [user, setUser] = useState<any>(null)
    const [bio, setBio] = useState("")
    const [experience, setExperience] = useState("")
    const [availableTime, setAvailableTime] = useState("")
    const [subjects, setSubjects] = useState([])
    const [selectSubject, setSelectSubject] = useState([])
    const router = useRouter()

    // Use useEffect to access localStorage on the client-side
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userFromLocalStorage = JSON.parse(localStorage.getItem("user") || "{}")
            setUser(userFromLocalStorage)
        }
    }, [])

    useEffect(() => {
        const fetchSubjects = async () => {
            const subjects = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subjects`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            setSubjects(subjects.data.data)
        }

        fetchSubjects()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) return // Ensure user is available before submitting the form

        const formData = {
            mentor_profile: role === "MENTOR" ? {
                bio,
                experience,
                availability: availableTime,
                subjects: selectSubject,
            } : undefined,
            userId: user.id,
            role: role?.toLowerCase(),
        }

        console.log(formData);


        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/upgrade`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            setBio("")
            setExperience("")
            setAvailableTime("")

            router.push("/chats/mentorship")
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself, your background, and your teaching philosophy"
                        className="min-h-[120px]"
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">This will be displayed on your public profile.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                        id="experience"
                        placeholder="Describe your teaching experience, qualifications, and areas of expertise"
                        className="min-h-[120px]"
                        onChange={(e) => setExperience(e.target.value)}
                    />
                </div>

                <div>
                    <Label>Subjects</Label>
                    <select
                        name="subjects"
                        id="subjects"
                        multiple
                        className="w-full mt-1"
                        onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value)
                            setSelectSubject(selectedOptions)
                        }}
                    >
                        {subjects.map((subject: any) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Available Time</Label>
                    <Input
                        id="start-time"
                        type="text"
                        className="mt-1"
                        onChange={(e) => setAvailableTime(e.target.value)}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
                Update Profile
            </Button>
        </form>
    )
}
