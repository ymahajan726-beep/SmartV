"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<number | null>(0);
  
  // Login states & Notification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [carMoving, setCarMoving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const reviews = [
    {
      name: "Rajesh Sharma",
      role: "Fleet Supervisor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote: "The automated status alerts and one-click invoice approval streamlined our fleet maintenance turnaround time by 40%.",
      rating: "5.0",
    },
    {
      name: "Amit Deshmukh",
      role: "Car Owner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      quote: "Zero hidden charges. Transparent spare-parts tracking and complete digital service logs right on the phone.",
      rating: "4.9",
    },
    {
      name: "Sneha Patel",
      role: "Workshop Partner",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      quote: "Assigning technicians to bays and updating inventory in real time has completely organized our daily operations.",
      rating: "5.0",
    },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "test@domain.com" || email.includes("@")) {
      setCarMoving(true);
      setTimeout(() => {
        setNotification("Login successful! Redirecting to Customer Dashboard...");
        setShowCustomerModal(false);
        setCarMoving(false);
        setTimeout(() => setNotification(null), 3000);
      }, 1200);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden ${isLightMode ? "bg-[#f2f2ef] text-[#111111]" : "bg-[#08080a] text-[#f3f3f6]"}`}>
      
      {/* Top Professional Commercial Navbar */}
      <nav className={`w-full px-8 md:px-16 py-6 flex justify-between items-center border-b sticky top-0 backdrop-blur-2xl z-50 ${isLightMode ? "border-black/15 bg-[#f2f2ef]/95 text-black" : "border-white/10 bg-[#08080a]/95 text-white"}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tighter uppercase">
            Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
          </span>
        </div>

        {/* Center Links */}
        <div className={`hidden lg:flex items-center gap-10 text-xs uppercase tracking-widest font-semibold ${isLightMode ? "text-neutral-800" : "text-neutral-300"}`}>
          <div 
            className="relative py-2 cursor-pointer"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <span className="hover:text-[#a8cc00] transition-colors flex items-center gap-1.5">
              Services <span className="text-[10px]">▼</span>
            </span>

            {servicesDropdownOpen && (
              <div className={`absolute top-full left-0 w-96 rounded-3xl p-8 shadow-2xl grid gap-6 border animate-in fade-in slide-in-from-top-3 duration-300 ${
                isLightMode ? "bg-white border-black/20 text-black shadow-black/10" : "bg-[#121216] border-white/20 text-white shadow-black/80"
              }`}>
                <span className="text-xs uppercase font-mono text-[#a8cc00] tracking-wider">Core Solutions & Modules</span>
                <Link href="#capabilities" className="text-base font-medium hover:text-[#a8cc00] transition-colors block">
                  → Live Bay Tracking & Telemetry
                </Link>
                <Link href="#capabilities" className="text-base font-medium hover:text-[#a8cc00] transition-colors block">
                  → Automated Spare Parts Ledger
                </Link>
                <Link href="#capabilities" className="text-base font-medium hover:text-[#a8cc00] transition-colors block">
                  → Tax-Compliant Digital Invoicing
                </Link>
              </div>
            )}
          </div>

          <a href="#experience" className="hover:text-[#a8cc00] transition-colors">Client Reviews</a>
          <a href="#inquiry" className="hover:text-[#a8cc00] transition-colors">Company</a>
        </div>

        {/* Right Corner: Single Staff Portal Login Button & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              href="/login" 
              className={`px-5 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                isLightMode 
                  ? "border-black/20 bg-neutral-200 text-black hover:bg-black hover:text-white" 
                  : "border-white/20 bg-white/5 text-white hover:bg-[#cbf000] hover:text-black"
              }`}
            >
              <span>🔐</span> Staff Portal Login
            </Link>
          </div>

          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`p-2.5 rounded-full border text-xs flex items-center justify-center transition-all ${isLightMode ? "border-black/20 bg-neutral-300 text-black" : "border-white/20 bg-neutral-900 text-[#cbf000]"}`}
            title="Toggle Theme"
          >
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-8 md:px-16 pt-24 pb-20">
        <div className="max-w-5xl mb-16">
          <span className="text-[#a8cc00] text-xs font-mono uppercase tracking-widest block mb-4">
            [ COMMERCIAL AUTOMOTIVE ECOSYSTEM ]
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.02] mb-8">
            We take vehicles, workshops, and <span className="font-normal italic text-neutral-500">fleets to the next level.</span>
          </h1>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => setShowCustomerModal(true)}
              className="bg-[#cbf000] text-black font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full hover:bg-white transition-all shadow-xl cursor-pointer"
            >
              Let's Talk →
            </button>
          </div>
        </div>

        {/* Commercial Banner */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden border border-white/15 bg-neutral-900 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80" 
            alt="Vehicle Service Bay"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
          />
          <div className="absolute bottom-8 left-8 md:left-12 z-20 max-w-xl">
            <span className="text-xs uppercase font-mono text-[#cbf000] bg-black/70 px-3.5 py-1.5 rounded-full border border-white/15">Showreel 2026/27</span>
            <h3 className="text-2xl md:text-4xl font-light mt-3 text-white">Live Vehicle Bay Telemetry & Repair Sync</h3>
          </div>
        </div>
      </section>

      {/* Client Reviews Section */}
      <section id="experience" className="container mx-auto px-8 md:px-16 py-24 border-t border-white/10">
        <div className="max-w-xl mb-16">
          <span className="text-[#a8cc00] text-xs font-mono uppercase tracking-widest block mb-2">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">Trusted by vehicle owners & workshops.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveReview(index)}
              className={`p-8 rounded-[28px] border transition-all duration-500 cursor-pointer flex flex-col justify-between ${
                activeReview === index
                  ? isLightMode ? "bg-white border-black shadow-2xl scale-[1.04]" : "bg-[#141418] border-[#cbf000] shadow-2xl shadow-[#cbf000]/10 scale-[1.04]"
                  : isLightMode ? "bg-white/60 border-black/10 opacity-70" : "bg-neutral-900/40 border-white/10 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img src={rev.avatar} alt={rev.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#cbf000]" />
                  <div>
                    <h4 className="font-medium text-base">{rev.name}</h4>
                    <span className="text-xs text-[#a8cc00] uppercase font-mono tracking-wider">{rev.role}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed italic mb-6">"{rev.quote}"</p>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-white/10">
                <span>Verified Client</span>
                <span className="text-[#a8cc00]">★ {rev.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Aerodynamic Car-Cockpit Styled Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-xl rounded-[70px] p-8 md:p-12 relative shadow-2xl border overflow-hidden transition-all duration-700 animate-smooth-car ${
            isLightMode ? "bg-[#ffffff] border-neutral-400 text-black shadow-black/30" : "bg-[#0b0b0e] border-[#cbf000]/40 text-white shadow-2xl shadow-[#cbf000]/10"
          } ${shake ? "animate-bounce" : ""}`}>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-gradient-to-b from-[#18181b] to-transparent rounded-b-[100%] opacity-60 pointer-events-none"></div>

            <button 
              onClick={() => setShowCustomerModal(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-red-500 text-xs uppercase font-mono tracking-widest z-20 bg-black/60 px-4 py-2 rounded-full border border-white/15 text-white"
            >
              [CLOSE]
            </button>

            <div className="mb-8 flex items-center gap-4 z-10 relative pt-4">
              <div className={`text-5xl transition-all duration-1000 ${carMoving ? "translate-x-80 scale-125 opacity-0" : "animate-pulse"}`}>
                🏎️
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#a8cc00] uppercase tracking-widest">Cockpit Telemetry</span>
                <h3 className="text-3xl font-light tracking-tight">Vehicle Garage Access</h3>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5 z-10 relative">
              <div>
                <label className="block text-xs uppercase font-mono text-neutral-400 mb-2">Registered Email / VIN</label>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com or VIN" 
                  className="w-full bg-black/90 text-white border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#cbf000]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-neutral-400 mb-2">Access Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-black/90 text-white border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#cbf000]"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#cbf000] text-black font-bold uppercase tracking-wider py-4 rounded-2xl hover:bg-white transition-all text-xs mt-4 shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Engage Drive & Enter</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Right-Side Floating Success Notification */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#cbf000] text-black px-6 py-4 rounded-2xl shadow-2xl border border-black/20 flex items-center gap-3 animate-in fade-in slide-in-from-right duration-500 font-semibold text-sm">
          <span>🏎️</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full px-8 md:px-16 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 uppercase tracking-widest gap-4">
        <span>© 2026 AutoCare Studio Platform. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}