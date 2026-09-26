"use client";
import React from "react";
import AdminSidebar from "@/src/components/AdminSidebar";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLightMode } = useTheme();

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isLightMode ? "bg-[#f4f4f0] text-[#111111]" : "bg-[#0b0b0e] text-[#f3f3f6]"}`}>
      <AdminSidebar />
      <main className={`flex-1 ml-64 p-8 min-h-screen overflow-y-auto ${isLightMode ? "bg-white text-[#111111]" : "bg-[#141418] text-[#f3f3f6]"}`}>
        {children}
      </main>
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