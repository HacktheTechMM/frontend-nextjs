import { format } from 'date-fns';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/interview.action";
import DisplayTechIcons from "./DisplayTechIcons";
import { Button } from '@/components/ui/button';

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

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