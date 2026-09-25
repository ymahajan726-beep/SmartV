"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export default function AdminSparePartsPage() {
  const [parts, setParts] = useState([]);
  const [formData, setFormData] = useState({ name: "", stock: "", price: "" });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const data = await apiRequest("/spare-parts");
      setParts(data);
    } catch {
      setParts([
        { id: 1, name: "Synthetic Engine Oil 5W40", stock: 45, price: 1200 },
        { id: 2, name: "Ceramic Brake Pads", stock: 12, price: 4500 }
      ]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/spare-parts", "POST", formData);
      setToast("Spare part registered to database!");
      setFormData({ name: "", stock: "", price: "" });
      loadParts();
    } catch {
      setToast("Failed to save part");
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] p-8 md:p-12 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase">[ Backend Module: Spare Parts ]</span>
          <h1 className="text-3xl font-light mt-1">Inventory & Ledger</h1>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-mono uppercase text-[#cbf000] hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleCreate} className="bg-[#141418] border border-white/10 p-6 rounded-[32px] space-y-4 h-fit">
          <h3 className="text-lg font-light">Add New Spare Part</h3>
          <input 
            type="text" 
            placeholder="Part Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            className="w-full bg-black text-white border border-white/20 rounded-2xl px-4 py-3 text-sm focus:border-[#cbf000] outline-none"
            required 
          />
          <input 
            type="number" 
            placeholder="Stock Units" 
            value={formData.stock} 
            onChange={(e) => setFormData({...formData, stock: e.target.value})} 
            className="w-full bg-black text-white border border-white/20 rounded-2xl px-4 py-3 text-sm focus:border-[#cbf000] outline-none"
            required 
          />
          <input 
            type="number" 
            placeholder="Price (₹)" 
            value={formData.price} 
            onChange={(e) => setFormData({...formData, price: e.target.value})} 
            className="w-full bg-black text-white border border-white/20 rounded-2xl px-4 py-3 text-sm focus:border-[#cbf000] outline-none"
            required 
          />
          <button type="submit" className="w-full bg-[#cbf000] text-black font-bold uppercase text-xs py-3.5 rounded-2xl cursor-pointer hover:bg-white transition-all">
            Save to DB →
          </button>
        </form>

        <div className="md:col-span-2 bg-[#141418] border border-white/10 rounded-[32px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/50 text-xs font-mono uppercase text-neutral-400">
                <th className="p-5 pl-8">Part Name</th>
                <th className="p-5">Stock</th>
                <th className="p-5 pr-8 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {parts.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="p-5 pl-8 font-medium">{p.name}</td>
                  <td className="p-5 font-mono text-[#cbf000]">{p.stock} Units</td>
                  <td className="p-5 pr-8 text-right font-mono">₹{p.price}</td>
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