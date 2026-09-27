"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminServiceCentersPage() {
  const { isLightMode } = useTheme();
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Create Center Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00 AM");
  const [closingTime, setClosingTime] = useState("08:00 PM");

  // Edit Center Modal States
  const [editingCenter, setEditingCenter] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editOpeningTime, setEditOpeningTime] = useState("");
  const [editClosingTime, setEditClosingTime] = useState("");

  useEffect(() => {
    fetchCenters();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/service-centers", "GET").catch(() => []);
      setCenters(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      console.error("Failed to fetch service centers from backend:", err);
      setErrorMsg(err.message || "Backend database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/service-centers", "POST", { 
        name, 
        description, 
        address, 
        city, 
        state, 
        pincode, 
        email, 
        phone, 
        openingTime, 
        closingTime 
      });
      setShowCreateModal(false);
      // Reset Form
      setName(""); setDescription(""); setAddress(""); setCity(""); setState(""); setPincode(""); setEmail(""); setPhone(""); setOpeningTime("09:00 AM"); setClosingTime("08:00 PM");
      showToast("Service center created successfully in database!");
      fetchCenters();
    } catch (err: any) {
      alert("Failed to create service center: " + (err.message || "Unknown error"));
    }
  };

  const handleUpdateCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCenter) return;
    try {
      await apiRequest(`/service-centers/${editingCenter.id}`, "PATCH", {
        name: editName,
        description: editDescription,
        address: editAddress,
        city: editCity,
        state: editState,
        pincode: editPincode,
        email: editEmail,
        phone: editPhone,
        openingTime: editOpeningTime,
        closingTime: editClosingTime,
      });
      setEditingCenter(null);
      showToast("Service center updated successfully!");
      fetchCenters();
    } catch (err: any) {
      alert("Failed to update service center: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteCenter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service center from database?")) return;
    try {
      await apiRequest(`/service-centers/${id}`, "DELETE");
      showToast("Service center deleted successfully!");
      fetchCenters();
    } catch (err: any) {
      alert("Failed to delete service center: " + (err.message || "Unknown error"));
    }
  };

  const openEditModal = (center: any) => {
    setEditingCenter(center);
    setEditName(center.name || "");
    setEditDescription(center.description || "");
    setEditAddress(center.address || "");
    setEditCity(center.city || "");
    setEditState(center.state || "");
    setEditPincode(center.pincode || "");
    setEditEmail(center.email || "");
    setEditPhone(center.phone || "");
    setEditOpeningTime(center.openingTime || "");
    setEditClosingTime(center.closingTime || "");
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl bg-[#cbf000] text-black font-mono text-xs font-bold uppercase shadow-2xl animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      <header className={`pb-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          
          <h1 className={`text-2xl md:text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Service Centers Database</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreateModal(true)} className={`px-4 py-2.5 rounded-xl text-xs uppercase font-mono font-bold tracking-wider transition-all cursor-pointer shadow-sm ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
            + Add Center
          </button>
          <button onClick={fetchCenters} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono tracking-wider transition-all cursor-pointer ${isLightMode ? "border-gray-200 bg-gray-50 hover:border-emerald-600 text-gray-800" : "border-white/20 bg-[#141418] hover:border-[#cbf000] text-white"}`}>
            🔄 Refresh
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          ⚠️ Error: {errorMsg}
        </div>
      )}

      {/* Service Centers Table */}
      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-100" : "border-white/10"}`}>
          <h4 className={`text-sm font-mono uppercase tracking-widest ${isLightMode ? "text-gray-600" : "text-neutral-400"}`}>Active Database Records</h4>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">{centers.length} Centers Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
            <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-100 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Center Name</th>
                <th className="p-4">Location / City</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Timings</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">Loading service centers from database...</td>
                </tr>
              ) : centers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">No service centers found.</td>
                </tr>
              ) : (
                centers.map((center) => (
                  <tr key={center.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                    <td className="p-4 text-neutral-400">#{center.id.slice(-6)}</td>
                    <td className={`p-4 font-bold ${isLightMode ? "text-gray-900" : "text-white"}`}>{center.name}</td>
                    <td className="p-4 text-neutral-400">{center.city ? `${center.city}, ${center.state}` : center.address || "N/A"}</td>
                    <td className="p-4 text-neutral-400">
                      <div>{center.phone || "N/A"}</div>
                      <div className="text-[10px] text-emerald-600 lowercase">{center.email}</div>
                    </td>
                    <td className="p-4 text-neutral-400">{center.openingTime} - {center.closingTime}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => openEditModal(center)} className="text-blue-400 hover:text-blue-300 cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteCenter(center.id)} className="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Service Center Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl p-8 rounded-[32px] border shadow-2xl max-h-[90vh] overflow-y-auto ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">🛠️ Add New Service Center</h3>
              <button onClick={() => setShowCreateModal(false)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleCreateCenter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Center Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="AutoCare Hub" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="center@autocare.com" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Authorized service center description..." rows={2} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Street Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Andheri East" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Maharashtra" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Pincode</label>
                  <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="400001" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Phone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Opening Time</label>
                  <input type="text" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} placeholder="09:00 AM" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Closing Time</label>
                  <input type="text" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} placeholder="08:00 PM" required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Save Service Center →
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Center Modal */}
      {editingCenter && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl p-8 rounded-[32px] border shadow-2xl max-h-[90vh] overflow-y-auto ${isLightMode ? "bg-white border-gray-200 text-gray-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-600">✏️ Edit Service Center</h3>
              <button onClick={() => setEditingCenter(null)} className={`text-xs uppercase font-mono px-3 py-1 rounded-lg border cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>Close</button>
            </div>

            <form onSubmit={handleUpdateCenter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Center Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Email Address</label>
                  <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Description</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Street Address</label>
                  <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>City</label>
                  <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>State</label>
                  <input type="text" value={editState} onChange={(e) => setEditState(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Pincode</label>
                  <input type="text" value={editPincode} onChange={(e) => setEditPincode(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Phone</label>
                  <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Opening Time</label>
                  <input type="text" value={editOpeningTime} onChange={(e) => setEditOpeningTime(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1 ${isLightMode ? "text-gray-500" : "text-neutral-400"}`}>Closing Time</label>
                  <input type="text" value={editClosingTime} onChange={(e) => setEditClosingTime(e.target.value)} required className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0b0b0e] border-white/10 text-white"}`} />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className={`flex-1 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer ${isLightMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#cbf000] text-black hover:opacity-90"}`}>
                  Save Changes →
                </button>
                <button type="button" onClick={() => setEditingCenter(null)} className={`px-6 py-3.5 rounded-2xl border text-xs font-mono uppercase cursor-pointer ${isLightMode ? "border-gray-200 hover:bg-gray-50" : "border-white/20 hover:bg-white/5"}`}>
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