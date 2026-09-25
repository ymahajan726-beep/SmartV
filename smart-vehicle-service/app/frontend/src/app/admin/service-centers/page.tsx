"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export default function AdminServiceCentersPage() {
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    apiRequest("/service-centers").then(setCenters).catch(() => {
      setCenters([{ id: 1, name: "Apex Auto Care Bay 1", location: "Mumbai Central", bays: 4 }]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] p-8 md:p-12 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase">[ Backend Module: Service Centers ]</span>
          <h1 className="text-3xl font-light mt-1">Workshop & Bay Centers</h1>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-mono uppercase text-[#cbf000] hover:underline">← Back to Dashboard</Link>
      </div>
      <div className="bg-[#141418] border border-white/10 rounded-[32px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/50 text-xs font-mono uppercase text-neutral-400">
              <th className="p-5 pl-8">Center Name</th>
              <th className="p-5">Location</th>
              <th className="p-5 pr-8 text-right">Active Bays</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {centers.map((c: any) => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="p-5 pl-8 font-medium">{c.name}</td>
                <td className="p-5 text-neutral-400">{c.location}</td>
                <td className="p-5 pr-8 text-right font-mono text-[#cbf000]">{c.bays} Bays</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}