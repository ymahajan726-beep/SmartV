"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminInvoicesPage() {
  const { isLightMode } = useTheme();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Create Invoice Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");

  // Edit Invoice Modal States
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [editBookingId, setEditBookingId] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editTax, setEditTax] = useState("");

  useEffect(() => {
    fetchInvoices();
    fetchBookings();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/invoices", "GET").catch(() => []);
      setInvoices(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      console.error("Failed to fetch invoices from backend:", err);
      setErrorMsg(err.message || "Backend database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await apiRequest("/bookings", "GET").catch(() => []);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch bookings for dropdown:", err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/invoices", "POST", { 
        bookingId, 
        amount: Number(amount), 
        tax: Number(tax) 
      });
      setShowCreateModal(false);
      setBookingId("");
      setAmount("");
      setTax("");
      showToast("Invoice generated successfully in database!");
      fetchInvoices();
    } catch (err: any) {
      alert("Failed to create invoice: " + (err.message || "Unknown error"));
    }
  };

  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;
    try {
      await apiRequest(`/invoices/${editingInvoice.id}`, "PATCH", {
        bookingId: editBookingId,
        amount: Number(editAmount),
        tax: Number(editTax),
      });
      setEditingInvoice(null);
      showToast("Invoice updated successfully!");
      fetchInvoices();
    } catch (err: any) {
      alert("Failed to update invoice: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice from database?")) return;
    try {
      await apiRequest(`/invoices/${id}`, "DELETE");
      showToast("Invoice deleted successfully!");
      fetchInvoices();
    } catch (err: any) {
      alert("Failed to delete invoice: " + (err.message || "Unknown error"));
    }
  };

  const openEditModal = (inv: any) => {
    setEditingInvoice(inv);
    setEditBookingId(inv.bookingId || "");
    setEditAmount(inv.amount || "");
    setEditTax(inv.tax || "");
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl bg-[#cbf000] text-black font-mono text-xs font-bold uppercase shadow-2xl animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      <header className={`pb-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          
          <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Financial Invoices & Database</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className={`px-4 py-2.5 rounded-xl text-xs uppercase font-mono font-bold tracking-wider transition-all cursor-pointer shadow-sm ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
            + Generate Invoice
          </button>
          <button onClick={fetchInvoices} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${isLightMode ? "border-gray-200 bg-gray-50 hover:border-emerald-600 text-gray-800" : "border-white/20 bg-[#141418] hover:border-[#cbf000] text-white"}`}>
            🔄 Refresh
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ Error: {errorMsg}
        </div>
      )}

      {/* Invoices Table */}
      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-100" : "border-white/10"}`}>
          <h4 className={`text-sm font-mono uppercase tracking-widest ${isLightMode ? "text-gray-600" : "text-neutral-400"}`}>Active Billing Records</h4>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{invoices.length} Invoices Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Tax</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">Loading invoices from database...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">No invoice records found.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{inv.id.slice(-6)}</td>
                    <td className="p-4 text-neutral-400">#{inv.bookingId ? inv.bookingId.slice(-6) : "N/A"}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>₹{inv.amount}</td>
                    <td className="p-4 text-emerald-600">₹{inv.tax || 0}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => openEditModal(inv)} className="text-blue-400 hover:text-blue-300 cursor-pointer">Edit</button>
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
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">💰 Generate New Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Select Booking</label>
                <select 
                  value={bookingId} 
                  onChange={(e) => setBookingId(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">Select Valid Booking ID</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>Booking #{b.id.slice(-6)} - {b.status || "Active"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Amount (₹)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="e.g. 2500" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Tax (₹)</label>
                <input 
                  type="number" 
                  value={tax} 
                  onChange={(e) => setTax(e.target.value)} 
                  placeholder="e.g. 180" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Save Invoice Record →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">✏️ Edit Invoice Record</h3>
              <button onClick={() => setEditingInvoice(null)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleUpdateInvoice} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Select Booking</label>
                <select 
                  value={editBookingId} 
                  onChange={(e) => setEditBookingId(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">Select Valid Booking ID</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>Booking #{b.id.slice(-6)} - {b.status || "Active"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Amount (₹)</label>
                <input 
                  type="number" 
                  value={editAmount} 
                  onChange={(e) => setEditAmount(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Tax (₹)</label>
                <input 
                  type="number" 
                  value={editTax} 
                  onChange={(e) => setEditTax(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Save Changes →
                </button>
                <button type="button" onClick={() => setEditingInvoice(null)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
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