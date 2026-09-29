"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { isLightMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isLightMode ? "bg-[#f8f9fa] text-slate-900" : "bg-[#060608] text-[#f8fafc]"}`}>
      
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* Customer Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isLightMode ? "bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50" : "bg-[#0d0d12] border-white/[0.06] text-slate-100"}`}>
        <div className="p-8 border-inherit flex items-center justify-between">
          <span className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
            Auto<span className="text-black bg-[#00F0FF] px-2 py-0.5 rounded-lg shadow-sm">Care</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 text-xs font-mono font-bold cursor-pointer">✕</button>
        </div>

        <div className="px-6 py-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Customer Cockpit</span>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-1.5 text-xs uppercase tracking-widest font-mono overflow-y-auto">
          <Link href="/customer/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${isActive('/customer/dashboard') ? (isLightMode ? "bg-slate-900 text-white shadow-md" : "bg-[#00F0FF] text-slate-950 shadow-lg") : "hover:opacity-80"}`}>
            <span>⚡</span> Dashboard
          </Link>
          <Link href="/customer/vehicles" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/vehicles') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
            <span>🚗</span> My Vehicles
          </Link>
          <Link href="/customer/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/bookings') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
            <span>📅</span> My Bookings
          </Link>
          <Link href="/customer/tracking" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/tracking') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
            <span>📡</span> Live Tracking
          </Link>
          <Link href="/customer/history" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/history') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
            <span>📜</span> History & Logs
          </Link>
          <Link href="/customer/invoices" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/invoices') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
            <span>💳</span> Invoices
          </Link>
          <Link href="/customer/reminders" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/reminders') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
            <span>⏰</span> Reminders
          </Link>
          <Link href="/customer/reviews" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/reviews') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
            <span>⭐</span> Reviews
          </Link>
        </nav>

        <div className="p-6 border-t border-inherit">
          <button onClick={() => { localStorage.removeItem("user-id"); window.location.href = "/"; }} className="w-full text-center py-3 rounded-xl border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-widest hover:bg-red-500/10 transition-colors font-bold cursor-pointer">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:pl-72 w-full">
        
        {/* Global Top Bar with Hamburger Toggle for Mobile */}
        <header className={`h-20 px-6 md:px-8 border-b flex justify-between items-center sticky top-0 z-20 backdrop-blur-xl ${isLightMode ? "bg-white/90 border-slate-200 shadow-sm" : "bg-[#060608]/90 border-white/[0.06]"}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden text-lg font-mono p-2 rounded-xl border border-white/10 cursor-pointer"
              title="Open Menu"
            >
              ☰
            </button>
            <div className="hidden sm:flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping"></span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Secure Cockpit Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="w-full flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}