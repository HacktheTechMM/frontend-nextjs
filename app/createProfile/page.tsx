"use client"
import React, { useEffect, useState } from "react"
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
import Link from "next/link";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

export default function CreateProfile() {

    const [selectProfile, setSelectProfile] = useState("");

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('USER');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    return (
        <AuthenticatedLayout>
            <div className="py-20 px-4">

                <div className="py-4 text-center">
                    <h1 className="text-3xl font-bold">Upgrade Your Profile</h1>
                    <p className="text-muted-foreground">Update your learner profile information and learning preferences.</p>
                </div>
                <div className="border-b" />

                {user?.role === "mentor" &&
                    (
                        <div className="max-w-3xl mx-auto py-4 text-center">
                            <p className="text-lg flex gap-2">
                                Your current role is <span className="font-semibold">mentor</span>.
                                Click
                                <Link href="/chats/mentorship/bookinglist" className="flex items-center gap-2 text-blue-600">
                                    Here
                                </Link>
                                to view your mentor requests.
                            </p>
                        </div>
                    )}

                {user?.role === "learner" &&
                    (
                        <div className="max-w-3xl mx-auto py-4 text-center">
                            <p className="text-lg flex gap-2">
                                Your current role is <span className="font-semibold">learner</span>.
                                Click
                                <Link href="/chats/mentorship" className="flex items-center gap-2 text-blue-600">
                                    Here
                                </Link>
                                to book meeting with mentor.
                            </p>
                        </div>
                    )}

                {user?.role === "user" &&
                    (
                        <div>
                            <div className="max-w-3xl mx-auto py-4 text-center">
                                <p className="text-lg">
                                    Your current role is <span className="font-semibold">{user?.role || "user"}</span>.
                                    Upgrade to <span className="font-semibold">Learner</span> role to book meetings or
                                    <span className="font-semibold"> Mentor</span> role to share your experiences.
                                </p>
                            </div>
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
                        </div>
                    )}



                {selectProfile === "MENTOR" && (
                    <div className="max-w-3xl mx-auto py-4">
                        <MentorProfileForm role={selectProfile} />
                    </div>
                )}


                {selectProfile === "LEARNER" && (
                    <div className="max-w-3xl mx-auto py-4">
                        <LearnerProfileForm role={selectProfile} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}
