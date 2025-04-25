"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"

export default function ResultsPage({ results, questions, onBack }:any) {
  const [activeTab, setActiveTab] = useState("summary")

  // Calculate score
  const correctAnswers = results.filter((result:any) => result.isCorrect).length
  const totalQuestions = results.length
  const score = Math.round((correctAnswers / totalQuestions) * 100)

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Difficulty Selection
        </Button>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Test Results</CardTitle>
          <CardDescription>
            You scored {correctAnswers} out of {totalQuestions} ({score}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              {results.map((result:any, index:any) => (
                <TabsTrigger key={result.questionId} value={`question-${index}`}>
                  Question {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="summary">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Score Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{score}%</div>
                      <div className="text-muted-foreground">
                        {correctAnswers} correct out of {totalQuestions} questions
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Language Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold capitalize">{results[0].language}</div>
                      <div className="text-muted-foreground">Programming language used for solutions</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Question Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.map((result:any, index:any) => (
                        <li key={result.questionId} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            {result.isCorrect ? (
                              <CheckCircle2 className="text-green-500 h-5 w-5" />
                            ) : (
                              <XCircle className="text-red-500 h-5 w-5" />
                            )}
                            <span>
                              Question {index + 1}: {result.questionTitle}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setActiveTab(`question-${index}`)}>
                            View Details
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {results.map((result:any, index:any) => (
              <TabsContent key={result.questionId} value={`question-${index}`}>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          Question {index + 1}: {result.questionTitle}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {result.isCorrect ? (
                            <>
                              <CheckCircle2 className="text-green-500 h-5 w-5" />
                              <span className="text-green-500 font-medium">Correct</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="text-red-500 h-5 w-5" />
                              <span className="text-red-500 font-medium">Incorrect</span>
                            </>
                          )}
                        </div>
                      </div>
                      <CardDescription>{questions[index].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Your Solution ({result.language}):</h3>
                        <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-sm">
                          {result.userCode}
                        </pre>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Correct Solution:</h3>
                        <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-sm">
                          {result.correctSolution}
                        </pre>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Feedback:</h3>
                        <div
                          className={`p-3 rounded-md ${result.isCorrect ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                        >
                          {result.feedback}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} className="w-full">
            Start New Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
