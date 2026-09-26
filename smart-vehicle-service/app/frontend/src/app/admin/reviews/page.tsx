"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";

export default function AdminReviewsPage() {
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
    <div className="space-y-8">
      <header className="pb-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase tracking-widest">[ MODULE 9: REVIEWS & RATINGS ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Customer Feedback Database</h1>
        </div>
        <button onClick={fetchReviews} className="px-4 py-2.5 rounded-xl border border-current/20 text-xs uppercase font-mono">🔄 Refresh</button>
      </header>

      {errorMsg && <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono">⚠️ Note: {errorMsg}</div>}

      <div className="rounded-[32px] border border-current/10 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs uppercase tracking-wider font-mono">
          <thead className="border-b border-current/10 bg-black/20 text-neutral-400">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-neutral-400">Loading reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-neutral-400">No reviews found in database.</td></tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="p-4 text-neutral-400">#{r.id.slice(-6)}</td>
                  <td className="p-4 text-[#cbf000]">⭐ {r.rating} / 5</td>
                  <td className="p-4 lowercase text-neutral-300">{r.comment || "No comment provided"}</td>
                  <td className="p-4 text-right text-red-400 cursor-pointer">Delete</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}