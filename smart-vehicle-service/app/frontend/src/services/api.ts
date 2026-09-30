const API_BASE_URL = "http://localhost:4000/api";

export async function apiRequest(endpoint: string, method: string = "GET", body?: any) {
  let token = "";
  if (typeof window !== "undefined") {
    const isAdminRoute = endpoint.startsWith("/admin");

    if (isAdminRoute) {
      // Admin routes ke liye pehle 'autocare_token' dekhein
      token = 
        localStorage.getItem("autocare_token") || 
        localStorage.getItem("token") || 
        localStorage.getItem("access_token") || 
        localStorage.getItem("authToken") || 
        localStorage.getItem("jwt") || 
        localStorage.getItem("customer_token") || "";
    } else {
      // Customer routes ke liye pehle 'customer_token' dekhein
      token = 
        localStorage.getItem("customer_token") || 
        localStorage.getItem("autocare_token") || 
        localStorage.getItem("token") || 
        localStorage.getItem("access_token") || 
        localStorage.getItem("authToken") || 
        localStorage.getItem("jwt") || "";
    }
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
  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}