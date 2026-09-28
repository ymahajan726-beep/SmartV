"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminRemindersPage() {
  const { isLightMode } = useTheme();
  const [reminders, setReminders] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Create Reminder Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [dueMileage, setDueMileage] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchReminders();
    fetchVehicles();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/maintenance-reminders", "GET").catch(() => []);
      setReminders(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Backend database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await apiRequest("/vehicles", "GET").catch(() => []);
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load vehicles for dropdown");
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/maintenance-reminders", "POST", { 
        vehicleId, 
        reminderDate, 
        dueMileage: dueMileage ? Number(dueMileage) : 5000,
        notes 
      });
      setShowCreateModal(false);
      setVehicleId("");
      setReminderDate("");
      setDueMileage("");
      setNotes("");
      fetchReminders();
      showToast("Maintenance reminder created successfully!");
    } catch (err: any) {
      showToast("Failed to create reminder: " + (err.message || "Unknown error"), "error");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;
    try {
      await apiRequest(`/maintenance-reminders/${id}`, "DELETE");
      fetchReminders();
      showToast("Reminder deleted successfully!");
    } catch (err: any) {
      showToast("Failed to delete reminder: " + (err.message || "Unknown error"), "error");
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono border transition-all ${toast.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      <header className={`pb-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Service Schedule Database</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className={`px-4 py-2.5 rounded-xl text-xs uppercase font-mono font-bold tracking-wider transition-all cursor-pointer shadow-sm ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
            + New Reminder
          </button>
          <button onClick={fetchReminders} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${isLightMode ? "border-gray-200 bg-gray-50 text-gray-800" : "border-white/20 bg-[#141418] text-white"}`}>
            🔄 Refresh
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Reminders Table */}
      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Vehicle ID</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Due Mileage</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">Loading reminders...</td></tr>
              ) : reminders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-neutral-400">No maintenance reminders found.</td></tr>
              ) : (
                reminders.map((rem) => (
                  <tr key={rem.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{rem.id.slice(-6)}</td>
                    <td className="p-4 text-neutral-400">#{rem.vehicleId ? rem.vehicleId.slice(-6) : "N/A"}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{rem.reminderDate ? new Date(rem.reminderDate).toLocaleDateString() : "N/A"}</td>
                    <td className="p-4 text-[#cbf000]">{rem.dueMileage ? `${rem.dueMileage} KM` : "5000 KM"}</td>
                    <td className={`p-4 lowercase ${isLightMode ? "text-gray-600" : "text-neutral-300"}`}>{rem.notes || "General Service"}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteReminder(rem.id)} className="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#cbf000]">⏰ Schedule Maintenance Reminder</h3>
              <button onClick={() => setShowCreateModal(false)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 font-mono text-xs">
              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Select Vehicle</label>
                <select 
                  value={vehicleId} 
                  onChange={(e) => setVehicleId(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] uppercase ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.modelName || v.vehicleNumber || `Vehicle #${v.id.slice(-6)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Due Date</label>
                <input 
                  type="date" 
                  value={reminderDate} 
                  onChange={(e) => setReminderDate(e.target.value)} 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Due Mileage (KM)</label>
                <input 
                  type="number" 
                  value={dueMileage} 
                  onChange={(e) => setDueMileage(e.target.value)} 
                  placeholder="e.g. 5000" 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className={`block uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Notes / Description</label>
                <input 
                  type="text" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="e.g. Oil change and general checkup" 
                  required 
                  className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none focus:border-[#cbf000] ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Save Reminder →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className={`px-6 py-3.5 rounded-2xl border uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
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