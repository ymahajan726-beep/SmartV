"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminInventoryPage() {
  const { isLightMode } = useTheme();
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [partName, setPartName] = useState("");
  const [sku, setSku] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/inventory", "GET");
      setParts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load inventory stock.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPartName("");
    setSku("");
    setStockQty("");
    setUnitPrice("");
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { partName, sku, stockQty: Number(stockQty), unitPrice: Number(unitPrice) };

      if (editingId) {
        await apiRequest(`/admin/inventory/${editingId}`, "PATCH", payload);
        triggerToast("Spare part updated successfully!", "success");
      } else {
        await apiRequest("/admin/inventory", "POST", payload);
        triggerToast("New spare part added to inventory stock!", "success");
      }

      resetForm();
      fetchInventory();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to save part.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inventory part?")) return;
    try {
      await apiRequest(`/admin/inventory/${id}`, "DELETE");
      triggerToast("Part removed from inventory.", "success");
      fetchInventory();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to delete.", "error");
    }
  };

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
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest"> WORKSHOP INVENTORY </span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Spare Parts Stock</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
      
        <div className={`p-6 rounded-[28px] border shadow-xl h-fit ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF]">
              {editingId ? "Edit Part Stock" : "Add Spare Part"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-[10px] text-neutral-400 underline uppercase cursor-pointer">Cancel</button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Part Name</label>
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="e.g. Engine Oil 5W30"
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">SKU / Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. OIL-5W30-01"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                placeholder="50"
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Unit Price (₹)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="1200"
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Processing..." : editingId ? "Update Stock" : "+ Add to Inventory"}
            </button>
          </form>
        </div>

        <div className={`lg:col-span-2 rounded-[28px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <div className="p-6 border-b border-white/10 font-mono text-xs uppercase tracking-widest text-[#00F0FF]">
            Current Inventory Stock ({parts.length})
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[650px]">
              <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
                <tr>
                  <th className="p-4">Part Name / SKU</th>
                  <th className="p-4">Available Stock</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-400">Loading stock...</td></tr>
                ) : parts.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-400">No spare parts in inventory.</td></tr>
                ) : (
                  parts.map((p) => (
                    <tr key={p.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                      <td className="p-4">
                        <div className="font-bold">{p.partName}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{p.sku || "NO SKU"}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${p.stockQty > 5 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                          {p.stockQty} Units Left
                        </span>
                      </td>
                      <td className="p-4 font-bold text-cyan-400">₹{p.unitPrice}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setPartName(p.partName);
                            setSku(p.sku || "");
                            setStockQty(p.stockQty);
                            setUnitPrice(p.unitPrice);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold text-[10px] cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-[10px] cursor-pointer"
                        >
                          🗑 Delete
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
    </div>
  );
}