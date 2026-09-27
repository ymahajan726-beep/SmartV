"use client";
import React, { useState } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminServiceStatusPage() {
  const { isLightMode } = useTheme();
  const [serviceId, setServiceId] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId.trim()) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      await apiRequest(`/service-status/${serviceId.trim()}`, "PATCH", { status });
      setSuccessMsg(`Status successfully updated to "${status}" in the database!`);
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setErrorMsg(err.message || "Failed to update status. Check ID or backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      <header className={`pb-6 border-b ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <span className="text-xs font-mono text-emerald-600 uppercase tracking-widest">[ Module 11: Service Status Control ]</span>
        <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Live Status Management</h1>
      </header>

      {/* Update Form Card */}
      <div className={`p-8 rounded-[32px] border mb-10 shadow-sm max-w-2xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <h3 className={`text-sm font-mono uppercase tracking-widest mb-6 ${isLightMode ? "text-gray-600" : "text-neutral-400"}`}>⚙️ Update Service Lifecycle Status</h3>
        
        <form onSubmit={handleUpdateStatus} className="space-y-6">
          <div>
            <label className={`block text-xs font-mono uppercase mb-2 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Service / Booking ID</label>
            <input 
              type="text" 
              value={serviceId} 
              onChange={(e) => setServiceId(e.target.value)} 
              placeholder="Enter exact Service ID..." 
              required 
              className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-mono uppercase mb-2 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Select New Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 uppercase font-mono text-xs ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 px-8 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer shadow-sm disabled:opacity-50 ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}
          >
            {loading ? "Updating Database..." : "Commit Status Update →"}
          </button>
        </form>

        {successMsg && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono">
            ✅ {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}