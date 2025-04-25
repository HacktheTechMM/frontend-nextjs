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
    const response = await fetch(`${apiUrl}/api/v1/interviews/${interviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // If the API call fails, return demo data for development
      return NextResponse.json({
        interview_id: interviewId,
        user_id: "demo-user",
        role: "Frontend Developer",
        type: "Technical",
        techstack: ["React", "TypeScript", "Next.js"],
        questions: [
          "Explain the difference between React state and props.",
          "How do you handle API calls in React?",
          "What are React hooks and how do you use them?",
        ],
        created_at: new Date().toISOString(),
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching interview:", error)

    // Return demo data in case of error
    return NextResponse.json({
      interview_id: params.id,
      user_id: "demo-user",
      role: "Frontend Developer",
      type: "Technical",
      techstack: ["React", "TypeScript", "Next.js"],
      questions: [
        "Explain the difference between React state and props.",
        "How do you handle API calls in React?",
        "What are React hooks and how do you use them?",
      ],
      created_at: new Date().toISOString(),
    })
  }
}
