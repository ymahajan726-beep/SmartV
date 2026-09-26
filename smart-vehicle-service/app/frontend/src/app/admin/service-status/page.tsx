"use client";
import React, { useState } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminServiceStatusPage() {
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
    <div className="space-y-8 font-sans text-gray-900">
      <header className="pb-6 border-b border-gray-200">
        <span className="text-xs font-mono text-emerald-600 uppercase tracking-widest">[ Module 11: Service Status Control ]</span>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-1">Live Status Management</h1>
      </header>

      {/* Update Form Card */}
      <div className="p-8 rounded-[32px] border border-gray-200 bg-white mb-10 shadow-sm max-w-2xl">
        <h3 className="text-sm font-mono uppercase tracking-widest text-gray-600 mb-6">⚙️ Update Service Lifecycle Status</h3>
        
        <form onSubmit={handleUpdateStatus} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Service / Booking ID</label>
            <input 
              type="text" 
              value={serviceId} 
              onChange={(e) => setServiceId(e.target.value)} 
              placeholder="Enter exact Service ID..." 
              required 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Select New Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50 uppercase font-mono text-xs"
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
            className="w-full py-3.5 px-8 rounded-2xl bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all cursor-pointer shadow-sm disabled:opacity-50"
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
          <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}