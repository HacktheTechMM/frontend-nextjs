"use client";
import { format } from 'date-fns';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { use } from 'react'; // Import the use hook

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/interview.action";
import { Button } from "@/components/ui/button";
import { useAppSelector } from '@/redux/store';

interface FeedbackData {
  totalScore?: number;
  createdAt?: string;
  finalAssessment?: string;
  categoryScores?: Array<{ name: string; score: number; comment: string }>;
  strengths?: string[];
  areasForImprovement?: string[];
}

const Feedback = ({ params }: { params: Promise<{ id: string }> }) => {
  // Unwrap the params promise
  const { id } = use(params);
  const router = useRouter();
  const user = useAppSelector(state => state.user.current);
  const [interview, setInterview] = useState<any>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const interviewData = await getInterviewById(id);
        if (!interviewData) {
          // router.push("/interviews");
          return;
        }
        setInterview(interviewData);

        if (user?.id) {
          const feedbackData = await getFeedbackByInterviewId({
            interviewId: id,
            userId: user.id
          });
          setFeedback(feedbackData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.id, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!interview) {
    return (
      <h1>we do not have feedback because we do not you interview data</h1>
    );
  }

  return (
    <section className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? format(new Date(feedback.createdAt), 'MMM d, yyyy h:mm a')
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;