"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useUser } from "@/context/UserContext"
import axios from "axios"
import { set } from "date-fns"
import { useEffect, useState } from "react"





const getStatusColor = (status: string) => {
    switch (status) {
        case "Approved":
            return "text-green-600 bg-green-100 px-2 py-1 rounded-full"
        case "Rejected":
            return "text-red-600 bg-red-100 px-2 py-1 rounded-full"
        case "Pending":
            return "text-amber-600 bg-amber-100 px-2 py-1 rounded-full"
        default:
            return ""
    }
}





export default function TableDemo() {

    const [requestList, setRequestList] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const user = JSON.parse(localStorage.getItem("USER")) || null;



    //   console.log(user.user?.role);
    const acceptRequest = async (id: any) => {


        try {
            console.log('request id:', id);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentor-request/accept/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setRequestList((prevList: any) =>
                prevList.map((request: any) =>
                    request.id === id ? { ...request, status: "accepted" } : request
                )
            );


        } catch (error) {
            console.log(error);

        }
    }



    useEffect(() => {
        const handleMentor = async () => {
            try {
                let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${user.role == "LEARNER" ? 'my-mentor-requests' : 'mentor/learner-requests'}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log(response.data.data);

                setRequestList(response.data.data);
                setLoading(false)
            } catch (error) {
                console.log(error);
                setRequestList([])
                setLoading(false)
                console.log("Error fetching mentor requests:", error);

            }
        }

        handleMentor();
    }, [])




    if (requestList.length == 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className='text-2xl font-bold text-center'>Loading Mentor Request List</h1>
                    <p className='text-center'>Please wait.</p>
                </div>
            </div>
        )
    }

    return (
        <Table className="max-w-5xl mt-20 mx-auto border-separate border-spacing-y-10">
            {user.role == "LEARNER" && (
                <TableCaption>Your's Mentor Request List</TableCaption>
            )}

            {user.role == "MENTOR" && (
                <TableCaption>Mentor's Learner Request List</TableCaption>
            )}
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">MentorName</TableHead>
                    <TableHead>SubjectName</TableHead>
                    <TableHead>Request User</TableHead>
                    <TableHead>RequestTime</TableHead>
                    {user.role == "LEARNER" && (
                        <TableHead className="text-right">Status</TableHead>
                    )}

                    {user.role == "MENTOR" && (
                        <TableHead className="text-center">Actions</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {requestList.map((request: any) => (
                    <TableRow key={request.id} className="">
                        <TableCell className="font-medium">{request.mentor_name}</TableCell>
                        <TableCell>{request.subject_name}</TableCell>
                        <TableCell>{request.learner_name}</TableCell>
                        <TableCell>{request.requested_time}</TableCell>
                        {user.role == "LEARNER" && (
                            <TableCell className={`text-right`}>{request.status}</TableCell>
                        )}

                        {user.role == "MENTOR" && (
                            <TableCell >
                                <div className="flex justify-end">
                                    {request.status === "pending" ? (
                                        <>
                                            <button onClick={() => acceptRequest(request.id)} className="bg-green-800 text-white px-4 py-2 rounded-md mr-2 font-semibold cursor-pointer">Approve</button>
                                            <button className="bg-red-800 text-white px-4 py-2 rounded-md font-semibold cursor-pointer">Reject</button>
                                        </>
                                    ) : (
                                        <span className={`font-semibold ${getStatusColor(request.status)}`}>{request.status}</span>
                                    )}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>

            </TableFooter>
        </Table>

    )
}
