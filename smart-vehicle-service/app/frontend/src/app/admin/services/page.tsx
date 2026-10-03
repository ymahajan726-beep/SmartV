"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminServicesPage() {
  const { isLightMode } = useTheme();
  const [services, setServices] = useState<any[]>([]);
  const [serviceCenters, setServiceCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [serviceCenterId, setServiceCenterId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesData, centersData] = await Promise.all([
        apiRequest("/services", "GET"),
        apiRequest("/service-centers", "GET"),
      ]);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setServiceCenters(Array.isArray(centersData) ? centersData : []);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setDuration("");
    setServiceCenterId("");
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { 
        name, 
        description, 
        price: Number(price), 
        duration, 
        serviceCenterId: serviceCenterId || null 
      };

      if (editingId) {
        await apiRequest(`/services/${editingId}`, "PATCH", payload);
        triggerToast("Service package updated successfully!", "success");
      } else {
        await apiRequest("/services", "POST", payload);
        triggerToast("Service package added successfully!", "success");
      }

      resetForm();
      fetchData();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to save service package.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      setSubmitting(true);
      await apiRequest(`/services/${id}`, "DELETE");
      triggerToast("Service package deleted successfully.", "success");
      fetchData();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to delete service.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-xs font-mono border flex items-center gap-3 ${toastType === "success" ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400" : "bg-red-500 text-white font-bold border-red-400"}`}>
          <span>{toastType === "success" ? "⚡" : "⚠"}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">[ CATALOG MANAGEMENT ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Service Packages</h1>
        </div>
      </header>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className={`p-6 rounded-[28px] border shadow-xl h-fit ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF]">
              {editingId ? "Edit Service" : "Add Service Package"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-[10px] text-neutral-400 underline uppercase cursor-pointer">
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Service Center</label>
              <select
                value={serviceCenterId}
                onChange={(e) => setServiceCenterId(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              >
                <option value="">-- Choose Center --</option>
                {serviceCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name} ({center.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Service Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Full Engine Diagnostics"
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about the service..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1499"
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-neutral-400 mb-1">Duration (e.g. 2 Hours)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2 Hours"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${isLightMode ? "bg-gray-50 border-gray-200" : "bg-black/60 border-white/10 text-white"}`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Processing..." : editingId ? "Update Package" : "+ Add Service Package"}
            </button>
          </form>
        </div>

        {/* List Table Section with Responsive Scroll */}
        <div className={`lg:col-span-2 rounded-[28px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
          <div className="p-6 border-b border-white/10 font-mono text-xs uppercase tracking-widest text-[#00F0FF]">
            Available Services ({services.length})
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[700px]">
              <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
                <tr>
                  <th className="p-4">Service Name</th>
                  <th className="p-4">Center</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading catalog...</td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No services added yet.</td></tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                      <td className="p-4">
                        <div className="font-bold">{s.name}</div>
                        <div className="text-[10px] text-neutral-400 normal-case">{s.description}</div>
                      </td>
                      <td className="p-4 text-neutral-400">
                        {s.serviceCenter ? `${s.serviceCenter.name}` : <span className="text-amber-400">All Centers / Unassigned</span>}
                      </td>
                      <td className="p-4 font-bold text-cyan-400">₹{s.price}</td>
                      <td className="p-4 text-neutral-400">{s.duration || "N/A"}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(s.id);
                            setName(s.name);
                            setDescription(s.description || "");
                            setPrice(s.price);
                            setDuration(s.duration || "");
                            setServiceCenterId(s.serviceCenterId || "");
                          }}
                          className="px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold text-[10px] cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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