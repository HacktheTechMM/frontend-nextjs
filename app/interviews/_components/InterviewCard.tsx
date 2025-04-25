'use client'
import { format } from 'date-fns';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import { getFeedbackByInterviewId } from "@/lib/actions/interview.action";
import DisplayTechIcons from "./DisplayTechIcons";
import { Button } from '@/components/ui/button';

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  console.log(techstack)
  const feedback = {
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
    "interviewId": "ZSYYMt87QAQ4TrCfm9la",
    "strengths": [
      "Acknowledged the importance of practicing code.",
      "Recognized errors as part of the learning process."
    ],
    "totalScore": 45,
    "userId": "Gm2623IML4cTlfNIXHnisKiiPQA2"
  }


  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = format(
    new Date(feedback?.createdAt || createdAt || Date.now()),
    'MMM d, yyyy'
  );

  return (
    <div className="border-gradient p-0.5 rounded-2xl w-fit max-sm:w-full min-h-auto text-white">
      <div className="dark-gradient rounded-2xl min-h-full flex flex-col p-6 relative overflow-hidden gap-10 justify-between">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="text-sm font-semibold capitalize">{normalizedType}</p>
          </div>

          {/* Interview Role */}
          <h3 className="mt-5 capitalize">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="bg-gray-500 text-white dark:bg-primary dark:text-black">
            <Link
              href={
                feedback
                  ? `/interviews/interview/${interviewId}/feedback`
                  : `/interviews/interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;