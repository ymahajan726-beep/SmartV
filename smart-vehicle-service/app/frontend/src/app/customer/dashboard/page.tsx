"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerDashboardPage() {
  const { isLightMode, toggleTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [customer, setCustomer] = useState({ name: "Guest User", id: "0000", isGuest: true });

  // Data States
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchCustomerTelemetryAndProfile();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCustomerTelemetryAndProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // Parallel fetching of user profile and real backend database records
      const [profileData, vData, iData, rData, sData] = await Promise.all([
        apiRequest("/auth/me", "GET").catch(() => ({ name: "Guest User", isGuest: true })),
        apiRequest("/vehicles", "GET").catch(() => []),
        apiRequest("/invoices", "GET").catch(() => []),
        apiRequest("/maintenance-reminders", "GET").catch(() => []),
        apiRequest("/service-status", "GET").catch(() => []),
      ]);

      if (profileData) {
        setCustomer({
          name: profileData.name || (profileData.isGuest ? "Guest User" : "Valued Customer"),
          id: profileData.id || "8092",
          isGuest: profileData.isGuest ?? false,
        });
      }

      setVehicles(Array.isArray(vData) ? vData : []);
      setInvoices(Array.isArray(iData) ? iData : []);
      setReminders(Array.isArray(rData) ? rData : []);
      setStatuses(Array.isArray(sData) ? sData : []);
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to synchronize garage telemetry.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const activeServiceItem = statuses.length > 0 ? statuses[0] : null;
  const pendingInvoices = invoices.filter(inv => !inv.isPaid);
  const totalPendingAmount = pendingInvoices.reduce((acc, inv) => acc + (Number(inv.amount) || 0), 0);
  const nextReminder = reminders.length > 0 ? reminders[0] : null;

  return (
    <div className={`w-full transition-colors duration-300 ${isLightMode ? "text-slate-900" : "text-[#f8fafc]"}`}>
      
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-2xl text-xs font-mono border backdrop-blur-md ${toast.type === "success" ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/30 font-bold" : "bg-red-500/10 text-red-600 border-red-500/30"}`}>
          {toast.type === "success" ? "⚡" : "⚠️"} {toast.message}
        </div>
      )}

      {/* Top Navbar */}
      <header className={`h-20 px-8 border-b flex justify-between items-center sticky top-0 z-30 backdrop-blur-xl ${isLightMode ? "bg-white/90 border-slate-200 shadow-sm" : "bg-[#060608]/90 border-white/[0.06]"}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Live Garage Telemetry Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`group relative px-4 py-2 rounded-2xl border text-xs font-mono tracking-wider flex items-center gap-3 transition-all duration-300 cursor-pointer shadow-md ${
              isLightMode 
                ? "border-slate-300 bg-gradient-to-r from-slate-100 to-white text-slate-800 hover:border-cyan-500 shadow-slate-200/60" 
                : "border-white/10 bg-gradient-to-r from-[#12121c] to-[#1a1a26] text-slate-200 hover:border-[#00F0FF]/50 shadow-black/50"
            }`}
            title="Switch Cockpit Theme"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <span className={`transition-transform duration-500 ${isLightMode ? "rotate-0 scale-100" : "-rotate-90 scale-75 opacity-40"}`}>☀️</span>
              <span className="text-[10px] text-slate-400 font-normal">/</span>
              <span className={`transition-transform duration-500 ${!isLightMode ? "rotate-0 scale-100" : "rotate-90 scale-75 opacity-40"}`}>🌙</span>
            </span>
            <span className={`h-3 w-[1px] ${isLightMode ? "bg-slate-300" : "bg-white/20"}`}></span>
            <span className={`text-[10px] font-bold uppercase ${isLightMode ? "text-slate-900" : "text-[#00F0FF]"}`}>
              {isLightMode ? "Light Deck" : "Cyber Dark"}
            </span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-300">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-bold flex items-center justify-center font-mono text-sm shadow-md">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left font-mono">
              <div className="text-xs font-bold text-slate-900">{customer.name}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{customer.isGuest ? "Guest Visitor" : "Verified Owner"}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto w-full">
        
        {/* Hero Welcome Section */}
        <div className={`relative overflow-hidden p-8 md:p-12 rounded-[36px] border shadow-xl ${isLightMode ? "bg-gradient-to-br from-white via-slate-50 to-cyan-50/40 border-slate-200/80" : "bg-gradient-to-r from-[#111118] via-[#161622] to-[#0d0d14] border-white/[0.08]"}`}>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className={`text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border inline-block font-bold ${isLightMode ? "bg-cyan-500/10 text-cyan-700 border-cyan-500/30" : "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/20"}`}>
              ⚡ DIGITAL COCKPIT V2.6
            </span>
            <h1 className={`text-3xl sm:text-5xl font-light tracking-tight ${isLightMode ? "text-slate-900" : "text-white"}`}>
              Good Afternoon, <span className={`font-bold ${isLightMode ? "text-cyan-600" : "text-[#00F0FF]"}`}>{customer.name}</span>
            </h1>
            <p className={`text-xs sm:text-sm font-mono leading-relaxed ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>
              Your luxury garage, live service bays, and automated maintenance records — streamlined in real-time.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/customer/bookings" className={`px-7 py-3.5 rounded-2xl font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20" : "bg-[#00F0FF] text-slate-950 hover:opacity-90 shadow-[#00F0FF]/20"}`}>
                + Book New Service
              </Link>
              <Link href="/customer/vehicles" className={`px-7 py-3.5 rounded-2xl border text-xs font-mono uppercase tracking-wider transition-all font-semibold ${isLightMode ? "border-slate-300 hover:bg-slate-100 text-slate-800" : "border-white/20 hover:bg-white/5 text-white"}`}>
                Explore Garage →
              </Link>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-mono font-bold">
            ⚠️ Database Sync Error: {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse font-bold">
            Loading garage telemetry from servers...
          </div>
        ) : (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
              <div className={`p-6 rounded-[28px] border shadow-md relative overflow-hidden ${isLightMode ? "bg-white border-slate-200" : "bg-[#12121a] border-white/[0.06]"}`}>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">My Garage</span>
                <div className={`text-3xl font-light ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>{vehicles.length} <span className="text-xs text-slate-500">Assets</span></div>
              </div>

              <div className={`p-6 rounded-[28px] border shadow-md relative overflow-hidden ${isLightMode ? "bg-white border-slate-200" : "bg-[#12121a] border-white/[0.06]"}`}>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Active Service</span>
                <div className={`text-sm font-bold uppercase mt-1 ${isLightMode ? "text-slate-900" : "text-white"}`}>{activeServiceItem ? activeServiceItem.status : "No Active Service"}</div>
              </div>

              <div className={`p-6 rounded-[28px] border shadow-md relative overflow-hidden ${isLightMode ? "bg-white border-slate-200" : "bg-[#12121a] border-white/[0.06]"}`}>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Next Service Due</span>
                <div className={`text-sm font-bold mt-1 ${isLightMode ? "text-slate-900" : "text-white"}`}>{nextReminder ? new Date(nextReminder.reminderDate).toLocaleDateString() : "All Up To Date"}</div>
              </div>

              <div className={`p-6 rounded-[28px] border shadow-md relative overflow-hidden ${isLightMode ? "bg-white border-slate-200" : "bg-[#12121a] border-white/[0.06]"}`}>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Pending Payment</span>
                <div className="text-2xl font-bold text-amber-600 mt-0.5">{totalPendingAmount > 0 ? `₹${totalPendingAmount}` : "No Dues"}</div>
              </div>
            </div>

            {/* My Garage Vehicles Section */}
            <div className={`p-8 md:p-10 rounded-[36px] border shadow-sm ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Garage Collection</span>
                  <h3 className={`text-2xl font-light tracking-tight mt-1 ${isLightMode ? "text-slate-900 font-normal" : "text-white"}`}>Your Registered Vehicles</h3>
                </div>
                <Link href="/customer/vehicles" className={`text-xs font-mono uppercase hover:underline font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Manage Garage →</Link>
              </div>

              {vehicles.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 font-mono text-xs text-slate-500 font-bold">
                  YOUR GARAGE IS EMPTY. Add your first vehicle to start tracking telemetry.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((v) => (
                    <div key={v.id} className={`p-6 rounded-[28px] border font-mono text-xs space-y-4 shadow-md transition-all ${isLightMode ? "bg-slate-50 border-slate-200 hover:border-cyan-500" : "bg-[#161622] border-white/[0.06] hover:border-[#00F0FF]/50"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[10px] uppercase font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Verified Asset</span>
                          <h4 className={`text-base font-bold uppercase mt-0.5 ${isLightMode ? "text-slate-900" : "text-white"}`}>{v.modelName || "Vehicle Model"}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-lg border font-bold ${isLightMode ? "bg-white border-slate-200 text-slate-800 shadow-xs" : "bg-white/5 border-white/10 text-slate-300"}`}>{v.vehicleNumber || "MH-04"}</span>
                      </div>
                      <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${isLightMode ? "text-slate-600 border-slate-200" : "text-slate-400 border-white/[0.06]"}`}>
                        <div>Mileage: <strong className={isLightMode ? "text-slate-900 font-bold" : "text-white"}>{v.mileage || 32000} KM</strong></div>
                        <div>Fuel: <strong className={`uppercase ${isLightMode ? "text-slate-900 font-bold" : "text-white"}`}>{v.fuelType || "Petrol"}</strong></div>
                      </div>
                      <div className="pt-2 flex gap-3">
                        <Link href="/customer/vehicles" className={`px-4 py-3 rounded-xl border uppercase transition-all font-semibold ${isLightMode ? "border-slate-300 text-slate-800 hover:bg-slate-200" : "border-white/20 text-white hover:bg-white/5"}`}>View</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Service Status Card */}
            {activeServiceItem ? (
              <div className={`p-8 md:p-10 rounded-[36px] border shadow-sm ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Active Bay Telemetry</span>
                <h3 className={`text-2xl font-light tracking-tight mt-1 mb-6 ${isLightMode ? "text-slate-900" : "text-white"}`}>Live Service Progress</h3>
                
                <div className={`p-6 rounded-2xl border font-mono text-xs space-y-4 shadow-xs ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#161622] border-white/[0.06]"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Booking Reference: #{activeServiceItem.bookingId ? activeServiceItem.bookingId.slice(-6) : "N/A"}</span>
                    <span className={`px-4 py-1.5 rounded-full border font-bold uppercase tracking-wider ${isLightMode ? "bg-cyan-50 text-cyan-700 border-cyan-300 shadow-xs" : "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30"}`}>{activeServiceItem.status}</span>
                  </div>
                  <div className={`flex items-center gap-2 pt-3 border-t ${isLightMode ? "text-slate-700 border-slate-200 font-semibold" : "text-slate-300 border-white/[0.06]"}`}>
                    <span>✓ Booked</span> → <span>✓ Received</span> → <span className={`font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>● {activeServiceItem.status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-10 rounded-[36px] border text-center space-y-4 shadow-sm ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Active Status</span>
                <h3 className={`text-xl font-light tracking-tight ${isLightMode ? "text-slate-900 font-normal" : "text-white"}`}>No Active Service Running</h3>
                <p className={`text-xs font-mono ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>All your vehicles are currently in pristine condition.</p>
                <div>
                  <Link href="/customer/bookings" className={`inline-block px-8 py-3.5 rounded-2xl font-mono text-xs uppercase shadow-md font-bold mt-2 ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-[#00F0FF] text-slate-950 shadow-[#00F0FF]/20"}`}>Schedule Service Now →</Link>
                </div>
              </div>
            )}

            {/* Reminders & Recent History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Reminders */}
              <div className={`p-8 rounded-[36px] border shadow-sm ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Maintenance</span>
                <h3 className={`text-xl font-light tracking-tight mt-1 mb-6 ${isLightMode ? "text-slate-900" : "text-white"}`}>Scheduled Reminders</h3>
                {reminders.length === 0 ? (
                  <p className={`text-xs font-mono ${isLightMode ? "text-slate-500 font-semibold" : "text-slate-400"}`}>You're all caught up! No reminders due.</p>
                ) : (
                  <div className="space-y-4">
                    {reminders.map((rem) => (
                      <div key={rem.id} className={`p-5 rounded-2xl border font-mono text-xs flex justify-between items-center shadow-xs ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#161622] border-white/[0.06]"}`}>
                        <div>
                          <div className={`font-bold uppercase ${isLightMode ? "text-slate-900" : "text-white"}`}>{rem.notes || "Periodic Maintenance"}</div>
                          <div className="text-[10px] text-slate-500 mt-1 font-bold">Target Mileage: {rem.dueMileage || 5000} KM</div>
                        </div>
                        <span className={`font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>{new Date(rem.reminderDate).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Service History */}
              <div className={`p-8 rounded-[36px] border shadow-sm ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Logs</span>
                <h3 className={`text-xl font-light tracking-tight mt-1 mb-6 ${isLightMode ? "text-slate-900" : "text-white"}`}>Recent Service History</h3>
                {invoices.length === 0 ? (
                  <p className={`text-xs font-mono ${isLightMode ? "text-slate-500 font-semibold" : "text-slate-400"}`}>No service history records found.</p>
                ) : (
                  <div className="space-y-4">
                    {invoices.slice(0, 3).map((inv) => (
                      <div key={inv.id} className={`p-5 rounded-2xl border font-mono text-xs flex justify-between items-center shadow-xs ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#161622] border-white/[0.06]"}`}>
                        <div>
                          <div className={`font-bold uppercase ${isLightMode ? "text-slate-900" : "text-white"}`}>Invoice #{inv.id.slice(-6)}</div>
                          <div className="text-[10px] text-emerald-600 mt-1 font-bold">Quality Checked & Settled</div>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold text-sm ${isLightMode ? "text-slate-900" : "text-white"}`}>₹{inv.amount || 0}</span>
                          <div className={`text-[10px] font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>PAID</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </main>
    </div>
  );
}