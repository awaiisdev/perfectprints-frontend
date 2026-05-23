"use client";
import React from "react";

const row1 = [
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451591/ChatGPT_Image_May_22_2026_04_54_45_AM_uwdszx.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_55_43_AM_r2pfpw.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_57_25_AM_mmcvya.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_04_59_38_AM_fltole.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_05_01_05_AM_sfupjk.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451593/ChatGPT_Image_May_22_2026_05_02_16_AM_iu4jqx.png",
];

const row2 = [
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451586/ChatGPT_Image_May_22_2026_05_03_26_AM_kpli5p.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_05_01_05_AM_sfupjk.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451591/ChatGPT_Image_May_22_2026_04_54_45_AM_uwdszx.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_55_43_AM_r2pfpw.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_57_25_AM_mmcvya.png",
  "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451593/ChatGPT_Image_May_22_2026_05_02_16_AM_iu4jqx.png",
];

export default function ProductionShowcase() {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white py-24 px-4 border-t border-black/10 dark:border-white/10 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT */}
        <div className="space-y-6">
          <span
            className="text-[10px] tracking-[0.4em] text-neutral-400 font-black uppercase block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            INDUSTRIAL CAPACITY // LIVE LAB
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-black dark:text-white"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            FROM RAW ELEMENTS
            <br />
            <span className="text-neutral-400 dark:text-neutral-600">TO HIGH-DENSITY FINISH.</span>
          </h2>
          <p
            className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            We don't outsource. From premium Sublimation Raw Materials and high-end industrial DTF setups to wholesale corporate clothing builds, everything is executed under strict professional standards.
          </p>
          <div
            className="border-l-2 border-black dark:border-white pl-4 py-1 text-[11px] text-neutral-500 dark:text-neutral-400"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ⚡ ADVANCE PAYMENT PROTECTION &nbsp;•&nbsp; 🇵🇰 10,000+ BULK ORDERS DELIVERED
          </div>
        </div>

        {/* RIGHT SCROLLING IMAGES */}
        <div className="flex flex-col gap-4">
          {/* Row 1 — scroll left */}
          <div
            className="flex gap-4 overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div className="flex gap-4 animate-showcase-left">
              {[...row1, ...row1].map((src, i) => (
                <div
                  key={i}
                  className="w-56 h-56 shrink-0 border border-black/10 dark:border-white/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 — scroll right */}
          <div
            className="flex gap-4 overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div className="flex gap-4 animate-showcase-right">
              {[...row2, ...row2].map((src, i) => (
                <div
                  key={i}
                  className="w-56 h-56 shrink-0 border border-black/10 dark:border-white/10 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-showcase-left {
          animation: showcaseLeft 30s linear infinite;
        }
        .animate-showcase-right {
          animation: showcaseRight 30s linear infinite;
        }
        @keyframes showcaseLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes showcaseRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}