"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminRemindersPage() {
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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden font-sans">
      {/* Responsive Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light mb-1">Customer Service Reminders Overview</h1>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Monitor and assign upcoming vehicle maintenance across workshop clients
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-[#00F0FF] text-slate-950 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg text-center"
        >
          + Set Reminder for Client
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d0d14]">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[750px]">
            <thead className="bg-[#12121c] border-b border-white/10 uppercase text-slate-400">
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
                  <tr key={rem.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-medium text-white">{rem.customer?.name || "N/A"}</td>
                    <td className="p-4 text-slate-300">{rem.customer?.phone || "N/A"}</td>
                    <td className="p-4 text-[#00F0FF]">{rem.title}</td>
                    <td className="p-4 uppercase">{rem.type}</td>
                    <td className="p-4">{new Date(rem.dueDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] ${rem.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
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
          <div className="bg-[#12121c] border border-white/25 rounded-3xl p-6 sm:p-8 max-w-lg w-full font-mono text-xs text-white relative shadow-2xl">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
            >
              [X]
            </button>

            <h2 className="text-xl font-light mb-6 text-[#00F0FF]">Create Client Service Reminder</h2>

            <form onSubmit={handleCreateAdminReminder} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Select Customer</label>
                <select 
                  value={customerId} 
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white"
                  required
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone || c.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reminder Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10,000 KM Major Service" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white"
                  required 
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white"
                >
                  <option value="SERVICE">Service</option>
                  <option value="PUC">PUC Check</option>
                  <option value="GENERAL">General Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-3 text-white"
                  required 
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button 
                  type="submit" 
                  className="flex-1 bg-[#00F0FF] text-slate-950 font-bold py-3.5 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  Save & Send Reminder
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3.5 rounded-xl border border-white/20 uppercase hover:bg-white/5 cursor-pointer text-center"
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