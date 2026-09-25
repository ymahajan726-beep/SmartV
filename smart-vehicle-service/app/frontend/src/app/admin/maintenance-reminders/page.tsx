"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export default function AdminMaintenanceRemindersPage() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    apiRequest("/maintenance-reminders").then(setReminders).catch(() => {
      setReminders([{ id: 1, vehicle: "Honda City", reminderType: "Oil Change", dueDate: "2026-10-15" }]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] p-8 md:p-12 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase">[ Backend Module: Maintenance Reminders ]</span>
          <h1 className="text-3xl font-light mt-1">Reminders & Alerts</h1>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-mono uppercase text-[#cbf000] hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="bg-[#141418] border border-white/10 rounded-[32px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/50 text-xs font-mono uppercase text-neutral-400">
              <th className="p-5 pl-8">ID</th>
              <th className="p-5">Vehicle</th>
              <th className="p-5">Reminder Type</th>
              <th className="p-5 pr-8 text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {reminders.map((r: any) => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="p-5 pl-8 font-mono text-xs text-neutral-400">#REM-{r.id}</td>
                <td className="p-5 font-medium">{r.vehicle}</td>
                <td className="p-5 text-neutral-300">{r.reminderType}</td>
                <td className="p-5 pr-8 text-right font-mono text-[#cbf000]">{r.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}