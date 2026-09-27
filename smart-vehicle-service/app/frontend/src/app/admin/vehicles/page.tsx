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

  // Form States
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [color, setColor] = useState("");

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
      const data = await apiRequest("/vehicles", "GET").catch(() => []);
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
    setMake(""); setModel(""); setRegistrationNumber(""); setYear("");
    setFuelType(""); setCurrentMileage(""); setColor("");
    setShowModal(true);
  };

  const handleOpenEditModal = (v: any) => {
    setEditingId(v.id);
    setMake(v.make || "");
    setModel(v.model || "");
    setRegistrationNumber(v.registrationNumber || "");
    setYear(v.year ? String(v.year) : "");
    setFuelType(v.fuelType || "");
    setCurrentMileage(v.currentMileage ? String(v.currentMileage) : "");
    setColor(v.color || "");
    setShowModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        make,
        model,
        registrationNumber,
        year: year ? Number(year) : undefined,
        fuelType: fuelType || undefined,
        currentMileage: currentMileage ? Number(currentMileage) : undefined,
        color: color || undefined,
      };

      if (editingId) {
        // UPDATE (PATCH)
        await apiRequest(`/vehicles/${editingId}`, "PATCH", payload);
        showToast("Vehicle updated successfully!");
      } else {
        // CREATE (POST)
        await apiRequest("/vehicles", "POST", payload);
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
      await apiRequest(`/vehicles/${id}`, "DELETE");
      showToast("Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {/* Toast Notification Banner */}
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
              <th className="p-4">Make & Model</th>
              <th className="p-4">Registration No</th>
              <th className="p-4">Fuel / Color</th>
              <th className="p-4">Year</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-neutral-400">Loading...</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-neutral-400">No vehicles found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                  <td className="p-4 text-neutral-400">#{String(v.id).slice(-6)}</td>
                  <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{v.make} {v.model}</td>
                  <td className="p-4 text-[#cbf000]">{v.registrationNumber}</td>
                  <td className="p-4 text-neutral-400">{v.fuelType || "N/A"} / {v.color || "N/A"}</td>
                  <td className="p-4 text-neutral-400">{v.year || "N/A"}</td>
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
              <input type="text" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make (e.g. Honda)" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model (e.g. City)" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="Registration Number" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={fuelType} onChange={(e) => setFuelType(e.target.value)} placeholder="Fuel Type (Optional - e.g. Petrol)" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="number" value={currentMileage} onChange={(e) => setCurrentMileage(e.target.value)} placeholder="Current Mileage (Optional - e.g. 15000)" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color (Optional - e.g. Black)" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year (Optional - e.g. 2023)" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              
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