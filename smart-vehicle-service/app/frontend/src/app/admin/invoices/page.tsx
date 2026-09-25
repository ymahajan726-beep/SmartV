"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/api/api";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    apiRequest("/invoices").then(setInvoices).catch(() => {
      setInvoices([{ id: 9001, clientName: "Rajesh Sharma", totalAmount: 14500, tax: 2610, status: "PAID" }]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] p-8 md:p-12 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase">[ Backend Module: Invoices ]</span>
          <h1 className="text-3xl font-light mt-1">GST Compliant Billing Ledger</h1>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-mono uppercase text-[#cbf000] hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="bg-[#141418] border border-white/10 rounded-[32px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/50 text-xs font-mono uppercase text-neutral-400">
              <th className="p-5 pl-8">Invoice ID</th>
              <th className="p-5">Client</th>
              <th className="p-5">Amount</th>
              <th className="p-5">GST Tax</th>
              <th className="p-5 pr-8 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {invoices.map((inv: any) => (
              <tr key={inv.id} className="hover:bg-white/5">
                <td className="p-5 pl-8 font-mono text-xs text-neutral-400">#INV-{inv.id}</td>
                <td className="p-5 font-medium">{inv.clientName}</td>
                <td className="p-5 font-mono text-[#cbf000]">₹{inv.totalAmount}</td>
                <td className="p-5 text-neutral-400 font-mono text-xs">₹{inv.tax} (GST)</td>
                <td className="p-5 pr-8 text-right font-mono text-xs text-green-400 uppercase">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}