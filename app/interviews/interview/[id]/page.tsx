"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DisplayTechIcons from "../../_components/DisplayTechIcons";
// import Agent from "../../_components/Agent";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/interview.action";

const InterviewDetails = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [interview, setInterview] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      try {
        // Fetch interview data
        const interviewData = await getInterviewById(id);
        if (!interviewData) {
          // router.push("/interviews");
          return;
        }
        setInterview(interviewData);

        // Fetch feedback if user exists
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!interview) {
    return (
      <h1>we do have interview</h1>
    );
  }

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      {/* <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      /> */}
    </>
  );
};

export default InterviewDetails;  