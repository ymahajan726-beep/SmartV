import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the route starts with /admin
  const isAdminRoute = path.startsWith("/admin");

  if (isAdminRoute) {
    // Check for authentication token in cookies or headers (agar aap localStorage use kar rahe hain, 
    // toh middleware mein cookies ya custom token check karna padta hai. Isiliye hum cookie-based ya localStorage check ke liye alternative approach dekhte hain)
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};