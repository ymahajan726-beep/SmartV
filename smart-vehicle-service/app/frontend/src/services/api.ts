const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiRequest(endpoint: string, method: string = "GET", body?: any) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // LocalStorage se token attach karein agar available ho
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include", // Cookies support ke liye
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: any = new Error(errorData.message || `API Error: ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}