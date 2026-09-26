"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Create Service Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Edit Service Modal States
  const [editingService, setEditingService] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

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
        price: Number(price) 
      });
      setShowCreateModal(false);
      setName("");
      setDescription("");
      setPrice("");
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
        price: Number(editPrice),
      });
      setEditingService(null);
      fetchServices();
    } catch (err: any) {
      alert("Failed to update service: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service from database?")) return;
    try {
      await apiRequest(`/services/${id}`, "DELETE");
      fetchServices();
    } catch (err: any) {
      alert("Failed to delete service: " + (err.message || "Unknown error"));
    }
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setEditName(service.name || "");
    setEditDescription(service.description || "");
    setEditPrice(service.price || "");
  };

  return (
    <div className="space-y-8 font-sans text-gray-900">
      <header className="pb-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-600 uppercase tracking-widest">[ Module 4: Services Management ]</span>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-1">Vehicle Services Database</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs uppercase font-mono font-bold tracking-wider hover:bg-gray-800 transition-all cursor-pointer shadow-sm">
            + New Service
          </button>
          <button onClick={fetchServices} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs uppercase font-mono tracking-wider hover:border-emerald-600 transition-all cursor-pointer bg-gray-50">
            🔄 Refresh
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
          ⚠️ Error: {errorMsg}
        </div>
      )}

      {/* Services Table */}
      <div className="rounded-[32px] border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-sm font-mono uppercase tracking-widest text-gray-600">Active Services Records</h4>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{services.length} Services Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className="border-b bg-gray-50 border-gray-100 text-gray-500">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Service Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Loading services from database...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No service records found.</td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-400">#{srv.id.slice(-6)}</td>
                    <td className="p-4 font-bold text-gray-900">{srv.name}</td>
                    <td className="p-4 text-gray-500">{srv.description || "N/A"}</td>
                    <td className="p-4 text-emerald-600 font-bold">₹{srv.price}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => openEditModal(srv)} className="text-blue-600 hover:underline cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteService(srv.id)} className="text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 rounded-[32px] border border-gray-200 bg-white shadow-2xl text-gray-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">⚙️ Create New Service</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-xs uppercase font-mono px-3 py-1 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">Close</button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Service Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Engine Tuning" 
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe service details..." 
                  rows={3}
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="e.g. 1500" 
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all cursor-pointer">
                  Save Service Record →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3.5 rounded-2xl border border-gray-200 text-xs font-mono uppercase cursor-pointer hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 rounded-[32px] border border-gray-200 bg-white shadow-2xl text-gray-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">✏️ Edit Service Record</h3>
              <button onClick={() => setEditingService(null)} className="text-xs uppercase font-mono px-3 py-1 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">Close</button>
            </div>

            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Service Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Description</label>
                <textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  rows={3}
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  value={editPrice} 
                  onChange={(e) => setEditPrice(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all cursor-pointer">
                  Save Changes →
                </button>
                <button type="button" onClick={() => setEditingService(null)} className="px-6 py-3.5 rounded-2xl border border-gray-200 text-xs font-mono uppercase cursor-pointer hover:bg-gray-50">
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