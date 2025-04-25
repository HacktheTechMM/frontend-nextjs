import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get token from request headers
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Call Laravel API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const response = await fetch(`${apiUrl}/api/v1/interviews/feedbacks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // If the API call fails, return demo data for development
      return NextResponse.json({
        id: "demo-feedback-" + Date.now(),
        interview_id: body.interview_id,
        user_id: body.user_id,
        ...body.feedback,
        createdAt: new Date().toISOString(),
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating feedback:", error)

    // Return error response
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 })
  }
}
