"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import axios from "axios"

export default function LearnerProfileForm({ role }: { role?: string }) {
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");
    const [contact, setContact] = useState("");
    const [goals, setGoals] = useState("");
    const [specialNeeds, setSpecialNeeds] = useState("");
    const [location, setLocation] = useState("");
    const [userRole] = useState(role);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            role: userRole,
            learner_profile: userRole === "learner" ? {
            age: parseInt(age, 10),
            school_grade: grade,
            guardian_contact: contact,
            learning_goals: goals,
            special_needs: specialNeeds,
            location
            } : undefined,
            mentor_profile: userRole === "mentor" ? {
            bio: "", // Add mentor bio field here
            experience: "" // Add mentor experience field here
            } : undefined
        }
        console.log(formData);

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/upgrade`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })

        console.log(response.data);

    }
    return (
        <form className="space-y-8"
            onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" placeholder="Enter your age" onChange={(e) => setAge(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="grade">School Grade</Label>
                    <Select onValueChange={setGrade}>
                        <SelectTrigger id="grade" className="w-full">
                            <SelectValue placeholder="Select your grade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="elementary">Elementary School</SelectItem>
                            <SelectItem value="middle">Middle School</SelectItem>
                            <SelectItem value="high">High School</SelectItem>
                            <SelectItem value="college">College/University</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Input id="contact" type="text" placeholder="Phone number or email" onChange={(e) => setContact(e.target.value)} />
                    <p className="text-sm text-muted-foreground">How would you prefer to be contacted?</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="goals">Learning Goals</Label>
                    <Textarea id="goals" placeholder="What do you hope to achieve through mentoring?" onChange={(e) => setGoals(e.target.value)} className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="special-needs">Special Needs</Label>
                    <Textarea
                        id="special-needs"
                        placeholder="Any special accommodations or learning needs we should be aware of"
                        className="min-h-[100px]"
                        onChange={(e) => setSpecialNeeds(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                        This information will only be shared with your assigned mentor.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" type="text" placeholder="City, State/Province, Country"
                        onChange={(e) => setLocation(e.target.value)} />
                </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
                Update Profile
            </Button>
        </form>
    )
}
