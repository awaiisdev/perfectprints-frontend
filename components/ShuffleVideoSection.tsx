"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, Terminal } from "lucide-react";

const squareData = [
  { id: 1, src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80" },
  { id: 2, src: "https://images.unsplash.com/photo-1571945153237-4929e78394a9?w=500&q=80" },
  { id: 3, src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80" },
  { id: 4, src: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=500&q=80" },
  { id: 5, src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&q=80" },
  { id: 6, src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80" },
  { id: 7, src: "https://images.unsplash.com/photo-1513201099495-a6697de526a2?w=500&q=80" },
  { id: 8, src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80" },
  { id: 9, src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80" },
  { id: 10, src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80" },
  { id: 11, src: "https://images.unsplash.com/photo-1606244864456-8bee63fce472?w=500&q=80" },
  { id: 12, src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80" },
  { id: 13, src: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=500&q=80" },
  { id: 14, src: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=500&q=80" },
  { id: 15, src: "https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=500&q=80" },
  { id: 16, src: "https://images.unsplash.com/photo-1580238053495-b9720401fd45?w=500&q=80" },
];

const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const generateSquares = () => {
      const shuffled = shuffle([...squareData]);
      return shuffled.map((sq) => (
        <motion.div
          key={sq.id}
          layout
          transition={{ duration: 1.5, type: "spring", stiffness: 80, damping: 15 }}
          className="w-full h-full rounded-none overflow-hidden bg-[#0a0a0c] border border-[#1a1a1c]/60"
          style={{ backgroundImage: `url(${sq.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
        ></motion.div>
      ));
    };

    setSquares(generateSquares());
    const runShuffle = () => {
      setSquares(generateSquares());
      timeoutRef.current = setTimeout(runShuffle, 3000);
    };
    timeoutRef.current = setTimeout(runShuffle, 3000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1.5 border border-[#1a1a1c] p-1.5 bg-[#050507]">
      {squares}
    </div>
  );
};

export default function ShuffleVideoSection() {
  return (
    <section className="w-full bg-black px-4 py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-7xl mx-auto border-t border-[#1a1a1c]">
      <div className="bg-[#09090b] border border-[#1a1a1c] p-8 flex flex-col justify-between h-[450px] rounded-none relative">
        <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
        <div className="z-10">
          <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1c] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-white animate-pulse" />
              <span className="text-[10px] tracking-[0.2em] font-black text-white uppercase font-mono">LAB_STREAM.LOG // PRODUCTION REELS</span>
            </div>
            <Terminal className="h-3 w-3 text-[#44444a]" />
          </div>
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.4em] text-[#55555a] font-black uppercase block">LIVE GEAR EXECUTION</span>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white uppercase font-serif leading-tight">INSIDE THE <br />PRINT LAB.</h3>
            <p className="text-xs text-[#88888f] font-light max-w-sm tracking-wide leading-relaxed">
              Every drop is monitored. From premium sublimation raw coats to high-density bulk industrial DTF prints, watch our regular flow frames shift positions in real-time execution.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-[#1a1a1c] text-[9px] text-[#44444a] font-mono tracking-widest uppercase flex justify-between items-center z-10">
          <span>🟢 SYSTEM FEED ACTIVE</span>
          <span className="flex items-center gap-1 text-white/60 cursor-pointer hover:text-white transition-colors">TAP TO REPLAY <Play className="h-2 w-2 fill-white" /></span>
        </div>
      </div>
      <div className="relative"><ShuffleGrid /></div>
    </section>
  );
}