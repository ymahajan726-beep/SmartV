"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerViewInvoicePage() {
  const { isLightMode } = useTheme();
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchInvoice();
    }
  }, [bookingId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/invoices/booking/${bookingId}`, "GET");
      setInvoice(data);
    } catch (err) {
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-cyan-400">Loading Tax Invoice...</div>;
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-mono text-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-red-400">Invoice Not Found</h2>
        <p className="text-xs text-neutral-400">The requested tax invoice could not be located or service is not yet completed.</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-[#00F0FF] text-slate-950 font-bold rounded-xl text-xs uppercase">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 sm:p-12 font-sans flex flex-col items-center ${isLightMode ? "bg-gray-100 text-slate-900" : "bg-[#0b0b0e] text-white"}`}>
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="px-4 py-2 rounded-xl border border-white/20 text-xs font-mono uppercase hover:border-[#00F0FF] cursor-pointer">
          ← Back to Invoices
        </button>
        <button onClick={() => window.print()} className="px-5 py-2 rounded-xl bg-[#00F0FF] text-slate-950 font-bold text-xs uppercase font-mono cursor-pointer">
          🖨️ Print / Download PDF
        </button>
      </div>

      {/* Full A4 Tax Invoice Document Layout */}
      <div className="w-full max-w-3xl bg-white text-slate-900 p-8 sm:p-12 rounded-[32px] shadow-2xl font-mono space-y-8">
        <div className="border-b pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md ml-1">Care</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-2">Authorized Service Center | GSTIN: 27AAAAA0000A1Z5</p>
            <p className="text-[10px] text-slate-500">Central Workshop, Main Highway, Maharashtra, India</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-black uppercase text-slate-800">TAX INVOICE</h2>
            <p className="text-xs font-bold text-cyan-600 mt-1">{invoice.invoiceNumber}</p>
            <p className="text-[10px] text-slate-500 mt-1">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <span className={`inline-block px-3 py-1 mt-2 rounded font-bold text-[10px] ${invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Customer Details</span>
            <strong className="text-sm block mt-1">{invoice.customer?.name || invoice.booking?.customer?.name}</strong>
            <div className="text-xs text-slate-600 mt-0.5">Phone: {invoice.customer?.phone || invoice.booking?.customer?.phone}</div>
            <div className="text-xs text-slate-600 truncate">Address: {invoice.customer?.address || invoice.booking?.customer?.address || "N/A"}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Vehicle Details</span>
            <strong className="text-sm block mt-1">{invoice.booking?.vehicle?.make} {invoice.booking?.vehicle?.model}</strong>
            <div className="text-xs text-slate-600 mt-0.5">Reg No: {invoice.booking?.vehicle?.registrationNumber}</div>
            <div className="text-xs text-slate-600">Fuel: {invoice.booking?.vehicle?.fuelType || "Petrol/Diesel"}</div>
          </div>
        </div>

        <div className="border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Qty / Type</th>
                <th className="p-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              <tr>
                <td className="p-3 font-bold">Service Package: {invoice.booking?.service?.name || "General Maintenance Service"}</td>
                <td className="p-3 text-center">1 Service</td>
                <td className="p-3 text-right">₹{Number(invoice.booking?.service?.price || invoice.booking?.estimatedAmount || 1500).toFixed(2)}</td>
              </tr>
              {invoice.booking?.spareParts?.map((sp: any, i: number) => (
                <tr key={i}>
                  <td className="p-3">Spare Part: {sp.partName}</td>
                  <td className="p-3 text-center">{sp.quantity} Unit(s)</td>
                  <td className="p-3 text-right">₹{Number(sp.price * sp.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{Number(invoice.subTotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (18%):</span>
              <span>₹{Number(invoice.taxAmount || 0).toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount Applied:</span>
                <span>-₹{Number(invoice.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black pt-3 border-t text-slate-900">
              <span>Grand Total:</span>
              <span className="text-emerald-600">₹{Number(invoice.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-[10px] text-slate-400 space-y-1">
          <p>This is a computer-generated tax invoice and requires no physical signature.</p>
          <p>Thank you for choosing AutoCare. Drive safe!</p>
        </div>
      </div>
    </div>
  );
}