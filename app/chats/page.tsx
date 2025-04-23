"use client"

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
  BookOpen,
  Code,
  Clock,
  CheckCircle,
  Circle,
  ExternalLink,
  GraduationCap,
  Brain,
  Calculator,
  FileCode,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

// Define roadmap step type based on the provided JSON
type RoadmapStep = {
  step_number: number
  title: string
  description: string
  resource_url?: string
  estimated_time_minutes: number
  completed?: boolean
  resources?: { title: string; url: string }[]
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
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I'm your AI learning mentor. I've created a personalized roadmap for you to become an AI Engineer. You can check off items as you complete them in the roadmap panel on the right. What specific topic would you like to learn more about?",
      },
      {
        id: "user-response",
        role: "user",
        content: "I'd like to learn more about deep learning and neural networks.",
      },
      {
        id: "mentor-response",
        role: "assistant",
        content:
          "Great choice! Deep learning is a fascinating field. Looking at your roadmap, I recommend starting with the fundamentals of AI and machine learning, followed by Python programming if you haven't already completed those steps.\n\nFor deep learning specifically, you'll want to ensure you have a solid foundation in mathematics (step 4) before diving into neural networks. The deep learning step includes concepts like:\n\n1. Neural network architectures\n2. Activation functions\n3. Backpropagation\n4. Convolutional neural networks (CNNs)\n5. Recurrent neural networks (RNNs)\n\nWould you like me to explain any of these topics in more detail?",
      },
    ],
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(20) // Example progress
  const [roadmapVisible, setRoadmapVisible] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Example pre-populated roadmap based on the provided JSON
  const [roadmap, setRoadmap] = useState<Roadmap>({
    id: 1,
    title: "AI Engineer Learning Path",
    description: "A comprehensive learning path for beginners to become an AI Engineer",
    language: "English",
    difficulty_level: "Beginner",
    ai_generated: true,
    steps: [
      {
        step_number: 1,
        title: "Introduction to AI and Machine Learning",
        description: "Learn the basics of AI, machine learning, and deep learning",
        resource_url: "https://www.coursera.org/specializations/machine-learning",
        estimated_time_minutes: 120,
        completed: true,
        resources: [
          {
            title: "Coursera Machine Learning Specialization",
            url: "https://www.coursera.org/specializations/machine-learning",
          },
          {
            title: "Stanford CS229: Machine Learning",
            url: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU",
          },
          {
            title: "AI For Everyone",
            url: "https://www.coursera.org/learn/ai-for-everyone",
          },
        ],
      },
      {
        step_number: 2,
        title: "Python Programming for AI",
        description: "Learn Python programming language and its applications in AI",
        resource_url: "https://www.python.org/about/gettingstarted/coding/",
        estimated_time_minutes: 180,
        completed: false,
        resources: [
          {
            title: "Python.org Getting Started",
            url: "https://www.python.org/about/gettingstarted/coding/",
          },
          {
            title: "Python for Data Science Handbook",
            url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
          },
          {
            title: "Codecademy Python Course",
            url: "https://www.codecademy.com/learn/learn-python-3",
          },
        ],
      },
      {
        step_number: 3,
        title: "Frontend Framework - Not Required for AI Engineer",
        description: "Not required for AI Engineer, skip this step",
        resource_url: "",
        estimated_time_minutes: 0,
        completed: false,
        resources: [],
      },
      {
        step_number: 4,
        title: "Mathematics for AI and Machine Learning",
        description: "Learn mathematical concepts required for AI and machine learning",
        resource_url: "https://www.khanacademy.org/math",
        estimated_time_minutes: 240,
        completed: false,
        resources: [
          {
            title: "Khan Academy Math",
            url: "https://www.khanacademy.org/math",
          },
          {
            title: "3Blue1Brown Linear Algebra",
            url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
          },
          {
            title: "Mathematics for Machine Learning",
            url: "https://mml-book.github.io/",
          },
        ],
      },
      {
        step_number: 5,
        title: "Deep Learning and Neural Networks",
        description: "Learn deep learning concepts and neural networks",
        estimated_time_minutes: 300,
        completed: false,
        resources: [
          {
            title: "Deep Learning Specialization",
            url: "https://www.coursera.org/specializations/deep-learning",
          },
          {
            title: "Fast.ai Practical Deep Learning",
            url: "https://course.fast.ai/",
          },
          {
            title: "Deep Learning Book",
            url: "https://www.deeplearningbook.org/",
          },
        ],
      },
    ],
  })

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

  // Calculate progress based on completed steps
  useEffect(() => {
    const totalSteps = roadmap.steps.length
    const completedSteps = roadmap.steps.filter((step) => step.completed).length
    const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    setProgress(newProgress)
  }, [roadmap])

  // Toggle step completion
  const toggleStepCompletion = (stepNumber: number) => {
    setRoadmap((prevRoadmap) => ({
      ...prevRoadmap,
      steps: prevRoadmap.steps.map((step) =>
        step.step_number === stepNumber ? { ...step, completed: !step.completed } : step,
      ),
    }))
  }

  // Get icon for step based on title
  const getStepIcon = (title: string) => {
    if (title.toLowerCase().includes("introduction") || title.toLowerCase().includes("ai")) {
      return <Brain className="h-5 w-5" />
    } else if (title.toLowerCase().includes("python") || title.toLowerCase().includes("programming")) {
      return <FileCode className="h-5 w-5" />
    } else if (title.toLowerCase().includes("frontend")) {
      return <Code className="h-5 w-5" />
    } else if (title.toLowerCase().includes("math")) {
      return <Calculator className="h-5 w-5" />
    } else if (title.toLowerCase().includes("deep learning")) {
      return <GraduationCap className="h-5 w-5" />
    } else {
      return <BookOpen className="h-5 w-5" />
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
        <Card className="flex-1 flex flex-col shadow-none rounded-none border-0 max-h-[90vh]">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>AI Learning Mentor</span>
              </CardTitle>

              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
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
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
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
                placeholder="Ask about any topic in your learning journey..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
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
            <h2 className="text-xl font-semibold">{roadmap.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{roadmap.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="bg-primary/10">
                {roadmap.difficulty_level}
              </Badge>
              <Badge variant="outline" className="bg-secondary/10">
                {roadmap.language}
              </Badge>
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
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
                      <div className="flex items-center justify-between">
                        <div className={`font-medium text-base ${step.completed ? "text-primary" : ""}`}>
                          {step.step_number}. {step.title}
                        </div>
                        {step.estimated_time_minutes > 0 && (
                          <Badge variant="outline" className="ml-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(step.estimated_time_minutes)}
                          </Badge>
                        )}
                      </div>

                      <p className={`text-sm mt-1 ${step.completed ? "text-muted-foreground" : ""}`}>
                        {step.description}
                      </p>

                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-3 space-y-1.5 bg-background/80 p-3 rounded-md">
                          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            Learning Resources:
                          </p>
                          <div className="space-y-2 mt-2">
                            {step.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1.5 p-1.5 rounded-md hover:bg-primary/5 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>{resource.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
