"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerVehiclesPage() {
  const { isLightMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Add Vehicle Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modelName, setModelName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fuelType, setFuelType] = useState("PETROL");
  const [mileage, setMileage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    let userId = localStorage.getItem("user-id");
    if (!userId) {
      userId = "cust-" + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("user-id", userId);
    }
    fetchVehicles();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const userId = localStorage.getItem("user-id") || "default-user";
      
      const response = await fetch("http://localhost:4000/api/customer/vehicles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate or fetch vehicle assets.");
      }

      const data = await response.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load garage vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const userId = localStorage.getItem("user-id") || "default-user";

      const response = await fetch("http://localhost:4000/api/customer/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          modelName,
          vehicleNumber: vehicleNumber.toUpperCase(),
          fuelType,
          mileage: Number(mileage) || 0,
          imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Server rejected vehicle registration.");
      }

      setShowAddModal(false);
      setModelName("");
      setVehicleNumber("");
      setMileage("");
      setImageUrl("");
      showToast("Vehicle successfully added to your Digital Garage!");
      fetchVehicles();
    } catch (err: any) {
      showToast("Failed to add vehicle: " + (err.message || "Server error"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vehicle asset?")) return;
    try {
      const userId = localStorage.getItem("user-id") || "default-user";
      
      const response = await fetch(`http://localhost:4000/api/customer/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          "user-id": userId,
        },
      });

      if (!response.ok) {
        throw new Error("Unauthorized or failed to delete.");
      }

      showToast("Vehicle removed successfully.");
      fetchVehicles();
    } catch (err: any) {
      showToast("Failed to remove vehicle asset.", "error");
    }
  };

  if (!mounted) return null;

  return (
    <div className={`w-full transition-colors duration-300 ${isLightMode ? "text-slate-900" : "text-[#f8fafc]"}`}>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-2xl text-xs font-mono border backdrop-blur-md ${toast.type === "success" ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/30 font-bold" : "bg-red-500/10 text-red-600 border-red-500/30"}`}>
          {toast.type === "success" ? "⚡" : "⚠️"} {toast.message}
        </div>
      )}

      {/* Top Navbar */}
      <header className={`h-20 px-8 border-b flex justify-between items-center sticky top-0 z-30 backdrop-blur-xl ${isLightMode ? "bg-white/90 border-slate-200 shadow-sm" : "bg-[#060608]/90 border-white/[0.06]"}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Secure Garage Vault</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`group relative px-4 py-2 rounded-2xl border text-xs font-mono tracking-wider flex items-center gap-3 transition-all duration-300 cursor-pointer shadow-md ${
              isLightMode 
                ? "border-slate-300 bg-gradient-to-r from-slate-100 to-white text-slate-800 hover:border-cyan-500 shadow-slate-200/60" 
                : "border-white/10 bg-gradient-to-r from-[#12121c] to-[#1a1a26] text-slate-200 hover:border-[#00F0FF]/50 shadow-black/50"
            }`}
            title="Switch Theme"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <span className={`transition-transform duration-500 ${isLightMode ? "rotate-0 scale-100" : "-rotate-90 scale-75 opacity-40"}`}>☀️</span>
              <span className="text-[10px] text-slate-400 font-normal">/</span>
              <span className={`transition-transform duration-500 ${!isLightMode ? "rotate-0 scale-100" : "rotate-90 scale-75 opacity-40"}`}>🌙</span>
            </span>
            <span className={`h-3 w-[1px] ${isLightMode ? "bg-slate-300" : "bg-white/20"}`}></span>
            <span className={`text-[10px] font-bold uppercase ${isLightMode ? "text-slate-900" : "text-[#00F0FF]"}`}>
              {isLightMode ? "Light" : "Cyber"}
            </span>
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-300/60">
          <div>
            <span className={`text-xs font-mono uppercase tracking-widest font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>[ ISOLATED CUSTOMER VAULT ]</span>
            <h1 className={`text-3xl md:text-4xl font-light tracking-tight mt-1 ${isLightMode ? "text-slate-900" : "text-white"}`}>My Registered Vehicles</h1>
            <p className={`text-xs font-mono mt-1 ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>Your personal fleet assets secured with protected routing.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className={`px-7 py-3.5 rounded-2xl font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg cursor-pointer ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20" : "bg-[#00F0FF] text-slate-950 hover:opacity-90 shadow-[#00F0FF]/20"}`}
          >
            + Add New Vehicle
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-mono font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse font-bold">
            Verifying credentials & fetching customer assets...
          </div>
        ) : vehicles.length === 0 ? (
          <div className={`p-16 rounded-[36px] border text-center space-y-4 shadow-sm ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
            <span className="text-4xl">🚗</span>
            <h3 className={`text-xl font-light tracking-tight ${isLightMode ? "text-slate-900" : "text-white"}`}>Your Garage is Empty</h3>
            <p className={`text-xs font-mono ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>No vehicle records found for your account session.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className={`px-6 py-3 rounded-xl font-mono text-xs uppercase font-bold mt-2 ${isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950"}`}
            >
              + Register Vehicle Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {vehicles.map((v) => (
              <div key={v.id} className={`p-7 rounded-[32px] border space-y-6 shadow-md transition-all relative group overflow-hidden ${isLightMode ? "bg-white border-slate-200 hover:border-cyan-500" : "bg-[#0d0d14] border-white/[0.06] hover:border-[#00F0FF]/50"}`}>
                
                {v.imageUrl && v.imageUrl.trim() !== "" && (
                  <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/10 relative bg-black/40">
                    <img 
                      src={v.imageUrl} 
                      alt={v.modelName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] uppercase font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Verified Asset</span>
                    <h3 className={`text-lg font-bold uppercase mt-0.5 ${isLightMode ? "text-slate-900" : "text-white"}`}>{v.modelName || "Vehicle Model"}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${isLightMode ? "bg-slate-100 border-slate-300 text-slate-800" : "bg-white/5 border-white/10 text-slate-300"}`}>
                    {v.vehicleNumber || "MH-04"}
                  </span>
                </div>

                <div className={`grid grid-cols-2 gap-4 py-4 border-y text-xs ${isLightMode ? "border-slate-200 text-slate-600" : "border-white/[0.06] text-slate-400"}`}>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Mileage</span>
                    <strong className={`text-sm ${isLightMode ? "text-slate-900" : "text-white"}`}>{v.mileage || 0} KM</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Fuel Type</span>
                    <strong className={`text-sm uppercase ${isLightMode ? "text-slate-900" : "text-white"}`}>{v.fuelType || "Petrol"}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link 
                    href="/customer/bookings" 
                    className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs text-center transition-all shadow-sm ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-[#00F0FF] text-slate-950 hover:opacity-90"}`}
                  >
                    Book Service
                  </Link>
                  <button 
                    onClick={() => handleDeleteVehicle(v.id)}
                    className={`px-4 py-3 rounded-xl border text-xs uppercase transition-all font-bold ${isLightMode ? "border-red-200 text-red-600 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}
                    title="Remove Vehicle"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-[40px] p-8 md:p-10 relative shadow-2xl border max-h-[90vh] overflow-y-auto ${isLightMode ? "bg-white border-slate-300 text-slate-900" : "bg-[#0d0d14] border-[#00F0FF]/40 text-white"}`}>
            
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-red-500 text-xs font-mono uppercase tracking-widest bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 cursor-pointer"
            >
              [CLOSE]
            </button>

            <div className="mb-6 pt-2 font-mono">
              <span className={`text-[10px] uppercase font-bold tracking-widest ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Garage Security</span>
              <h3 className="text-2xl font-light tracking-tight mt-1">Register New Vehicle</h3>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-5 font-mono text-xs">
              <div>
                <label className="block uppercase text-slate-500 mb-2 font-bold">Vehicle Model Name</label>
                <input 
                  type="text" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Tata Nexon EV" 
                  className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-slate-500 mb-2 font-bold">Registration / Vehicle Number</label>
                <input 
                  type="text" 
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. MH15AB1234" 
                  className={`w-full px-5 py-3.5 rounded-2xl border outline-none uppercase font-bold tracking-wider ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-slate-500 mb-2 font-bold">Fuel Type</label>
                  <select 
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-2xl border outline-none font-bold uppercase ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-slate-500 mb-2 font-bold">Current Mileage (KM)</label>
                  <input 
                    type="number" 
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="e.g. 15200" 
                    className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block uppercase text-slate-500 font-bold">Vehicle Photo (Optional)</label>
                
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase cursor-pointer transition-all ${isLightMode ? "border-slate-300 bg-slate-100 hover:border-cyan-500 text-slate-800" : "border-white/20 bg-white/5 hover:border-[#00F0FF] text-white"}`}>
                    <span>📸</span> Open Camera
                    <input 
                      type="file" 
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                  </label>

                  <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase cursor-pointer transition-all ${isLightMode ? "border-slate-300 bg-slate-100 hover:border-cyan-500 text-slate-800" : "border-white/20 bg-white/5 hover:border-[#00F0FF] text-white"}`}>
                    <span>🖼️</span> Choose Gallery
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {imageUrl && (
                <div className="w-full h-32 rounded-2xl overflow-hidden border border-cyan-500/40 relative group">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl cursor-pointer mt-4 ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-[#00F0FF] text-slate-950 hover:opacity-90 shadow-[#00F0FF]/20"}`}
              >
                {submitting ? "Securing Asset..." : "Save Vehicle to Vault →"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}