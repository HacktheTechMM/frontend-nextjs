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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];


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
    requested_time: [{ Tue: "4:00" }],
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
    requested_time: [{ Mon: "2:30" }],
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
    requested_time: [{ Thu: "5:15" }],
    status: "Rejected",
    created_at: "2025-04-21 09:15:30",
    updated_at: "2025-04-21 11:45:10",
  },
]

const formatRequestedTime = (timeArray: { [key: string]: string }[]) => {
  if (!timeArray || timeArray.length === 0) return "N/A"

  return timeArray
    .map((time) => {
      const day = Object.keys(time)[0]
      const hour = time[day]
      return `${day} ${hour}`
    })
    .join(", ")
}

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
  return (
    <Table className="max-w-5xl mt-20 mx-auto border-separate border-spacing-y-10">
      <TableCaption>Your's Mentor Request List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">MentorName</TableHead>
          <TableHead>SubjectName</TableHead>
          <TableHead>RequestTime</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mentorRequests.map((mentor) => (
          <TableRow key={mentor.id} className="">
            <TableCell className="font-medium">{mentor.mentor_name}</TableCell>
            <TableCell>{mentor.subject_name}</TableCell>
            <TableCell>{formatRequestedTime(mentor.requested_time)}</TableCell>
            <TableCell className={`text-right`}>{mentor.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        
      </TableFooter>
    </Table>
  )
}
