"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the question type based on the API response
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

export default function QuizQuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || "beginner"
  const language = searchParams.get("language") || "nextjs"

  // State for quiz data and UI
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])

  // Fetch questions from our API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              input: `{${level} ${language}}`,
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.statusText}`)
        }

        const responseData = await response.json()

        // Check if the response has the expected structure
        if (!responseData.output || !responseData.output.content) {
          throw new Error("Invalid API response format")
        }

        // Clean up the content string before parsing
        let contentStr = responseData.output.content

        // Handle markdown code blocks by removing backticks and language identifiers
        if (contentStr.startsWith("```")) {
          // Extract content between code blocks
          const codeBlockMatch = contentStr.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (codeBlockMatch && codeBlockMatch[1]) {
            contentStr = codeBlockMatch[1].trim()
          } else {
            // If we can't extract from code blocks, just remove the first line
            contentStr = contentStr.replace(/```(?:json)?\s*/, "")
            // And remove trailing backticks if they exist
            contentStr = contentStr.replace(/\s*```\s*$/, "")
          }
        }

        // Parse the cleaned content string
        let data
        try {
          data = JSON.parse(contentStr)
          console.log(data)
        } catch (parseError) {
          console.error("Failed to parse questions:", parseError)
          console.error("Content string:", contentStr)
          throw new Error("Failed to parse quiz questions")
        }

        // Validate the data structure
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format: expected an array of questions")
        }

        // Filter out questions with missing options
        const validQuestions = data.filter((q) => q.options && Array.isArray(q.options) && q.options.length > 0)

        if (validQuestions.length === 0) {
          throw new Error("No valid questions found for this combination")
        }

        setQuestions(validQuestions)
        // Initialize userAnswers array with nulls
        setUserAnswers(Array(validQuestions.length).fill(null))
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching questions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [level, language])

  // Handle loading state
  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading quiz questions...</p>
      </div>
    )
  }

  // Handle error state
  if (error || questions.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Unable to Load Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || "No questions available for this combination."}</p>
            <p>Try selecting a different skill level or language.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/chats/quizz")} className="w-full">
              Back to Selection
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Find the index of the correct answer in the options array
  const getCorrectAnswerIndex = (question: QuizQuestion) => {
    return question.options.findIndex((option) => option === question.correctAnswer)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex)
    }
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswerSubmitted(true)

    // Store the user's answer
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = selectedAnswer
    setUserAnswers(newUserAnswers)

    // Check if the selected answer is correct
    const correctAnswerIndex = getCorrectAnswerIndex(currentQuestion)
    if (selectedAnswer === correctAnswerIndex) {
      setScore(score + 1)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setScore(0)
    setQuizCompleted(false)
    setUserAnswers(Array(questions.length).fill(null))
  }

  const goBack = () => {
    router.push("/chats/quizz")
  }

  // Quiz results view
  if (quizCompleted) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-2xl font-bold mb-6">
              Your Score: {score} out of {questions.length}
            </div>
            <Progress value={(score / questions.length) * 100} className="h-3" />

            <div className="mt-8 space-y-4">
              {questions.map((question, index) => {
                const correctAnswerIndex = getCorrectAnswerIndex(question)
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      {userAnswers[index] === correctAnswerIndex ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
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
                              userAnswers[index] === correctAnswerIndex
                                ? "text-green-500 font-medium"
                                : "text-red-500 font-medium"
                            }
                          >
                            {userAnswers[index] !== null ? question.options[userAnswers[index]] : "Not answered"}
                          </span>
                        </p>
                        {userAnswers[index] !== correctAnswerIndex && (
                          <p className="text-sm text-green-600 mt-1">Correct answer: {question.correctAnswer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Selection
            </Button>
            <Button onClick={restartQuiz}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Quiz question view
  const correctAnswerIndex = getCorrectAnswerIndex(currentQuestion)

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer?.toString()} className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer transition-colors ${
                  isAnswerSubmitted
                    ? index === correctAnswerIndex
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : selectedAnswer === index
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-transparent"
                    : selectedAnswer === index
                      ? "border-primary"
                      : "hover:bg-muted"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswerSubmitted} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {isAnswerSubmitted && index === correctAnswerIndex && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isAnswerSubmitted && selectedAnswer === index && index !== correctAnswerIndex && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isAnswerSubmitted ? (
            <Button onClick={goToNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Complete Quiz"
              )}
            </Button>
          ) : (
            <Button onClick={checkAnswer} disabled={selectedAnswer === null}>
              Check Answer
            </Button>
          )}
        </CardFooter>
      </Card>

      {isAnswerSubmitted && (
        <Alert
          className={
            selectedAnswer === correctAnswerIndex
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }
        >
          <AlertDescription>
            {selectedAnswer === correctAnswerIndex
              ? "Correct! Well done."
              : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
