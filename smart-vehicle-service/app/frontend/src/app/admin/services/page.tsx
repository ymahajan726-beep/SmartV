"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await apiRequest("/services");
      setServices(data);
    } catch {
      setServices([
        { id: 1, name: "Full Ceramic Coating", description: "Complete body protection", price: 15000 },
        { id: 2, name: "Engine Diagnostic & Tuning", description: "ECU scan and repair", price: 3500 }
      ]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/services", "POST", formData);
      setToast("Service added successfully!");
      setFormData({ name: "", description: "", price: "" });
      loadData();
    } catch {
      setToast("Failed to save service");
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] p-8 md:p-12 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase">[ Backend Module: Services ]</span>
          <h1 className="text-3xl font-light mt-1">Master Services Management</h1>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-mono uppercase text-[#cbf000] hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleCreate} className="bg-[#141418] border border-white/10 p-6 rounded-[32px] space-y-4 h-fit">
          <h3 className="text-lg font-light">Add Service Offering</h3>
          <input type="text" placeholder="Service Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black text-white border border-white/20 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#cbf000]" required />
          <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black text-white border border-white/20 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#cbf000]" required />
          <input type="number" placeholder="Price (₹)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-black text-white border border-white/20 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#cbf000]" required />
          <button type="submit" className="w-full bg-[#cbf000] text-black font-bold uppercase text-xs py-3.5 rounded-2xl cursor-pointer hover:bg-white transition-all">Save to DB →</button>
        </form>
        <div className="md:col-span-2 bg-[#141418] border border-white/10 rounded-[32px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/50 text-xs font-mono uppercase text-neutral-400">
                <th className="p-5 pl-8">Service Name</th>
                <th className="p-5">Description</th>
                <th className="p-5 pr-8 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {services.map((s: any) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="p-5 pl-8 font-medium">{s.name}</td>
                  <td className="p-5 text-neutral-400">{s.description}</td>
                  <td className="p-5 pr-8 text-right font-mono text-[#cbf000]">₹{s.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toast && <div className="fixed bottom-6 right-6 bg-[#cbf000] text-black px-6 py-4 rounded-2xl font-semibold text-sm shadow-2xl">{toast}</div>}
    </div>
  );
}