"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Rocket, ArrowRight, Braces, Database, Globe, Terminal } from "lucide-react"

export default function QuizSelectionPage() {
  const router = useRouter()
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  const skillLevels = [
    { id: "beginner", name: "Beginner", icon: BookOpen, description: "New to programming or this technology" },
    { id: "intermediate", name: "Intermediate", icon: Code, description: "Familiar with core concepts" },
    { id: "advanced", name: "Advanced", icon: Rocket, description: "Looking for challenging questions" },
  ]

  const languages = [
    { id: "nextjs", name: "Next.js", icon: Braces, description: "React framework for production" },
    { id: "reactjs", name: "React.js", icon: Code, description: "JavaScript library for building user interfaces" },
    { id: "javascript", name: "JavaScript", icon: Globe, description: "Core web programming language" },
    { id: "typescript", name: "TypeScript", icon: Database, description: "Typed superset of JavaScript" },
    { id: "python", name: "Python", icon: Terminal, description: "General-purpose programming language" },
  ]

  const startQuiz = () => {
    if (selectedSkillLevel && selectedLanguage) {
      router.push(`/chats/quizz/questions?level=${selectedSkillLevel}&language=${selectedLanguage}`)
    }
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Take a Quiz</h1>
        <p className="text-muted-foreground">Select your skill level and preferred language to start the quiz</p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Choose your skill level:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillLevels.map((level) => (
            <Card
              key={level.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedSkillLevel === level.id ? "border-primary ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedSkillLevel(level.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <level.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{level.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{level.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Choose a language or framework:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {languages.map((language) => (
            <Card
              key={language.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedLanguage === language.id ? "border-primary ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedLanguage(language.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <language.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{language.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{language.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={startQuiz} disabled={!selectedSkillLevel || !selectedLanguage} className="gap-2">
          Start Quiz <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
