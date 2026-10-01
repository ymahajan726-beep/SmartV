"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminVehiclesPage() {
  const { isLightMode } = useTheme();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchAdminVehicles();
  }, []);

  const fetchAdminVehicles = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/vehicles", "GET");
      setVehicles(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load registered vehicles telemetry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      
      {/* Header */}
      <header className={`pb-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ FLEET CONTROL CENTER ]</span>
          <h1 className={`text-2xl sm:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>
            Registered Customer Vehicles
          </h1>
        </div>
        <button 
          onClick={fetchAdminVehicles} 
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer transition-all ${isLightMode ? "border-gray-300 hover:border-black text-gray-800 bg-gray-50" : "border-white/20 hover:border-[#cbf000] text-white"}`}
        >
          🔄 Refresh Fleet
        </button>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Responsive Vehicles Table Container */}
      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono min-w-[700px]">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Vehicle Model / Name</th>
                <th className="p-4">Vehicle Number</th>
                <th className="p-4">Owner Name</th>
                <th className="p-4">Owner Mobile No</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Loading fleet telemetry...</td></tr>
              ) : vehicles.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">No vehicles registered in garage yet.</td></tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    
                    {/* Vehicle Name / Model */}
                    <td className="p-4 font-bold text-sm">
                      {v.model || v.modelName || "Unknown Model"}
                      <div className="text-[10px] text-neutral-400 font-normal">Fuel: {v.fuelType || "Petrol"}</div>
                    </td>

                    {/* Vehicle Number */}
                    <td className="p-4 font-bold text-[#cbf000]">
                      {v.registrationNumber || v.vehicleNumber || "N/A"}
                    </td>

                    {/* Owner Name - Fixed to use 'v.customer' matching Prisma schema */}
                    <td className="p-4 font-bold">
                      {v.customer?.name || "Valued Customer"}
                    </td>

                    {/* Owner Mobile No - Fixed to use 'v.customer' matching Prisma schema */}
                    <td className="p-4 text-neutral-300">
                      {v.customer?.phone || "No Phone"}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        🟢 ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}