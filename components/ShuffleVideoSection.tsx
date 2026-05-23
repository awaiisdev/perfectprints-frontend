"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";

const squareData = [
  { id: 1, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451591/ChatGPT_Image_May_22_2026_04_54_45_AM_uwdszx.png" },
  { id: 2, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_55_43_AM_r2pfpw.png" },
  { id: 3, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_57_25_AM_mmcvya.png" },
  { id: 4, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_04_59_38_AM_fltole.png" },
  { id: 5, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_05_01_05_AM_sfupjk.png" },
  { id: 6, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451593/ChatGPT_Image_May_22_2026_05_02_16_AM_iu4jqx.png" },
  { id: 7, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451586/ChatGPT_Image_May_22_2026_05_03_26_AM_kpli5p.png" },
  { id: 8, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_05_01_05_AM_sfupjk.png" },
  { id: 9, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451591/ChatGPT_Image_May_22_2026_04_54_45_AM_uwdszx.png" },
  { id: 10, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_55_43_AM_r2pfpw.png" },
  { id: 11, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_57_25_AM_mmcvya.png" },
  { id: 12, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_04_59_38_AM_fltole.png" },
  { id: 13, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451593/ChatGPT_Image_May_22_2026_05_02_16_AM_iu4jqx.png" },
  { id: 14, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451586/ChatGPT_Image_May_22_2026_05_03_26_AM_kpli5p.png" },
  { id: 15, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_05_01_05_AM_sfupjk.png" },
  { id: 16, src: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451591/ChatGPT_Image_May_22_2026_04_54_45_AM_uwdszx.png" },
];

const shuffle = (arr: typeof squareData) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState<typeof squareData>([]);

  useEffect(() => {
    setSquares(shuffle(squareData));
    const run = () => {
      setSquares(shuffle(squareData));
      timeoutRef.current = setTimeout(run, 3000);
    };
    timeoutRef.current = setTimeout(run, 3000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-1.5 border border-black/10 dark:border-white/10 p-1.5 bg-neutral-100 dark:bg-[#050507]">
      {squares.map((sq) => (
        <motion.div
          key={sq.id}
          layout
          transition={{ duration: 1.5, type: "spring", stiffness: 80, damping: 15 }}
          className="aspect-square w-full overflow-hidden bg-neutral-200 dark:bg-[#0a0a0c] border border-black/10 dark:border-white/10"
          style={{ backgroundImage: `url(${sq.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ))}
    </div>
  );
};

export default function ShuffleVideoSection() {
  return (
    <section className="w-full bg-white dark:bg-black border-t border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

        {/* LEFT TEXT CARD */}
        <div className="bg-neutral-50 dark:bg-[#09090b] border border-black/10 dark:border-white/10 p-8 flex flex-col justify-between relative overflow-hidden min-h-[450px]">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #00000015 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          />
          <div className="z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span
                  className="text-[10px] tracking-[0.2em] font-black text-black dark:text-white uppercase"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  LAB_STREAM.LOG // PRODUCTION REELS
                </span>
              </div>
              <Terminal className="h-3 w-3 text-neutral-400" />
            </div>

            <div className="space-y-4">
              <span
                className="text-[10px] tracking-[0.4em] text-neutral-400 font-black uppercase block"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                LIVE GEAR EXECUTION
              </span>
              <h3
                className="text-3xl md:text-5xl font-black tracking-tighter text-black dark:text-white uppercase leading-tight"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                INSIDE THE<br />PRINT LAB.
              </h3>
              <p
                className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Every drop is monitored. From premium sublimation raw coats to high-density bulk industrial DTF prints — watch our production flow in real-time execution.
              </p>
            </div>
          </div>

          <div
            className="pt-4 border-t border-black/10 dark:border-white/10 text-[9px] text-neutral-400 uppercase flex justify-between items-center z-10 mt-6"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span>🟢 SYSTEM FEED ACTIVE</span>
            <span className="text-black dark:text-white font-black tracking-widest">LIVE ▶</span>
          </div>
        </div>

        {/* RIGHT SHUFFLE GRID */}
        <div className="relative">
          <ShuffleGrid />
        </div>

      </div>
    </section>
  );
}