"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/src/services/api";
import { useTheme } from "@/src/context/ThemeContext";

export default function CustomerReviewsPage() {
  const { isLightMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [revData, bookData] = await Promise.all([
        apiRequest("/reviews/customer", "GET").catch(() => []),
        apiRequest("/customer/bookings", "GET").catch(() => []),
      ]);

      setReviews(Array.isArray(revData) ? revData : []);
      const finishedBookings = Array.isArray(bookData) 
        ? bookData.filter((b: any) => b.status === "COMPLETED" || b.status === "READY_FOR_DELIVERY" || b.status === "DELIVERED") 
        : [];
      setCompletedBookings(finishedBookings);
    } catch (err: any) {
      triggerToast(err?.message || "Failed to load reviews telemetry.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    try {
      setSubmitting(true);
      await apiRequest("/reviews", "POST", {
        bookingId: selectedBookingId,
        rating: Number(rating),
        comment,
      });

      triggerToast("Review saved successfully!", "success");
      setSelectedBookingId(null);
      setRating(5);
      setComment("");
      fetchData();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to submit review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomerReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    try {
      await apiRequest(`/reviews/${reviewId}`, "DELETE").catch(async () => {
        await apiRequest(`/reviews/admin/${reviewId}`, "DELETE");
      });
      triggerToast("Review deleted successfully.", "success");
      fetchData();
    } catch (err: any) {
      triggerToast(err?.message || "Failed to delete review.", "error");
    }
  };

  const openEditModal = (review: any) => {
    setSelectedBookingId(review.bookingId);
    setRating(review.rating);
    setComment(review.comment || "");
  };

  if (!mounted) {
    return null;
  }

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
          <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">[ CUSTOMER FEEDBACK ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">My Service Reviews & Ratings</h1>
        </div>
        <button onClick={fetchData} className="px-4 py-2.5 rounded-xl border text-xs uppercase font-mono cursor-pointer border-white/20 hover:border-[#00F0FF]">
          🔄 Refresh
        </button>
      </header>

      <div className={`p-8 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-slate-200" : "bg-[#141418] border-white/10"}`}>
        <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF] mb-6">Your Submitted Reviews (Editable / Deletable)</h3>
        
        {loading ? (
          <div className="py-12 text-center text-neutral-400 font-mono text-xs">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 font-mono text-xs border border-dashed rounded-2xl border-white/10">
            You haven't reviewed any service bookings yet. Rate your completed services below!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {reviews.map((r) => {
              const fullStars = Math.floor(r.rating);
              const hasHalfStar = r.rating % 1 !== 0;
              const emptyStars = Math.floor(5 - r.rating);

              return (
                <div key={r.id} className={`p-6 rounded-2xl border space-y-3 flex flex-col justify-between ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10"}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-cyan-400 font-bold">{r.booking?.vehicle?.make} {r.booking?.vehicle?.model}</span>
                        <div className="text-[10px] text-neutral-400">{r.booking?.bookingNumber}</div>
                      </div>
                      <div className="text-amber-400 text-sm font-bold flex items-center gap-1">
                        <span>{"★".repeat(fullStars)}{hasHalfStar ? "½" : ""}{"☆".repeat(emptyStars < 0 ? 0 : emptyStars)}</span>
                        <span className="text-xs text-neutral-400">({r.rating})</span>
                      </div>
                    </div>
                    <p className={`text-xs italic ${isLightMode ? "text-slate-700" : "text-slate-300"}`}>
                      "{r.comment || "No written comment provided."}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                    <span className="text-neutral-500">Date: {new Date(r.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(r)}
                        className="px-3 py-1.5 rounded-lg border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 uppercase cursor-pointer font-bold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCustomerReview(r.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-500 hover:bg-red-500/10 uppercase cursor-pointer font-bold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`p-8 rounded-[32px] border shadow-xl ${isLightMode ? "bg-white border-slate-200" : "bg-[#141418] border-white/10"}`}>
        <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF] mb-2">Rate Completed Service Bookings</h3>
        <p className="text-xs font-mono text-neutral-400 mb-6">Select any finished service booking to submit your rating and feedback.</p>

        {completedBookings.length === 0 ? (
          <div className="py-8 text-center text-neutral-400 font-mono text-xs">
            No completed bookings available for review at the moment. (Ensure a booking status is COMPLETED or DELIVERED).
          </div>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            {completedBookings.map((b) => (
              <div key={b.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10"}`}>
                <div>
                  <strong className="text-[#00F0FF]">{b.bookingNumber}</strong>
                  <div className="font-bold mt-0.5">{b.vehicle?.make} {b.vehicle?.model} ({b.vehicle?.registrationNumber})</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Status: <span className="text-emerald-400 font-bold">{b.status}</span></div>
                </div>
                <button
                  onClick={() => {
                    setSelectedBookingId(b.id);
                    setRating(5);
                    setComment("");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 transition-all"
                >
                  ⭐ Rate & Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBookingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl ${isLightMode ? "bg-white text-slate-900" : "bg-[#141418] border-white/10 text-white"}`}>
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F0FF] mb-2">
              Service Feedback
            </h3>
            <p className="text-[11px] text-neutral-400 mb-6 font-mono">
              Share your experience regarding service quality and execution.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Rating (Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-2xl border outline-none font-bold text-amber-400 ${isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#0b0b0e] border-white/10"}`}
                >
                  <option value={5}>★★★★★ (5.0 - Excellent)</option>
                  <option value={4.5}>★★★★½ (4.5 - Outstanding)</option>
                  <option value={4}>★★★★☆ (4.0 - Very Good)</option>
                  <option value={3.5}>★★★½☆ (3.5 - Good)</option>
                  <option value={3}>★★★☆☆ (3.0 - Average)</option>
                  <option value={2}>★★☆☆☆ (2.0 - Poor)</option>
                  <option value={1}>★☆☆☆☆ (1.0 - Terrible)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1">Your Comments / Feedback</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your experience here..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-2xl border outline-none resize-none ${isLightMode ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-[#0b0b0e] border-white/10 text-white"}`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-2xl bg-[#00F0FF] text-slate-950 font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBookingId(null)}
                  className="px-6 py-3.5 rounded-2xl border border-white/20 text-neutral-300 uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}