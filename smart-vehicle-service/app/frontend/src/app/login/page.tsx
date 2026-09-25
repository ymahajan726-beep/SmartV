"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("admin"); // 'admin' | 'workshop'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem("auth_token", "jwt_mock_token_12345");
        localStorage.setItem("user_role", role);

        showToast("Login successful! Redirecting to dashboard...", "success");

        setTimeout(() => {
          if (role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/workshop/dashboard");
          }
        }, 1000);
      }, 800);
    } catch (error) {
      setLoading(false);
      showToast("Invalid credentials or database error", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f3f3f6] flex items-center justify-center p-6 font-sans">
      <div className="absolute w-[500px] h-[500px] bg-[#cbf000]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#121216] border border-white/15 rounded-[40px] p-8 md:p-10 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <span className="text-xl font-black tracking-tighter uppercase inline-block mb-3">
            Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
          </span>
          <h2 className="text-2xl font-light tracking-tight">Portal Gateway</h2>
          <p className="text-xs font-mono text-neutral-400 mt-1">Select your staff role to access secured dashboard</p>
        </div>

        {/* Role Selector Tabs (Only Admin & Workshop) */}
        <div className="grid grid-cols-2 gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-6 text-xs uppercase font-mono">
          <button 
            type="button"
            onClick={() => setRole("admin")}
            className={`py-3 rounded-xl transition-all cursor-pointer ${role === "admin" ? "bg-[#cbf000] text-black font-bold shadow-lg" : "text-neutral-400 hover:text-white"}`}
          >
            🛡️ Admin Control
          </button>
          <button 
            type="button"
            onClick={() => setRole("workshop")}
            className={`py-3 rounded-xl transition-all cursor-pointer ${role === "workshop" ? "bg-[#cbf000] text-black font-bold shadow-lg" : "text-neutral-400 hover:text-white"}`}
          >
            🛠️ Workshop Panel
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-mono text-neutral-400 mb-2">Registered Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com" 
              className="w-full bg-black text-white border border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#cbf000]"
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
              className="w-full bg-black text-white border border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#cbf000]"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#cbf000] text-black font-bold uppercase tracking-wider py-4 rounded-2xl hover:bg-white transition-all text-xs shadow-2xl cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Authenticating..." : `Login to ${role.toUpperCase()} Portal`}</span>
            <span>→</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link href="/" className="text-xs uppercase font-mono text-neutral-400 hover:text-[#cbf000] transition-colors">
            ← Back to Home Landing Page
          </Link>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 font-semibold text-sm ${
          toast.type === "success" ? "bg-[#cbf000] text-black border-black/20" : "bg-red-600 text-white border-red-800"
        }`}>
          <span>{toast.type === "success" ? "🏎️" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}