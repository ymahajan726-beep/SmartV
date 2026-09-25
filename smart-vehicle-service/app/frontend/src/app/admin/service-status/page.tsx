"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export default function AdminServiceStatusPage() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    apiRequest("/service-status").then(setStatuses).catch(() => {
      setStatuses([{ id: 1, vehicle: "Hyundai Creta", currentStage: "Diagnostics in progress", bay: "Bay 02" }]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] p-8 md:p-12 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase">[ Backend Module: Service Status ]</span>
          <h1 className="text-3xl font-light mt-1">Live Bay Service Status Tracker</h1>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-mono uppercase text-[#cbf000] hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="bg-[#141418] border border-white/10 rounded-[32px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/50 text-xs font-mono uppercase text-neutral-400">
              <th className="p-5 pl-8">Vehicle</th>
              <th className="p-5">Current Stage</th>
              <th className="p-5 pr-8 text-right">Bay Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {statuses.map((st: any) => (
              <tr key={st.id} className="hover:bg-white/5">
                <td className="p-5 pl-8 font-medium">{st.vehicle}</td>
                <td className="p-5 font-mono text-[#cbf000]">{st.currentStage}</td>
                <td className="p-5 pr-8 text-right text-neutral-300">{st.bay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}