"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerDashboardPage() {
  const { isLightMode, toggleTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [customer, setCustomer] = useState({ name: "Valued Customer", id: "", isGuest: false });
  const [greeting, setGreeting] = useState("Good Afternoon");

  // Data States
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile Completion Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Time-based dynamic greeting logic
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

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

      const [profileData, vData, iData, rData, sData] = await Promise.all([
        apiRequest("/customer/users/profile", "GET").catch(() => null),
        apiRequest("/vehicles", "GET").catch(() => []),
        apiRequest("/invoices", "GET").catch(() => []),
        apiRequest("/maintenance-reminders", "GET").catch(() => []),
        apiRequest("/service-status", "GET").catch(() => []),
      ]);

      if (profileData) {
        const isAdmin = profileData.role === "ADMIN" || profileData.role === "admin";
        
        const nameLower = (profileData.name || "").toLowerCase();
        if (
          !profileData.name || 
          nameLower.includes("development") || 
          nameLower.includes("dev.customer") || 
          profileData.name === "Valued Customer"
        ) {
          setShowProfileModal(true);
          // Baaki fields explicitly empty rakhi gayi hain taaki user khud enter kare
          setProfileName("");
          setProfileEmail("");
          setProfileAddress("");
        } else {
          setProfileName(profileData.name || "");
          setProfileEmail(profileData.email && !profileData.email.includes("autocare.local") ? profileData.email : "");
          setProfileAddress(profileData.address || "");
        }

        // Sirf mobile number auto-fill hoga jo OTP se verified hai
        setProfilePhone(profileData.phone || "");

        const fetchedName = profileData.name && !nameLower.includes("development") && !nameLower.includes("dev.customer") && profileData.name !== "Valued Customer"
          ? profileData.name 
          : "Valued Customer";

        setCustomer({
          name: isAdmin ? "Super Admin" : fetchedName,
          id: profileData.id || "",
          isGuest: false,
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/customer/users/profile", "PATCH", {
        name: profileName,
        email: profileEmail,
        address: profileAddress,
        phone: profilePhone,
      });

      setCustomer((prev) => ({ ...prev, name: profileName }));
      setShowProfileModal(false);
      showToast("Profile completed successfully!", "success");
      fetchCustomerTelemetryAndProfile();
    } catch (err: any) {
      showToast("Failed to update profile: " + err.message, "error");
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
          {toast.type === "success" ? "⚡" : "⚠"} {toast.message}
        </div>
      )}

      {/* Profile Completion Mandatory Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl relative ${isLightMode ? "bg-white border-slate-200 text-slate-900" : "bg-[#141418] border-white/10 text-white"}`}>
            
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer p-2"
              title="Close Modal"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500 font-bold">Onboarding Required</span>
            <h3 className="text-xl font-light tracking-tight mt-1 mb-2">Complete Your Profile</h3>
            <p className="text-xs font-mono text-neutral-400 mb-6">Please enter your real name, email, and address. Verified mobile number is auto-linked.</p>
            
            <form onSubmit={handleSaveProfile} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  required
                  className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="e.g. rajesh@gmail.com"
                  required
                  className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Mobile Number (Verified)</label>
                <input
                  type="text"
                  value={profilePhone}
                  readOnly
                  disabled
                  className={`w-full px-4 py-3 rounded-2xl border outline-none opacity-85 cursor-not-allowed ${isLightMode ? "bg-slate-200 border-slate-300 text-slate-700" : "bg-white/5 border-white/10 text-cyan-400 font-bold"}`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Service Address</label>
                <textarea
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="Enter your complete address..."
                  required
                  rows={3}
                  className={`w-full px-4 py-3 rounded-2xl border outline-none resize-none ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 transition-all shadow-lg"
              >
                Save & Enter Garage →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Unified Header */}
      <div className={`w-full px-8 py-4 border-b flex justify-between items-center ${isLightMode ? "bg-white border-slate-200 text-slate-500" : "bg-[#060608] border-white/[0.06] text-slate-400"}`}>
        <div className="flex items-center gap-2.5">
           <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping"></span>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Secure Garage Vault</span>
        </div>

        <div className="flex items-center">
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
        </div>
      </div>

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
              {greeting}, <span className={`font-bold ${isLightMode ? "text-cyan-600" : "text-[#00F0FF]"}`}>{customer.name}</span>
            </h1>
            <p className={`text-xs sm:text-sm font-mono leading-relaxed ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>
              Your luxury garage, live service bays, and automated maintenance records — streamlined in real-time.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/customer/bookings" className={`px-7 py-3.5 rounded-2xl font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20" : "bg-[#00F0FF] text-slate-950 hover:opacity-90 shadow-[#00F0FF]/20"}`}>
                + Book New Service
              </Link>
              <button onClick={() => setShowProfileModal(true)} className={`px-7 py-3.5 rounded-2xl border text-xs font-mono uppercase tracking-wider transition-all font-semibold ${isLightMode ? "border-cyan-600 text-cyan-700 hover:bg-cyan-50" : "border-[#00F0FF] text-[#00F0FF] hover:bg-white/5"}`}>
                ✏️ Update Profile & Name
              </button>
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
                          <h4 className={`text-base font-bold uppercase mt-0.5 ${isLightMode ? "text-slate-900" : "text-white"}`}>{v.modelName || v.model || "Vehicle Model"}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-lg border font-bold ${isLightMode ? "bg-white border-slate-200 text-slate-800 shadow-xs" : "bg-white/5 border-white/10 text-slate-300"}`}>{v.vehicleNumber || v.registrationNumber || "MH-04"}</span>
                      </div>
                      <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${isLightMode ? "text-slate-600 border-slate-200" : "text-slate-400 border-white/[0.06]"}`}>
                        <div>Mileage: <strong className={isLightMode ? "text-slate-900 font-bold" : "text-white"}>{v.mileage || v.currentMileage || 32000} KM</strong></div>
                        <div>Fuel: <strong className={`uppercase ${isLightMode ? "text-slate-900 font-bold" : "text-white"}`}>{v.fuelType || "Petrol"}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}