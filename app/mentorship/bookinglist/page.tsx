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
import axios from "axios"
import { useEffect, useState } from "react"



const mentorRequests = [
  {
    id: 1,
    learner_id: 1,
    learner_name: "kyaw",
    mentor_id: 1,
    mentor_name: "Daniel",
    subject_id: 1,
    subject_name: "Beginning with HTML",
    message: "Please contact me",
    requested_time: { Thu: ["5:15"] },
    status: "Pending",
    created_at: "2025-04-23 15:49:25",
    updated_at: "2025-04-23 15:49:25",
  },
  {
    id: 2,
    learner_id: 2,
    learner_name: "Sarah",
    mentor_id: 3,
    mentor_name: "Michael",
    subject_id: 2,
    subject_name: "CSS Fundamentals",
    message: "Need help with flexbox",
    requested_time: { Thu: ["5:15"] },
    status: "Approved",
    created_at: "2025-04-22 10:30:15",
    updated_at: "2025-04-22 14:20:05",
  },
  {
    id: 3,
    learner_id: 3,
    learner_name: "John",
    mentor_id: 2,
    mentor_name: "Emma",
    subject_id: 3,
    subject_name: "JavaScript Basics",
    message: "Would like to schedule a session",
    requested_time: { Thu: ["5:15"] },
    status: "Rejected",
    created_at: "2025-04-21 09:15:30",
    updated_at: "2025-04-21 11:45:10",
  },
]




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

  useEffect(() => {
    const handleMentor = async () => {
      try {
        let response = await axios.get("http://127.0.0.1:8000/api/v1/my-mentor-requests", {
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
    return(
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
      <TableCaption>Your's Mentor Request List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">MentorName</TableHead>
          <TableHead>SubjectName</TableHead>
          <TableHead>Request User</TableHead>
          <TableHead>RequestTime</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requestList.map((mentor:any) => (
          <TableRow key={mentor.id} className="">
            <TableCell className="font-medium">{mentor.mentor_name}</TableCell>
            <TableCell>{mentor.subject_name}</TableCell>
            <TableCell>{mentor.learner_name}</TableCell>
            <TableCell>{mentor.requested_time}</TableCell>
            <TableCell className={`text-right`}>{mentor.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>

      </TableFooter>
    </Table>

  )
}
