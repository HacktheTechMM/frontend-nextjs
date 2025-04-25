import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id

    // Get token from request headers
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Call Laravel API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/v1/feedbacks/interviews/${interviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // If the API call fails, return demo data for development
      return NextResponse.json({
        id: "demo-feedback-id",
        interview_id: interviewId,
        user_id: "demo-user",
        totalScore: 85,
        finalAssessment:
          "Overall, you demonstrated strong technical knowledge and communication skills. Your answers were clear and well-structured.",
        categoryScores: [
          {
            name: "Technical Knowledge",
            score: 90,
            comment: "You showed excellent understanding of React concepts and modern web development practices.",
          },
          {
            name: "Communication",
            score: 85,
            comment:
              "Your explanations were clear and concise, though sometimes you could provide more concrete examples.",
          },
          {
            name: "Problem Solving",
            score: 80,
            comment: "You approached problems methodically, but could improve on considering edge cases.",
          },
        ],
        strengths: [
          "Strong understanding of React fundamentals",
          "Clear communication style",
          "Good knowledge of modern JavaScript features",
        ],
        areasForImprovement: [
          "Consider edge cases more thoroughly",
          "Provide more real-world examples in your answers",
          "Deepen knowledge of performance optimization techniques",
        ],
        createdAt: new Date().toISOString(),
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching feedback:", error)

    // Return demo data in case of error
    return NextResponse.json({
      id: "demo-feedback-id",
      interview_id: params.id,
      user_id: "demo-user",
      totalScore: 85,
      finalAssessment:
        "Overall, you demonstrated strong technical knowledge and communication skills. Your answers were clear and well-structured.",
      categoryScores: [
        {
          name: "Technical Knowledge",
          score: 90,
          comment: "You showed excellent understanding of React concepts and modern web development practices.",
        },
        {
          name: "Communication",
          score: 85,
          comment:
            "Your explanations were clear and concise, though sometimes you could provide more concrete examples.",
        },
        {
          name: "Problem Solving",
          score: 80,
          comment: "You approached problems methodically, but could improve on considering edge cases.",
        },
      ],
      strengths: [
        "Strong understanding of React fundamentals",
        "Clear communication style",
        "Good knowledge of modern JavaScript features",
      ],
      areasForImprovement: [
        "Consider edge cases more thoroughly",
        "Provide more real-world examples in your answers",
        "Deepen knowledge of performance optimization techniques",
      ],
      createdAt: new Date().toISOString(),
    })
  }
}
