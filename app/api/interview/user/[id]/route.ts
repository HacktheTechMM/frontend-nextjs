import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    // Get token from request headers
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Call Laravel API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    console.log("url",`${apiUrl}/api/v1/users/${userId}/interviews`)
    const response = await fetch(`${apiUrl}/api/v1/users/${userId}/interviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // If the API call fails, return demo data for development
      return NextResponse.json([
        {
          interview_id: "demo-1",
          user_id: userId,
          role: "Frontend Developer",
          type: "Technical",
          techstack: ["React", "TypeScript", "Next.js"],
          created_at: new Date().toISOString(),
        },
        {
          interview_id: "demo-2",
          user_id: userId,
          role: "Backend Developer",
          type: "Mixed",
          techstack: ["Node.js", "Express", "MongoDB"],
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ])
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching user interviews:", error)

    // Return demo data in case of error
    return NextResponse.json([
      {
        interview_id: "demo-1",
        user_id: params.id,
        role: "Frontend Developer",
        type: "Technical",
        techstack: ["React", "TypeScript", "Next.js"],
        created_at: new Date().toISOString(),
      },
      {
        interview_id: "demo-2",
        user_id: params.id,
        role: "Backend Developer",
        type: "Mixed",
        techstack: ["Node.js", "Express", "MongoDB"],
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ])
  }
}
