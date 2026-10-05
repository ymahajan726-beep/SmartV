"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/src/context/ThemeContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://autocare-backend-p1v3.onrender.com/api";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { isLightMode, toggleTheme } = useTheme();
 const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [activeReview, setActiveReview] = useState<number | null>(0);
 const [identifier, setIdentifier] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [shake, setShake] = useState(false);
  const [carMoving, setCarMoving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [publicReviews, setPublicReviews] = useState<any[]>([]);

  const heroImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555353540-64580b51c258?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop&q=80"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);

    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    fetch(`${API_BASE_URL}/reviews/public`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPublicReviews(data);
        }
      })
      .catch(() => setPublicReviews([]));

    return () => clearInterval(slideInterval);
  }, []);

  const fallbackReviews = [
    {
      customer: { name: "Rajesh Sharma" },
      role: "Fleet Supervisor",
      comment: "The automated status alerts and one-click invoice approval streamlined our fleet maintenance turnaround time by 40%.",
      rating: 5,
    },
    {
      customer: { name: "Amit Deshmukh" },
      role: "Car Owner",
      comment: "Zero hidden charges. Transparent spare-parts tracking and complete digital service logs right on the phone.",
      rating: 4.5,
    },
    {
      customer: { name: "Sneha Patel" },
      role: "Workshop Partner",
      comment: "Assigning technicians to bays and updating inventory in real time has completely organized our daily operations.",
      rating: 5,
    },
  ];

  const rawReviews = publicReviews.length > 0 ? publicReviews : fallbackReviews;
  const displayReviews = rawReviews.filter((rev: any) => (rev.rating ?? 5) >= 3.0);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = identifier.trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      setShake(true);
      setNotification("Please enter a valid 10-digit mobile number.");
      setTimeout(() => {
        setShake(false);
        setNotification(null);
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setNotification(null);

      const response = await fetch(`${API_BASE_URL}/auth/customer/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to request OTP.");
      }

      setOtpSent(true);
      setNotification(`OTP generated successfully. Development OTP: ${data?.devOtp ?? "1234"}`);

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error: any) {
      setNotification(error?.message || "Unable to request OTP.");
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = identifier.trim();
    const cleanOtp = otp.trim();

    if (!/^\d{4}$/.test(cleanOtp)) {
      setShake(true);
      setNotification("Please enter the 4-digit OTP.");
      setTimeout(() => {
        setShake(false);
        setNotification(null);
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setNotification(null);

      const response = await fetch(`${API_BASE_URL}/auth/customer/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: cleanOtp }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Invalid OTP.");
      }

      const accessToken = data?.accessToken;
      const user = data?.user;

      if (!accessToken) {
        throw new Error("Authentication token was not returned by the server.");
      }

      localStorage.setItem("customer_token", accessToken);
      if (user?.id) {
        localStorage.setItem("user-id", user.id);
      }
      localStorage.setItem("customer_user", JSON.stringify(user ?? {}));

      setCarMoving(true);
      setNotification("Authentication successful! Redirecting to Customer Garage...");

      setTimeout(() => {
        setShowCustomerModal(false);
        setCarMoving(false);
        setOtpSent(false);
        setIdentifier("");
        setOtp("");
        setNotification(null);
        window.location.href = "/customer/dashboard";
      }, 1000);
    } catch (error: any) {
      setShake(true);
      setNotification(error?.message || "OTP verification failed.");
      setTimeout(() => {
        setShake(false);
        setNotification(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 overflow-x-hidden ${isLightMode ? "bg-[#f8f9fa] text-slate-900" : "bg-[#060608] text-[#f8fafc]"}`}>
      
      <nav className={`w-full px-8 md:px-16 py-6 flex justify-between items-center border-b sticky top-0 backdrop-blur-2xl z-50 ${isLightMode ? "border-slate-200 bg-white/90 text-slate-900" : "border-white/[0.06] bg-[#0d0d12]/90 text-white"}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tighter uppercase">
            Auto<span className="text-slate-950 bg-[#00F0FF] px-2 py-0.5 rounded-lg">Care</span>
          </span>
        </div>

        <div className={`hidden lg:flex items-center gap-10 text-xs uppercase tracking-widest font-mono font-semibold ${isLightMode ? "text-slate-700" : "text-slate-300"}`}>
          <a href="#features" className="hover:text-[#00F0FF] transition-colors">Features</a>
          <a href="#why-choose" className="hover:text-[#00F0FF] transition-colors">Why Choose Us</a>
          <a href="#reviews" className="hover:text-[#00F0FF] transition-colors">Client Reviews</a>
          <a href="#contact" className="hover:text-[#00F0FF] transition-colors">Contact Us</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/admin/dashboard" className={`px-4 py-2 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 font-bold ${isLightMode ? "border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white" : "border-white/10 bg-white/5 text-white hover:bg-[#00F0FF] hover:text-slate-950"}`}>
              <span>🔐</span> Staff
            </Link>
          </div>

          <button onClick={toggleTheme} className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${isLightMode ? "border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200" : "border-white/10 bg-[#12121c] text-[#00F0FF] hover:bg-white/10"}`}>
            <span>{isLightMode ? "🌙" : "☀️"}</span>
            <span className="text-[10px] uppercase font-bold">{isLightMode ? "Dark" : "Light"}</span>
          </button>
        </div>
      </nav>

      <section className="container mx-auto px-8 md:px-16 pt-24 pb-20">
        <div className="max-w-5xl mb-16">
          <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest block mb-4 font-bold">
            [ COMMERCIAL AUTOMOTIVE ECOSYSTEM ]
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.02] mb-8">
            We take vehicles, workshops, and <span className="font-normal italic text-slate-500">fleets to the next level.</span>
          </h1>

          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={() => setShowCustomerModal(true)} className="bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#00F0FF]/20 cursor-pointer font-mono">
              Let's Talk... →
            </button>
          </div>
        </div>

        <div className="relative w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden border border-white/10 bg-neutral-900 group shadow-2xl">
          {heroImages.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt="Vehicle Service Bay Slideshow"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? "opacity-90 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}
            />
          ))}

          <div className="absolute top-6 right-6 z-30 flex gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? "w-8 bg-[#00F0FF]" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>

          <div className="absolute bottom-8 left-8 md:left-12 z-20 max-w-xl">
            <span className="text-xs uppercase font-mono text-[#00F0FF] bg-black/80 px-4 py-1.5 rounded-full border border-white/15 font-bold">
              Showreel 2026/27
            </span>
            <h3 className="text-2xl md:text-4xl font-light mt-3 text-white">
              Live Vehicle Bay Telemetry & Repair Sync
            </h3>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className={`container mx-auto px-8 md:px-16 py-24 border-t ${isLightMode ? "border-slate-200 bg-slate-50/50" : "border-white/10 bg-black/20"}`}>
        <div className="max-w-xl mb-16">
          <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest block mb-2 font-bold">
            Core Modules
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            Engineered for high-performance workshops.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-8 rounded-[32px] border ${isLightMode ? "bg-white border-slate-200 shadow-lg" : "bg-[#12121c] border-white/10 shadow-xl"}`}>
            <span className="text-3xl mb-4 block">📍</span>
            <h3 className="text-xl font-bold mb-3">Live Bay Tracking & Telemetry</h3>
            <p className={`text-sm leading-relaxed ${isLightMode ? "text-slate-600" : "text-neutral-400"}`}>
              Monitor workshop bays in real time. Track vehicle progress from initial inspection right up to final delivery stages.
            </p>
          </div>

          <div className={`p-8 rounded-[32px] border ${isLightMode ? "bg-white border-slate-200 shadow-lg" : "bg-[#12121c] border-white/10 shadow-xl"}`}>
            <span className="text-3xl mb-4 block">📦</span>
            <h3 className="text-xl font-bold mb-3">Automated Spare Parts Ledger</h3>
            <p className={`text-sm leading-relaxed ${isLightMode ? "text-slate-600" : "text-neutral-400"}`}>
              Keep track of inventory seamlessly. Auto-deduct spare parts usage and maintain transparent records for every job card.
            </p>
          </div>

          <div className={`p-8 rounded-[32px] border ${isLightMode ? "bg-white border-slate-200 shadow-lg" : "bg-[#12121c] border-white/10 shadow-xl"}`}>
            <span className="text-3xl mb-4 block">📄</span>
            <h3 className="text-xl font-bold mb-3">Tax-Compliant Digital Invoicing</h3>
            <p className={`text-sm leading-relaxed ${isLightMode ? "text-slate-600" : "text-neutral-400"}`}>
              Generate professional A4 tax invoices with built-in 18% GST calculation, manual labor adjustments, and secure locks.
            </p>
          </div>
        </div>
      </section>

      <section id="why-choose" className="container mx-auto px-8 md:px-16 py-24 border-t border-white/10">
        <div className="max-w-xl mb-16">
          <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest block mb-2 font-bold">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            The ultimate standard in vehicle care management.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-8 rounded-[32px] border ${isLightMode ? "bg-white border-slate-200" : "bg-[#12121c] border-white/10"}`}>
            <span className="text-xs font-mono text-[#00F0FF] font-bold block mb-2">01 // SPEED</span>
            <h3 className="text-lg font-bold mb-2">Seamless Workflows</h3>
            <p className={`text-xs leading-relaxed ${isLightMode ? "text-slate-600" : "text-neutral-400"}`}>
              From booking creation to automated 6-month periodic maintenance reminders, everything is fully streamlined.
            </p>
          </div>

          <div className={`p-8 rounded-[32px] border ${isLightMode ? "bg-white border-slate-200" : "bg-[#12121c] border-white/10"}`}>
            <span className="text-xs font-mono text-[#00F0FF] font-bold block mb-2">02 // SECURITY</span>
            <h3 className="text-lg font-bold mb-2">Role-Based Access</h3>
            <p className={`text-xs leading-relaxed ${isLightMode ? "text-slate-600" : "text-neutral-400"}`}>
              Dedicated portals for Admin, Workshop staff, and Customers with secured token verification.
            </p>
          </div>

          <div className={`p-8 rounded-[32px] border ${isLightMode ? "bg-white border-slate-200" : "bg-[#12121c] border-white/10"}`}>
            <span className="text-xs font-mono text-[#00F0FF] font-bold block mb-2">03 // TRANSPARENCY</span>
            <h3 className="text-lg font-bold mb-2">Zero Hidden Fees</h3>
            <p className={`text-xs leading-relaxed ${isLightMode ? "text-slate-600" : "text-neutral-400"}`}>
              Clear itemized estimates and online/offline payment gateways with permanent invoice locking upon payment.
            </p>
          </div>
        </div>
      </section>

      <section id="reviews" className={`container mx-auto px-8 md:px-16 py-24 border-t ${isLightMode ? "border-slate-200 bg-slate-50/50" : "border-white/10 bg-black/20"}`}>
        <div className="max-w-xl mb-16">
          <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest block mb-2 font-bold">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            Trusted by vehicle owners & workshops.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((rev, index) => {
            const clientName = rev.customer?.name || rev.name || "Client";
            const firstLetter = clientName.charAt(0).toUpperCase();

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveReview(index)}
                className={`p-8 rounded-[28px] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  activeReview === index
                    ? isLightMode ? "bg-white border-slate-400 shadow-xl scale-[1.03]" : "bg-[#12121c] border-[#00F0FF] shadow-xl shadow-[#00F0FF]/10 scale-[1.03]"
                    : isLightMode ? "bg-white/60 border-slate-200 opacity-70" : "bg-[#0d0d14] border-white/10 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] font-bold text-lg font-mono">
                      {firstLetter}
                    </div>
                    <div>
                      <h4 className="font-medium text-base">{clientName}</h4>
                      <span className="text-xs text-[#00F0FF] uppercase font-mono tracking-wider">
                        {rev.role || "Verified Client"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed italic mb-6">
                    "{rev.comment || rev.quote}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-white/10">
                  <span>Verified Client</span>
                  <span className="text-[#00F0FF]">★ {rev.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="contact" className="container mx-auto px-8 md:px-16 py-24 border-t border-white/10">
        <div className="max-w-xl mb-12">
          <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest block mb-2 font-bold">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            Connect with our administration team.
          </h2>
        </div>

        <div className={`p-8 md:p-12 rounded-[32px] border max-w-2xl ${isLightMode ? "bg-white border-slate-200 shadow-xl" : "bg-[#12121c] border-white/10 shadow-2xl"}`}>
          <div className="space-y-6 font-mono text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-widest block mb-1">Official Admin Support Email</span>
              <a href="mailto:admin@autocare.com" className="text-base sm:text-lg font-bold text-[#00F0FF] hover:underline">
                admin@autocare.com
              </a>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-widest block mb-1">Workshop Central Desk</span>
              <p className="text-sm font-semibold">+91 98765 43210 / Support Helpline</p>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-widest block mb-1">Location</span>
              <p className="text-sm font-semibold">Central Workshop, Main Highway, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </section>
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-xl rounded-[40px] p-8 md:p-12 relative shadow-2xl border overflow-hidden ${isLightMode ? "bg-white border-slate-300 text-slate-900" : "bg-[#0d0d14] border-[#00F0FF]/40 text-white"} ${shake ? "animate-bounce" : ""}`}>
            <button
              onClick={() => {
                setShowCustomerModal(false);
                setOtpSent(false);
                setIdentifier("");
                setOtp("");
              }}
              className="absolute top-6 right-6 text-white bg-black/60 px-4 py-2 rounded-full border border-white/15 text-xs cursor-pointer"
            >
              [CLOSE]
            </button>

            <div className="mb-8 flex items-center gap-4 pt-2">
              <div className={`text-5xl transition-all duration-1000 ${carMoving ? "translate-x-80 scale-125 opacity-0" : "animate-pulse"}`}>
                🏎️
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest font-bold">Secure Telemetry Access</span>
                <h3 className="text-2xl font-light tracking-tight">Customer Garage Portal</h3>
              </div>
            </div>

            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-5 font-mono text-xs">
                <div>
                  <label className="block uppercase text-slate-400 mb-2 font-bold">Registered Mobile Number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className="w-full bg-black/90 text-white border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#00F0FF] font-bold tracking-wider"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1.5 block">Development mode: any 10-digit test number can be used.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider py-4 rounded-2xl hover:opacity-90 transition-all text-xs shadow-xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Generating OTP..." : "Request Verification OTP →"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-center font-bold">
                  OTP generated for <span className="underline">{identifier}</span><br />
                  <span className="text-[10px] text-slate-400 font-normal">Development OTP: 1234</span>
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-2 font-bold">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="1234"
                    className="w-full bg-black/90 text-white border border-white/20 rounded-2xl px-5 py-4 text-center tracking-widest text-lg font-bold focus:outline-none focus:border-[#00F0FF]"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider py-4 rounded-2xl hover:opacity-90 transition-all text-xs shadow-xl cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Enter Garage →"}
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="px-5 py-4 rounded-2xl border border-white/20 uppercase cursor-pointer hover:bg-white/5 font-bold disabled:opacity-50"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-8 right-8 z-[100] bg-[#00F0FF] text-slate-950 px-6 py-4 rounded-2xl shadow-2xl border border-black/20 flex items-center gap-3 font-mono font-bold text-xs max-w-md">
          <span>🏎️</span>
          <span>{notification}</span>
        </div>
      )}

      <footer className="w-full px-8 md:px-16 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 uppercase tracking-widest gap-4 font-mono">
        <span>© 2026 AutoCare Studio Platform. All rights reserved.</span>
      </footer>
    </div>
  );
}