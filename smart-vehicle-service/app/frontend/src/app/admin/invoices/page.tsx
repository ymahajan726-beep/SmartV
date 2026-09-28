"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminInvoicesPage() {
  const { isLightMode } = useTheme();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Create Invoice Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [nextServiceMileage, setNextServiceMileage] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/invoices", "GET").catch(() => []);
      setInvoices(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load invoices from database.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/invoices", "POST", {
        bookingId,
        customerId,
        totalAmount: Number(totalAmount),
        nextServiceDate,
        nextServiceMileage: nextServiceMileage ? Number(nextServiceMileage) : 5000,
      });
      setShowCreateModal(false);
      setBookingId("");
      setCustomerId("");
      setTotalAmount("");
      setNextServiceDate("");
      setNextServiceMileage("");
      fetchInvoices();
      showToast("Invoice generated & automated reminders triggered successfully!");
    } catch (err: any) {
      showToast("Failed to create invoice: " + (err.message || "Unknown error"), "error");
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await apiRequest(`/invoices/${id}`, "DELETE");
      fetchInvoices();
      showToast("Invoice deleted successfully!");
    } catch (err: any) {
      showToast("Failed to delete invoice: " + (err.message || "Unknown error"), "error");
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono border transition-all ${toast.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      <header className={`pb-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          
          <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Service Billing & Auto-Triggers</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className={`px-4 py-2.5 rounded-xl text-xs uppercase font-mono font-bold tracking-wider transition-all cursor-pointer shadow-sm ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
            + Generate Invoice
          </button>
          <button onClick={fetchInvoices} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${isLightMode ? "border-gray-200 bg-gray-50 text-gray-800" : "border-white/20 bg-[#141418] text-white"}`}>
            🔄 Refresh
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Invoices Table */}
      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No invoices generated yet.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{inv.id.slice(-6)}</td>
                    <td className="p-4 text-neutral-400">#{inv.bookingId ? inv.bookingId.slice(-6) : "N/A"}</td>
                    <td className="p-4 text-neutral-400">#{inv.customerId ? inv.customerId.slice(-6) : "N/A"}</td>
                    <td className="p-4 font-bold text-[#cbf000]">₹ {inv.totalAmount || 0}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteInvoice(inv.id)} className="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000]">💳 Generate Bill & Trigger Automation</h3>
              <button onClick={() => setShowCreateModal(false)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 font-mono text-xs">
              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Booking ID</label>
                <input 
                  type="text" 
                  value={bookingId} 
                  onChange={(e) => setBookingId(e.target.value)} 
                  placeholder="Enter Booking ID" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Customer ID</label>
                <input 
                  type="text" 
                  value={customerId} 
                  onChange={(e) => setCustomerId(e.target.value)} 
                  placeholder="Enter Customer ID" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Total Amount (₹)</label>
                <input 
                  type="number" 
                  value={totalAmount} 
                  onChange={(e) => setTotalAmount(e.target.value)} 
                  placeholder="e.g. 2500" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Next Service Due Date</label>
                <input 
                  type="date" 
                  value={nextServiceDate} 
                  onChange={(e) => setNextServiceDate(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Next Service Mileage (KM)</label>
                <input 
                  type="number" 
                  value={nextServiceMileage} 
                  onChange={(e) => setNextServiceMileage(e.target.value)} 
                  placeholder="e.g. 5000" 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Pay & Trigger Reminders →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className={`px-6 py-3.5 rounded-2xl border uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}