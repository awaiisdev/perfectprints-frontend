"use client";
import React from "react";

export default function OfferMarquee() {
  const text = " ✨ FREE SHIPPING ON ORDERS ABOVE RS. 3000 • 📦 EXTRA 5% OFF ON ADVANCE PAYMENT • 🏢 BULK CORPORATE DISCOUNTS AVAILABLE • 🖨️ ZERO MINIMUM ORDER LIMIT ON DTF ";

  return (
    <div className="relative w-full h-12 bg-white dark:bg-black text-black dark:text-white border-y border-black/10 dark:border-white/10 flex items-center overflow-hidden transition-colors duration-300">
      <div className="flex whitespace-nowrap animate-marquee-offer">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="mx-4 text-[10px] font-black tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {text}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-offer {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-offer {
          animation: marquee-offer 30s linear infinite;
        }
      `}</style>
    </div>
  );
}