"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/src/services/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // 👈 Toggle for Forgot Password view
  
  // Forgot/Reset state variables
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await apiRequest("/auth/login", "POST", { email, password });
      
      const token = 
        response?.access_token || 
        response?.token || 
        response?.accessToken || 
        response?.data?.access_token || 
        response?.data?.token;

      if (token) {
        localStorage.setItem("autocare_token", token);
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("Login failed: Secure token not found in server response.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await apiRequest("/auth/forgot-password", "POST", { email: resetEmail });
      setSuccessMsg(res.message || "Reset token generated successfully!");
      if (res.resetToken) {
        setResetToken(res.resetToken); // Auto-fill token for smooth testing
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await apiRequest("/auth/reset-password", "POST", { 
        email: resetEmail, 
        token: resetToken, 
        newPassword 
      });
      
      setSuccessMsg(res.message || "Password reset successful! Please login.");
      setTimeout(() => {
        setIsForgotPassword(false);
        setSuccessMsg("");
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-[32px] border border-white/10 bg-[#141418] shadow-2xl">
        <div className="mb-8 text-center">
          <span className="text-2xl font-black tracking-tighter uppercase">
            Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
          </span>
          <p className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-widest">
            {isForgotPassword ? "[ Password Recovery Portal ]" : "[ Admin Portal Authentication ]"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono">
            ✅ {successMsg}
          </div>
        )}

        {!isForgotPassword ? (
          // LOGIN FORM
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@autocare.com" 
                required 
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm text-white outline-none focus:border-[#cbf000] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-neutral-400">Password</label>
                <button 
                  type="button" 
                  onClick={() => { setIsForgotPassword(true); setErrorMsg(""); setSuccessMsg(""); }}
                  className="text-xs font-mono text-[#cbf000] hover:underline bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  className="w-full px-4 py-3 pr-14 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm text-white outline-none focus:border-[#cbf000] transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono uppercase text-neutral-400 hover:text-white px-2 py-1"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#cbf000]/20 mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Login to Dashboard →"}
            </button>
          </form>
        ) : (
          // FORGOT & RESET PASSWORD FLOW
          <div className="space-y-4">
            {!resetToken ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Enter Registered Email</label>
                  <input 
                    type="email" 
                    value={resetEmail} 
                    onChange={(e) => setResetEmail(e.target.value)} 
                    placeholder="admin@autocare.com" 
                    required 
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm text-white outline-none focus:border-[#cbf000]"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg mt-4 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Token →"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Reset Token / Code</label>
                  <input 
                    type="text" 
                    value={resetToken} 
                    onChange={(e) => setResetToken(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm text-white outline-none focus:border-[#cbf000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Min 6 characters" 
                    required 
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm text-white outline-none focus:border-[#cbf000]"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg mt-4 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password →"}
                </button>
              </form>
            )}

            <button 
              type="button"
              onClick={() => { setIsForgotPassword(false); setResetToken(""); setErrorMsg(""); setSuccessMsg(""); }}
              className="w-full text-center text-xs font-mono text-neutral-400 hover:text-white mt-4 underline bg-transparent border-none cursor-pointer"
            >
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}