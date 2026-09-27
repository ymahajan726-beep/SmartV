const API_BASE_URL = "http://localhost:4000/api";

export async function apiRequest(endpoint: string, method: string = "GET", body?: any) {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("autocare_token") || localStorage.getItem("token") || "";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }
  
  // 🔥 FIX: Agar response empty hai (jaise DELETE 204 No Content), toh json() parse mat karo
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}