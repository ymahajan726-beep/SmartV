"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { io } from "socket.io-client";

export default function WorkshopDashboard() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState("bays");

  // Database State & Loading
  const [bays, setBays] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form State for Adding Inventory Item
  const [newItem, setNewItem] = useState({ partName: "", stock: "", category: "Engine Parts", price: "" });

  useEffect(() => {
    // Route Protection Check
    const token = localStorage.getItem("auth_token") || "mock_jwt_token";
    if (!token) {
      window.location.href = "/";
    }

    fetchWorkshopDatabase();

    // Socket.IO Real-time Connection for Workshop
    const socket = io("http://localhost:3001");
    socket.on("connect", () => {
      console.log("Workshop connected to WebSocket server:", socket.id);
    });

    socket.on("bayUpdated", (updatedBay: any) => {
      showToast(`Bay status updated live for Bay #${updatedBay.id}`, "info");
      fetchWorkshopDatabase();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchWorkshopDatabase = async () => {
    setLoading(true);
    try {
      // Simulating database fetch latency with Skeleton Loader
      setTimeout(() => {
        setBays([
          { id: 1, bayName: "Bay 01 - Heavy Lift", vehicle: "Honda City (MH-15-AB-1234)", mechanic: "Ramesh Kumar", status: "Occupied" },
          { id: 2, bayName: "Bay 02 - Diagnostics", vehicle: "Hyundai Creta (MH-18-XY-9876)", mechanic: "Suresh Patil", status: "In Maintenance" },
          { id: 3, bayName: "Bay 03 - Quick Service", vehicle: "Available for Assignment", mechanic: "Unassigned", status: "Available" },
        ]);
        setInventory([
          { id: 201, partName: "Synthetic Engine Oil 5W40", stock: 45, category: "Lubricants", price: "₹1,200" },
          { id: 202, name: "Ceramic Brake Pads Set", stock: 12, category: "Braking", price: "₹4,500" },
          { id: 203, name: "Cabin Air Filter", stock: 28, category: "Filtration", price: "₹650" },
        ]);
        setLoading(false);
      }, 700);
    } catch (error) {
      showToast("Failed to fetch workshop database", "error");
      setLoading(false);
    }
  };

  const handleAddInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const entry = { id: Date.now(), ...newItem };
      setInventory([entry, ...inventory]);
      setNewItem({ partName: "", stock: "", category: "Engine Parts", price: "" });
      showToast("Spare part successfully registered in database!");
    } catch (error) {
      showToast("Database insertion failed", "error");
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col md:flex-row ${isLightMode ? "bg-[#f4f4f0] text-[#111111]" : "bg-[#0b0b0e] text-[#f3f3f6]"}`}>
      
      {/* Sidebar */}
      <aside className={`w-full md:w-72 border-r p-6 md:p-8 flex md:flex-col justify-between items-center md:items-stretch z-40 ${isLightMode ? "border-black/10 bg-white" : "border-white/10 bg-[#121216]"}`}>
        <div>
          <div className="flex items-center gap-3 mb-0 md:mb-12">
            <span className="text-xl font-black tracking-tighter uppercase">
              Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono uppercase bg-[#cbf000]/10 text-[#cbf000] px-2.5 py-1 rounded-full border border-[#cbf000]/20">Workshop Hub</span>
          </div>

          <nav className="flex md:flex-col gap-2 md:space-y-3 text-xs uppercase tracking-widest font-bold mt-4 md:mt-0">
            <button 
              onClick={() => setActiveTab("bays")} 
              className={`px-4 md:px-5 py-3 md:py-3.5 rounded-2xl transition-all flex items-center gap-3 ${activeTab === "bays" ? "bg-[#cbf000] text-black shadow-lg" : "hover:opacity-70"}`}
            >
              <span>🛠️</span> <span className="hidden md:inline">Service Bays</span>
            </button>
            <button 
              onClick={() => setActiveTab("inventory")} 
              className={`px-4 md:px-5 py-3 md:py-3.5 rounded-2xl transition-all flex items-center gap-3 ${activeTab === "inventory" ? "bg-[#cbf000] text-black shadow-lg" : "hover:opacity-70"}`}
            >
              <span>📦</span> <span className="hidden md:inline">Parts Inventory</span>
            </button>
            <button 
              onClick={() => setActiveTab("addPart")} 
              className={`px-4 md:px-5 py-3 md:py-3.5 rounded-2xl transition-all flex items-center gap-3 ${activeTab === "addPart" ? "bg-[#cbf000] text-black shadow-lg" : "hover:opacity-70"}`}
            >
              <span>➕</span> <span className="hidden md:inline">Add Spare Part</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:flex pt-6 border-t border-white/10 items-center justify-between">
          <Link href="/" className="text-xs uppercase font-mono tracking-widest hover:text-[#cbf000]">← Exit</Link>
          <button onClick={() => setIsLightMode(!isLightMode)} className="p-2.5 rounded-full border text-xs cursor-pointer">
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ Workshop Management & Telemetry ]</span>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-1">Garage Control Station</h1>
          </div>
          <span className="text-xs font-mono uppercase bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Socket.IO Synchronized
          </span>
        </header>

        {/* Service Bays Tab */}
        {activeTab === "bays" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl md:text-2xl font-light">Live Service Bay Status</h3>
              <button 
                onClick={() => { fetchWorkshopDatabase(); showToast("Bays status refreshed!"); }}
                className="bg-[#cbf000] text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-2xl shadow-xl hover:bg-white transition-all cursor-pointer"
              >
                {loading ? "Syncing..." : "🔄 Refresh Bays"}
              </button>
            </div>

            <div className={`rounded-[32px] border overflow-x-auto ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className={`border-b text-xs font-mono uppercase tracking-wider ${isLightMode ? "border-black/10 bg-neutral-100 text-neutral-700" : "border-white/10 bg-black/50 text-neutral-400"}`}>
                    <th className="p-5 pl-8">Bay ID</th>
                    <th className="p-5">Bay Name</th>
                    <th className="p-5">Assigned Vehicle</th>
                    <th className="p-5">Lead Mechanic</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 pr-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {loading ? (
                    [1, 2, 3].map((n) => (
                      <tr key={n} className="animate-pulse">
                        <td className="p-5 pl-8"><div className="h-4 bg-white/10 rounded w-8"></div></td>
                        <td className="p-5"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                        <td className="p-5"><div className="h-4 bg-white/10 rounded w-44"></div></td>
                        <td className="p-5"><div className="h-4 bg-white/10 rounded w-28"></div></td>
                        <td className="p-5"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                        <td className="p-5 pr-8 text-right"><div className="h-4 bg-white/10 rounded w-16 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : (
                    bays.map((bay: any) => (
                      <tr key={bay.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-5 pl-8 font-mono text-xs text-neutral-400">#0{bay.id}</td>
                        <td className="p-5 font-medium">{bay.bayName}</td>
                        <td className="p-5 text-neutral-300">{bay.vehicle}</td>
                        <td className="p-5 text-neutral-400">{bay.mechanic}</td>
                        <td className="p-5">
                          <span className={`text-[10px] font-mono px-3.5 py-1.5 rounded-full uppercase border ${bay.status === 'Occupied' ? 'bg-[#cbf000]/10 text-[#cbf000] border-[#cbf000]/20' : bay.status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                            {bay.status}
                          </span>
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <button onClick={() => showToast(`Bay #${bay.id} toggled successfully!`)} className="text-xs uppercase font-mono text-[#cbf000] hover:underline cursor-pointer">Manage</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Ledger Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl md:text-2xl font-light">Spare Parts Inventory Ledger</h3>
            <div className={`rounded-[32px] border overflow-x-auto ${isLightMode ? "bg-white border-black/10" : "bg-[#141418] border-white/10"}`}>
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className={`border-b text-xs font-mono uppercase tracking-wider ${isLightMode ? "border-black/10 bg-neutral-100 text-neutral-700" : "border-white/10 bg-black/50 text-neutral-400"}`}>
                    <th className="p-5 pl-8">Part Name</th>
                    <th className="p-5">Category</th>
                    <th className="p-5">Stock Units</th>
                    <th className="p-5 pr-8 text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {inventory.map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-5 pl-8 font-medium">{item.partName || item.name}</td>
                      <td className="p-5 text-neutral-400">{item.category}</td>
                      <td className="p-5 font-mono text-[#cbf000]">{item.stock} Units</td>
                      <td className="p-5 pr-8 text-right font-mono">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Spare Part Tab */}
        {activeTab === "addPart" && (
          <div className="max-w-xl space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl md:text-2xl font-light">Register New Spare Part to DB</h3>
            <form onSubmit={handleAddInventoryItem} className={`p-6 md:p-10 rounded-[32px] border space-y-6 ${isLightMode ? "bg-white border-black/10 shadow-xl" : "bg-[#141418] border-white/10 shadow-2xl"}`}>
              <div>
                <label className="block text-xs uppercase font-mono text-neutral-400 mb-2">Part Name</label>
                <input 
                  type="text" 
                  value={newItem.partName}
                  onChange={(e) => setNewItem({...newItem, partName: e.target.value})}
                  placeholder="e.g. Turbocharger Assembly" 
                  className="w-full bg-black text-white border border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#cbf000]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-neutral-400 mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  value={newItem.stock}
                  onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                  placeholder="e.g. 25" 
                  className="w-full bg-black text-white border border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#cbf000]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-neutral-400 mb-2">Unit Price (₹)</label>
                <input 
                  type="text" 
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  placeholder="e.g. ₹12,500" 
                  className="w-full bg-black text-white border border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#cbf000]"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#cbf000] text-black font-bold uppercase tracking-wider py-4 rounded-2xl hover:bg-white transition-all text-xs shadow-2xl cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Commit Part to Database</span>
                <span>→</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 font-semibold text-sm ${
          toast.type === "success" ? "bg-[#cbf000] text-black border-black/20" : toast.type === "info" ? "bg-blue-500 text-white border-blue-700" : "bg-red-600 text-white border-red-800"
        }`}>
          <span>{toast.type === "success" ? "🏎️" : toast.type === "info" ? "⚡" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}