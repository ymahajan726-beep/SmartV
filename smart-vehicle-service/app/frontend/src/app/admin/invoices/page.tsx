"use client";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminInvoicesPage() {
  const { isLightMode } = useTheme();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/invoices", "GET");
      setInvoices(Array.isArray(data) ? data : []);
      triggerToast("Financial ledger synchronized successfully!", "success");
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load invoices ledger.", "error");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) =>
    inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.booking?.vehicle?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-xs font-mono border flex items-center gap-3 ${toastType === "success" ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400" : "bg-red-500 text-white font-bold border-red-400"}`}>
          <span>{toastType === "success" ? "⚡" : "⚠"}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest"> FINANCIAL LEDGER </span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Master Invoices & Billing</h1>
        </div>
        <button onClick={fetchInvoices} className="px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer border-white/20 hover:border-[#00F0FF]">
          🔄 Refresh Ledger
        </button>
      </header>

      <input
        type="text"
        placeholder="Search by Invoice No, Customer or Vehicle Reg..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full xl:w-96 px-4 py-3 rounded-2xl border text-xs font-mono outline-none ${isLightMode ? "bg-white border-gray-300 text-slate-900" : "bg-[#141418] border-white/20 text-white focus:border-[#00F0FF]"}`}
      />

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[1100px]">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">Loading invoices ledger...</td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">No invoices generated yet. (Generate from Bookings panel after service completion).</td></tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 font-bold text-[#00F0FF]">{inv.invoiceNumber}</td>
                    <td className="p-4">
                      <div className="font-bold">{inv.customer?.name || "N/A"}</div>
                      <div className="text-[10px] text-neutral-400">{inv.customer?.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{inv.booking?.vehicle?.make} {inv.booking?.vehicle?.model}</div>
                      <div className="text-[10px] text-neutral-400">{inv.booking?.vehicle?.registrationNumber}</div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">₹{Number(inv.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-neutral-400 text-[11px]">
                      {new Date(inv.createdAt).toLocaleDateString()}
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