"use client"
import React, { useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import MentorProfileForm from "@/components/mentor-profile-form";
import LearnerProfileForm from "@/components/learner-profile-form";

export default function CreateProfile() {

    const [selectProfile, setSelectProfile] = useState("");

    console.log(selectProfile);


    return (
        <div className="py-20 px-4">

            <div className="py-4 text-center">
                <h1 className="text-3xl font-bold">Create Your Profile</h1>
                <p className="text-muted-foreground">Update your learner profile information and learning preferences.</p>
            </div>
            <div className="border-b" />

            <div className="max-w-3xl mx-auto py-4  text-center">
                <Select onValueChange={setSelectProfile}>
                    <SelectTrigger className="w-full" >
                        <SelectValue placeholder="Select Profile" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Profile</SelectLabel>
                            <SelectItem value="MENTOR">Mentor</SelectItem>
                            <SelectItem value="LEARNER">Learner</SelectItem>

                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>



            {selectProfile === "MENTOR" && (
                <div className="max-w-3xl mx-auto py-4">
                    <MentorProfileForm role={selectProfile}/>
                </div>
            )}


            {selectProfile === "LEARNER" && (
                <div className="max-w-3xl mx-auto py-4">
                    <LearnerProfileForm role={selectProfile}/>
                </div>
            )}
        </div>
    )
}
