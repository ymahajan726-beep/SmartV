"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerSidebar({ isLightMode }: { isLightMode: boolean }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r flex flex-col transition-transform duration-300 ${isLightMode ? "bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50" : "bg-[#0d0d12] border-white/[0.06] text-slate-100"}`}>
      <div className="p-8 border-inherit flex items-center justify-between">
        <span className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
          Auto<span className="text-black bg-[#00F0FF] px-2 py-0.5 rounded-lg shadow-sm">Care</span>
        </span>
      </div>

      <div className="px-6 py-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Customer Cockpit</span>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-1.5 text-xs uppercase tracking-widest font-mono overflow-y-auto">
        <Link href="/customer/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${isActive('/customer/dashboard') ? (isLightMode ? "bg-slate-900 text-white shadow-md" : "bg-[#00F0FF] text-slate-950 shadow-lg") : "hover:opacity-80"}`}>
          <span>⚡</span> Dashboard
        </Link>
        <Link href="/customer/vehicles" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/vehicles') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
          <span>🚗</span> My Vehicles
        </Link>
        {/* Book Service hata diya hai, sirf My Bookings rakha hai */}
        <Link href="/customer/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${isActive('/customer/bookings') ? (isLightMode ? "bg-slate-900 text-white" : "bg-[#00F0FF] text-slate-950") : "hover:opacity-80"}`}>
          <span>📅</span> My Bookings
        </Link>
        <Link href="/customer/tracking" className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors hover:opacity-80">
          <span>📡</span> Live Tracking
        </Link>
        <Link href="/customer/history" className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors hover:opacity-80">
          <span>📜</span> History & Logs
        </Link>
        <Link href="/customer/invoices" className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors hover:opacity-80">
          <span>💳</span> Invoices
        </Link>
        <Link href="/customer/reminders" className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors hover:opacity-80">
          <span>⏰</span> Reminders
        </Link>
        <Link href="/customer/reviews" className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors hover:opacity-80">
          <span>⭐</span> Reviews
        </Link>
      </nav>

      <div className="p-6 border-t border-inherit">
        <Link href="/" className="block text-center py-3 rounded-xl border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-widest hover:bg-red-500/10 transition-colors font-bold">
          Sign Out
        </Link>
      </div>
    </aside>
  );
}