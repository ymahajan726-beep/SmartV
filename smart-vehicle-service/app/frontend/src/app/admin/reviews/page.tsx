"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminReviewsPage() {
  const { isLightMode } = useTheme();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Fallback safe handling agar backend endpoint abhi ready nahi hai
      const data = await apiRequest("/reviews", "GET").catch(() => []);
      setReviews(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-8 font-sans ${isLightMode ? "text-gray-900" : "text-[#f3f3f6]"}`}>
      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ MODULE 9: REVIEWS & RATINGS ]</span>
          <h1 className={`text-3xl font-light tracking-tight mt-1 ${isLightMode ? "text-gray-900" : "text-white"}`}>Customer Feedback Database</h1>
        </div>
        <button onClick={fetchReviews} className={`px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer transition-all ${isLightMode ? "border-gray-300 hover:border-black text-gray-800 bg-gray-50" : "border-white/20 hover:border-[#cbf000] text-white"}`}>🔄 Refresh</button>
      </header>

      {errorMsg && <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">⚠️ Note: {errorMsg}</div>}

      <div className={`rounded-[32px] border overflow-hidden shadow-xl ${isLightMode ? "bg-white border-gray-200" : "bg-[#141418] border-white/10"}`}>
        <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
          <thead className={`border-b ${isLightMode ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0b0b0e] border-white/10 text-neutral-400"}`}>
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLightMode ? "divide-gray-100" : "divide-white/5"}`}>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-neutral-400">Loading reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-neutral-400">No reviews found in database.</td></tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className={`transition-colors ${isLightMode ? "hover:bg-gray-50 text-gray-800" : "hover:bg-white/5 text-white"}`}>
                  <td className="p-4 text-neutral-400">#{r.id.slice(-6)}</td>
                  <td className="p-4 text-[#cbf000]">⭐ {r.rating} / 5</td>
                  <td className={`p-4 lowercase ${isLightMode ? "text-gray-600" : "text-neutral-300"}`}>{r.comment || "No comment provided"}</td>
                  <td className="p-4 text-right text-red-400 hover:text-red-300 cursor-pointer">Delete</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}