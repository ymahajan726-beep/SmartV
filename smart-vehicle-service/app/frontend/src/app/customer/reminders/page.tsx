"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/src/services/api";

export default function CustomerRemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("SERVICE");
  const [dueDate, setDueDate] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const fetchReminders = async () => {
    try {
      const data = await apiRequest("/reminders/customer", "GET");
      setReminders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await apiRequest("/vehicles/my-vehicles", "GET").catch(() => []);
      setVehicles(Array.isArray(data) ? data : []);
    } catch (e) {
      setVehicles([]);
    }
  };

  useEffect(() => {
    fetchReminders();
    fetchVehicles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/reminders", "POST", {
        title,
        type,
        dueDate,
        vehicleId: vehicleId || undefined,
      });
      setTitle("");
      setDueDate("");
      setVehicleId("");
      fetchReminders();
    } catch (err: any) {
      alert(err.message || "Failed to create reminder");
    }
  };

  const markComplete = async (id: string) => {
    try {
      await apiRequest(`/reminders/${id}/complete`, "PATCH");
      fetchReminders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await apiRequest(`/reminders/${id}`, "DELETE");
      fetchReminders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-light mb-2">Service & Maintenance Reminders</h1>
      <p className="text-xs font-mono text-slate-400 mb-8 uppercase tracking-widest">
        Track upcoming services and custom vehicle alerts
      </p>
      <form onSubmit={handleCreate} className="bg-[#12121c] border border-white/10 p-6 rounded-3xl mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Reminder Title</label>
          <input 
            type="text" 
            placeholder="e.g. Engine Oil Change" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white"
            required 
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white"
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
            className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white"
            required 
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full bg-[#00F0FF] text-slate-950 font-bold py-3 rounded-xl uppercase tracking-wider cursor-pointer">
            + Add Reminder
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xs font-mono text-slate-500">Loading reminders...</p>
        ) : reminders.length === 0 ? (
          <p className="text-xs font-mono text-slate-500">No reminders found.</p>
        ) : (
          reminders.map((rem) => (
            <div key={rem.id} className="p-6 rounded-2xl border border-white/10 bg-[#0d0d14] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold uppercase">
                    {rem.type}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-1 rounded ${rem.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {rem.status}
                  </span>
                </div>
                <h3 className="text-lg font-medium mb-1">{rem.title}</h3>
                <p className="text-xs font-mono text-slate-400 mb-4">
                  Due Date: {new Date(rem.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10 font-mono text-xs">
                {rem.status !== 'COMPLETED' && (
                  <button onClick={() => markComplete(rem.id)} className="text-emerald-400 hover:underline cursor-pointer">
                    Mark Completed
                  </button>
                )}
                <button onClick={() => deleteReminder(rem.id)} className="text-rose-400 hover:underline cursor-pointer ml-auto">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}