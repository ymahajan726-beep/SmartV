"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/services/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    apiRequest("/reviews").then(setReviews).catch(() => {
      setReviews([{ id: 1, client: "Amit Deshmukh", rating: 5, comment: "Excellent service turnaround time!" }]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f3f3f6] p-8 md:p-12 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#cbf000] uppercase">[ Backend Module: Reviews ]</span>
          <h1 className="text-3xl font-light mt-1">Client Reviews & Ratings</h1>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-mono uppercase text-[#cbf000] hover:underline">← Back to Dashboard</Link>
      </div>

      <div className="bg-[#141418] border border-white/10 rounded-[32px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/50 text-xs font-mono uppercase text-neutral-400">
              <th className="p-5 pl-8">Client</th>
              <th className="p-5">Rating</th>
              <th className="p-5 pr-8 text-right">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {reviews.map((rev: any) => (
              <tr key={rev.id} className="hover:bg-white/5">
                <td className="p-5 pl-8 font-medium">{rev.client}</td>
                <td className="p-5 font-mono text-[#cbf000]">★ {rev.rating} / 5</td>
                <td className="p-5 pr-8 text-right text-neutral-400 italic">"{rev.comment}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}