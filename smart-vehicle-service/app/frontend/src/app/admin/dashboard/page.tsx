"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminDashboardPage() {
  const { isLightMode } = useTheme();
  const [stats, setStats] = useState({ totalVehicles: 0, totalCustomers: 0, totalBookings: 0 });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, paidInvoices] = await Promise.all([
        apiRequest("/admin/stats", "GET").catch(() => ({})),
        apiRequest("/invoices/recent-paid", "GET").catch(() => []),
      ]);

      setStats({
        totalVehicles: statsData.totalVehicles || 0,
        totalCustomers: statsData.totalCustomers || 0,
        totalBookings: statsData.totalBookings || 0,
      });

      setRecentInvoices(Array.isArray(paidInvoices) ? paidInvoices : []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h1 className="text-3xl font-light tracking-tight">Admin Control Center</h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">Real-time platform telemetry and garage metrics.</p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="px-4 py-2 rounded-xl border text-xs uppercase font-mono border-white/20 hover:border-[#00F0FF] cursor-pointer"
        >
          🔄 Refresh
        </button>
      </header>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
  
        <div className={`p-6 rounded-[28px] border shadow-md ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Total Fleet Vehicles</span>
          <div className="text-3xl font-bold text-[#cbf000]">
            {loading ? "..." : stats.totalVehicles} <span className="text-xs text-neutral-400 font-normal">Registered</span>
          </div>
        </div>

        <div className={`p-6 rounded-[28px] border shadow-md ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Total Customers</span>
          <div className="text-3xl font-bold text-cyan-400">
            {loading ? "..." : stats.totalCustomers} <span className="text-xs text-neutral-400 font-normal">Active</span>
          </div>
        </div>

        <div className={`p-6 rounded-[28px] border shadow-md ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Service Bookings</span>
          <div className="text-3xl font-bold text-amber-400">
            {loading ? "..." : stats.totalBookings} <span className="text-xs text-neutral-400 font-normal">Total</span>
          </div>
        </div>
      </div>

      <div className={`rounded-[32px] border overflow-hidden shadow-xl p-6 ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">[ LIVE ACTIVITY FEED ]</span>
            <h2 className="text-lg font-bold tracking-tight mt-1">Recently Paid Bills & Settlements</h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">Past 48 Hours / Latest Settled</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[900px]">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Vehicle Model</th>
                <th className="p-4">Service Taken</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4 text-right">Settled Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">Loading recent transactions...</td></tr>
              ) : recentInvoices.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">No paid invoices found recently. Complete service bookings to view live entries here.</td></tr>
              ) : (
                recentInvoices.map((inv) => (
                  <tr key={inv.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 font-bold text-[#00F0FF]">{inv.invoiceNumber}</td>
                    <td className="p-4 font-bold">{inv.customer?.name || inv.booking?.customer?.name || "Customer"}</td>
                    <td className="p-4">
                      <div>{inv.booking?.vehicle?.make} {inv.booking?.vehicle?.model}</div>
                      <div className="text-[10px] text-neutral-400">{inv.booking?.vehicle?.registrationNumber}</div>
                    </td>
                    <td className="p-4 text-cyan-400">{inv.booking?.service?.name || "General Inspection"}</td>
                    <td className="p-4 font-bold text-emerald-400">₹{Number(inv.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-4 text-right text-neutral-400 text-[11px]">
                      {new Date(inv.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}