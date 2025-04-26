"use client"

import MentorProfile from '@/components/mentorProfile';
// import { useUser } from '@/context/UserContext';
import axios from 'axios'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'



const page = () => {

  const [mentorProfiles, setMentorProfiles] = useState([]);
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('USER');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-mentors`);
        setMentorProfiles(response.data.data);
      } catch (error) {
        console.error("Error fetching mentor profiles:", error);
        setMentorProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (mentorProfiles.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
          <h1 className='text-2xl font-bold text-center'>Loading the mentor list</h1>
          <p className='text-center'>Please wait.</p>
        <div className="flex items-center justify-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
        </div>
    )
  }

  return (
    <div>

      <div className='px-4 md:px-10 py-6'>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-center mb-6">Mentor Profile</h1>
          <p className="text-center text-gray-600 mb-4">Learn more about your mentor and book a session.</p>
          <Link href="/chats/mentorship/bookinglist" className="underline">your bookinglist</Link>
        </div>

        <div className='grid grid-cols-1 gap-4 mx-auto md:grid-cols-3'>

          {mentorProfiles.length > 0 && (
            mentorProfiles.map((mentor) => {
              return (
                <MentorProfile user={user} key={mentor.id} mentor={mentor} />
              )
            })
          )}
        </div>

      </div>

    </div>
  )
}

export default page
