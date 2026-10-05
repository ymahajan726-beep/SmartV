"use client";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminArchivePage() {
  const { isLightMode } = useTheme();
  const [archivedBookings, setArchivedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchArchive = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/bookings/archived", "GET").catch(() => []);
      setArchivedBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load service archives.", "error");
      setArchivedBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  const handleViewBill = async (bookingId: string) => {
    try {
      const data = await apiRequest(`/invoices/booking/${bookingId}`, "GET");
      setViewingInvoice(data);
      triggerToast("Saved tax invoice loaded successfully!", "success");
    } catch (err: any) {
      triggerToast("Failed to load invoice details.", "error");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this archived record?")) return;
    try {
      await apiRequest(`/admin/bookings/${id}/archive`, "DELETE");
      triggerToast("Archived record deleted permanently.", "success");
      fetchArchive();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to delete record.", "error");
    }
  };

  return (
    <div className={`space-y-8 font-sans p-8 ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-xs font-mono border flex items-center gap-3 ${toastType === "success" ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400" : "bg-red-500 text-white font-bold border-red-400"}`}>
          <span>{toastType === "success" ? "⚡" : "⚠"}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest"> COMPLETED & PAID ARCHIVES </span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Service Archives & Saved Bills</h1>
        </div>
        <button onClick={fetchArchive} className="px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer border-white/20 hover:border-[#00F0FF]">
          🔄 Refresh
        </button>
      </header>

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[1100px]">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Final Paid Bill</th>
                <th className="p-4 text-right">Saved Bill & Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading archives...</td></tr>
              ) : archivedBookings.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No archived records found. Completed paid bookings will appear here.</td></tr>
              ) : (
                archivedBookings.map((b) => (
                  <tr key={b.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 font-bold text-[#00F0FF]">{b.bookingNumber}</td>
                    <td className="p-4">
                      <div className="font-bold">{b.customer?.name || "N/A"}</div>
                      <div className="text-[10px] text-neutral-400">{b.customer?.phone || "N/A"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{b.vehicle?.make} {b.vehicle?.model}</div>
                      <div className="text-[10px] text-neutral-400">{b.vehicle?.registrationNumber}</div>
                    </td>
                    <td className="p-4 text-emerald-400 font-bold">
                      ₹{b.finalAmount || b.estimatedAmount || "0"} <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded ml-1">PAID</span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewBill(b.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/10 font-bold text-[10px] uppercase cursor-pointer"
                      >
                        📄 View Saved Bill
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(b.id)}
                        className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-[10px] uppercase cursor-pointer"
                      >
                        Delete Forever
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-2xl p-8 rounded-[32px] shadow-2xl relative space-y-6 font-mono text-xs my-8">
            <button
              onClick={() => setViewingInvoice(null)}
              className="absolute top-6 right-6 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs cursor-pointer"
            >
              [CLOSE]
            </button>

            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black uppercase">Archived Tax Invoice: {viewingInvoice.invoiceNumber}</h2>
                <p className="text-[10px] text-slate-500">AutoCare Authorized Service Center | GSTIN: 27AAAAA0000A1Z5</p>
              </div>
              <span className="px-3 py-1 rounded font-bold bg-emerald-100 text-emerald-700">
                {viewingInvoice.status} (ARCHIVED)
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Customer Details</span>
                  <strong className="text-sm">{viewingInvoice.customer?.name || viewingInvoice.booking?.customer?.name}</strong>
                  <div className="text-[11px] text-slate-600">{viewingInvoice.customer?.phone || viewingInvoice.booking?.customer?.phone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Vehicle Details</span>
                  <strong className="text-sm">{viewingInvoice.booking?.vehicle?.make} {viewingInvoice.booking?.vehicle?.model}</strong>
                  <div className="text-[11px] text-slate-600">Reg: {viewingInvoice.booking?.vehicle?.registrationNumber}</div>
                </div>
              </div>

              <div className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between font-bold border-b pb-2 text-slate-500 uppercase text-[10px]">
                  <span>Item Description</span>
                  <span>Total</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Service Package: {viewingInvoice.booking?.service?.name || "General Service"}</span>
                  <span>₹{Number(viewingInvoice.subTotal || 1500).toFixed(2)}</span>
                </div>
                {viewingInvoice.booking?.spareParts?.map((sp: any, i: number) => (
                  <div key={i} className="flex justify-between text-slate-600 py-1">
                    <span>Spare Part: {sp.partName} ({sp.quantity}x)</span>
                    <span>₹{Number(sp.price * sp.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{Number(viewingInvoice.subTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%):</span>
                  <span>₹{Number(viewingInvoice.taxAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t">
                  <span>Final Total Paid:</span>
                  <span className="text-emerald-600">₹{Number(viewingInvoice.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  window.print();
                  triggerToast("Opening print dialog...", "success");
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-950 text-[#00F0FF] font-bold uppercase tracking-wider cursor-pointer"
              >
                🖨️ Print / Download Saved Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}