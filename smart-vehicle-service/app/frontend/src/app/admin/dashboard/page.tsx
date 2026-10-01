"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminDashboardPage() {
  const { isLightMode } = useTheme();
  const [stats, setStats] = useState({ totalVehicles: 0, totalCustomers: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/stats", "GET"); // Backend stats endpoint
      setStats({
        totalVehicles: data.totalVehicles || 0,
        totalCustomers: data.totalCustomers || 0,
        totalBookings: data.totalBookings || 0,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      <header className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-light tracking-tight">Admin Control Center</h1>
        <p className="text-xs font-mono text-neutral-400 mt-1">Real-time platform telemetry and garage metrics.</p>
      </header>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        
        {/* Total Vehicles Card */}
        <div className={`p-6 rounded-[28px] border shadow-md ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Total Fleet Vehicles</span>
          <div className="text-3xl font-bold text-[#cbf000]">
            {loading ? "..." : stats.totalVehicles} <span className="text-xs text-neutral-400 font-normal">Registered</span>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className={`p-6 rounded-[28px] border shadow-md ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Total Customers</span>
          <div className="text-3xl font-bold text-cyan-400">
            {loading ? "..." : stats.totalCustomers} <span className="text-xs text-neutral-400 font-normal">Active</span>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className={`p-6 rounded-[28px] border shadow-md ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Service Bookings</span>
          <div className="text-3xl font-bold text-amber-400">
            {loading ? "..." : stats.totalBookings} <span className="text-xs text-neutral-400 font-normal">Total</span>
          </div>
        </div>

      </div>
    </div>
  );
}