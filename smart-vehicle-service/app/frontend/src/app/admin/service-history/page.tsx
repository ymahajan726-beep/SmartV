"use client";
import React, { useState } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminServiceHistoryPage() {
  const { isLightMode } = useTheme();
  const [searchCategory, setSearchCategory] = useState("vehicleId");
  const [searchValue, setSearchValue] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await apiRequest(`/service-history?${searchCategory}=${searchValue}`, "GET");
      setRecords(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch service history records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      <header className={`pb-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-emerald-600 uppercase tracking-widest">[ Module 10: Service History ]</span>
          <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Vehicle & Customer History Lookup</h1>
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Search Form Card */}
      <div className={`p-8 rounded-[32px] border shadow-sm ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <h3 className={`text-sm font-mono uppercase tracking-widest mb-6 ${isLightMode ? "text-gray-600" : "text-neutral-400"}`}>🔍 Query Database Records</h3>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Search Category</label>
            <select 
              value={searchCategory} 
              onChange={(e) => setSearchCategory(e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 font-mono uppercase text-xs ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
            >
              <option value="vehicleId">By Vehicle ID</option>
              <option value="userId">By User ID</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Enter ID</label>
            <input 
              type="text" 
              value={searchValue} 
              onChange={(e) => setSearchValue(e.target.value)} 
              placeholder="Enter ID..." 
              required 
              className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-emerald-500 ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
            />
          </div>
          <div>
            <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer shadow-sm disabled:opacity-50 ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
              {loading ? "Searching..." : "Fetch History Records →"}
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      <div className={`rounded-[32px] border overflow-hidden shadow-sm ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-100" : "border-white/10"}`}>
          <h4 className={`text-sm font-mono uppercase tracking-widest ${isLightMode ? "text-gray-600" : "text-neutral-400"}`}>Lookup Results</h4>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{records.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">Record ID</th>
                <th className="p-4">Service Type / Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-400">Querying database...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-400">No history records found for this ID.</td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{rec.id.slice(-6)}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{rec.details || rec.serviceType || "N/A"}</td>
                    <td className="p-4 text-emerald-600">{rec.status || "COMPLETED"}</td>
                    <td className="p-4 text-neutral-400">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "N/A"}</td>
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