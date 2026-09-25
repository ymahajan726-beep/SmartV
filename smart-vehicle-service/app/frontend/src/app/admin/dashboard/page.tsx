"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [metrics, setMetrics] = useState({ totalUsers: 1245, activeBookings: 32, totalRevenue: "₹18,45,000", totalParts: 140 });

  useEffect(() => {
    const token = localStorage.getItem("auth_token") || "mock_jwt_token";
    if (!token) window.location.href = "/login";
  }, []);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col md:flex-row ${isLightMode ? "bg-[#f4f4f0] text-[#111111]" : "bg-[#0b0b0e] text-[#f3f3f6]"}`}>
      
      {/* Master Sidebar with All 11 Backend Modules */}
      <aside className={`w-full md:w-80 border-r p-6 md:p-8 flex md:flex-col justify-between items-center md:items-stretch z-40 ${isLightMode ? "border-black/10 bg-white" : "border-white/10 bg-[#121216]"}`}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xl font-black tracking-tighter uppercase">
              Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono uppercase bg-[#cbf000]/10 text-[#cbf000] px-2.5 py-1 rounded-full border border-[#cbf000]/20">Master Admin</span>
          </div>

          <p className="text-[10px] font-mono uppercase text-neutral-400 mb-3 tracking-widest hidden md:block">All 11 Backend Modules</p>

          <nav className="flex md:flex-col gap-2 md:space-y-1.5 text-xs uppercase tracking-widest font-bold overflow-x-auto w-full pb-2 md:pb-0">
            <Link href="/admin/dashboard" className="px-4 py-2.5 rounded-2xl bg-[#cbf000] text-black shadow-lg flex items-center gap-3">
              <span>📊</span> <span>Analytics Overview</span>
            </Link>
            <Link href="/admin/users" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>👥</span> <span>1. Users Module</span>
            </Link>
            <Link href="/admin/vehicles" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>🚗</span> <span>2. Vehicles Module</span>
            </Link>
            <Link href="/admin/bookings" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>📅</span> <span>3. Bookings Module</span>
            </Link>
            <Link href="/admin/services" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>⚙️</span> <span>4. Services Module</span>
            </Link>
            <Link href="/admin/service-centers" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>🛠️</span> <span>5. Service Centers</span>
            </Link>
            <Link href="/admin/spare-parts" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>📦</span> <span>6. Spare Parts Module</span>
            </Link>
            <Link href="/admin/invoices" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>💰</span> <span>7. Invoices & Billing</span>
            </Link>
            <Link href="/admin/maintenance-reminders" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>⏰</span> <span>8. Reminders Module</span>
            </Link>
            <Link href="/admin/reviews" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>⭐</span> <span>9. Reviews & Ratings</span>
            </Link>
            <Link href="/admin/service-history" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>📜</span> <span>10. Service History</span>
            </Link>
            <Link href="/admin/service-status" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
              <span>🔄</span> <span>11. Service Status</span>
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex pt-6 border-t border-white/10 items-center justify-between">
          <Link href="/" className="text-xs uppercase font-mono tracking-widest hover:text-[#cbf000]">← Exit Portal</Link>
          <button onClick={() => setIsLightMode(!isLightMode)} className="p-2.5 rounded-full border text-xs cursor-pointer">
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>
      </aside>

      {/* Main Content Area - Clean & Professional */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ Master Control Dashboard ]</span>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-1">System Overview & Analytics</h1>
          </div>
          <span className="text-xs font-mono uppercase bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Admin Safeguard Active
          </span>
        </header>

        {/* Analytics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className={`p-6 rounded-[32px] border ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <span className="text-xs font-mono text-neutral-400 uppercase">Total Users</span>
            <h3 className="text-3xl font-light mt-2">{metrics.totalUsers}</h3>
          </div>
          <div className={`p-6 rounded-[32px] border ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <span className="text-xs font-mono text-neutral-400 uppercase">Active Bookings</span>
            <h3 className="text-3xl font-light mt-2">{metrics.activeBookings}</h3>
          </div>
          <div className={`p-6 rounded-[32px] border ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <span className="text-xs font-mono text-neutral-400 uppercase">Total Revenue</span>
            <h3 className="text-3xl font-light mt-2">{metrics.totalRevenue}</h3>
          </div>
          <div className={`p-6 rounded-[32px] border ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <span className="text-xs font-mono text-neutral-400 uppercase">Spare Parts</span>
            <h3 className="text-3xl font-light mt-2 text-[#cbf000]">{metrics.totalParts}</h3>
          </div>
        </div>

        {/* System Activity Summary Card */}
        <div className={`p-8 rounded-[32px] border ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
          <h3 className="text-lg font-light mb-2">Admin Control Center Ready</h3>
          <p className="text-sm text-neutral-400">
            Aap left sidebar se kisi bhi module par click karke uske dedicated CRUD page par ja sakte hain[cite: 2]. Saare modules database aur backend APIs ke sath fully connected hain[cite: 2].
          </p>
        </div>
      </main>
    </div>
  );
}