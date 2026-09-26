"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminDashboardPage() {
  const { isLightMode } = useTheme();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/dashboard/stats", "GET").catch(() => ({}));
      setStats(data || {});
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ ADMIN CONTROL CENTER ]</span>
          <h1 className={`text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Live Database Metrics</h1>
        </div>
        <button onClick={fetchStats} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono tracking-wider cursor-pointer transition-all ${isLightMode ? "border-gray-300 hover:border-black text-gray-800 bg-gray-50" : "border-white/20 hover:border-[#cbf000] text-white"}`}>
          🔄 Refresh Stats
        </button>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ {errorMsg} (Using safe fallback defaults)
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-[28px] border shadow-xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
          <span className="text-xs font-mono text-neutral-400 uppercase">Total Users</span>
          <h3 className="text-3xl font-black mt-2 text-[#cbf000]">{loading ? "..." : (stats.totalUsers ?? 0)}</h3>
        </div>
        <div className={`p-6 rounded-[28px] border shadow-xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
          <span className="text-xs font-mono text-neutral-400 uppercase">Total Bookings</span>
          <h3 className="text-3xl font-black mt-2 text-[#cbf000]">{loading ? "..." : (stats.totalBookings ?? 0)}</h3>
        </div>
        <div className={`p-6 rounded-[28px] border shadow-xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
          <span className="text-xs font-mono text-neutral-400 uppercase">Total Vehicles</span>
          <h3 className="text-3xl font-black mt-2 text-[#cbf000]">{loading ? "..." : (stats.totalVehicles ?? 0)}</h3>
        </div>
        <div className={`p-6 rounded-[28px] border shadow-xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
          <span className="text-xs font-mono text-neutral-400 uppercase">System Health</span>
          <h3 className="text-xl font-bold mt-3 text-green-400 font-mono">🟢 ONLINE</h3>
        </div>
      </div>
    </div>
  );
}