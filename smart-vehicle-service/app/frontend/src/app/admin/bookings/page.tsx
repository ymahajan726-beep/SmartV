"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminBookingsPage() {
  const { isLightMode } = useTheme();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminBookings();
  }, []);

  const fetchAdminBookings = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/bookings", "GET");
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await apiRequest(`/admin/bookings/${bookingId}/status`, "PATCH", { status: newStatus });
      fetchAdminBookings();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">[ FLEET BOOKINGS ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Customer Service Bookings</h1>
        </div>
        <button onClick={fetchAdminBookings} className="px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer border-white/20 hover:border-[#00F0FF]">
          🔄 Refresh
        </button>
      </header>

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[800px]">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Ref / Vehicle</th>
                <th className="p-4">Customer Name & Phone</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status Pipeline</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading bookings telemetry...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No service bookings found.</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4">
                      <strong className="text-[#00F0FF]">{b.bookingNumber}</strong>
                      <div className="font-bold">{b.vehicle?.make} {b.vehicle?.model} ({b.vehicle?.registrationNumber})</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{b.customer?.name || "Customer"}</div>
                      <div className="text-[10px] text-neutral-400">{b.customer?.phone || "No Phone"}</div>
                    </td>
                    <td className="p-4">
                      {new Date(b.bookingDate).toLocaleDateString()}
                      <div className="text-[10px] text-neutral-400">{b.bookingTime}</div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      ₹{b.estimatedAmount || 1500}
                    </td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase cursor-pointer outline-none ${isLightMode ? "bg-slate-100 border-slate-300" : "bg-black/80 border-white/20 text-[#00F0FF]"}`}
                      >
                        <option value="BOOKED">BOOKED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="QUALITY_CHECK">QUALITY_CHECK</option>
                        <option value="READY_FOR_DELIVERY">READY_FOR_DELIVERY</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
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