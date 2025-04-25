import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("reponse",JSON.stringify(body))

    // Call the external API with the exact same body structure
<<<<<<< HEAD
    const response = await fetch("https://ai-backend-13.onrender.com/quiz/invoke", {
=======
    const response = await fetch("https://ai-backend-8.onrender.com/quiz/invoke", {
>>>>>>> 7e4872e (quizz done)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    // Just pass through the response as-is
    // This way the client can handle the specific structure
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 })
  }
}
