"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminReviewsPage() {
  const { isLightMode } = useTheme();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    fetchAdminReviews();
  }, []);

  const fetchAdminReviews = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/reviews/admin", "GET").catch(() => []);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load admin reviews.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      await apiRequest(`/reviews/admin/${id}/feature`, "PATCH", {});
      triggerToast("Review featured status updated successfully!", "success");
      fetchAdminReviews();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to update feature status.", "error");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await apiRequest(`/reviews/admin/${id}`, "DELETE");
      triggerToast("Review deleted successfully.", "success");
      fetchAdminReviews();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to delete review.", "error");
    }
  };

  return (
    <div className={`space-y-8 font-sans p-8 md:p-12 ${isLightMode ? "text-slate-900" : "text-[#f3f3f6]"}`}>
      
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-xs font-mono border flex items-center gap-3 ${toastType === "success" ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400" : "bg-red-500 text-white font-bold border-red-400"}`}>
          <span>{toastType === "success" ? "⚡" : "⚠"}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <header className={`pb-6 border-b flex justify-between items-center ${isLightMode ? "border-slate-200" : "border-white/10"}`}>
        <div>
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">[ ADMIN CONTROL CENTER ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">Customer Reviews & Moderation</h1>
        </div>
        <button onClick={fetchAdminReviews} className="px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer border-white/20 hover:border-[#00F0FF]">
          🔄 Refresh Feed
        </button>
      </header>
      <div className={`p-8 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-slate-200" : "bg-[#141418] border-white/10"}`}>
        <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF] mb-6">All Platform Feedback</h3>
        
        {loading ? (
          <div className="py-16 text-center text-neutral-400 font-mono text-xs">Loading platform reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 font-mono text-xs border border-dashed rounded-2xl border-white/10">
            No reviews submitted by customers yet.
          </div>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            {reviews.map((r) => (
              <div key={r.id} className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10"}`}>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-amber-400 text-sm font-bold">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold border ${r.isFeatured ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-neutral-500/10 text-neutral-400 border-neutral-500/30"}`}>
                      {r.isFeatured ? "✨ Featured on Landing" : "Standard Review"}
                    </span>
                  </div>

                  <p className={`italic ${isLightMode ? "text-slate-700" : "text-slate-300"}`}>
                    "{r.comment || "No written comment provided."}"
                  </p>

                  <div className="text-[10px] text-neutral-400 flex flex-wrap gap-4 pt-1">
                    <div>Customer: <strong className={isLightMode ? "text-slate-900" : "text-white"}>{r.customer?.name || "Unknown"}</strong> ({r.customer?.phone})</div>
                    <div>Vehicle: <strong className={isLightMode ? "text-slate-900" : "text-white"}>{r.booking?.vehicle?.make} {r.booking?.vehicle?.model} ({r.booking?.vehicle?.registrationNumber})</strong></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleToggleFeature(r.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] uppercase font-bold border transition-colors cursor-pointer ${r.isFeatured ? "border-amber-500/40 text-amber-400 hover:bg-amber-500/10" : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"}`}
                  >
                    {r.isFeatured ? "Unfeature" : "⭐ Feature"}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="px-4 py-2 rounded-xl text-[10px] uppercase font-bold border border-red-500/40 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}