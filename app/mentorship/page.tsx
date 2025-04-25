"use client"

import MentorProfile from '@/components/mentorProfile';
import axios from 'axios'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'



const page = () => {

  const [mentorProfiles, setMentorProfiles] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const handleMentor = async () => {
        let response = await axios.get("http://127.0.0.1:8000/api/v1/get-mentors");
        setMentorProfiles(response.data.data);

      }

      handleMentor();
      setLoading(false)
    } catch (error) {
      setMentorProfiles([]);
      setLoading(false)
      console.log("Error fetching mentor profiles:", error);
    }
  }, [])



  if (mentorProfiles.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
          <h1 className='text-2xl font-bold text-center'>Loading the mentor list</h1>
          <p className='text-center'>Please wait.</p>
        </div>
    )
  }


  return (
    <div>
     
      <div className='py-20 px-10'>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center mb-6">Mentor Profile</h1>
          <p className="text-center text-gray-600 mb-4">Learn more about your mentor and book a session.</p>
          <Link href="/mentorship/bookinglist" className="underline">your bookinglist</Link>
        </div>

        <div className='grid grid-cols-1 gap-4 mx-auto md:grid-cols-3'>

          {mentorProfiles.length > 0 && (
            mentorProfiles.map((mentor) => {
              return (
                <MentorProfile key={mentor.id} mentor={mentor} />
              )
            })
          )}
        </div>

      </div>

    </div>
  )
}

export default page