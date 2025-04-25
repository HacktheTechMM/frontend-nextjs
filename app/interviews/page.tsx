"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import InterviewCard from './_components/InterviewCard';
import { useUser } from '@/context/UserContext';

const Interviewspage = () => {
  const { user, loading } = useUser();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(interviews)
  useEffect(() => {
    if (loading || !user?.id || fetching === false) return;
  
    const fetchUserInterviews = async () => {
      setFetching(true);
      setError(null);
  
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
  
        const response = await fetch(`/api/interview/user/${user.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Optional: sort by newest first
        const sortedData = data.sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
  
        setInterviews(sortedData);
      } catch (err) {
        console.error("Failed to fetch interviews:", err);
        setError(err instanceof Error ? err.message : "Failed to load interviews");
      } finally {
        setFetching(false);
      }
    };
  
    fetchUserInterviews();
  }, [user?.id, loading]);
   // Trigger re-run if user or loading state changes

  // If the user is loading, show a loading indicator
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading user data...</div>;
  }

  // If there was an error in fetching interviews
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
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

        <div className="flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch">
          {fetching ? (
            <div className="flex justify-center w-full">
              <p>Loading interviews...</p>
            </div>
          ) : interviews.length > 0 ? (
            interviews.map((interview) => (
              <InterviewCard
                key={interview.interview_id}
                userId={user?.id}
                interviewId={interview.interview_id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.created_at}
              />

            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <p>You haven't taken any interviews yet</p>
              <Button asChild>
                <Link href="interviews/interview">Start Your First Interview</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Interviewspage;
