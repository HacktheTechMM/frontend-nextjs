
"use server"
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const laravelResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        withCredentials: true, // if Laravel uses cookie-based auth
      }
    );

    return NextResponse.json(laravelResponse.data.data.user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.response?.data || error.message || "Failed to fetch user",
      },
      { status: error.response?.status || 500 }
    );
  }
}
