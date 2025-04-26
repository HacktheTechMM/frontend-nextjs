"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import InterviewCard from './_components/InterviewCard';
import { useUser } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react';

interface Interview {
  interview_id: string;
  user_id: string;
  role: string;
  type: string;
  techstack: string[];
  created_at: string;
}

const Interviewspage = () => {

    
  return (
    <>
      <Link href="/chats" className="underline flex items-center gap-2">
        <ArrowLeft size={16} />
        Back to roadmap
      </Link>

      <section className="flex flex-row bg-gradient-to-b from-[#171532] to-[#08090D] rounded-3xl px-16 items-center justify-between max-sm:px-4">

        <div className="flex flex-col gap-6 p-4 max-w-lg text-white dark:text-white/90">
          <h2 className='md:text-md lg:text-2xl'>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-sm md:text-md lg:text-xl">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="max-sm:w-full bg-gray-600 hover:bg-gray-500 dark:bg-white/80 dark:hover:bg-white/70">
            <Link href="interviews/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/logo.svg"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className='text-2xl font-bold font-mono'>Your Interviews</h2>


        <div className="flex flex-wrap gap-4 max-lg:flex-col w-full md:w-2/4 items-stretch">
          <InterviewCard
                userId={"1"}
                interviewId={"1"}
                role={"frontend"}
                type={"mixed"}
                techstack={["next.js"]}
                createdAt={"2025-04-26T09:30:30.209Z"}
              />
        </div>
      </section>
    </>
  );
};

export default Interviewspage;