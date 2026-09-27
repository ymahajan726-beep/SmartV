"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminServicesPage() {
  const { isLightMode } = useTheme();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState(""); // Toast state added

  // Create Service Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("30");

  // Edit Service Modal States
  const [editingService, setEditingService] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editEstimatedDuration, setEditEstimatedDuration] = useState("30");

  useEffect(() => {
    fetchServices();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/services", "GET").catch(() => []);
      setServices(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      console.error("Failed to fetch services from backend:", err);
      setErrorMsg(err.message || "Backend database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/services", "POST", { 
        name, 
        description, 
        basePrice: Number(price),
        estimatedDuration: Number(estimatedDuration)
      });
      setShowCreateModal(false);
      setName("");
      setDescription("");
      setPrice("");
      setEstimatedDuration("30");
      showToast("Service created successfully in database!");
      fetchServices();
    } catch (err: any) {
      alert("Failed to create service: " + (err.message || "Unknown error"));
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      await apiRequest(`/services/${editingService.id}`, "PATCH", {
        name: editName,
        description: editDescription,
        basePrice: Number(editPrice),
        estimatedDuration: Number(editEstimatedDuration),
      });
      setEditingService(null);
      showToast("Service updated successfully!");
      fetchServices();
    } catch (err: any) {
      alert("Failed to update service: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service from database?")) return;
    try {
      await apiRequest(`/services/${id}`, "DELETE");
      showToast("Service deleted successfully!");
      fetchServices();
    } catch (err: any) {
      alert("Failed to delete service: " + (err.message || "Unknown error"));
    }
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setEditName(service.name || "");
    setEditDescription(service.description || "");
    setEditPrice(service.basePrice || service.price || "");
    setEditEstimatedDuration(service.estimatedDuration || "30");
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl bg-[#cbf000] text-black font-mono text-xs font-bold uppercase shadow-2xl animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      <header className={`pb-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
    
          <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Vehicle Services Database</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className={`px-4 py-2.5 rounded-xl text-xs uppercase font-mono font-bold tracking-wider transition-all cursor-pointer shadow-sm ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
            + New Service
          </button>
          <button onClick={fetchServices} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${isLightMode ? "border-gray-200 bg-gray-50 hover:border-emerald-600 text-gray-800" : "border-white/20 bg-[#141418] hover:border-[#cbf000] text-white"}`}>
            🔄 Refresh
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ Error: {errorMsg}
        </div>
      )}

      {/* Services Table */}
      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-100" : "border-white/10"}`}>
          <h4 className={`text-sm font-mono uppercase tracking-widest ${isLightMode ? "text-gray-600" : "text-neutral-400"}`}>Active Services Records</h4>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{services.length} Services Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Service Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">Loading services from database...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">No service records found.</td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{srv.id.slice(-6)}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{srv.name}</td>
                    <td className="p-4 text-neutral-400">{srv.description || "N/A"}</td>
                    <td className="p-4 text-neutral-400">{srv.estimatedDuration} mins</td>
                    <td className="p-4 text-emerald-600 font-bold">₹{srv.basePrice || srv.price}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => openEditModal(srv)} className="text-blue-400 hover:text-blue-300 cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteService(srv.id)} className="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">⚙️ Create New Service</h3>
              <button onClick={() => setShowCreateModal(false)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Service Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Engine Tuning" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe service details..." 
                  rows={3}
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Price (₹)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="e.g. 1500" 
                    required 
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Duration (Minutes)</label>
                  <input 
                    type="number" 
                    value={estimatedDuration} 
                    onChange={(e) => setEstimatedDuration(e.target.value)} 
                    placeholder="e.g. 45" 
                    required 
                    min="1"
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Save Service Record →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">✏️ Edit Service Record</h3>
              <button onClick={() => setEditingService(null)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Service Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Description</label>
                <textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  rows={3}
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
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
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Duration (Minutes)</label>
                  <input 
                    type="number" 
                    value={editEstimatedDuration} 
                    onChange={(e) => setEditEstimatedDuration(e.target.value)} 
                    required 
                    min="1"
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Save Changes →
                </button>
                <button type="button" onClick={() => setEditingService(null)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
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