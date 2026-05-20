"use client";

import React from "react";

export default function OfferMarquee() {
  const text = " ✨ FREE SHIPPING ON ORDERS ABOVE RS. 3000 • 📦 EXTRA 5% OFF ON ADVANCE PAYMENT • 🏢 BULK CORPORATE DISCOUNTS AVAILABLE • 🖨️ ZERO MINIMUM ORDER LIMIT ON DTF ";
  const speed = 25; // Speed adjustment

  return (
    <div className="relative w-full h-12 bg-white text-black text-[10px] font-black tracking-[0.2em] uppercase flex items-center overflow-hidden border-y border-white">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee ${speed}s linear infinite;
        }
      `}</style>
    </div>
  );
}