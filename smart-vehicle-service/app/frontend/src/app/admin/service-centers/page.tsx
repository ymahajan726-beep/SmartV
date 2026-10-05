"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminCentersPage() {
  const { isLightMode } = useTheme();
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [editingCenterId, setEditingCenterId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/service-centers", "GET");
      setCenters(Array.isArray(data) ? data : []);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load service centers.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setPhone("");
    setEditingCenterId(null);
  };

  const handleSaveCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { name, location, phone };

      if (editingCenterId) {
        await apiRequest(`/service-centers/${editingCenterId}`, "PATCH", payload);
        triggerToast("Service Center updated successfully!", "success");
      } else {
        await apiRequest("/service-centers", "POST", payload);
        triggerToast("Service Center registered successfully!", "success");
      }

      resetForm();
      fetchCenters();
    } catch (err: any) {
      triggerToast(err?.message || "Operation failed. Check admin permissions.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (center: any) => {
    setEditingCenterId(center.id);
    setName(center.name || "");
    setLocation(center.location || "");
    setPhone(center.phone || "");
  };

  const handleDeleteCenter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service center?")) return;
    try {
      setSubmitting(true);
      await apiRequest(`/service-centers/${id}`, "DELETE");
      triggerToast("Service Center deleted successfully.", "success");
      fetchCenters();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to delete center.", "error");
    } finally {
      setSubmitting(false);
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
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">[ WORKSHOP MANAGEMENT ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Service Centers</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`p-6 rounded-[28px] border shadow-xl h-fit ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF]">
              {editingCenterId ? "Edit Center" : "Add New Center"}
            </h3>
            {editingCenterId && (
              <button onClick={resetForm} className="text-[10px] text-neutral-400 underline uppercase cursor-pointer">
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSaveCenter} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Center Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Motorcare Central"
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Location / Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jalgaon City Center"
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Processing..." : editingCenterId ? "Update Center" : "+ Register Center"}
            </button>
          </form>
        </div>

        <div className={`lg:col-span-2 rounded-[28px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <div className="p-6 border-b border-white/10 font-mono text-xs uppercase tracking-widest text-[#00F0FF]">
            Active Service Centers ({centers.length})
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
              <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
                <tr>
                  <th className="p-4">Center Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-400">Loading centers...</td></tr>
                ) : centers.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-400">No service centers added yet.</td></tr>
                ) : (
                  centers.map((c) => (
                    <tr key={c.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                      <td className="p-4 font-bold">{c.name}</td>
                      <td className="p-4 text-neutral-300">{c.location}</td>
                      <td className="p-4 text-neutral-400">{c.phone || "N/A"}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold text-[10px] cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCenter(c.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-[10px] cursor-pointer"
                        >
                          🗑️ Delete
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