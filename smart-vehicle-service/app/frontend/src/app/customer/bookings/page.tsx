'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/src/context/ThemeContext';

interface Vehicle {
  id: number;
  modelName: string;
  vehicleNumber: string;
  fuelType?: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  estimatedAmount: number;
  createdAt: string;
  vehicle?: Vehicle;
}

export default function CustomerBookingsPage() {
  const { isLightMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');

  const API_BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    setMounted(true);
    let userId = localStorage.getItem("user-id");
    if (!userId) {
      userId = "cust-" + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("user-id", userId);
    }
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem("user-id") || "default-user";

      // 1. Fetch Customer Bookings
      const bookingsRes = await fetch(`${API_BASE_URL}/customer/bookings`, {
        headers: { 'user-id': userId },
      });
      const bookingsData = await bookingsRes.json();
      if (bookingsRes.ok && Array.isArray(bookingsData)) {
        setBookings(bookingsData);
      }

      // 2. Fetch Customer Vehicles from the same session
      const vehiclesRes = await fetch(`${API_BASE_URL}/customer/vehicles`, {
        headers: { 'user-id': userId },
      });
      const vehiclesData = await vehiclesRes.json();
      if (vehiclesRes.ok && Array.isArray(vehiclesData)) {
        setVehicles(vehiclesData);
      }
    } catch (err) {
      setError('Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("user-id") || "default-user";
      const response = await fetch(`${API_BASE_URL}/customer/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
        },
        body: JSON.stringify({
          vehicleId: Number(selectedVehicle),
          serviceId: selectedService || '1',
          serviceCenterId: selectedCenter || '1',
          bookingDate: bookingDate,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Booking successfully created!');
        fetchInitialData();
        setSelectedVehicle('');
        setSelectedService('');
        setSelectedCenter('');
        setBookingDate('');
      } else {
        alert(result.message || 'Failed to create booking.');
      }
    } catch (err) {
      alert('An error occurred while creating booking.');
    }
  };

  if (!mounted) return null;

  return (
    <div className={`w-full transition-colors duration-300 ${isLightMode ? "text-slate-900" : "text-[#f8fafc]"}`}>
      
      {/* Top Navbar with Theme Toggle */}
      <header className={`h-20 px-8 border-b flex justify-between items-center sticky top-0 z-30 backdrop-blur-xl ${isLightMode ? "bg-white/90 border-slate-200 shadow-sm" : "bg-[#060608]/90 border-white/[0.06]"}`}>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping"></span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Service Bay Control</span>
        </div>

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
      </header>

      {/* Main Body */}
      <main className="p-8 md:p-12 space-y-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-light tracking-tight">My Service Bookings</h1>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-mono font-bold">
            {error}
          </div>
        )}

        {/* Booking Form Section */}
        <div className={`p-8 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
          <h2 className={`text-lg font-bold mb-6 uppercase tracking-wider text-xs font-mono ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Book a New Service</h2>
          <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            
            <div>
              <label className={`block uppercase tracking-widest mb-2 font-bold ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>Select Vehicle</label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                required
                className={`w-full p-3.5 rounded-2xl border outline-none transition ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-[#161622] border-white/10 text-white focus:border-[#00F0FF]"}`}
              >
                <option value="">-- Choose Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.modelName} ({v.vehicleNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block uppercase tracking-widest mb-2 font-bold ${isLightMode ? "text-slate-600" : "text-slate-400"}`}>Booking Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className={`w-full p-3.5 rounded-2xl border outline-none transition ${isLightMode ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500" : "bg-[#161622] border-white/10 text-white focus:border-[#00F0FF]"}`}
              />
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider transition shadow-lg cursor-pointer ${isLightMode ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20" : "bg-[#00F0FF] text-slate-950 hover:opacity-90 shadow-[#00F0FF]/20"}`}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>

        {/* Bookings List Section */}
        <div className={`p-8 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-slate-200" : "bg-[#0d0d14] border-white/[0.06]"}`}>
          <h2 className={`text-lg font-bold mb-6 uppercase tracking-wider text-xs font-mono ${isLightMode ? "text-cyan-700" : "text-[#00F0FF]"}`}>Booking History</h2>
          {loading ? (
            <p className="text-slate-500 font-mono text-xs animate-pulse font-bold">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className={`p-8 text-center border border-dashed rounded-2xl font-mono text-xs font-bold ${isLightMode ? "border-slate-300 text-slate-500" : "border-white/10 text-slate-500"}`}>
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b uppercase tracking-widest text-[10px] ${isLightMode ? "border-slate-200 text-slate-600 bg-slate-50" : "border-white/10 text-slate-400 bg-transparent"}`}>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLightMode ? "divide-slate-200 text-slate-800" : "divide-white/[0.06] text-slate-300"}`}>
                  {bookings.map((b) => (
                    <tr key={b.id} className={`transition ${isLightMode ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"}`}>
                      <td className={`p-4 font-bold ${isLightMode ? "text-cyan-600" : "text-[#00F0FF]"}`}>{b.bookingNumber}</td>
                      <td className="p-4">
                        {b.vehicle ? `${b.vehicle.modelName} (${b.vehicle.vehicleNumber})` : 'N/A'}
                      </td>
                      <td className="p-4 font-bold">₹{b.estimatedAmount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          b.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          b.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}