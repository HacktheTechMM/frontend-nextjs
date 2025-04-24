"use client"

import type React from "react"
import ReactMarkdown from "react-markdown"

import { useChat } from "@ai-sdk/react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  Sparkles,
  User,
  Moon,
  Sun,
  Clock,
  CheckCircle,
  Circle,
  Brain,
  FileCode,
  Lightbulb,
  Layers,
  Code,
  Loader2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Define roadmap step type
type RoadmapStep = {
  step_number: number
  title: string
  description: string
  estimated_time_minutes: number
  completed?: boolean
}

// Define roadmap type
type Roadmap = {
  id: number
  title: string
  description: string
  language: string
  difficulty_level: string
  ai_generated: boolean
  steps: RoadmapStep[]
}

export default function MentorPage() {
  // State for conversation flow
  const [conversationStage, setConversationStage] = useState<"initial" | "topic" | "level" | "roadmap">("initial")
  const [userTopic, setUserTopic] = useState<string>("")
  const [userLevel, setUserLevel] = useState<string>("")
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState<number>(0)

  // Custom chat hook with initial welcome message
  const { messages, input, handleInputChange, setMessages, setInput, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "👋 Hey there! I'm your personal AI learning assistant.\nI can help you create a personalized learning roadmap based on your goals and current skill level.\n\nWhat topic or skill would you like to learn today?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [roadmapVisible, setRoadmapVisible] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)

  // Only show theme toggle after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Process user messages and manage conversation flow
  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === "user")

    if (conversationStage === "initial" && userMessages.length > 0) {
      // User has provided a topic
      setUserTopic(userMessages[userMessages.length - 1].content)
      setConversationStage("topic")

      // Add the experience level question
      setTimeout(() => {
        setMessages([
          ...messages,
          {
            id: "level-question",
            role: "assistant",
            content:
              "Great choice! To help you best, could you tell me your current experience level with that topic?\n\nFor example:\n• Beginner (just starting)\n• Intermediate (some experience)\n• Advanced (confident, looking to master)",
          },
        ])
      }, 500)
    } else if (conversationStage === "topic" && userMessages.length > 1) {
      // User has provided their experience level
      setUserLevel(userMessages[userMessages.length - 1].content)
      setConversationStage("level")

      // Fetch roadmap from API
      fetchRoadmap(userMessages[0].content, userMessages[1].content)
    }
  }, [messages, conversationStage])

  // Calculate progress based on completed steps
  useEffect(() => {
    if (roadmap) {
      const totalSteps = roadmap.steps.length
      const completedSteps = roadmap.steps.filter((step) => step.completed).length
      const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
      setProgress(newProgress)
    }
  }, [roadmap])

  // Fetch roadmap from API
  const fetchRoadmap = async (topic: string, level: string) => {
    setIsLoadingRoadmap(true)

    try {
      // Add loading message
      setMessages((prev) => [
        ...prev,
        {
          id: "loading-roadmap",
          role: "assistant",
          content: "Creating your personalized learning roadmap...",
        },
      ])

      // Use our proxy API route instead of calling the external API directly
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            input: `I want to learn ${topic}. Now I am ${level} level.`,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      console.log('ai response', data)

      // Parse the roadmap data
      let roadmapData: Roadmap

      if (typeof data.output?.content === "string") {
        // Extract JSON from markdown code block if needed
        const contentString = data.output.content
        const jsonString = contentString.replace(/```(?:json)?\n([\s\S]*)\n```/m, "$1")
        roadmapData = JSON.parse(jsonString)
      } else if (data.steps) {
        // Data is already in the right format
        roadmapData = data
      } else {
        throw new Error("Unexpected API response format")
      }

      // Add completed property to each step
      roadmapData.steps = roadmapData.steps.map((step) => ({
        ...step,
        completed: false,
      }))

      setRoadmap(roadmapData)
      setRoadmapVisible(true)

      // Save roadmap to backend
      saveRoadmapToBackend(roadmapData)

      // Add success message
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading-roadmap"), // Remove loading message
        {
          id: "roadmap-ready",
          role: "assistant",
          content: `Your personalized ${roadmapData.title} is ready! I've created a step-by-step learning path based on your experience level. You can track your progress by checking off items as you complete them in the roadmap panel.\n\nIs there any specific part of the roadmap you'd like me to explain in more detail?`,
        },
      ])

      setConversationStage("roadmap")
      setRetryCount(0) // Reset retry count on success
    } catch (error) {
      console.error("Error fetching roadmap:", error)

      if (retryCount < 2) {
        // Try again with a short delay
        setRetryCount(retryCount + 1)

        // Show retry toast
        toast({
          title: "Connection issue",
          description: "Trying to reconnect to the roadmap service...",
          variant: "destructive",
        })

        setTimeout(() => {
          fetchRoadmap(topic, level)
        }, 2000)
        return
      }

      // After retries, use fallback roadmap
      const fallbackRoadmap = getFallbackRoadmap(topic, level)
      setRoadmap(fallbackRoadmap)
      setRoadmapVisible(true)

      // Add message about using fallback
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading-roadmap"), // Remove loading message
        {
          id: "roadmap-fallback",
          role: "assistant",
          content: `I've created a basic ${fallbackRoadmap.title} for you. I had some trouble connecting to our advanced roadmap service, but this should help you get started. You can track your progress by checking off items as you complete them in the roadmap panel.\n\nIs there any specific part of the roadmap you'd like me to explain in more detail?`,
        },
      ])

      setConversationStage("roadmap")

      // Show toast with error
      toast({
        title: "Using offline roadmap",
        description: "I couldn't connect to the roadmap service, so I've created a basic roadmap for you.",
        variant: "default",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsLoadingRoadmap(false)
    }
  }

  // Fallback roadmap function in case the API is unavailable
  const getFallbackRoadmap = (topic: string, level: string): Roadmap => {
    const topicLower = topic.toLowerCase()
    const levelLower = level.toLowerCase()

    let title = "Learning Path"
    let difficulty = "Beginner"

    if (topicLower.includes("ai") || topicLower.includes("machine") || topicLower.includes("ml")) {
      title = "AI & Machine Learning Path"
    } else if (topicLower.includes("web") || topicLower.includes("frontend") || topicLower.includes("react")) {
      title = "Web Development Path"
    } else if (topicLower.includes("data") || topicLower.includes("analytics")) {
      title = "Data Science Path"
    } else {
      title = `${topic.charAt(0).toUpperCase() + topic.slice(1)} Learning Path`
    }

    if (levelLower.includes("intermediate")) {
      difficulty = "Intermediate"
    } else if (levelLower.includes("advanced") || levelLower.includes("expert")) {
      difficulty = "Advanced"
    }

    return {
      id: 1,
      title,
      description: `A comprehensive learning path for ${difficulty.toLowerCase()} learners to master ${topic}`,
      language: "English",
      difficulty_level: difficulty,
      ai_generated: true,
      steps: [
        {
          step_number: 1,
          title: `Introduction to ${topic}`,
          description: `Learn the fundamentals and core concepts of ${topic}`,
          estimated_time_minutes: 120,
        },
        {
          step_number: 2,
          title: "Essential Tools and Setup",
          description: "Set up your development environment and learn about key tools",
          estimated_time_minutes: 90,
        },
        {
          step_number: 3,
          title: "Core Principles and Techniques",
          description: "Master the fundamental techniques and principles",
          estimated_time_minutes: 180,
        },
        {
          step_number: 4,
          title: "Building Your First Project",
          description: "Apply your knowledge by building a complete project",
          estimated_time_minutes: 240,
        },
        {
          step_number: 5,
          title: "Advanced Topics and Specialization",
          description: "Deepen your knowledge with advanced concepts and specialization",
          estimated_time_minutes: 300,
        },
      ],
    }
  }

  // Save roadmap to backend
  const saveRoadmapToBackend = async (roadmapData: Roadmap) => {
    try {
      const response = await fetch("/api/save-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user123", // In a real app, this would be the authenticated user's ID
          roadmap: roadmapData,
        }),
      })

      if (!response.ok) {
        console.error("Failed to save roadmap to backend")
      }
    } catch (error) {
      console.error("Error saving roadmap:", error)
    }
  }

  // Update roadmap progress in backend
  const updateProgressInBackend = async (updatedRoadmap: Roadmap) => {
    try {
      const response = await fetch("/api/update-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user123", // In a real app, this would be the authenticated user's ID
          roadmap: updatedRoadmap,
        }),
      })

      if (!response.ok) {
        console.error("Failed to update progress in backend")
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  // Toggle step completion
  const toggleStepCompletion = (stepNumber: number) => {
    if (!roadmap) return

    const updatedRoadmap = {
      ...roadmap,
      steps: roadmap.steps.map((step) =>
        step.step_number === stepNumber ? { ...step, completed: !step.completed } : step,
      ),
    }

    setRoadmap(updatedRoadmap)

    // Update progress in backend
    updateProgressInBackend(updatedRoadmap)
  }

  // Custom submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        role: "user",
        content: input,
      },
    ])

    // Clear input
    setInput("")
  }

  // Get icon for step based on title
  const getStepIcon = (title: string) => {
    if (title.toLowerCase().includes("introduction") || title.toLowerCase().includes("ai")) {
      return <Brain className="h-5 w-5" />
    } else if (
      title.toLowerCase().includes("programming") ||
      title.toLowerCase().includes("fundamentals") ||
      title.toLowerCase().includes("tools")
    ) {
      return <FileCode className="h-5 w-5" />
    } else if (title.toLowerCase().includes("frontend")) {
      return <Code className="h-5 w-5" />
    } else if (title.toLowerCase().includes("machine learning") || title.toLowerCase().includes("framework")) {
      return <Layers className="h-5 w-5" />
    } else if (
      title.toLowerCase().includes("hands-on") ||
      title.toLowerCase().includes("projects") ||
      title.toLowerCase().includes("building")
    ) {
      return <Lightbulb className="h-5 w-5" />
    } else {
      return <Brain className="h-5 w-5" />
    }
  }

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    if (minutes === 0) return "N/A"
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Main chat area - on the left */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col shadow-none rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>AI Learning Mentor</span>
              </CardTitle>

              
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-primary/10"}`}>
                      <AvatarFallback>
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-primary" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                        }`}
                    >
                      <div className="markdown">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-md font-bold my-1" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2" {...props} />,
                            li: ({ node, ...props }) => <li className="my-1" {...props} />,
                            p: ({ node, ...props }) => <p className="my-1" {...props} />,
                            a: ({ node, ...props }) => <a className="text-primary underline" {...props} />,
                            code: ({ node, inline, className, children, ...props }) => {
                              if (inline) {
                                return (
                                  <code
                                    className="px-1 py-0.5 rounded bg-muted text-muted-foreground font-mono text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              }
                              return (
                                <pre className="p-2 my-2 rounded bg-muted overflow-x-auto">
                                  <code className="text-muted-foreground font-mono text-sm" {...props}>
                                    {children}
                                  </code>
                                </pre>
                              )
                            },
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="pl-4 border-l-2 border-primary/30 italic my-2" {...props} />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
              {(isLoading || isLoadingRoadmap) && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <AvatarFallback>
                        <Sparkles className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={
                  conversationStage === "initial"
                    ? "Enter a topic you want to learn..."
                    : conversationStage === "topic"
                      ? "Enter your experience level..."
                      : "Ask about any topic in your learning journey..."
                }
                className="flex-1"
                disabled={isLoading || isLoadingRoadmap}
              />
              <Button type="submit" size="icon" disabled={isLoading || isLoadingRoadmap || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      {/* Roadmap sidebar - on the right with enhanced checklist */}
      <div className={`w-full md:w-96 border-l ${roadmapVisible ? "block" : "hidden md:block"}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{roadmap?.title || "Your Learning Journey"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {roadmap?.description || "Your personalized learning path will appear here"}
            </p>

            {roadmap && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="bg-primary/10">
                  {roadmap.difficulty_level}
                </Badge>
                <Badge variant="outline" className="bg-secondary/10">
                  {roadmap.language}
                </Badge>
              </div>
            )}

            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {roadmap ? (
              <div className="p-4 space-y-4">
                {roadmap.steps.map((step) => (
                  <div
                    key={step.step_number}
                    className={`border rounded-lg p-4 transition-all ${step.completed ? "bg-primary/5 border-primary/20" : "hover:border-primary/30 hover:bg-background"
                      }`}
                  >
                    <div
                      className="flex items-start gap-3 cursor-pointer"
                      onClick={() => toggleStepCompletion(step.step_number)}
                    >
                      <div className="mt-0.5 text-primary flex-shrink-0">
                        {step.completed ? (
                          <div className="relative">
                            <CheckCircle className="h-6 w-6 text-primary" />
                            <div
                              className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-75"
                              style={{ animationDuration: "1s", animationIterationCount: 1 }}
                            ></div>
                          </div>
                        ) : (
                          <Circle className="h-6 w-6 text-primary/40" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10 text-primary">{getStepIcon(step.title)}</div>
                          <div className={`font-medium text-base ${step.completed ? "text-primary" : ""}`}>
                            {step.step_number}. {step.title}
                          </div>
                        </div>

                        <div className="flex items-center mt-2">
                          {step.estimated_time_minutes > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(step.estimated_time_minutes)}
                            </Badge>
                          )}
                        </div>

                        <p className={`text-sm mt-2 ${step.completed ? "text-muted-foreground" : ""}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-4">
                <div className="max-w-xs space-y-4">
                  {isLoadingRoadmap ? (
                    <>
                      <Loader2 className="h-12 w-12 text-primary/60 mx-auto animate-spin" />
                      <h3 className="text-lg font-medium">Creating your roadmap...</h3>
                      <p className="text-sm text-muted-foreground">
                        I'm designing a personalized learning path just for you.
                      </p>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-12 w-12 text-primary/60 mx-auto" />
                      <h3 className="text-lg font-medium">Your roadmap is coming</h3>
                      <p className="text-sm text-muted-foreground">
                        Tell me what you want to learn and your experience level, and I'll create a personalized
                        learning roadmap for you.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
