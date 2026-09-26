"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Create Reminder Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/maintenance-reminders", "GET").catch(() => []);
      setReminders(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      console.error("Failed to fetch reminders from backend:", err);
      setErrorMsg(err.message || "Backend database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/maintenance-reminders", "POST", { 
        vehicleId, 
        reminderDate, 
        notes 
      });
      setShowCreateModal(false);
      setVehicleId("");
      setReminderDate("");
      setNotes("");
      fetchReminders();
    } catch (err: any) {
      alert("Failed to create reminder: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reminder from database?")) return;
    try {
      await apiRequest(`/maintenance-reminders/${id}`, "DELETE");
      fetchReminders();
    } catch (err: any) {
      alert("Failed to delete reminder: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="space-y-8 font-sans text-gray-900">
      <header className="pb-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-600 uppercase tracking-widest">[ Module 8: Maintenance Reminders ]</span>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-1">Reminders Database & Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs uppercase font-mono font-bold tracking-wider hover:bg-gray-800 transition-all cursor-pointer shadow-sm">
            + New Reminder
          </button>
          <button onClick={fetchReminders} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs uppercase font-mono tracking-wider hover:border-emerald-600 transition-all cursor-pointer bg-gray-50">
            🔄 Refresh
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
          ⚠️ Error: {errorMsg}
        </div>
      )}

      {/* Reminders Table */}
      <div className="rounded-[32px] border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-sm font-mono uppercase tracking-widest text-gray-600">Active Reminder Records</h4>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{reminders.length} Reminders Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className="border-b bg-gray-50 border-gray-100 text-gray-500">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Vehicle ID</th>
                <th className="p-4">Reminder Date</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Loading reminders from database...</td>
                </tr>
              ) : reminders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No maintenance reminders found.</td>
                </tr>
              ) : (
                reminders.map((rem) => (
                  <tr key={rem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-400">#{rem.id.slice(-6)}</td>
                    <td className="p-4 text-gray-600">#{rem.vehicleId ? rem.vehicleId.slice(-6) : "N/A"}</td>
                    <td className="p-4 font-bold text-gray-900">{rem.reminderDate ? new Date(rem.reminderDate).toLocaleDateString() : "N/A"}</td>
                    <td className="p-4 text-emerald-600">{rem.notes || "General Service"}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleDeleteReminder(rem.id)} className="text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Reminder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 rounded-[32px] border border-gray-200 bg-white shadow-2xl text-gray-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">⏰ Create Maintenance Reminder</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-xs uppercase font-mono px-3 py-1 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">Close</button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Vehicle ID</label>
                <input 
                  type="text" 
                  value={vehicleId} 
                  onChange={(e) => setVehicleId(e.target.value)} 
                  placeholder="Enter Vehicle ID" 
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Reminder Date</label>
                <input 
                  type="date" 
                  value={reminderDate} 
                  onChange={(e) => setReminderDate(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-500 mb-1">Notes / Description</label>
                <input 
                  type="text" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="e.g. Oil change and brake inspection" 
                  required 
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-gray-50"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all cursor-pointer">
                  Save Reminder →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3.5 rounded-2xl border border-gray-200 text-xs font-mono uppercase cursor-pointer hover:bg-gray-50">
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