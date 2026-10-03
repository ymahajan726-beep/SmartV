"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerBookingsPage() {
  const { isLightMode } = useTheme();
  const searchParams = useSearchParams();
  const prefilledVehicleId = searchParams.get("vehicleId");

  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [serviceCenters, setServiceCenters] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]); // 👈 Center-wise services state
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Form States
  const [vehicleId, setVehicleId] = useState("");
  const [serviceCenterId, setServiceCenterId] = useState("");
  const [serviceId, setServiceId] = useState(""); // 👈 Selected Service ID
  const [estimatedAmount, setEstimatedAmount] = useState<number | null>(null); // 👈 Dynamic Price
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (prefilledVehicleId && vehicles.length > 0) {
      setVehicleId(prefilledVehicleId);
      setShowModal(true);
    }
  }, [prefilledVehicleId, vehicles]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bData, vData, cData] = await Promise.all([
        apiRequest("/customer/bookings", "GET").catch(() => []),
        apiRequest("/vehicles", "GET").catch(() => []),
        apiRequest("/service-centers", "GET").catch(() => []),
      ]);
      setBookings(Array.isArray(bData) ? bData : []);
      setVehicles(Array.isArray(vData) ? vData : []);
      setServiceCenters(Array.isArray(cData) ? cData : []);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load bookings telemetry.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Service Center change hone par us center ki services fetch karna
  const handleCenterChange = async (centerId: string) => {
    setServiceCenterId(centerId);
    setServiceId("");
    setEstimatedAmount(null);
    setAvailableServices([]);

    if (!centerId) return;

    try {
      const data = await apiRequest(`/services?serviceCenterId=${centerId}`, "GET");
      setAvailableServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setAvailableServices([]);
    }
  };

  // ✅ Service select hone par price automatically update karna
  const handleServiceChange = (sId: string) => {
    setServiceId(sId);
    const selectedSvc = availableServices.find((s) => s.id === sId);
    if (selectedSvc) {
      setEstimatedAmount(Number(selectedSvc.price));
    } else {
      setEstimatedAmount(null);
    }
  };

  const resetForm = () => {
    setVehicleId("");
    setServiceCenterId("");
    setServiceId("");
    setEstimatedAmount(null);
    setAvailableServices([]);
    setBookingDate("");
    setBookingTime("");
    setNotes("");
    setEditingBookingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = async (booking: any) => {
    setEditingBookingId(booking.id);
    setVehicleId(booking.vehicleId || "");
    setServiceCenterId(booking.serviceCenterId || "");
    setServiceId(booking.serviceId || "");
    setEstimatedAmount(booking.estimatedAmount ? Number(booking.estimatedAmount) : null);
    setBookingDate(booking.bookingDate ? booking.bookingDate.split("T")[0] : "");
    setBookingTime(booking.bookingTime || "");
    setNotes(booking.notes || "");

    // Agar center pehle se selected hai toh uski services load karein
    if (booking.serviceCenterId) {
      try {
        const data = await apiRequest(`/services?serviceCenterId=${booking.serviceCenterId}`, "GET");
        setAvailableServices(Array.isArray(data) ? data : []);
      } catch (err) {
        setAvailableServices([]);
      }
    }

    setShowModal(true);
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        vehicleId,
        serviceCenterId: serviceCenterId || null,
        serviceId: serviceId || null,
        estimatedAmount: estimatedAmount !== null ? Number(estimatedAmount) : null,
        bookingDate,
        bookingTime: bookingTime || "10:00 AM",
        notes,
      };

      if (editingBookingId) {
        await apiRequest(`/customer/bookings/${editingBookingId}`, "PATCH", payload);
        triggerToast("Booking rescheduled successfully!", "success");
      } else {
        await apiRequest("/customer/bookings", "POST", payload);
        triggerToast("Service successfully booked in your vault!", "success");
      }

      setShowModal(false);
      resetForm();
      window.history.replaceState({}, "", window.location.pathname);
      fetchData();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to save booking.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this booking record?");
    if (!confirmed) return;

    try {
      setSubmitting(true);
      await apiRequest(`/customer/bookings/${bookingId}`, "DELETE");
      triggerToast("Booking deleted successfully.", "success");
      fetchData();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to delete booking.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">🔵 BOOKED</span>;
      case "IN_PROGRESS":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">🟡 IN PROGRESS</span>;
      case "QUALITY_CHECK":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">🟣 QUALITY CHECK</span>;
      case "READY_FOR_DELIVERY":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">🟢 READY FOR DELIVERY</span>;
      case "COMPLETED":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✅ COMPLETED</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">🔴 CANCELLED</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">{status}</span>;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`p-8 md:p-12 space-y-8 font-sans max-w-7xl mx-auto relative ${isLightMode ? "text-slate-900" : "text-white"}`}>
      
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-xs font-mono border flex items-center gap-3 ${toastType === "success" ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400" : "bg-red-500 text-white font-bold border-red-400"}`}>
          <span>{toastType === "success" ? "⚡" : "⚠"}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">[ SERVICE VAULT ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">My Service Bookings</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3.5 rounded-2xl bg-[#00F0FF] text-slate-950 font-bold uppercase text-xs font-mono tracking-wider cursor-pointer shadow-lg hover:opacity-90"
        >
          + Book New Service
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-neutral-400">Loading bookings telemetry...</div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] border border-dashed border-neutral-600 font-mono text-xs text-neutral-400">
          No active service bookings found. Click "+ Book New Service" to schedule one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          {bookings.map((b) => (
            <div key={b.id} className={`p-6 rounded-[28px] border shadow-md space-y-4 flex flex-col justify-between ${isLightMode ? "bg-white border-slate-200" : "bg-[#141418] border-white/10 text-white"}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#00F0FF] font-bold uppercase">{b.bookingNumber}</span>
                    <h3 className="text-base font-bold uppercase mt-0.5">{b.vehicle?.make} {b.vehicle?.model}</h3>
                  </div>
                  <div>{renderStatusBadge(b.status)}</div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-neutral-300">
                  <div>Vehicle No: <strong className="text-white">{b.vehicle?.registrationNumber}</strong></div>
                  <div>Service Package: <strong className="text-cyan-400">{b.service?.name || "General Inspection"}</strong></div>
                  <div>Scheduled Date: <strong className="text-white">{new Date(b.bookingDate).toLocaleDateString()} ({b.bookingTime || "10:00 AM"})</strong></div>
                  <div>Service Center: <strong className="text-white">{b.serviceCenter?.name || "Main Garage"}</strong></div>
                  {b.estimatedAmount && <div>Estimated Cost: <strong className="text-emerald-400">₹{b.estimatedAmount}</strong></div>}
                  {b.notes && <div className="text-neutral-400 text-[10px] italic">Note: {b.notes}</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => openEditModal(b)}
                  disabled={submitting}
                  className="py-2 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold uppercase text-[10px] cursor-pointer disabled:opacity-50"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteBooking(b.id)}
                  disabled={submitting}
                  className="py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold uppercase text-[10px] cursor-pointer disabled:opacity-50"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal (Create / Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white text-slate-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF] mb-6">
              {editingBookingId ? "Edit Service Booking" : "Schedule Garage Service"}
            </h3>
            
            <form onSubmit={handleSaveBooking} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Select Your Vehicle</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">-- Choose Registered Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Center Selection Dropdown */}
              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Select Service Center</label>
                <select
                  value={serviceCenterId}
                  onChange={(e) => handleCenterChange(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">-- Choose Workshop / Center --</option>
                  {serviceCenters.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name} - {center.location}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Service Package Dropdown */}
              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Select Service Package</label>
                <select
                  value={serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  required
                  disabled={!serviceCenterId}
                  className={`w-full px-4 py-3 rounded-2xl border outline-none disabled:opacity-50 ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                >
                  <option value="">-- Choose Service Package --</option>
                  {availableServices.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name} - ₹{svc.price} ({svc.duration || "Standard"})
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Dynamic Cost Calculation Display */}
              {estimatedAmount !== null && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex justify-between items-center text-cyan-400 font-bold">
                  <span>Estimated Service Cost:</span>
                  <span className="text-sm">₹{estimatedAmount}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-neutral-400 mb-1">Booking Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-neutral-400 mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="e.g. 11:15 AM"
                    required
                    className={`w-full px-4 py-3 rounded-2xl border outline-none ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Service Notes / Issues</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe any specific problem..."
                  rows={2}
                  className={`w-full px-4 py-3 rounded-2xl border outline-none resize-none ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="flex-1 py-3.5 rounded-2xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Processing..." : editingBookingId ? "Update Booking" : "Confirm Booking"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3.5 rounded-2xl border border-white/20 text-neutral-300 uppercase cursor-pointer"
                >
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