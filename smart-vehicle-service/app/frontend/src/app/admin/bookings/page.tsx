"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { isLightMode } = useTheme();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/bookings", "GET").catch(() => []);
      setBookings(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel booking?")) return;
    try {
      await apiRequest(`/bookings/${id}/cancel`, "PATCH");
      fetchBookings();
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
        
          <h1 className={`text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Service Bookings</h1>
        </div>
        <button onClick={fetchBookings} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer transition-all ${isLightMode ? "border-gray-300 hover:border-black text-gray-800 bg-gray-50" : "border-white/20 hover:border-[#cbf000] text-white"}`}>🔄 Refresh</button>
      </header>

      {errorMsg && <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">⚠️ Note: {errorMsg}</div>}

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
          <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Service Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No bookings found.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                  <td className="p-4 text-neutral-400">#{b.id.slice(-6)}</td>
                  <td className="p-4 font-bold">{b.serviceType || "Standard"}</td>
                  <td className="p-4 text-[#cbf000]">{b.status || "PENDING"}</td>
                  <td className="p-4 text-neutral-400">{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-4 text-right">
                    {b.status !== 'CANCELLED' && (
                      <button onClick={() => handleCancel(b.id)} className="text-red-400 hover:text-red-300 cursor-pointer">Cancel</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}