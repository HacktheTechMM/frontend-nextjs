import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch('https://ai-backend-7-vpq9.onrender.com/steps/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error forwarding request:', error)
    return NextResponse.json({ error: 'Failed to fetch steps' }, { status: 500 })
  }
}
