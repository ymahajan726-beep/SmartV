"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/src/components/AdminSidebar";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLightMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("autocare_token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("autocare_token");
    router.push("/login");
  };

  // Agar token verify nahi hua toh blank screen ya loader dikhayein redirect hone tak
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Verifying Security Credentials...
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-200 ${isLightMode ? "bg-[#f4f4f0] text-[#111111]" : "bg-[#0b0b0e] text-[#f3f3f6]"}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden pt-16 lg:pt-0">
        {/* Universal Top Header for all viewports */}
        <header className={`h-16 px-4 sm:px-8 border-b flex justify-between items-center gap-4 z-30 ${isLightMode ? "border-gray-200 bg-white" : "border-white/10 bg-[#121216]"}`}>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#cbf000] truncate">
            Admin Control Center
          </span>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={toggleTheme} 
              className={`px-3 sm:px-4 py-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-1.5 ${isLightMode ? "border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}`}
            >
              {isLightMode ? "🌙 Dark" : "☀️ Light"}
            </button>

            <button 
              onClick={handleLogout}
              title="Logout Session"
              className="px-3 sm:px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1.5 font-mono"
            >
              🚪 <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Adaptive Main Page Content */}
        <main className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto ${isLightMode ? "bg-white text-[#111111]" : "bg-[#141418] text-[#f3f3f6]"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  );
}