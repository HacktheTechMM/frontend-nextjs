"use client"

import dynamic from 'next/dynamic'; 
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

// Wrap the `MentorProfile` component with dynamic import to disable SSR for this part
const DynamicMentorProfile = dynamic(() => import('@/components/mentorProfile'), { ssr: false });

const Page = () => {
  const [mentorProfiles, setMentorProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUser() || null;

  useEffect(() => {
    const fetchMentorProfiles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/get-mentors");
        setMentorProfiles(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        setMentorProfiles([]);
        console.log("Error fetching mentor profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className='text-2xl font-bold text-center'>Loading the mentor list</h1>
        <p className='text-center'>Please wait.</p>
      </div>
    );
  }

  return (
      <div className=' p-5 md:py-20 md:px-10'>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-center mb-6">Mentor Profile</h1>
          <p className="text-center text-gray-600 mb-4">Learn more about your mentor and book a session.</p>
          <Link href="/chats/mentorship/bookinglist" className="underline">your bookinglist</Link>
        </div>

        <div className='grid grid-cols-1 gap-6 mx-auto md:grid-cols-3'>
          {mentorProfiles.length > 0 ? (
            mentorProfiles.map((mentor) => (
              <DynamicMentorProfile key={mentor.id} mentor={mentor} />
            ))
          ) : (
            <p>No mentors available at the moment.</p>
          )}
        </div>
      </div>
  );
};

export default Page;
