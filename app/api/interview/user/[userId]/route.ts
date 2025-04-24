import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}/interviews`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true, // only if Laravel uses cookie-based auth
      }
    );

    return NextResponse.json(response.data.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response?.data || error.message || "Error fetching user interviews",
      },
      { status: error.response?.status || 500 }
    );
  }
}
