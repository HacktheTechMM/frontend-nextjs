// app/api/roadmap/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Using Axios to make the API call
    const res = await axios.post("https://ai-backend-3-3gjd.onrender.com/roadmap/invoke", body, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Return the response from the external API
    return NextResponse.json(res.data)
  } catch (err) {
    console.error("API Error:", err)

    // Return a 500 error if something goes wrong
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
