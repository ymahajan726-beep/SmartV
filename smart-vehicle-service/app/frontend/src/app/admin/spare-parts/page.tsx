"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminSparePartsPage() {
  const { isLightMode } = useTheme();
  const [spareParts, setSpareParts] = useState<any[]>([]);
  const [serviceCenters, setServiceCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Create Spare Part Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [serviceCenterId, setServiceCenterId] = useState("");

  // Edit Spare Part Modal States
  const [editingPart, setEditingPart] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPartNumber, setEditPartNumber] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editServiceCenterId, setEditServiceCenterId] = useState("");

  useEffect(() => {
    fetchSpareParts();
    fetchServiceCenters();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

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

  const fetchServiceCenters = async () => {
    try {
      const data = await apiRequest("/service-centers", "GET");
      setServiceCenters(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch service centers:", err);
    }
  };

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/spare-parts", "POST", { 
        name, 
        partNumber, 
        price: Number(price), 
        stock: Number(stock),
        serviceCenterId 
      });
      setShowCreateModal(false);
      setName("");
      setPartNumber("");
      setPrice("");
      setStock("");
      setServiceCenterId("");
      showToast("Spare part successfully added to inventory!");
      fetchSpareParts();
    } catch (err: any) {
      alert("Failed to create spare part: " + (err.message || "Unknown error"));
    }
  };

  const handleUpdatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPart) return;
    try {
      await apiRequest(`/spare-parts/${editingPart.id}`, "PATCH", {
        name: editName,
        partNumber: editPartNumber,
        price: Number(editPrice),
        stock: Number(editStock),
        serviceCenterId: editServiceCenterId,
      });
      setEditingPart(null);
      showToast("Spare part updated successfully!");
      fetchSpareParts();
    } catch (err: any) {
      alert("Failed to update spare part: " + (err.message || "Unknown error"));
    }
  };

  const handleDeletePart = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spare part from database?")) return;
    try {
      await apiRequest(`/spare-parts/${id}`, "DELETE");
      showToast("Spare part deleted successfully!");
      fetchSpareParts();
    } catch (err: any) {
      alert("Failed to delete spare part: " + (err.message || "Unknown error"));
    }
  };

  const openEditModal = (part: any) => {
    setEditingPart(part);
    setEditName(part.name || "");
    setEditPartNumber(part.partNumber || "");
    setEditPrice(part.price || "");
    setEditStock(part.stock || "");
    setEditServiceCenterId(part.serviceCenterId || "");
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
          <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Spare Parts & Inventory Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className={`px-4 py-2.5 rounded-xl text-xs uppercase font-mono font-bold tracking-wider transition-all cursor-pointer shadow-lg ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90 shadow-[#cbf000]/20"}`}>
            + Add Part
          </button>
          <button onClick={fetchSpareParts} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${isLightMode ? "border-gray-200 bg-gray-50 hover:border-[#cbf000] text-gray-800" : "border-white/20 bg-[#141418] hover:border-[#cbf000] text-white"}`}>
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
      <div className={`rounded-[32px] border overflow-hidden shadow-2xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-100" : "border-white/10"}`}>
          <h4 className={`text-sm font-mono uppercase tracking-widest ${isLightMode ? "text-gray-600" : "text-neutral-400"}`}>Active Inventory Records</h4>
          <span className="text-xs font-mono bg-[#cbf000]/10 text-[#cbf000] px-3 py-1 rounded-full">{spareParts.length} Parts Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Part Name</th>
                <th className="p-4">SKU / Number</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
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
                  <tr key={part.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{part.id.slice(-6)}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{part.name}</td>
                    <td className="p-4 text-neutral-400">{part.partNumber || "N/A"}</td>
                    <td className="p-4 text-[#cbf000] font-bold">₹{part.price}</td>
                    <td className={`p-4 ${isLightMode ? "text-gray-800" : "text-white"}`}>{part.stock} units</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => openEditModal(part)} className="text-blue-400 hover:text-blue-300 cursor-pointer">Edit</button>
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
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000]">📦 Add New Spare Part</h3>
              <button onClick={() => setShowCreateModal(false)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleCreatePart} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Service Center</label>
                <select 
                  value={serviceCenterId} 
                  onChange={(e) => setServiceCenterId(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">Select Service Center</option>
                  {serviceCenters.map((center) => (
                    <option key={center.id} value={center.id}>{center.name} ({center.city || center.address})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Part Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Brake Pad Set" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Part Number / SKU</label>
                <input 
                  type="text" 
                  value={partNumber} 
                  onChange={(e) => setPartNumber(e.target.value)} 
                  placeholder="e.g. BP-8920-X" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Price (₹)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="e.g. 1200" 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Stock Quantity</label>
                  <input 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    placeholder="e.g. 45" 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all cursor-pointer">
                  Save Part to Inventory →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Spare Part Modal */}
      {editingPart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000]">✏️ Edit Spare Part</h3>
              <button onClick={() => setEditingPart(null)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleUpdatePart} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Service Center</label>
                <select 
                  value={editServiceCenterId} 
                  onChange={(e) => setEditServiceCenterId(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">Select Service Center</option>
                  {serviceCenters.map((center) => (
                    <option key={center.id} value={center.id}>{center.name} ({center.city || center.address})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Part Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Part Number / SKU</label>
                <input 
                  type="text" 
                  value={editPartNumber} 
                  onChange={(e) => setEditPartNumber(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Price (₹)</label>
                  <input 
                    type="number" 
                    value={editPrice} 
                    onChange={(e) => setEditPrice(e.target.value)} 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Stock Quantity</label>
                  <input 
                    type="number" 
                    value={editStock} 
                    onChange={(e) => setEditStock(e.target.value)} 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all cursor-pointer">
                  Save Changes →
                </button>
                <button type="button" onClick={() => setEditingPart(null)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
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