"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { isLightMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem("autocare_token");
    localStorage.removeItem("autocare_token");
    window.location.href = "/";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex bg-[#060608] text-white">
        <div className="w-72 border-r border-white/10 p-6 font-mono text-xs">Loading Cockpit...</div>
        <main className="flex-1 p-8">{children}</main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isLightMode ? "bg-[#f8f9fa] text-slate-900" : "bg-[#060608] text-[#f8fafc]"}`}>
      
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isLightMode ? "bg-white border-slate-200 text-slate-900 shadow-xl" : "bg-[#0d0d12] border-white/[0.06] text-slate-100"}`}>
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
          <Link 
            href="/customer/dashboard" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${isActive('/customer/dashboard') ? (isLightMode ? "bg-slate-900 text-white shadow-md" : "bg-[#00F0FF] text-slate-950 shadow-lg") : "hover:opacity-80"}`}
          >
            <span>⚡</span> Dashboard
          </Link>
          <Link 
            href="/customer/vehicles" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/vehicles') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}
          >
            <span>🚗</span> My Vehicles
          </Link>
          <Link 
            href="/customer/bookings" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/bookings') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}
          >
            <span>📅</span> My Bookings
          </Link>
          <Link 
            href="/customer/invoices" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/invoices') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}
          >
            <span>💳</span> Invoices
          </Link>
          <Link 
            href="/customer/reminders" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/reminders') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}
          >
            <span>⏰</span> Reminders
          </Link>
          <Link 
            href="/customer/reviews" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/reviews') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}
          >
            <span>⭐</span> Reviews
          </Link>
        </nav>

        <div className="p-6 border-t border-inherit">
          <button onClick={handleLogout} className="w-full text-center py-3 rounded-xl border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-widest hover:bg-red-500/10 transition-colors font-bold cursor-pointer">
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:pl-72 w-full min-w-0">
        {/* Universal Top Header for all customer pages with Theme Toggle */}
        <header className={`h-16 px-4 sm:px-8 border-b flex justify-between items-center gap-4 z-30 sticky top-0 backdrop-blur-md ${isLightMode ? "border-slate-200 bg-white/80 text-slate-900" : "border-white/10 bg-[#060608]/80 text-white"}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden text-xs font-mono p-2 rounded-xl border border-current cursor-pointer"
            >
              ☰ Menu
            </button>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#00F0FF] truncate">
              Secure Garage Vault 
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className={`px-3 sm:px-4 py-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-1.5 font-mono ${isLightMode ? "border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}`}
            >
              {isLightMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </header>

        <main className={`w-full flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto ${isLightMode ? "bg-[#f8f9fa] text-slate-900" : "bg-[#060608] text-[#f8fafc]"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}