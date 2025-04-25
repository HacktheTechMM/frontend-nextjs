"use client";
import { format } from 'date-fns';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from 'react'; // Import the use hook

// import {
//   getFeedbackByInterviewId,
//   getInterviewById,
// } from "@/lib/actions/interview.action";
import { Button } from "@/components/ui/button";

interface FeedbackData {
  totalScore?: number;
  createdAt?: string;
  finalAssessment?: string;
  categoryScores?: Array<{ name: string; score: number; comment: string }>;
  strengths?: string[];
  areasForImprovement?: string[];
  userId:string
}

const Feedback = ({ params }: { params: Promise<{ id: string }> }) => {
  // Unwrap the params promise
  const { id } = use(params);
  const router = useRouter();
  const [interview, setInterview] = useState({
    "createdAt": "2025-04-26T09:30:30.209Z",
    "finalized": true,
    "level": "senior",
    "questions": [
      "Describe a complex frontend challenge you faced while using Next.js and how you overcame it.",
      "Explain your approach to optimizing Next.js application performance, including specific techniques you've used.",
      "How do you stay up to date with the latest advancements in Next.js and the broader frontend ecosystem?",
      "Walk me through your experience with server side rendering, static site generation, and client side rendering in Next.js. What are the trade offs?",
      "Describe a time you had to make a significant architectural decision on a frontend project. What factors did you consider, and what was the outcome?",
      "How do you approach testing in a Next.js environment, and what types of tests do you prioritize?",
      "Tell me about a project where you had to collaborate closely with backend engineers. How did you ensure a smooth integration between the frontend and backend?"
    ],
    "role": "frontend",
    "techstack": ["next.js"],
    "type": "mixed",
    "userId": "1"
  });
  const [feedback, setFeedback] = useState<FeedbackData | null>({
    "areasForImprovement": [
      "Improve clarity and structure of responses.",
      "Provide specific examples and details when answering questions.",
      "Enhance technical knowledge and demonstrate a deeper understanding of concepts.",
      "Practice articulating problem-solving approaches more effectively.",
      "Increase confidence and engagement during interviews."
    ],
    "categoryScores": [
      {
        "comment": "The candidate's communication was unclear and unstructured. Responses were often vague and lacked specific details. There were grammatical errors and a lack of clarity in expressing thoughts.",
        "name": "Communication Skills",
        "score": 50
      },
      {
        "comment": "The candidate mentioned 'RIAGS' but didn't elaborate on what it is or demonstrate a deep understanding. The response lacked technical depth and specific examples.",
        "name": "Technical Knowledge",
        "score": 50
      },
      {
        "comment": "The candidate described learning RIAGS but didn't clearly articulate the specific challenges faced or the problem-solving steps taken. The response was more of a general statement than a detailed problem-solving scenario.",
        "name": "Problem Solving",
        "score": 40
      },
      {
        "comment": "Based on the limited interaction, it's difficult to assess cultural fit comprehensively. However, the candidate's lack of engagement and somewhat unclear responses suggest a potential mismatch with a collaborative and communicative work environment.",
        "name": "Cultural Fit",
        "score": 45
      },
      {
        "comment": "The candidate lacked confidence and clarity in their responses. There were hesitations and a lack of directness in answering the questions. The responses were not well-articulated, impacting the overall impression.",
        "name": "Confidence and Clarity",
        "score": 40
      }
    ],
    "createdAt": "2025-04-13T07:15:31.416Z",
    "finalAssessment": "The candidate's performance was below average. There are significant areas for improvement in communication skills, technical knowledge, problem-solving, and confidence. The candidate needs to work on providing clear, structured, and detailed responses to interview questions.",
    // "interviewId": "ZSYYMt87QAQ4TrCfm9la",
    "strengths": [
      "Acknowledged the importance of practicing code.",
      "Recognized errors as part of the learning process."
    ],
    "totalScore": 45,
    "userId": "1"
  }
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const interviewData = await getInterviewById(id);
  //       if (!interviewData) {
  //         // router.push("/interviews");
  //         return;
  //       }
  //       setInterview(interviewData);

  //       if (user?.id) {
  //         const feedbackData = await getFeedbackByInterviewId({
  //           interviewId: id,
  //           userId: user.id
  //         });
  //         setFeedback(feedbackData);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [id, user?.id, router]);



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

      <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center mb-10">
        <Button className="btn-secondary flex-1">
          <Link href="/interviews" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-accent text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

      </div>
    </section>
  );
};

export default Feedback;