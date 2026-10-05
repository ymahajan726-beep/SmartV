const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function apiRequest(endpoint: string, method: string = "GET", body?: any) {
  let token = "";
  if (typeof window !== "undefined") {
    const isAdminRoute = 
      endpoint.startsWith("/admin") || 
      endpoint.startsWith("/service-centers") || 
      endpoint.startsWith("/services") ||
      endpoint.startsWith("/invoices") || 
      endpoint.includes("/admin/");

    if (isAdminRoute) {
      token = 
        localStorage.getItem("autocare_token") || 
        localStorage.getItem("token") || 
        localStorage.getItem("access_token") || 
        localStorage.getItem("authToken") || 
        localStorage.getItem("jwt") || "";
    } else {
      token = 
        localStorage.getItem("customer_token") || 
        localStorage.getItem("autocare_token") || 
        localStorage.getItem("token") || 
        localStorage.getItem("access_token") || 
        localStorage.getItem("authToken") || 
        localStorage.getItem("jwt") || "";
    }
  }


  const cleanBase = API_BASE_URL.replace(/\/+$/, ""); 
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const finalUrl = cleanBase.endsWith("/api") 
    ? `${cleanBase}${cleanEndpoint}` 
    : `${cleanBase}/api${cleanEndpoint}`;

  const response = await fetch(finalUrl, {
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