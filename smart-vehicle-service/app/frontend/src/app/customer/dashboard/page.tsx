"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerDashboardPage() {
  const { isLightMode } = useTheme();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Review / Feedback Form States
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchAllCustomerTelemetry();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllCustomerTelemetry = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // Real-time dynamic parallel data fetching from backend database APIs
      const [vData, iData, rData, sData] = await Promise.all([
        apiRequest("/vehicles", "GET").catch(() => []),
        apiRequest("/invoices", "GET").catch(() => []),
        apiRequest("/maintenance-reminders", "GET").catch(() => []),
        apiRequest("/service-status", "GET").catch(() => []),
      ]);

      setVehicles(Array.isArray(vData) ? vData : []);
      setInvoices(Array.isArray(iData) ? iData : []);
      setReminders(Array.isArray(rData) ? rData : []);
      setStatuses(Array.isArray(sData) ? sData : []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to synchronize customer database records.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      await apiRequest("/reviews", "POST", {
        rating: Number(rating),
        comment,
      });
      setComment("");
      setRating("5");
      showToast("Service review submitted successfully to admin records!");
    } catch (err: any) {
      showToast("Failed to submit review: " + (err.message || "Unknown error"), "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className={`min-h-screen p-8 md:p-16 font-sans transition-colors duration-200 ${isLightMode ? "bg-[#f2f2ef] text-[#111111]" : "bg-[#08080a] text-[#f3f3f6]"}`}>
      
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono border transition-all ${toast.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      {/* Header */}
      <header className={`pb-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 ${isLightMode ? "border-black/15" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#a8cc00] uppercase tracking-widest">[ CUSTOMER COCKPIT TELEMETRY ]</span>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight mt-1">Vehicle Garage & Live Sync</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAllCustomerTelemetry} 
            className={`px-5 py-3 rounded-xl border text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${isLightMode ? "border-black/20 bg-white hover:bg-black hover:text-white" : "border-white/20 bg-[#141418] hover:border-[#cbf000]"}`}
          >
            🔄 Sync Live Database
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ Database Sync Error: {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-neutral-400 animate-pulse">
          Fetching real-time telemetry from backend servers...
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Section 1: Live Vehicle & Service Status Lifecycle */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#a8cc00] mb-6">🚗 Live Service Lifecycle Status</h3>
            {statuses.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 uppercase">No active service lifecycle found in database.</p>
            ) : (
              <div className="grid gap-4">
                {statuses.map((st) => (
                  <div key={st.id} className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-[#0b0b0e] border-white/10"}`}>
                    <div>
                      <span className="text-xs font-mono text-neutral-400">Booking Reference: #{st.bookingId ? st.bookingId.slice(-6) : "N/A"}</span>
                      <h4 className="text-base font-medium mt-1 font-mono uppercase">Bay Stage Tracking</h4>
                    </div>
                    <span className="px-4 py-2 rounded-xl text-xs font-mono uppercase bg-[#cbf000]/20 text-[#cbf000] border border-[#cbf000]/40 font-bold tracking-wider">
                      {st.status || "IN PROGRESS"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Registered Garage Vehicles */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#a8cc00] mb-6">🚙 Registered Garage Vehicles</h3>
            {vehicles.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 uppercase">No vehicles linked to your account.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <div key={v.id} className={`p-6 rounded-2xl border font-mono text-xs space-y-2 ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-[#0b0b0e] border-white/10"}`}>
                    <div className="text-[#a8cc00] uppercase font-bold text-sm">#{v.modelName || v.vehicleNumber || `Vehicle ${v.id.slice(-6)}`}</div>
                    <div className="text-neutral-400 uppercase">Reg No: {v.vehicleNumber || "N/A"}</div>
                    <div className="text-neutral-400 uppercase">Fuel/Type: {v.fuelType || "Petrol / Electric"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Maintenance Reminders & Due Mileage */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#a8cc00] mb-6">⏰ Scheduled Maintenance Reminders</h3>
            {reminders.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 uppercase">No upcoming maintenance reminders.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reminders.map((rem) => (
                  <div key={rem.id} className={`p-6 rounded-2xl border font-mono text-xs space-y-3 ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-[#0b0b0e] border-white/10"}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 uppercase">Due Date</span>
                      <span className="text-[#a8cc00] font-bold">{rem.reminderDate ? new Date(rem.reminderDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 uppercase">Target Mileage</span>
                      <span className="font-bold">{rem.dueMileage || 5000} KM</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-neutral-400 lowercase">
                      Notes: {rem.notes || "General periodic service checkup"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Digital Invoices & Billing Records */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#a8cc00] mb-6">💳 Digital Invoices & Tax Summary</h3>
            {invoices.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 uppercase">No financial invoices generated yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
                  <thead className={`border-b ${isLightMode ? "border-gray-200 text-gray-500" : "border-white/10 text-neutral-400"}`}>
                    <tr>
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Tax</th>
                      <th className="p-4 text-right">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="p-4 text-neutral-400">#{inv.id.slice(-6)}</td>
                        <td className="p-4 font-bold">₹{inv.amount || 0}</td>
                        <td className="p-4 text-emerald-600">₹{inv.tax || 0}</td>
                        <td className="p-4 text-right text-[#a8cc00] font-bold">PAID & SETTLED</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 5: Post-Service Feedback & Rating Form */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#a8cc00] mb-6">⭐ Submit Service Feedback & Rating</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase mb-2 text-neutral-400">Select Rating</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-2xl border text-xs outline-none focus:border-[#a8cc00] ${isLightMode ? "bg-gray-50 border-gray-200 text-black" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 - Exceptional Quality)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 - Professional & Timely)</option>
                  <option value="3">⭐⭐⭐ (3/5 - Satisfactory)</option>
                  <option value="2">⭐⭐ (2/5 - Needs Improvement)</option>
                  <option value="1">⭐ (1/5 - Unsatisfactory)</option>
                </select>
              </div>

              <div>
                <label className="block uppercase mb-2 text-neutral-400">Detailed Feedback / Comments</label>
                <textarea 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience regarding service turnaround time, spare parts transparency, etc."
                  rows={4}
                  required
                  className={`w-full px-4 py-3.5 rounded-2xl border text-xs outline-none focus:border-[#a8cc00] ${isLightMode ? "bg-gray-50 border-gray-200 text-black" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <button 
                type="submit" 
                disabled={submittingReview}
                className="w-full py-4 rounded-2xl bg-[#cbf000] text-black font-bold uppercase tracking-widest hover:bg-white transition-all cursor-pointer shadow-xl disabled:opacity-50"
              >
                {submittingReview ? "Submitting Review..." : "Submit Review to Admin Records →"}
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}