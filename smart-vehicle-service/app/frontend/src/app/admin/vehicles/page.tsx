"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

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

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/vehicles", "POST", { make, model, registrationNumber, year: year ? Number(year) : undefined });
      setShowCreateModal(false);
      setMake(""); setModel(""); setRegistrationNumber(""); setYear("");
      fetchVehicles();
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiRequest(`/vehicles/${id}`, "DELETE");
      fetchVehicles();
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-current/10 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ MODULE 2: VEHICLES ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Vehicles Database</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2.5 rounded-xl bg-[#cbf000] text-black text-xs font-mono font-bold uppercase">
            + Register Vehicle
          </button>
          <button onClick={fetchVehicles} className="px-4 py-2.5 rounded-xl border border-current/20 text-xs uppercase font-mono">🔄 Refresh</button>
        </div>
      </header>

      {errorMsg && <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono">⚠️ Note: {errorMsg}</div>}

      <div className="rounded-[32px] border border-current/10 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
          <thead className="border-b border-current/10 bg-black/20 text-neutral-400">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Make & Model</th>
              <th className="p-4">Registration No</th>
              <th className="p-4">Year</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading...</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No vehicles found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-white/5">
                  <td className="p-4 text-neutral-400">#{v.id.slice(-6)}</td>
                  <td className="p-4 font-bold">{v.make} {v.model}</td>
                  <td className="p-4 text-[#cbf000]">{v.registrationNumber}</td>
                  <td className="p-4 text-neutral-400">{v.year || "N/A"}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 rounded-[32px] border border-current/20 bg-[#141418] text-white shadow-2xl">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000] mb-6">Register Vehicle</h3>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <input type="text" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make (e.g. Honda)" required className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm outline-none" />
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model (e.g. City)" required className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm outline-none" />
              <input type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="Registration Number" required className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm outline-none" />
              <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm outline-none" />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs">Save</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3.5 rounded-2xl border border-white/20 text-xs uppercase font-mono">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}