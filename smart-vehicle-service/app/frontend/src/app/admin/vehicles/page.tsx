"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminVehiclesPage() {
  const { isLightMode } = useTheme();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States matching backend entity properties
  const [modelName, setModelName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/vehicles", "GET").catch(() => []);
      setVehicles(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setModelName(""); setVehicleNumber(""); setFuelType(""); setMileage("");
    setShowModal(true);
  };

  const handleOpenEditModal = (v: any) => {
    setEditingId(v.id);
    setModelName(v.modelName || "");
    setVehicleNumber(v.vehicleNumber || "");
    setFuelType(v.fuelType || "");
    setMileage(v.mileage ? String(v.mileage) : "");
    setShowModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        modelName,
        vehicleNumber,
        fuelType: fuelType || undefined,
        mileage: mileage ? Number(mileage) : undefined,
      };

      if (editingId) {
        await apiRequest(`/admin/vehicles/${editingId}`, "PATCH", payload);
        showToast("Vehicle updated successfully!");
      } else {
        await apiRequest("/admin/vehicles", "POST", payload);
        showToast("Vehicle registered successfully!");
      }

      setShowModal(false);
      fetchVehicles();
    } catch (err: any) {
      alert("Operation Failed: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await apiRequest(`/admin/vehicles/${id}`, "DELETE");
      showToast("Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl bg-[#cbf000] text-black font-mono text-xs font-bold uppercase shadow-2xl animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h1 className={`text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Vehicles Database</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handleOpenCreateModal} className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
            + Register Vehicle
          </button>
          <button onClick={fetchVehicles} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer transition-all ${isLightMode ? "border-gray-300 hover:border-black text-gray-800 bg-gray-50" : "border-white/20 hover:border-[#cbf000] text-white"}`}>🔄 Refresh</button>
        </div>
      </header>

      {errorMsg && <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">⚠️ Note: {errorMsg}</div>}

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
          <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Vehicle Model</th>
              <th className="p-4">Registration No</th>
              <th className="p-4">Fuel / Mileage</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading...</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No vehicles found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                  <td className="p-4 text-neutral-400">#{String(v.id)}</td>
                  <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{v.modelName || "N/A"}</td>
                  <td className="p-4 text-[#cbf000]">{v.vehicleNumber || "N/A"}</td>
                  <td className="p-4 text-neutral-400">{v.fuelType || "N/A"} / {v.mileage ? `${v.mileage} km` : "N/A"}</td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleOpenEditModal(v)} className="text-blue-400 hover:text-blue-300 cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000] mb-6">
              {editingId ? "Edit Vehicle Record" : "Register Vehicle"}
            </h3>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <input type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Model Name (e.g. Honda City)" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="Vehicle Registration No (e.g. MH04AB1234)" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={fuelType} onChange={(e) => setFuelType(e.target.value)} placeholder="Fuel Type (Optional - e.g. Petrol)" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="Mileage (Optional - e.g. 15000)" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              
              <div className="flex gap-4 pt-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  {editingId ? "Update Vehicle" : "Save Record"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className={`px-6 py-3.5 rounded-2xl border text-xs uppercase font-mono cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}