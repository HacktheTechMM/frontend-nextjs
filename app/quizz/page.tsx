"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle } from "lucide-react"

// Sample quiz data
const quizData = [
  {
    id: 1,
    question: "What is the primary purpose of Next.js?",
    options: [
      "A frontend JavaScript library",
      "A React framework for building web applications",
      "A backend Node.js framework",
      "A database management system",
    ],
    correctAnswer: "A React framework for building web applications",
  },
  {
    id: 2,
    question: "Which of the following is NOT a feature of Next.js?",
    options: ["Server-side rendering", "Static site generation", "Native mobile app development", "API routes"],
    correctAnswer: "Native mobile app development",
  },
  {
    id: 3,
    question: "What is the file-based routing system in Next.js App Router?",
    options: [
      "Using a routes.js file to define all routes",
      "Using folder and file structure to define routes",
      "Using a routing library like React Router",
      "Manually configuring routes in next.config.js",
    ],
    correctAnswer: "Using folder and file structure to define routes",
  },
  {
    id: 4,
    question: "What directive is used to mark a component as a Client Component in Next.js?",
    options: ["'use client'", "'use browser'", "'client only'", "'client component'"],
    correctAnswer: "'use client'",
  },
  {
    id: 5,
    question: "Which file is used to create a layout that applies to all pages in Next.js App Router?",
    options: ["_app.js", "layout.js", "main.js", "global.js"],
    correctAnswer: "layout.js",
  },
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(quizData.length).fill(""))

  const handleAnswerSelect = (value: string) => {
    if (!answered) {
      setSelectedAnswer(value)
    }
  }

  const handleNextQuestion = () => {
    // Save the user's answer
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestion] = selectedAnswer
    setUserAnswers(newUserAnswers)

    // Check if answer is correct
    if (selectedAnswer === quizData[currentQuestion].correctAnswer && !answered) {
      setScore(score + 1)
    }

    // If we're checking the answer
    if (!answered) {
      setAnswered(true)
      return
    }

    // If we're moving to the next question
    setAnswered(false)
    setSelectedAnswer("")

    // If we're at the last question, show results
    if (currentQuestion === quizData.length - 1) {
      setShowResult(true)
    } else {
      // Otherwise, move to the next question
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setShowResult(false)
    setScore(0)
    setAnswered(false)
    setUserAnswers(Array(quizData.length).fill(""))
  }

  const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100

  if (showResult) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-2xl font-bold mb-6">
            Your Score: {score} out of {quizData.length}
          </div>
          <Progress value={(score / quizData.length) * 100} className="h-3" />

          <div className="mt-8 space-y-4">
            {quizData.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  {userAnswers[index] === question.correctAnswer ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">
                      Question {index + 1}: {question.question}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your answer:{" "}
                      <span
                        className={
                          userAnswers[index] === question.correctAnswer
                            ? "text-green-500 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {userAnswers[index] || "Not answered"}
                      </span>
                    </p>
                    {userAnswers[index] !== question.correctAnswer && (
                      <p className="text-sm text-green-600 mt-1">Correct answer: {question.correctAnswer}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={restartQuiz} className="w-full">
            Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex flex-col space-y-4 items-center justify-center min-h-screen">
        <Card className="max-w-2xl mx-auto min-w-[300px]">
          <CardHeader className="">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestion + 1} of {quizData.length}
              </span>
              <span className="text-sm font-medium">Score: {score}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <CardTitle className="mt-4">{quizData[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect} className="space-y-3">
              {quizData[currentQuestion].options.map((option, index) => {
                const isCorrect = option === quizData[currentQuestion].correctAnswer
                const isSelected = option === selectedAnswer

                let optionClassName = "border border-input rounded-lg p-4 transition-colors"

                if (answered) {
                  if (isCorrect) {
                    optionClassName += " bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  } else if (isSelected && !isCorrect) {
                    optionClassName += " bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  }
                } else if (isSelected) {
                  optionClassName += " bg-muted"
                }

                return (
                  <div key={index} className={optionClassName} onClick={() => handleAnswerSelect(option)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} disabled={answered} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                      {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNextQuestion} disabled={!selectedAnswer} className="w-full">
              {answered ? (currentQuestion === quizData.length - 1 ? "Show Results" : "Next Question") : "Check Answer"}
            </Button>
          </CardFooter>
        </Card>
    </div>
  )
}
