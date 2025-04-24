import axios from "axios";

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/interviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      withCredentials: true // required if Laravel uses cookies + CSRF
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching interview:", error.response?.data || error.message);
    return null;
  }
}
