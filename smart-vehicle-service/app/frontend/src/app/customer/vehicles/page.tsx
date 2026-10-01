"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/src/context/ThemeContext";
import {useRouter} from "next/navigation";
type Vehicle = {
  id: string;
  customerId?: string;
  registrationNumber: string;
  make: string;
  model: string;
  variant?: string | null;
  year: number;
  fuelType: string;
  currentMileage: number;
  color: string;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ToastType = "success" | "error";

const API_BASE_URL = "http://localhost:4000/api";

export default function CustomerVehiclesPage() {
  const { isLightMode, toggleTheme } = useTheme();
 const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState("");
  const [fuelType, setFuelType] = useState("PETROL");
  const [currentMileage, setCurrentMileage] = useState("");
  const [color, setColor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const getToken = (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }
    return (
      localStorage.getItem("customer_token") ||
      localStorage.getItem("token")
    );
  };

  const authenticatedRequest = async (
    endpoint: string,
    method: string = "GET",
    body?: unknown,
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Customer authentication token not found. Please login again.",
      );
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const text = await response.text();
    let data: any = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      let message =
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}.`;
      if (Array.isArray(message)) {
        message = message.join(", ");
      }
      throw new Error(message);
    }

    return data;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    fetchVehicles();
  }, [mounted]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = getToken();
      if (!token) {
        setVehicles([]);
        setErrorMsg("Customer session not found. Please login again.");
        return;
      }

      const data = await authenticatedRequest("/vehicles", "GET");
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Fetch customer vehicles error:", err);
      setVehicles([]);
      const message = err?.message || "Failed to load your vehicles.";
      setErrorMsg(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetVehicleForm = () => {
    setRegistrationNumber("");
    setMake("");
    setModel("");
    setVariant("");
    setYear("");
    setFuelType("PETROL");
    setCurrentMileage("");
    setColor("");
    setImageUrl("");
    setEditingVehicleId(null);
  };

  const openAddVehicleModal = () => {
    resetVehicleForm();
    setShowVehicleModal(true);
  };

  const openEditVehicleModal = (vehicle: Vehicle) => {
    setEditingVehicleId(vehicle.id);
    setRegistrationNumber(vehicle.registrationNumber || "");
    setMake(vehicle.make || "");
    setModel(vehicle.model || "");
    setVariant(vehicle.variant || "");
    setYear(vehicle.year ? String(vehicle.year) : "");
    setFuelType(vehicle.fuelType || "PETROL");
    setCurrentMileage(
      vehicle.currentMileage !== undefined && vehicle.currentMileage !== null
        ? String(vehicle.currentMileage)
        : "",
    );
    setColor(vehicle.color || "");
    setImageUrl(vehicle.imageUrl || "");
    setShowVehicleModal(true);
  };

  const closeVehicleModal = () => {
    if (submitting) return;
    setShowVehicleModal(false);
    resetVehicleForm();
  };

  const validateVehicleForm = (): boolean => {
    if (!registrationNumber.trim()) {
      showToast("Registration number is required.", "error");
      return false;
    }
    if (!make.trim()) {
      showToast("Vehicle make is required.", "error");
      return false;
    }
    if (!model.trim()) {
      showToast("Vehicle model is required.", "error");
      return false;
    }
    if (!year || Number(year) < 1900) {
      showToast("Please enter a valid manufacturing year.", "error");
      return false;
    }
    if (!currentMileage || Number(currentMileage) < 0) {
      showToast("Please enter a valid current mileage.", "error");
      return false;
    }
    if (!color.trim()) {
      showToast("Vehicle color is required.", "error");
      return false;
    }
    return true;
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVehicleForm()) return;

    try {
      setSubmitting(true);
      const token = getToken();
      if (!token) {
        showToast("Customer session not found. Please login again.", "error");
        return;
      }

      const payload = {
        registrationNumber: registrationNumber.trim().toUpperCase(),
        make: make.trim(),
        model: model.trim(),
        variant: variant.trim() || null,
        year: Number(year),
        fuelType: fuelType.trim().toUpperCase(),
        currentMileage: Number(currentMileage),
        color: color.trim(),
        imageUrl: imageUrl.trim() !== "" ? imageUrl : null,
      };

      if (editingVehicleId) {
        await authenticatedRequest(`/vehicles/${editingVehicleId}`, "PATCH", payload);
        setShowVehicleModal(false);
        resetVehicleForm();
        showToast("Vehicle updated successfully.", "success");
        await fetchVehicles();
        return;
      }

      await authenticatedRequest("/vehicles", "POST", payload);
      setShowVehicleModal(false);
      resetVehicleForm();
      showToast("Vehicle successfully added to your Digital Garage!", "success");
      await fetchVehicles();
    } catch (err: any) {
      console.error("Save customer vehicle error:", err);
      showToast(err?.message || "Failed to save vehicle.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to remove this vehicle asset?");
    if (!confirmed) return;

    try {
      setSubmitting(true);
      const token = getToken();
      if (!token) {
        showToast("Customer session not found. Please login again.", "error");
        return;
      }

      await authenticatedRequest(`/vehicles/${id}`, "DELETE");
      showToast("Vehicle removed successfully.", "success");
      await fetchVehicles();
    } catch (err: any) {
      console.error("Delete customer vehicle error:", err);
      showToast(err?.message || "Failed to remove vehicle.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`w-full transition-colors duration-300 ${isLightMode ? "text-slate-900" : "text-[#f8fafc]"}`}>
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-3.5 rounded-2xl shadow-2xl text-xs font-mono border backdrop-blur-md max-w-md ${toast.type === "success" ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/30 font-bold" : "bg-red-500/10 text-red-600 border-red-500/30"}`}>
          {toast.type === "success" ? "⚡" : "⚠️"} {toast.message}
        </div>
      )}

      {/* Unified Header */}
      <div className={`w-full px-8 py-4 border-b flex justify-between items-center ${isLightMode ? "bg-white border-slate-200 text-slate-500" : "bg-[#060608] border-white/[0.06] text-slate-400"}`}>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping"></span>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Isolated Customer Vault</span>
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

      <main className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-300/60">
          <div>
            <span className={`text-xs font-mono uppercase tracking-widest font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>
              [ ISOLATED CUSTOMER VAULT ]
            </span>
            <h1 className={`text-3xl md:text-4xl font-light tracking-tight mt-1 ${isLightMode ? "text-slate-900" : "text-white"}`}>
              My Registered Vehicles
            </h1>
            <p className={`text-xs font-mono mt-1 ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>
              Your personal fleet assets secured with protected routing.
            </p>
          </div>

          <button
            onClick={openAddVehicleModal}
            className={`px-7 py-3.5 rounded-2xl font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
              isLightMode
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                : "bg-[#00F0FF] text-slate-950 hover:opacity-90 shadow-[#00F0FF]/20"
            }`}
          >
            + Add New Vehicle
          </button>
        </div>

        {errorMsg && !loading && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-mono font-bold">
            ⚠️️ {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse font-bold">
            Verifying credentials & fetching customer assets...
          </div>
        ) : vehicles.length === 0 ? (
          <div className={`p-16 rounded-[36px] border text-center space-y-4 shadow-sm ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
            <span className="text-4xl">🚗</span>
            <h3 className={`text-xl font-light tracking-tight ${isLightMode ? "text-slate-900" : "text-white"}`}>
              Your Garage is Empty
            </h3>
            <p className={`text-xs font-mono ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>
              No vehicle records found for your account session.
            </p>
            <button
              onClick={openAddVehicleModal}
              className={`px-6 py-3 rounded-xl font-mono text-xs uppercase font-bold mt-2 ${isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950"}`}
            >
              + Register Vehicle Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`p-7 rounded-[32px] border space-y-6 shadow-md transition-all relative group overflow-hidden ${
                  isLightMode
                    ? "bg-white border-slate-200 hover:border-cyan-500"
                    : "bg-[#0d0d14] border-white/[0.06] hover:border-[#00F0FF]/50"
                }`}
              >
                {v.imageUrl && v.imageUrl.trim() !== "" && (
                  <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/10 relative bg-black/40">
                    <img
                      src={v.imageUrl}
                      alt={`${v.make} ${v.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className={`text-[10px] uppercase font-bold ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>
                      Verified Asset
                    </span>
                    <h3 className={`text-lg font-bold uppercase mt-0.5 ${isLightMode ? "text-slate-900" : "text-white"}`}>
                      {v.make} {v.model}
                    </h3>
                    {v.variant && (
                      <p className="text-[10px] text-slate-500 mt-1 uppercase">
                        {v.variant}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap ${isLightMode ? "bg-slate-100 border-slate-300 text-slate-800" : "bg-white/5 border-white/10 text-slate-300"}`}>
                    {v.registrationNumber}
                  </span>
                </div>

                <div className={`grid grid-cols-2 gap-4 py-4 border-y text-xs ${isLightMode ? "border-slate-200 text-slate-600" : "border-white/[0.06] text-slate-400"}`}>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Mileage</span>
                    <strong className={`text-sm ${isLightMode ? "text-slate-900" : "text-white"}`}>
                      {v.currentMileage ?? 0} KM
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Fuel Type</span>
                    <strong className={`text-sm uppercase ${isLightMode ? "text-slate-900" : "text-white"}`}>
                      {v.fuelType || "-"}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Year</span>
                    <strong className={`text-sm ${isLightMode ? "text-slate-900" : "text-white"}`}>
                      {v.year || "-"}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Color</span>
                    <strong className={`text-sm uppercase ${isLightMode ? "text-slate-900" : "text-white"}`}>
                      {v.color || "-"}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <Link
                  href={`/customer/bookings?vehicleId=${v.id}`}
                    className={`py-3 rounded-xl font-bold uppercase text-[10px] text-center transition-all shadow-sm ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-[#00F0FF] text-slate-950 hover:opacity-90"}`}
                  >
                    Book Service
                  </Link>

                  <button
                    onClick={() => openEditVehicleModal(v)}
                    disabled={submitting}
                    className={`py-3 rounded-xl border text-[10px] uppercase transition-all font-bold disabled:opacity-50 ${isLightMode ? "border-cyan-200 text-cyan-700 hover:bg-cyan-50" : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"}`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    disabled={submitting}
                    className={`py-3 rounded-xl border text-[10px] uppercase transition-all font-bold disabled:opacity-50 ${isLightMode ? "border-red-200 text-red-600 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-[40px] p-8 md:p-10 relative shadow-2xl border max-h-[90vh] overflow-y-auto ${isLightMode ? "bg-white border-slate-300 text-slate-900" : "bg-[#0d0d14] border-[#00F0FF]/40 text-white"}`}>
            <button
              type="button"
              onClick={closeVehicleModal}
              disabled={submitting}
              className="absolute top-6 right-6 text-slate-400 hover:text-red-500 text-xs font-mono uppercase tracking-widest bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 cursor-pointer disabled:opacity-50"
            >
              [CLOSE]
            </button>

            <div className="mb-6 pt-2 font-mono">
              <span className={`text-[10px] uppercase font-bold tracking-widest ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>
                Garage Security
              </span>
              <h3 className="text-2xl font-light tracking-tight mt-1">
                {editingVehicleId ? "Update Vehicle" : "Register New Vehicle"}
              </h3>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-5 font-mono text-xs">
              <div>
                <label className="block uppercase text-slate-500 mb-2 font-bold">Registration Number</label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. MH15AB1234"
                  className={`w-full px-5 py-3.5 rounded-2xl border outline-none uppercase font-bold tracking-wider ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-slate-500 mb-2 font-bold">Vehicle Make</label>
                <input
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Tata"
                  className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-slate-500 mb-2 font-bold">Vehicle Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Nexon"
                  className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-slate-500 mb-2 font-bold">Variant</label>
                  <input
                    type="text"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    placeholder="e.g. XZ Plus"
                    className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  />
                </div>

                <div>
                  <label className="block uppercase text-slate-500 mb-2 font-bold">Manufacturing Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                    required
                  />
                </div>
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
                    value={currentMileage}
                    onChange={(e) => setCurrentMileage(e.target.value)}
                    placeholder="e.g. 15200"
                    min="0"
                    className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-slate-500 mb-2 font-bold">Vehicle Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. White"
                  className={`w-full px-5 py-3.5 rounded-2xl border outline-none font-bold ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-black/80 border-white/20 text-white focus:border-[#00F0FF]"}`}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block uppercase text-slate-500 font-bold">Vehicle Photo (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase cursor-pointer transition-all ${isLightMode ? "border-slate-300 bg-slate-100 hover:border-cyan-500 text-slate-800" : "border-white/20 bg-white/5 hover:border-[#00F0FF] text-white"}`}>
                    <span>📸</span> Open Camera
                    <input type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
                  </label>

                  <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase cursor-pointer transition-all ${isLightMode ? "border-slate-300 bg-slate-100 hover:border-cyan-500 text-slate-800" : "border-white/20 bg-white/5 hover:border-[#00F0FF] text-white"}`}>
                    <span>🖼️</span> Choose Gallery
                    <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {imageUrl && (
                <div className="w-full h-32 rounded-2xl overflow-hidden border border-cyan-500/40 relative group">
                  <img src={imageUrl} alt="Vehicle Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl cursor-pointer mt-4 ${submitting ? "opacity-60 cursor-not-allowed" : ""} ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-[#00F0FF] text-slate-950 hover:opacity-90 shadow-[#00F0FF]/20"}`}
              >
                {submitting ? (editingVehicleId ? "Updating Asset..." : "Securing Asset...") : (editingVehicleId ? "Update Vehicle →" : "Save Vehicle to Vault →")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}