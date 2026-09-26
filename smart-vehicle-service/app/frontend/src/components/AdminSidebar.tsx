"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/src/hooks/useTheme";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isLightMode, toggleTheme } = useTheme();

  const menuItems = [
    { name: "📊 Dashboard", href: "/admin/dashboard" },
    { name: "👥 1. Users Module", href: "/admin/users" },
    { name: "🚗 2. Vehicles Module", href: "/admin/vehicles" },
    { name: "📅 3. Bookings Module", href: "/admin/bookings" },
    { name: "⚙️ 4. Services Module", href: "/admin/services" },
    { name: "🛠️ 5. Service Centers", href: "/admin/service-centers" },
    { name: "📦 6. Spare Parts", href: "/admin/spare-parts" },
    { name: "💰 7. Invoices & Billing", href: "/admin/invoices" },
    { name: "⏰ 8. Reminders Module", href: "/admin/maintenance-reminders" },
    { name: "⭐ 9. Reviews & Ratings", href: "/admin/reviews" },
    { name: "📜 10. Service History", href: "/admin/service-history" },
    { name: "🔄 11. Service Status", href: "/admin/service-status" },
  ];

  return (
    <aside className={`w-64 fixed top-0 left-0 h-screen border-r z-50 flex flex-col justify-between p-6 transition-colors duration-300 ${isLightMode ? "bg-white border-black/10 text-neutral-900" : "bg-[#141418] border-white/10 text-white"}`}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-black tracking-tighter uppercase">
            Auto<span className="text-[#cbf000] bg-black text-white px-2 py-0.5 rounded-md">Care</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1 text-xs uppercase tracking-widest font-bold overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                  isActive ? "bg-[#cbf000] text-black shadow-md font-extrabold" : isLightMode ? "hover:bg-neutral-100 text-neutral-600" : "hover:bg-white/5 text-neutral-300"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`pt-4 border-t flex items-center justify-between ${isLightMode ? "border-black/10" : "border-white/10"}`}>
        <span className="text-[10px] font-mono uppercase tracking-widest text-green-400">● Live DB</span>
        <button 
          onClick={toggleTheme} 
          className={`p-2 rounded-xl text-xs cursor-pointer transition-all ${isLightMode ? "bg-neutral-100 hover:bg-neutral-200 text-black" : "bg-white/10 hover:bg-white/20 text-white"}`}
          title="Toggle Theme"
        >
          {isLightMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </aside>
  );
}