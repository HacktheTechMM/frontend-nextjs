"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight, Clock, Lightbulb, Play } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useIsMobile as useMobile } from "@/hooks/use-mobile"
import CodeEditor from "./code-editor"
import TabWarning from "./tab-warning"
import { useToast } from "@/components/ui/use-toast"
import CodeOutput from "./code-output"
import ResultsPage from "./results-page"
import LanguageSelector from "./language-selector"

export default function CodingTest({ difficulty, onBack }: any) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedLanguage, setSelectedLanguage] = useState("javascript")
    const [code, setCode] = useState(difficulty.questions[0].starterCode[selectedLanguage])
    const [timeLeft, setTimeLeft] = useState(difficulty.questions[0].timeLimit)
    const [tabSwitchCount, setTabSwitchCount] = useState(0)
    const [showWarning, setShowWarning] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [testCompleted, setTestCompleted] = useState(false)
    const [codeOutput, setCodeOutput] = useState("")
    const [questionSubmitted, setQuestionSubmitted] = useState(Array(difficulty.questions.length).fill(false))
    const { toast } = useToast()
    const isMobile = useMobile()
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Save user's code for each question and language
    const [userAnswers, setUserAnswers] = useState(
        difficulty.questions.map((q: any) => ({
            javascript: q.starterCode.javascript,
            python: q.starterCode.python,
            c: q.starterCode.c,
        })),
    )
    const [results, setResults] = useState([])

    // Handle tab visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setTabSwitchCount((prev) => prev + 1)
                setShowWarning(true)

                if (tabSwitchCount >= 4) {
                    setIsRedirecting(true)
                    toast({
                        title: "Too many violations",
                        description: "You've switched tabs too many times. Your test will be submitted automatically.",
                        variant: "destructive",
                    })

                    // In a real app, you would submit the test and redirect
                    // For demo purposes, we'll just show a message
                    setTimeout(() => {
                        finishTest()
                    }, 3000)
                }
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [tabSwitchCount, toast])

    // Timer countdown
    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev: number) => {
                if (prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }

                    // Call toast here (after state)
                    setTimeout(() => {
                        toast({
                            title: "Time's up for this question!",
                            description: "Moving to the next question...",
                        });
                    }, 0);

                    const newUserAnswers = [...userAnswers];
                    newUserAnswers[currentQuestionIndex] = {
                        ...newUserAnswers[currentQuestionIndex],
                        [selectedLanguage]: code,
                    };
                    setUserAnswers(newUserAnswers);

                    if (!questionSubmitted[currentQuestionIndex]) {
                        const newSubmitted = [...questionSubmitted];
                        newSubmitted[currentQuestionIndex] = true;
                        setQuestionSubmitted(newSubmitted);
                    }

                    if (currentQuestionIndex < difficulty.questions.length - 1) {
                        setTimeout(() => handleNext(), 2000);
                    } else {
                        setTimeout(() => finishTest(), 2000);
                    }

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentQuestionIndex, difficulty.questions.length]);


    //? Update code when language changes
    useEffect(() => {
        setCode(userAnswers[currentQuestionIndex][selectedLanguage])
    }, [selectedLanguage, currentQuestionIndex, userAnswers])

    // Format time as MM:SS
    const formatTime = (seconds: any) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Navigate to next question
    const handleNext = () => {
        // Save current answer
        const newUserAnswers = [...userAnswers]
        newUserAnswers[currentQuestionIndex] = {
            ...newUserAnswers[currentQuestionIndex],
            [selectedLanguage]: code,
        }
        setUserAnswers(newUserAnswers)
        setShowHint(false)

        if (currentQuestionIndex < difficulty.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
            setTimeLeft(difficulty.questions[currentQuestionIndex + 1].timeLimit)
            setCodeOutput("")
        }
    }

    // Navigate to previous question
    const handlePrev = () => {
        // Save current answer
        const newUserAnswers = [...userAnswers]
        newUserAnswers[currentQuestionIndex] = {
            ...newUserAnswers[currentQuestionIndex],
            [selectedLanguage]: code,
        }
        setUserAnswers(newUserAnswers)
        setShowHint(false)

        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1)
            setTimeLeft(difficulty.questions[currentQuestionIndex - 1].timeLimit)
            setCodeOutput("")
        }
    }

    // Run the code and display output
    const runCode = () => {
        try {
            // open submit button again
            const newSubmitted = [...questionSubmitted]
            newSubmitted[currentQuestionIndex] = false
            setQuestionSubmitted(newSubmitted)
            const currentQuestion = difficulty.questions[currentQuestionIndex]
            const input = currentQuestion.sampleInput[selectedLanguage]
            let formattedOutput = `Input: ${input}\n`

            if (selectedLanguage === "javascript") {
                // Create a safe environment to run JavaScript code
                const originalConsoleLog = console.log
                const outputCapture: any[] = []

                // Override console.log to capture output
                console.log = (...args) => {
                    outputCapture.push(args.join(" "))
                }

                // Get function name from code
                const functionName = code.substring(9, code.indexOf("("))

                // Execute the code
                const result = new Function(`
          ${code}
          return ${functionName}(${input});
        `)()

                // Restore console.log
                console.log = originalConsoleLog

                if (outputCapture.length > 0) {
                    formattedOutput += outputCapture.join("\n") + "\n"
                }

                formattedOutput += `Return value: ${JSON.stringify(result)}`
            } else if (selectedLanguage === "python") {
                // For Python, we'd normally use a backend service
                // This is a simulation for the UI
                formattedOutput += "Python execution (simulated):\n"

                // Extract function name
                const functionName = code.substring(4, code.indexOf("("))

                // Simulate some output
                if (code.includes("print")) {
                    formattedOutput += "Output: " + input + "\n"
                }

                // Simulate return value based on solution pattern
                const solution = currentQuestion.solution.python
                if (code.includes(solution.substring(solution.indexOf("return")))) {
                    if (currentQuestion.title.includes("Reverse")) {
                        formattedOutput += "Return value: " + JSON.stringify(input.split("").reverse().join(""))
                    } else if (currentQuestion.title.includes("Maximum")) {
                        formattedOutput += "Return value: 9"
                    } else if (currentQuestion.title.includes("Palindrome")) {
                        formattedOutput += "Return value: true"
                    }
                } else {
                    formattedOutput += "Return value: (default return value)"
                }
            } else if (selectedLanguage === "c") {
                // For C, we'd normally use a backend service
                // This is a simulation for the UI
                formattedOutput += "C execution (simulated):\n"

                // Simulate some output
                if (code.includes("printf")) {
                    formattedOutput += "Output: " + input + "\n"
                }

                // Simulate return value based on solution pattern
                const solution = currentQuestion.solution.c
                if (code.includes(solution.substring(solution.indexOf("return")))) {
                    if (currentQuestion.title.includes("Reverse")) {
                        formattedOutput += "String reversed successfully"
                    } else if (currentQuestion.title.includes("Maximum")) {
                        formattedOutput += "Return value: 9"
                    } else if (currentQuestion.title.includes("Palindrome")) {
                        formattedOutput += "Return value: true"
                    }
                } else {
                    formattedOutput += "Return value: (default return value)"
                }
            }

            setCodeOutput(formattedOutput)
        } catch (error: any) {
            setCodeOutput(`Error: ${error.message}`)
        }
    }

    // Submit the current question
    const submitSolution = () => {
        // Save current answer
        const newUserAnswers = [...userAnswers]
        newUserAnswers[currentQuestionIndex] = {
            ...newUserAnswers[currentQuestionIndex],
            [selectedLanguage]: code,
        }
        setUserAnswers(newUserAnswers)

        // Mark as submitted
        const newSubmitted = [...questionSubmitted]
        newSubmitted[currentQuestionIndex] = true
        setQuestionSubmitted(newSubmitted)

        toast({
            title: "Solution submitted",
            description: "Your solution has been saved",
        })
    }

    // Finish the test and evaluate results
    const finishTest = () => {
        // Save the current answer
        const newUserAnswers = [...userAnswers]
        newUserAnswers[currentQuestionIndex] = {
            ...newUserAnswers[currentQuestionIndex],
            [selectedLanguage]: code,
        }
        setUserAnswers(newUserAnswers)

        // Evaluate results (in a real app, this would be done server-side)
        const evaluatedResults = difficulty.questions.map((question: any, index: any) => {
            // Get the user's code in their preferred language
            const userCode = newUserAnswers[index][selectedLanguage]
            const solution = question.solution[selectedLanguage]

            // This is a simplified evaluation - in a real app, you would run tests against the code
            const isCorrect = userCode.includes(solution.substring(solution.indexOf("return")))

            return {
                questionId: question.id,
                questionTitle: question.title,
                userCode,
                correctSolution: solution,
                language: selectedLanguage,
                isCorrect,
                feedback: isCorrect
                    ? "Great job! Your solution is correct."
                    : "Your solution doesn't match the expected output. Review the correct solution.",
            }
        })

        setResults(evaluatedResults)
        setTestCompleted(true)
    }

    // Calculate progress percentage
    const progressPercentage = ((currentQuestionIndex + 1) / difficulty.questions.length) * 100

    const currentQuestion = difficulty.questions[currentQuestionIndex]

    if (testCompleted) {
        return <ResultsPage results={results} questions={difficulty.questions} onBack={onBack} />
    }

    return (
        <>
            <div className="mb-4">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back to Difficulty Selection
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Question Card */}
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                {difficulty.title}: Question {currentQuestionIndex + 1}/{difficulty.questions.length}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-orange-500">
                                <Clock className="h-5 w-5" />
                                <span className="font-mono">{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                        <CardDescription>
                            {tabSwitchCount > 0 && (
                                <Alert className="mt-2 bg-amber-50 text-amber-800 border-amber-200">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Warning!</AlertTitle>
                                    <AlertDescription>
                                        Tab switching detected ({tabSwitchCount}/5). Please stay on this page.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-2">{currentQuestion?.title}</h3>
                        <p className="mb-4">{currentQuestion?.description}</p>

                        <div className="bg-muted p-3 rounded-md mb-4">
                            <h4 className="font-medium mb-2">Test Cases:</h4>
                            <ul className="space-y-1 font-mono text-sm">
                                {currentQuestion?.testCases.map((testCase: any, index: any) => (
                                    <li key={index}>
                                        Input: {testCase.input} → Expected: {testCase.expectedOutput}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {showHint && (
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4">
                                <h4 className="font-medium mb-1 flex items-center gap-1 text-amber-700">
                                    <Lightbulb className="h-4 w-4" /> Hint:
                                </h4>
                                <p className="text-amber-700">{currentQuestion.hint}</p>
                            </div>
                        )}

                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Progress:</h4>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                            <Button variant="secondary" onClick={() => setShowHint(!showHint)}>
                                <Lightbulb className="mr-2 h-4 w-4" /> {showHint ? "Hide Hint" : "Show Hint"}
                            </Button>
                        </div>
                        {currentQuestionIndex === difficulty.questions.length - 1 ? (
                            <Button onClick={finishTest} variant="default">
                                Finish Test
                            </Button>
                        ) : (
                            <Button onClick={handleNext}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Code Editor Card */}
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Your Solution</CardTitle>
                                <CardDescription>Write your code below to solve the problem</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={setSelectedLanguage} />
                                <Button onClick={runCode} variant="secondary" className="flex items-center gap-1">
                                    <Play className="h-4 w-4" /> Run
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[400px] md:h-[500px] flex flex-col">
                        <div className="flex-1 mb-4">
                            <CodeEditor value={code} onChange={setCode} language={selectedLanguage} />
                        </div>
                        <div className="h-[150px]">
                            <CodeOutput
                                output={codeOutput || `Click 'Run' to execute your ${selectedLanguage} code and see the output here.`}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            variant={questionSubmitted[currentQuestionIndex] ? "secondary" : "default"}
                            onClick={submitSolution}
                            disabled={questionSubmitted[currentQuestionIndex]}
                        >
                            {questionSubmitted[currentQuestionIndex] ? "Submitted" : "Submit Solution"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Tab Warning Modal */}
            {showWarning && (
                <TabWarning
                    count={tabSwitchCount}
                    isOpen={showWarning}
                    onClose={() => setShowWarning(false)}
                    isRedirecting={isRedirecting}
                />
            )}
        </>
    )
}
