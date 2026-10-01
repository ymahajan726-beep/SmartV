"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerTrackingPage() {
  const { isLightMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchTrackingData();
  }, []);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/service-status", "GET");
      setTrackingData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tracking data", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const steps = ["BOOKED", "IN_PROGRESS", "QUALITY_CHECK", "READY_FOR_DELIVERY", "COMPLETED"];

  return (
    <div className={`p-8 md:p-12 space-y-8 font-sans ${isLightMode ? "text-slate-900" : "text-[#f8fafc]"}`}>
      <header className="border-b pb-6 border-inherit">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-500 font-bold">📡 Real-Time Telemetry</span>
        <h1 className="text-3xl font-light tracking-tight mt-1">Live Service Status Tracking</h1>
      </header>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse">Syncing live bay telemetry...</div>
      ) : trackingData.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed font-mono text-xs text-neutral-400">
          No active service bays found for your vehicles currently.
        </div>
      ) : (
        <div className="space-y-6">
          {trackingData.map((item) => {
            const currentStepIndex = steps.indexOf(item.status || "BOOKED");
            return (
              <div key={item.id} className={`p-8 rounded-[32px] border shadow-xl space-y-6 ${isLightMode ? "bg-white border-slate-200" : "bg-[#141418] border-white/10"}`}>
                <div className="flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[10px] text-cyan-500 font-bold uppercase">Active Job Card</span>
                    <h3 className="text-lg font-bold uppercase mt-0.5">{item.vehicle?.modelName || item.vehicleModel || "Vehicle Service"}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                    STATUS: {item.status || "BOOKED"}
                  </span>
                </div>

                {/* Visual Progress Timeline */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-inherit font-mono text-[10px] uppercase">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    return (
                      <div key={step} className={`p-3 rounded-2xl border text-center transition-all ${isCompleted ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold shadow-md" : "opacity-40 border-neutral-700"}`}>
                        <div className="mb-1">{isCompleted ? "✓" : "○"}</div>
                        {step.replace(/_/g, " ")}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}