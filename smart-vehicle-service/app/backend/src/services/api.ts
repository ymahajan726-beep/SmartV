const API_BASE_URL = "http://localhost:3001/api";

export async function apiRequest(endpoint: string, method: string = "GET", data?: any) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Backend Connection Error:", error);
    throw error;
  }
}