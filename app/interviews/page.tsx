"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import InterviewCard from './_components/InterviewCard'
import { getCurrentUser } from '@/lib/utils'
import { getInterviewsByUserId } from '@/lib/actions/interview.action'

const Interviewspage = async () => { 
    const user = await getCurrentUser();
    console.log("user is here",user)
    const userInterviews = await getInterviewsByUserId(user?.id)

    return (
        <>
            <section className="flex flex-row bg-gradient-to-b from-[#171532] to-[#08090D] rounded-3xl px-16 items-center justify-between max-sm:px-4">
                <div className="flex flex-col gap-6 p-4 max-w-lg text-white dark:text-white/90">
                    <h2 className='md:text-md lg:text-2xl '>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
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
                    {userInterviews?.length ? (
                        userInterviews?.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user?.id}
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                    {/* {dummyInterviews.map((internive) => (
                        <InterviewCard 
                            key={internive.id}
                            userId={internive.userId}
                            interviewId={internive.id}
                            role={internive.role}
                            type={internive.type}
                            techstack={internive.techstack}
                            createdAt={internive.createdAt}
                        />
                    ))} */}
                </div>
            </section>


        </>
    )
}

export default Interviewspage
