"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminRemindersPage() {
  const { isLightMode } = useTheme();
  const [reminders, setReminders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("SERVICE");
  const [dueDate, setDueDate] = useState("");

  const fetchData = async () => {
    try {
      const [remData, usersData] = await Promise.all([
        apiRequest("/reminders/admin", "GET").catch(() => []),
        apiRequest("/reminders/admin/customers-list", "GET").catch(() => []),
      ]);
      setReminders(Array.isArray(remData) ? remData : []);
      setCustomers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAdminReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !title || !dueDate) {
      alert("Please fill required fields");
      return;
    }

    try {
      await apiRequest("/reminders/admin", "POST", {
        customerId,
        vehicleId: vehicleId || undefined,
        title,
        type,
        dueDate,
      });
      setShowModal(false);
      setTitle("");
      setCustomerId("");
      setVehicleId("");
      setDueDate("");
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to create reminder");
    }
  };

  return (
    <div className={`p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden font-sans ${isLightMode ? "text-slate-900" : "text-white"}`}>
      {/* Responsive Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light mb-1">Customer Service Reminders Overview</h1>
          <p className={`text-xs font-mono uppercase tracking-widest ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>
            Monitor and assign upcoming vehicle maintenance across workshop clients
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg text-center ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-[#00F0FF] text-slate-950"}`}
        >
          + Set Reminder for Client
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className={`border rounded-2xl overflow-hidden shadow-md ${isLightMode ? "bg-white border-slate-200" : "border-white/10 bg-[#0d0d14]"}`}>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[750px]">
            <thead className={`border-b uppercase font-bold ${isLightMode ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-[#12121c] border-white/10 text-slate-400"}`}>
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Reminder Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">Loading reminders...</td></tr>
              ) : reminders.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No client reminders found.</td></tr>
              ) : (
                reminders.map((rem) => (
                  <tr key={rem.id} className={`border-b transition-colors ${isLightMode ? "border-slate-100 hover:bg-slate-50" : "border-white/5 hover:bg-white/5"}`}>
                    <td className={`p-4 font-medium ${isLightMode ? "text-slate-900" : "text-white"}`}>{rem.customer?.name || "N/A"}</td>
                    <td className={`p-4 ${isLightMode ? "text-slate-600" : "text-slate-300"}`}>{rem.customer?.phone || "N/A"}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>{rem.title}</td>
                    <td className="p-4 uppercase">{rem.type}</td>
                    <td className="p-4">{new Date(rem.dueDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${rem.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
                        {rem.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`border rounded-3xl p-6 sm:p-8 max-w-lg w-full font-mono text-xs relative shadow-2xl ${isLightMode ? "bg-white border-slate-300 text-slate-900" : "bg-[#12121c] border-white/25 text-white"}`}>
            <button 
              onClick={() => setShowModal(false)}
              className={`absolute top-6 right-6 cursor-pointer font-bold ${isLightMode ? "text-slate-500 hover:text-slate-900" : "text-slate-400 hover:text-white"}`}
            >
              [X]
            </button>

            <h2 className={`text-xl font-light mb-6 ${isLightMode ? "text-cyan-700 font-bold" : "text-[#00F0FF]"}`}>Create Client Service Reminder</h2>

            <form onSubmit={handleCreateAdminReminder} className="space-y-4">
              <div>
                <label className={`block mb-1 ${isLightMode ? "text-slate-700" : "text-slate-400"}`}>Select Customer</label>
                <select 
                  value={customerId} 
                  onChange={(e) => setCustomerId(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 outline-none ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white"}`}
                  required
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone || c.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-1 ${isLightMode ? "text-slate-700" : "text-slate-400"}`}>Reminder Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10,000 KM Major Service" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 outline-none ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white"}`}
                  required 
                />
              </div>

              <div>
                <label className={`block mb-1 ${isLightMode ? "text-slate-700" : "text-slate-400"}`}>Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 outline-none ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white"}`}
                >
                  <option value="SERVICE">Service</option>
                  <option value="PUC">PUC Check</option>
                  <option value="GENERAL">General Maintenance</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 ${isLightMode ? "text-slate-700" : "text-slate-400"}`}>Due Date</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 outline-none ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white"}`}
                  required 
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button 
                  type="submit" 
                  className={`flex-1 font-bold py-3.5 rounded-xl uppercase tracking-wider cursor-pointer ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-[#00F0FF] text-slate-950"}`}
                >
                  Save & Send Reminder
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className={`px-6 py-3.5 rounded-xl border uppercase cursor-pointer text-center font-bold ${isLightMode ? "border-slate-300 text-slate-700 hover:bg-slate-100" : "border-white/20 hover:bg-white/5"}`}
                >
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