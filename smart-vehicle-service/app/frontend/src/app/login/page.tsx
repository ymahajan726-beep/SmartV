"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/src/services/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

      // Real backend API call to NestJS Auth Controller (/api/auth/login)
      const response = await apiRequest("/auth/login", "POST", { email, password });
      
      console.log("Login Response Data:", response);

      // Handle all possible backend response key variations for the JWT token
      const token = 
        response?.access_token || 
        response?.token || 
        response?.accessToken || 
        response?.data?.access_token || 
        response?.data?.token;

      if (token) {
        // Store the real JWT token securely in localStorage
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

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md p-8 rounded-[32px] border border-white/10 bg-[#141418] shadow-2xl">
        <div className="mb-8 text-center">
          <span className="text-2xl font-black tracking-tighter uppercase">
            Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
          </span>
          <p className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-widest">[ Admin Portal Authentication ]</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@autocare.com" 
              required 
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm text-white outline-none focus:border-[#cbf000]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b0e] text-sm text-white outline-none focus:border-[#cbf000]"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#cbf000] text-black font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#cbf000]/20 mt-4 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Dashboard →"}
          </button>
        </form>
      </div>
    </div>
  );
}