"use client";
import React, { useState } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminServiceHistoryPage() {
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
    <div className="space-y-8 font-sans text-gray-900">
      <header className="pb-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-600 uppercase tracking-widest">[ Module 10: Service History ]</span>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-1">Vehicle & Customer History Lookup</h1>
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Search Form Card */}
      <div className="p-8 rounded-[32px] border border-gray-200 bg-white shadow-sm">
        <h3 className="text-sm font-mono uppercase tracking-widest text-gray-600 mb-6">🔍 Query Database Records</h3>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Search Category</label>
            <select 
              value={searchCategory} 
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50 font-mono uppercase text-xs"
            >
              <option value="vehicleId">By Vehicle ID</option>
              <option value="userId">By User ID</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Enter ID</label>
            <input 
              type="text" 
              value={searchValue} 
              onChange={(e) => setSearchValue(e.target.value)} 
              placeholder="Enter ID..." 
              required 
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
            />
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all cursor-pointer shadow-sm disabled:opacity-50">
              {loading ? "Searching..." : "Fetch History Records →"}
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      <div className="rounded-[32px] border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-sm font-mono uppercase tracking-widest text-gray-600">Lookup Results</h4>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{records.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className="border-b bg-gray-50 border-gray-100 text-gray-500">
              <tr>
                <th className="p-4">Record ID</th>
                <th className="p-4">Service Type / Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">Querying database...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">No history records found for this ID.</td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-400">#{rec.id.slice(-6)}</td>
                    <td className="p-4 font-bold text-gray-900">{rec.details || rec.serviceType || "N/A"}</td>
                    <td className="p-4 text-emerald-600">{rec.status || "COMPLETED"}</td>
                    <td className="p-4 text-gray-500">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "N/A"}</td>
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