"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/src/context/ThemeContext";

const API_BASE_URL = "http://localhost:4000/api";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { isLightMode, toggleTheme } = useTheme();

  const [showCustomerModal, setShowCustomerModal] =
    useState(false);

  const [servicesDropdownOpen, setServicesDropdownOpen] =
    useState(false);

  const [activeReview, setActiveReview] =
    useState<number | null>(0);

  const [identifier, setIdentifier] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [shake, setShake] = useState(false);
  const [carMoving, setCarMoving] = useState(false);
  const [notification, setNotification] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reviews = [
    {
      name: "Rajesh Sharma",
      role: "Fleet Supervisor",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote:
        "The automated status alerts and one-click invoice approval streamlined our fleet maintenance turnaround time by 40%.",
      rating: "5.0",
    },
    {
      name: "Amit Deshmukh",
      role: "Car Owner",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      quote:
        "Zero hidden charges. Transparent spare-parts tracking and complete digital service logs right on the phone.",
      rating: "4.9",
    },
    {
      name: "Sneha Patel",
      role: "Workshop Partner",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      quote:
        "Assigning technicians to bays and updating inventory in real time has completely organized our daily operations.",
      rating: "5.0",
    },
  ];

  // =====================================================
  // STEP 1: REQUEST OTP FROM BACKEND
  // =====================================================

  const handleRequestOtp = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const cleanPhone = identifier.trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      setShake(true);

      setNotification(
        "Please enter a valid 10-digit mobile number.",
      );

      setTimeout(() => {
        setShake(false);
        setNotification(null);
      }, 3000);

      return;
    }

    try {
      setLoading(true);
      setNotification(null);

      const response = await fetch(
        `${API_BASE_URL}/auth/customer/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: cleanPhone,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to request OTP.",
        );
      }

      setOtpSent(true);

      setNotification(
        `OTP generated successfully. Development OTP: ${
          data?.devOtp ?? "1234"
        }`,
      );

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error: any) {
      setNotification(
        error?.message ||
          "Unable to request OTP.",
      );

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STEP 2: VERIFY OTP FROM BACKEND
  // =====================================================

  const handleVerifyOtp = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const cleanPhone = identifier.trim();
    const cleanOtp = otp.trim();

    if (!/^\d{4}$/.test(cleanOtp)) {
      setShake(true);

      setNotification(
        "Please enter the 4-digit OTP.",
      );

      setTimeout(() => {
        setShake(false);
        setNotification(null);
      }, 3000);

      return;
    }

    try {
      setLoading(true);
      setNotification(null);

      const response = await fetch(
        `${API_BASE_URL}/auth/customer/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: cleanPhone,
            otp: cleanOtp,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Invalid OTP.",
        );
      }

      const accessToken =
        data?.accessToken;

      const user = data?.user;

      if (!accessToken) {
        throw new Error(
          "Authentication token was not returned by the server.",
        );
      }

      // =================================================
      // SAVE REAL BACKEND JWT (TOKEN ISOLATION APPLIED)
      // =================================================

      localStorage.setItem(
        "customer_token",
        accessToken,
      );

      // Store actual database UUID.
      if (user?.id) {
        localStorage.setItem(
          "user-id",
          user.id,
        );
      }

      localStorage.setItem(
        "customer_user",
        JSON.stringify(user ?? {}),
      );

      setCarMoving(true);

      setNotification(
        "Authentication successful! Redirecting to Customer Garage...",
      );

      setTimeout(() => {
        setShowCustomerModal(false);
        setCarMoving(false);
        setOtpSent(false);
        setIdentifier("");
        setOtp("");
        setNotification(null);

        window.location.href =
          "/customer/dashboard";
      }, 1000);
    } catch (error: any) {
      setShake(true);

      setNotification(
        error?.message ||
          "OTP verification failed.",
      );

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
    <div
      className={`min-h-screen font-sans transition-colors duration-200 overflow-x-hidden ${
        isLightMode
          ? "bg-[#f8f9fa] text-slate-900"
          : "bg-[#060608] text-[#f8fafc]"
      }`}
    >
      {/* NAVBAR */}

      <nav
        className={`w-full px-8 md:px-16 py-6 flex justify-between items-center border-b sticky top-0 backdrop-blur-2xl z-50 ${
          isLightMode
            ? "border-slate-200 bg-white/95 text-slate-900"
            : "border-white/[0.06] bg-[#0d0d12]/95 text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tighter uppercase">
            Auto
            <span className="text-slate-950 bg-[#00F0FF] px-2 py-0.5 rounded-lg">
              Care
            </span>
          </span>
        </div>

        <div
          className={`hidden lg:flex items-center gap-10 text-xs uppercase tracking-widest font-mono font-semibold ${
            isLightMode
              ? "text-slate-700"
              : "text-slate-300"
          }`}
        >
          <div
            className="relative py-2 cursor-pointer"
            onMouseEnter={() =>
              setServicesDropdownOpen(true)
            }
            onMouseLeave={() =>
              setServicesDropdownOpen(false)
            }
          >
            <span className="hover:text-[#00F0FF] transition-colors flex items-center gap-1.5">
              Services
              <span className="text-[10px]">
                ▼
              </span>
            </span>

            {servicesDropdownOpen && (
              <div
                className={`absolute top-full left-0 w-96 rounded-3xl p-8 shadow-2xl grid gap-6 border ${
                  isLightMode
                    ? "bg-white border-slate-200 text-slate-900 shadow-xl"
                    : "bg-[#12121c] border-white/10 text-white shadow-2xl"
                }`}
              >
                <span className="text-xs uppercase font-mono text-[#00F0FF] tracking-wider">
                  Core Solutions & Modules
                </span>

                <Link
                  href="#capabilities"
                  className="text-sm font-medium hover:text-[#00F0FF]"
                >
                  → Live Bay Tracking & Telemetry
                </Link>

                <Link
                  href="#capabilities"
                  className="text-sm font-medium hover:text-[#00F0FF]"
                >
                  → Automated Spare Parts Ledger
                </Link>

                <Link
                  href="#capabilities"
                  className="text-sm font-medium hover:text-[#00F0FF]"
                >
                  → Tax-Compliant Digital Invoicing
                </Link>
              </div>
            )}
          </div>

          <a
            href="#experience"
            className="hover:text-[#00F0FF]"
          >
            Client Reviews
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className={`px-5 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 font-bold ${
                isLightMode
                  ? "border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white"
                  : "border-white/10 bg-white/5 text-white hover:bg-[#00F0FF] hover:text-slate-950"
              }`}
            >
              <span>🔐</span>
              Staff Portal Login
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-2xl border text-xs flex items-center justify-center transition-all cursor-pointer ${
              isLightMode
                ? "border-slate-300 bg-slate-100 text-slate-900"
                : "border-white/10 bg-[#12121c] text-[#00F0FF]"
            }`}
          >
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      {/* HERO */}

      <section className="container mx-auto px-8 md:px-16 pt-24 pb-20">
        <div className="max-w-5xl mb-16">
          <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest block mb-4 font-bold">
            [ COMMERCIAL AUTOMOTIVE ECOSYSTEM ]
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.02] mb-8">
            We take vehicles, workshops, and{" "}
            <span className="font-normal italic text-slate-500">
              fleets to the next level.
            </span>
          </h1>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() =>
                setShowCustomerModal(true)
              }
              className="bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#00F0FF]/20 cursor-pointer font-mono"
            >
              Customer Garage Login →
            </button>
          </div>
        </div>

        <div className="relative w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden border border-white/10 bg-neutral-900 group shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80"
            alt="Vehicle Service Bay"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
          />

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

      {/* REVIEWS */}

      <section
        id="experience"
        className="container mx-auto px-8 md:px-16 py-24 border-t border-white/10"
      >
        <div className="max-w-xl mb-16">
          <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest block mb-2 font-bold">
            Testimonials
          </span>

          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            Trusted by vehicle owners & workshops.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(
            (rev, index) => (
              <div
                key={index}
                onMouseEnter={() =>
                  setActiveReview(index)
                }
                className={`p-8 rounded-[28px] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  activeReview === index
                    ? isLightMode
                      ? "bg-white border-slate-400 shadow-xl scale-[1.03]"
                      : "bg-[#12121c] border-[#00F0FF] shadow-xl shadow-[#00F0FF]/10 scale-[1.03]"
                    : isLightMode
                    ? "bg-white/60 border-slate-200 opacity-70"
                    : "bg-[#0d0d14] border-white/10 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#00F0FF]"
                    />

                    <div>
                      <h4 className="font-medium text-base">
                        {rev.name}
                      </h4>

                      <span className="text-xs text-[#00F0FF] uppercase font-mono tracking-wider">
                        {rev.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed italic mb-6">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-white/10">
                  <span>
                    Verified Client
                  </span>

                  <span className="text-[#00F0FF]">
                    ★ {rev.rating}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* CUSTOMER LOGIN MODAL */}

      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-xl rounded-[40px] p-8 md:p-12 relative shadow-2xl border overflow-hidden ${
              isLightMode
                ? "bg-white border-slate-300 text-slate-900"
                : "bg-[#0d0d14] border-[#00F0FF]/40 text-white"
            } ${shake ? "animate-bounce" : ""}`}
          >
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
              <div
                className={`text-5xl transition-all duration-1000 ${
                  carMoving
                    ? "translate-x-80 scale-125 opacity-0"
                    : "animate-pulse"
                }`}
              >
                🏎️
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest font-bold">
                  Secure Telemetry Access
                </span>

                <h3 className="text-2xl font-light tracking-tight">
                  Customer Garage Portal
                </h3>
              </div>
            </div>

            {!otpSent ? (
              <form
                onSubmit={handleRequestOtp}
                className="space-y-5 font-mono text-xs"
              >
                <div>
                  <label className="block uppercase text-slate-400 mb-2 font-bold">
                    Registered Mobile Number
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={identifier}
                    onChange={(e) =>
                      setIdentifier(
                        e.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    placeholder="9876543210"
                    className="w-full bg-black/90 text-white border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#00F0FF] font-bold tracking-wider"
                    required
                  />

                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Development mode: any 10-digit test number can be used.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider py-4 rounded-2xl hover:opacity-90 transition-all text-xs shadow-xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Generating OTP..."
                    : "Request Verification OTP →"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-5 font-mono text-xs"
              >
                <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-center font-bold">
                  OTP generated for{" "}
                  <span className="underline">
                    {identifier}
                  </span>

                  <br />

                  <span className="text-[10px] text-slate-400 font-normal">
                    Development OTP: 1234
                  </span>
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-2 font-bold">
                    Enter 4-Digit OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    placeholder="1234"
                    className="w-full bg-black/90 text-white border border-white/20 rounded-2xl px-5 py-4 text-center tracking-widest text-lg font-bold focus:outline-none focus:border-[#00F0FF]"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider py-4 rounded-2xl hover:opacity-90 transition-all text-xs shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify & Enter Garage →"}
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

      {/* NOTIFICATION */}

      {notification && (
        <div className="fixed bottom-8 right-8 z-[100] bg-[#00F0FF] text-slate-950 px-6 py-4 rounded-2xl shadow-2xl border border-black/20 flex items-center gap-3 font-mono font-bold text-xs max-w-md">
          <span>🏎️</span>
          <span>{notification}</span>
        </div>
      )}

      {/* FOOTER */}

      <footer className="w-full px-8 md:px-16 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 uppercase tracking-widest gap-4 font-mono">
        <span>
          © 2026 AutoCare Studio Platform. All rights reserved.
        </span>
      </footer>
    </div>
  );
}