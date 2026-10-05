"use client";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerInvoicesPage() {
  const { isLightMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchCustomerInvoices();
  }, []);

  const fetchCustomerInvoices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/invoices/customer/my-invoices", "GET");
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6 font-sans p-6 text-white max-w-5xl mx-auto font-mono text-xs">
        Loading billing history...
      </div>
    );
  }

  return (
    <div className={`space-y-6 font-sans p-6 ${isLightMode ? "text-gray-900" : "text-white"} max-w-5xl mx-auto`}>
      <header className={`pb-4 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest"> MY BILLING HISTORY </span>
          <h1 className="text-2xl font-light tracking-tight mt-1">Service Invoices & Payments</h1>
        </div>
        <button onClick={fetchCustomerInvoices} className="px-4 py-2 rounded-xl border text-xs uppercase font-mono border-white/20 hover:border-[#00F0FF] cursor-pointer">
          🔄 Refresh
        </button>
      </header>

      <div className={`rounded-3xl border overflow-hidden ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Service</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">Loading your invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">No invoices generated yet.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50" : "hover:bg-white/5"}`}>
                    <td className="p-4 font-bold text-[#00F0FF]">{inv.invoiceNumber}</td>
                    <td className="p-4">
                      <div>{inv.booking?.vehicle?.make} {inv.booking?.vehicle?.model}</div>
                      <div className="text-[10px] text-neutral-400">{inv.booking?.vehicle?.registrationNumber}</div>
                    </td>
                    <td className="p-4 text-cyan-400">{inv.booking?.service?.name || "General Service"}</td>
                    <td className="p-4 font-bold text-emerald-400">₹{Number(inv.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => window.location.href = `/customer/invoices/${inv.bookingId}`}
                        className="px-3 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-bold text-[10px] cursor-pointer"
                      >
                        📄 View Full Invoice
                      </button>
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