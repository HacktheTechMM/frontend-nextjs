"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { useTheme } from "next-themes";
import { createFeedback } from "@/lib/actions/interview.action"; 

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  
  const {theme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });
      console.log(success)

      if (success && id) {
        router.push(`/interviews/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };


  return (
    <>
      <div className="flex sm:flex-row flex-col gap-10 items-center justify-between w-full">
        {/* AI Interviewer Card */}
        <div className="border border-gray-200 p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-md:hidden bg-white dark:bg-accent shadow-sm dark:shadow-none">
          <div className="flex flex-col gap-2 justify-center items-center p-7 rounded-2xl min-h-full">
            <div className="relative">
              {mounted ? (
                theme === 'dark' ? (
                  <Image
                    src="/logo.svg"
                    alt="profile-image"
                    width={539}
                    height={539}
                    className="rounded-full object-cover size-[120px]"
                  />
                ) : (
                  <Image
                    src="/logo-black.svg"
                    alt="profile-image"
                    width={539}
                    height={539}
                    className="rounded-full object-cover size-[120px]"
                  />
                )
              ) : (
                // Show a neutral placeholder during SSR
                <div className="rounded-full object-cover size-[120px] bg-gray-200 dark:bg-gray-700" />
              )}

              {isSpeaking && (
                <span className="absolute top-0 left-0 inline-flex h-full w-full animate-ping rounded-full bg-primary-200 opacity-75" />
              )}
            </div>
            <h3 className="text-gray-900 dark:text-white font-medium text-lg">AI Interviewer</h3>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="border border-gray-200 dark:border-gray-700 p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-md:hidden bg-white dark:bg-gray-900 shadow-sm dark:shadow-none">
          <div className="flex flex-col gap-2 justify-center items-center p-7 rounded-2xl min-h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <Image
              src="/avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3 className="text-gray-900 dark:text-white font-medium text-lg">{userName}</h3>
          </div>
        </div>

      </div>

      {messages.length > 0 && (
        <div className="border-gradient p-0.5 rounded-2xl w-full">
          <div className="dark-gradient rounded-2xl  min-h-12 px-5 py-3 flex items-center justify-center">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100 text-lg text-center text-white"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative inline-block px-7 py-3 font-bold text-sm leading-5 
          text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full 
          shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible"
            onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl 
          active:bg-destructive-200 hover:bg-destructive-200 min-w-28" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
