"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

// import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import axios from "axios";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };
    console.log("feedback", feedback);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interviews/feedbacks`, feedback,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, feedbackId: response.data.id };
    } catch (error: any) {
      console.error("Error storing feedback:", error.response?.data || error.message);
      throw error;
    }

  

  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interviews/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching interviews:", error.response?.data || error.message);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {

  const { interviewId, userId } = params;

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feedbacks/interviews/${interviewId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching feedback:", error.response?.data || error.message);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  return null;

}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}/interviews`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching interviews:", error.response?.data || error.message);
    return null;
  }
}
