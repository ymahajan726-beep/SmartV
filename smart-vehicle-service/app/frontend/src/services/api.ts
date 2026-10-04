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

    token = localStorage.getItem(isAdminRoute ? "autocare_token" : "customer_token") || 
            localStorage.getItem("autocare_token") || 
            localStorage.getItem("token") || 
            localStorage.getItem("access_token") || 
            localStorage.getItem("authToken") || 
            localStorage.getItem("jwt") || "";
  }

  // Base URL aur endpoint ko clean karo aur aakhri slash (/) hata do
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const cleanEndpoint = formattedEndpoint.replace(/\/+$/, ""); // 👈 Aakhri slash ko hata dega taaki 308 na aaye

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