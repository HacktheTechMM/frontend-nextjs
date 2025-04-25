// app/api/roadmap/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST() {
  try {
    const token = localStorage.getItem('token') // or wherever you store your token

    // Using Axios to make the API call
    const res = await axios.post("http://127.0.0.1:8000/api/v1/auth/me", {
      headers: {
            Authorization: `Bearer ${token} ?? null}`,
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
