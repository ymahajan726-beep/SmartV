"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/src/services/api";

export default function AdminSparePartsPage() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [spareParts, setSpareParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Create Spare Part Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/spare-parts", "GET");
      setSpareParts(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      console.error("Failed to fetch spare parts from backend:", err);
      setErrorMsg(err.message || "Backend database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/spare-parts", "POST", { 
        name, 
        partNumber, 
        price: Number(price), 
        stock: Number(stock) 
      });
      setShowCreateModal(false);
      setName("");
      setPartNumber("");
      setPrice("");
      setStock("");
      fetchSpareParts();
    } catch (err: any) {
      alert("Failed to create spare part: " + (err.message || "Unknown error"));
    }
  };

  const handleDeletePart = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spare part from database?")) return;
    try {
      await apiRequest(`/spare-parts/${id}`, "DELETE");
      fetchSpareParts();
    } catch (err: any) {
      alert("Failed to delete spare part: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col lg:flex-row ${isLightMode ? "bg-[#f4f4f0] text-[#111111]" : "bg-[#0b0b0e] text-[#f3f3f6]"}`}>
      
      {/* Dark Backdrop Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 lg:hidden" />}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 sm:w-80 border-r p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${isLightMode ? "border-black/10 bg-white" : "border-white/10 bg-[#121216]"}`}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-black tracking-tighter uppercase">
              Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
            </span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl border text-xs cursor-pointer">✕</button>
          </div>
          <nav className="flex flex-col gap-2 text-xs uppercase tracking-widest font-bold w-full overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
            <Link href="/admin/dashboard" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 flex items-center gap-3 transition-all">📊 Dashboard</Link>
            <Link href="/admin/users" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 flex items-center gap-3 transition-all">👥 1. Users Module</Link>
            <Link href="/admin/vehicles" className="px-4 py-2.5 rounded-2xl hover:bg-white/5 flex items-center gap-3 transition-all">🚗 2. Vehicles Module</Link>
            <Link href="/admin/spare-parts" className="px-4 py-2.5 rounded-2xl bg-[#cbf000] text-black shadow-lg flex items-center gap-3">📦 6. Spare Parts Module</Link>
          </nav>
        </div>
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-xs uppercase font-mono tracking-widest hover:text-[#cbf000]">← Dashboard</Link>
          <button onClick={() => setIsLightMode(!isLightMode)} className="p-2.5 rounded-full border text-xs cursor-pointer">
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 pb-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ Module 6: Spare Parts Inventory ]</span>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-1">Spare Parts & Inventory Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2.5 rounded-xl bg-[#cbf000] text-black text-xs uppercase font-mono font-bold tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#cbf000]/20">
              + Add Part
            </button>
            <button onClick={fetchSpareParts} className="px-4 py-2.5 rounded-xl border border-white/20 text-xs uppercase font-mono tracking-wider hover:border-[#cbf000] transition-all cursor-pointer">
              🔄 Refresh
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            ⚠️ Error: {errorMsg}
          </div>
        )}

        {/* Spare Parts Table */}
        <div className={`rounded-[32px] border overflow-hidden shadow-2xl ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h4 className="text-sm font-mono uppercase tracking-widest">Active Inventory Records</h4>
            <span className="text-xs font-mono bg-[#cbf000]/10 text-[#cbf000] px-3 py-1 rounded-full">{spareParts.length} Parts Found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
              <thead className={`border-b ${isLightMode ? "bg-neutral-100 border-black/10 text-neutral-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Part Name</th>
                  <th className="p-4">Part Number</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400">Loading inventory from database...</td>
                  </tr>
                ) : spareParts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400">No spare parts found in database.</td>
                  </tr>
                ) : (
                  spareParts.map((part) => (
                    <tr key={part.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-neutral-400">#{part.id.slice(-6)}</td>
                      <td className="p-4 font-bold text-white">{part.name}</td>
                      <td className="p-4 text-neutral-400">{part.partNumber || "N/A"}</td>
                      <td className="p-4 text-[#cbf000] font-bold">₹{part.price}</td>
                      <td className="p-4 text-white">{part.stock} units</td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => handleDeletePart(part.id)} className="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Spare Part Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-black/10 text-black" : "bg-[#141418] border-white/10 text-white"}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000]">📦 Add New Spare Part</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-xs uppercase font-mono px-3 py-1 rounded-lg border border-white/20 cursor-pointer">Close</button>
              </div>

              <form onSubmit={handleCreatePart} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Part Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Brake Pad Set" 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-neutral-100 border-black/10" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Part Number / SKU</label>
                  <input 
                    type="text" 
                    value={partNumber} 
                    onChange={(e) => setPartNumber(e.target.value)} 
                    placeholder="e.g. BP-8920-X" 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-neutral-100 border-black/10" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="e.g. 1200" 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-neutral-100 border-black/10" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    placeholder="e.g. 45" 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-neutral-100 border-black/10" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all cursor-pointer">
                    Save Part to Inventory →
                  </button>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3.5 rounded-2xl border border-white/20 text-xs font-mono uppercase cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}