"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminServiceStatusPage() {
  const { isLightMode } = useTheme();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form States
  const [bookingId, setBookingId] = useState("");
  const [newStatus, setNewStatus] = useState("IN PROGRESS");

  useEffect(() => {
    fetchStatuses();
    fetchBookings();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/service-status", "GET").catch(() => []);
      setStatuses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      showToast("Failed to fetch status records.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await apiRequest("/bookings", "GET").catch(() => []);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bookings for dropdown");
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/service-status", "POST", { bookingId, status: newStatus });
      setBookingId("");
      fetchStatuses();
      showToast("Service lifecycle status updated successfully!");
    } catch (err: any) {
      showToast("Failed to update status: " + (err.message || "Unknown error"), "error");
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono border transition-all ${toast.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          
          <h1 className={`text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Live Status Management</h1>
        </div>
        <button onClick={fetchStatuses} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer ${isLightMode ? "border-gray-300 text-gray-800 bg-gray-50" : "border-white/20 text-white"}`}>🔄 Refresh</button>
      </header>

      {/* Update Form with Booking Dropdown */}
      <div className={`p-8 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#cbf000] mb-6">⚙️ Update Service Lifecycle Status</h3>
        
        <form onSubmit={handleStatusUpdate} className="space-y-4 font-mono text-xs">
          <div>
            <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Select Service / Booking</label>
            <select 
              value={bookingId} 
              onChange={(e) => setBookingId(e.target.value)} 
              required 
              className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] uppercase ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
            >
              <option value="">-- Choose Booking ID --</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  Booking #{b.id.slice(-6)} - {b.status || "Active"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Select New Status</label>
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)} 
              required 
              className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] uppercase ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
            >
              <option value="IN PROGRESS">In Progress</option>
              <option value="QC CHECK">QC Check</option>
              <option value="READY FOR DELIVERY">Ready For Delivery</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="pt-4">
            <button type="submit" className={`w-full py-3.5 rounded-2xl font-bold uppercase tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
              Commit Status Update →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}