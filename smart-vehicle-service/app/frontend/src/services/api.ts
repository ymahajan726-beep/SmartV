const API_BASE_URL = "http://localhost:4000/api";

export async function apiRequest(endpoint: string, method: string = "GET", body?: any) {
  let token = "";
  if (typeof window !== "undefined") {
    // Admin routes, invoices, aur reviews ke admin endpoints ko yahan detect karenge
    const isAdminRoute = 
      endpoint.startsWith("/admin") || 
      endpoint.startsWith("/service-centers") || 
      endpoint.startsWith("/services") ||
      endpoint.startsWith("/invoices") || // 👈 Yeh /invoices endpoint ko bhi admin token ke liye pakad lega
      endpoint.includes("/admin/");

    if (isAdminRoute) {
      // Admin/Workshop protected routes ke liye primary tokens
      token = 
        localStorage.getItem("autocare_token") || 
        localStorage.getItem("token") || 
        localStorage.getItem("access_token") || 
        localStorage.getItem("authToken") || 
        localStorage.getItem("jwt") || "";
    } else {
      // Pure customer routes ke liye
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