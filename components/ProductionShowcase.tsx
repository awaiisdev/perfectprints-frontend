"use client";

import React from 'react';

const row1 = [
  "https://images.unsplash.com/photo-1600805625047-a65db4b4e8d0?w=500&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80",
  "https://images.unsplash.com/photo-1663433541063-ddab084d1126?w=500&q=80",
];

const row2 = [
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80",
  "https://images.unsplash.com/photo-1571945153237-4929e78394a9?w=500&q=80",
  "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=500&q=80",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
];

export default function ProductionShowcase() {
  return (
    <section className="bg-white text-black py-24 px-4 border-t border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="space-y-6">
          <span className="text-[10px] tracking-[0.4em] text-gray-500 font-black uppercase">INDUSTRIAL CAPACITY // LIVE LAB</span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase font-serif leading-none">
            FROM RAW ELEMENTS <br/> 
            <span className="text-gray-400">TO HIGH-DENSITY FINISH.</span>
          </h2>
          <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
            We don't outsource. From premium Sublimation Raw Materials and high-end industrial DTF setups to wholesale corporate clothing builds, everything is executed under strict professional geometry.
          </p>
          <div className="border-l-2 border-black pl-4 py-1 text-[11px] font-mono text=black/70">
            ⚡ ADVANCE PAYMENT PROTECTION • 🇵🇰 10,000+ BULK ORDERS DELIVERED
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 overflow-hidden">
            <div className="flex gap-4 animate-scroll-left">
              {[...row1, ...row1].map((src, i) => (
                <div key={i} className="w-40 h-40 shrink-0 border border-gray-200 overflow-hidden shadow-sm">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            <div className="flex gap-4 animate-scroll-right">
              {[...row2, ...row2].map((src, i) => (
                <div key={i} className="w-40 h-40 shrink-0 border border-gray-200 overflow-hidden shadow-sm">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-scroll-left { animation: scrollLeft 30s linear infinite; }
        .animate-scroll-right { animation: scrollRight 30s linear infinite; }
        @keyframes scrollLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scrollRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </section>
  );
}