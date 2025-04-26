"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeIcon, Gauge, GraduationCap, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import CodingTest from "./coding-test"

// Define types for your data structures
interface StarterCode {
    javascript: string;
    python: string;
    c: string;
}

interface Question {
    id: number;
    title: string;
    description: string;
    timeLimit: number;
    starterCode: StarterCode;
    solution: StarterCode;
    testCases: Array<{
        input: string;
        expectedOutput: string;
    }>;
    hint: string;
    sampleInput: StarterCode;
}

interface DifficultyLevel {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    badge: React.ReactNode;
    questions: Question[];
}

const difficultyLevels: DifficultyLevel[] = [
    {
        id: "beginner",
        title: "Beginner",
        description: "Fundamental programming concepts and simple algorithms",
        icon: <Lightbulb className="h-8 w-8 text-emerald-500" />,
        color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
        badge: (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Easy
            </Badge>
        ),
        questions: [
            {
                id: 1,
                title: "Reverse a String",
                description: "Write a function that reverses a string. The input string is given as an array of characters.",
                timeLimit: 5 * 60, // 5 minutes in seconds
                starterCode: {
                    javascript:
                        'function reverseString(str) {\n  // Your code here\n  \n  console.log("Output: " + str);\n  return str;\n}',
                    python: 'def reverse_string(s):\n    # Your code here\n    \n    print("Output:", s)\n    return s',
                    c: '#include <stdio.h>\n#include <string.h>\n\nvoid reverse_string(char* str) {\n    // Your code here\n    \n    printf("Output: %s\\n", str);\n}',
                },
                testCases: [
                    { input: '"hello"', expectedOutput: '"olleh"' },
                    { input: '"world"', expectedOutput: '"dlrow"' },
                ],
                hint: "Try using the split(), reverse(), and join() methods or a for loop that swaps characters.",
                solution: {
                    javascript: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
                    python: "def reverse_string(s):\n    return s[::-1]",
                    c: "void reverse_string(char* str) {\n    int length = strlen(str);\n    int i, j;\n    char temp;\n    for (i = 0, j = length - 1; i < j; i++, j--) {\n        temp = str[i];\n        str[i] = str[j];\n        str[j] = temp;\n    }\n}",
                },
                sampleInput: {
                    javascript: '"hello"',
                    python: '"hello"',
                    c: '"hello"',
                },
            },
            {
                id: 2,
                title: "Reverse a String",
                description: "Write a function that reverses a string. The input string is given as an array of characters.",
                timeLimit: 5 * 60, // 5 minutes in seconds
                starterCode: {
                    javascript:
                        'function reverseString(str) {\n  // Your code here\n  \n  console.log("Output: " + str);\n  return str;\n}',
                    python: 'def reverse_string(s):\n    # Your code here\n    \n    print("Output:", s)\n    return s',
                    c: '#include <stdio.h>\n#include <string.h>\n\nvoid reverse_string(char* str) {\n    // Your code here\n    \n    printf("Output: %s\\n", str);\n}',
                },
                testCases: [
                    { input: '"hello"', expectedOutput: '"olleh"' },
                    { input: '"world"', expectedOutput: '"dlrow"' },
                ],
                hint: "Try using the split(), reverse(), and join() methods or a for loop that swaps characters.",
                solution: {
                    javascript: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
                    python: "def reverse_string(s):\n    return s[::-1]",
                    c: "void reverse_string(char* str) {\n    int length = strlen(str);\n    int i, j;\n    char temp;\n    for (i = 0, j = length - 1; i < j; i++, j--) {\n        temp = str[i];\n        str[i] = str[j];\n        str[j] = temp;\n    }\n}",
                },
                sampleInput: {
                    javascript: '"hello"',
                    python: '"hello"',
                    c: '"hello"',
                },
            },
        ],
    },
    {
        id: "intermediate",
        title: "Intermediate",
        description: "Data structures, algorithms, and problem-solving techniques",
        icon: <Gauge className="h-8 w-8 text-blue-500" />,
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        badge: (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Medium
            </Badge>
        ),
        questions: [
            {
                id: 1,
                title: "Find Maximum Value",
                description: "Write a function that finds the maximum value in an array of numbers.",
                timeLimit: 8 * 60, // 8 minutes in seconds
                starterCode: {
                    javascript:
                        'function findMax(arr) {\n  // Your code here\n  \n  console.log("Output: " + arr);\n  return 0;\n}',
                    python: 'def find_max(arr):\n    # Your code here\n    \n    print("Output:", arr)\n    return 0',
                    c: '#include <stdio.h>\n\nint find_max(int arr[], int size) {\n    // Your code here\n    \n    printf("Output: Array of size %d\\n", size);\n    return 0;\n}',
                },
                testCases: [
                    { input: "[1, 3, 5, 7, 9]", expectedOutput: "9" },
                    { input: "[-1, -5, -10, -2]", expectedOutput: "-1" },
                ],
                hint: "You can use Math.max() with the spread operator or implement a loop to track the maximum value.",
                solution: {
                    javascript: "function findMax(arr) {\n  return Math.max(...arr);\n}",
                    python: "def find_max(arr):\n    return max(arr)",
                    c: "int find_max(int arr[], int size) {\n    int max = arr[0];\n    for (int i = 1; i < size; i++) {\n        if (arr[i] > max) {\n            max = arr[i];\n        }\n    }\n    return max;\n}",
                },
                sampleInput: {
                    javascript: "[1, 3, 5, 7, 9]",
                    python: "[1, 3, 5, 7, 9]",
                    c: "[1, 3, 5, 7, 9]",
                },
            },
        ],
    },
    {
        id: "advanced",
        title: "Advanced",
        description: "Complex algorithms, optimization problems, and system design",
        icon: <GraduationCap className="h-8 w-8 text-purple-500" />,
        color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        badge: (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Hard
            </Badge>
        ),
        questions: [
            {
                id: 1,
                title: "Check for Palindrome",
                description: "Write a function that checks if a given string is a palindrome.",
                timeLimit: 10 * 60, // 10 minutes in seconds
                starterCode: {
                    javascript:
                        'function isPalindrome(str) {\n  // Your code here\n  \n  console.log("Output: " + str);\n  return false;\n}',
                    python: 'def is_palindrome(s):\n    # Your code here\n    \n    print("Output:", s)\n    return False',
                    c: '#include <stdio.h>\n#include <stdbool.h>\n#include <string.h>\n\nbool is_palindrome(char* str) {\n    // Your code here\n    \n    printf("Output: %s\\n", str);\n    return false;\n}',
                },
                testCases: [
                    { input: '"racecar"', expectedOutput: "true" },
                    { input: '"hello"', expectedOutput: "false" },
                ],
                hint: "A palindrome reads the same backward as forward. Consider normalizing the string (removing spaces, converting to lowercase) before checking.",
                solution: {
                    javascript:
                        "function isPalindrome(str) {\n  const normalized = str.toLowerCase();\n  return normalized === normalized.split('').reverse().join('');\n}",
                    python: "def is_palindrome(s):\n    s = s.lower()\n    return s == s[::-1]",
                    c: "bool is_palindrome(char* str) {\n    int length = strlen(str);\n    for (int i = 0; i < length / 2; i++) {\n        if (str[i] != str[length - i - 1]) {\n            return false;\n        }\n    }\n    return true;\n}",
                },
                sampleInput: {
                    javascript: '"racecar"',
                    python: '"racecar"',
                    c: '"racecar"',
                },
            },
        ],
    },
];

export default function DifficultySelector() {
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null)

    if (selectedDifficulty) {
        return <CodingTest difficulty={selectedDifficulty} onBack={() => setSelectedDifficulty(null)} />
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {difficultyLevels.map((level) => (
                    <Card
                        key={level.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${level.color} dark:bg-card `}
                        onClick={() => setSelectedDifficulty(level)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl dark:text-white">{level.title}</CardTitle>
                                {level.badge}
                            </div>
                            <CardDescription className="dark:text-gray-400">{level.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center py-6">{level.icon}</CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => setSelectedDifficulty(level)}>
                                <CodeIcon className="mr-2 h-4 w-4" /> Start Coding
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}