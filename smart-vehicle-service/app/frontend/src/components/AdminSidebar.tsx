"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminSidebar() {
  const { isLightMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile & Tablet Top Bar for Responsive Screens */}
      <div className={`lg:hidden flex items-center justify-between px-4 sm:px-6 py-4 border-b ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#121216] border-white/10 text-white"} fixed top-0 left-0 right-0 z-50`}>
        <span className="text-lg font-black tracking-tighter uppercase">
          Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
        </span>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="px-3.5 py-2 rounded-xl border text-xs font-bold tracking-wider uppercase cursor-pointer"
        >
          {sidebarOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Backdrop Overlay for smaller viewports */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden" 
        />
      )}

      {/* Adaptive Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 shrink-0 border-r p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isLightMode ? "border-gray-200 bg-white text-gray-900" : "border-white/10 bg-[#121216] text-[#f3f3f6]"}`}>
        <div>
          <div className="hidden lg:flex items-center justify-between mb-8">
            <span className="text-xl font-black tracking-tighter uppercase">
              Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
            </span>
          </div>
          
          <nav className="flex flex-col gap-2 text-xs uppercase tracking-widest font-bold w-full overflow-y-auto max-h-[calc(100vh-140px)] pr-1 pt-12 lg:pt-0">
            <Link href="/admin/dashboard" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>📊 Dashboard</Link>
            <Link href="/admin/users" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>👥 Users</Link>
            <Link href="/admin/vehicles" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>🚗 Vehicles</Link>
            <Link href="/admin/bookings" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>📅 Bookings</Link>
            <Link href="/admin/services" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>⚙️ Services</Link>
            <Link href="/admin/service-centers" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>🛠️ Centers</Link>
            <Link href="/admin/spare-parts" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>📦 Spare Parts</Link>
            <Link 
                    href="/admin/archive" 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-[#00F0FF]"
                  >
                    <span>📦</span>  Archives
              </Link>
            <Link href="/admin/invoices" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>💰 Invoices</Link>
            <Link href="/admin/reminders" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>⏰ Reminders</Link>
            <Link href="/admin/reviews" onClick={() => setSidebarOpen(false)} className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${isLightMode ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-neutral-300"}`}>⭐ Reviews</Link>
          </nav>
        </div>

        <div className={`pt-4 border-t text-xs font-mono text-neutral-500 uppercase tracking-widest ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
          AutoCare v2.6
        </div>
      </aside>
    </>
  );
}