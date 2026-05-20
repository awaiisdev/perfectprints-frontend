"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

// 1. Data yahan define karein
const INITIAL_PRODUCTS = [
  { id: 1, title: "Heavyweight Boxy Streetwear Tee (260 GSM)", price: "Rs. 2,450", category: "custom-clothing", tag: "DROP 01 // NEW", imgSrc: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80" },
  { id: 2, title: "Premium Acrylic Photo Frame Grid", price: "Rs. 1,890", category: "personalized-gifts", tag: "ZERO MINIMUM", imgSrc: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80" },
  { id: 3, title: "High-Density Industrial DTF Transfer Roll", price: "Rs. 450 / Meter", category: "dtf-printing", tag: "B2B RETAIL", imgSrc: "https://images.unsplash.com/photo-1571945153237-4929e78394a9?w=600&q=80" },
  { id: 4, title: "Wholesale Sublimation Coating Mug Blank", price: "Rs. 185", category: "sublimation-raw", tag: "WHOLESALE RATE", imgSrc: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&q=80" },
  { id: 5, title: "Custom Pakistan Cricket Fan Jersey 2026", price: "Rs. 1,999", category: "cricket-merch", tag: "LIMITED EDITION", imgSrc: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80" },
  { id: 6, title: "Corporate Branded Executive Keychains (Bulk)", price: "Call for Pricing", category: "promotional-branded", tag: "MIN. 50 PCS", imgSrc: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80" },
];

const TABS = [
  { id: "all", label: "ALL LAB RELEASES" },
  { id: "custom-clothing", label: "STREETWEAR CLOTHING" },
  { id: "personalized-gifts", label: "PERSONALIZED GIFTS" },
  { id: "dtf-printing", label: "DTF PRINT SHOP" },
  { id: "sublimation-raw", label: "RAW MATERIALS" },
];

// 2. Component yahan start hoga
export default function ProductGrid() {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredProducts = activeTab === "all" 
    ? INITIAL_PRODUCTS 
    : INITIAL_PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <section className="w-full bg-black py-24 px-4 border-t border-[#1a1a1c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-white font-black uppercase block mb-2">CATALOGUE SYSTEM // CURRENT RELEASES</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white uppercase font-serif">READY FOR EXECUTION</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-300 rounded-none border ${activeTab === tab.id ? "bg-white text-black border-white" : "bg-transparent text-[#44444a] border-[#1a1a1c] hover:border-[#44444a] hover:text-white"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }} key={product.id} className="group relative bg-[#050507] border border-[#1a1a1c] p-4 flex flex-col justify-between hover:border-[#333339]">
                <div className="relative aspect-square w-full overflow-hidden bg-[#09090b] border border-[#1a1a1c] mb-5">
                  <span className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md border border-[#1a1a1c] px-2.5 py-1 text-[9px] font-mono font-bold text-[#88888f] tracking-widest uppercase">{product.tag}</span>
                  <img src={product.imgSrc} alt={product.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-white text-black flex items-center justify-center"><Plus className="h-5 w-5 stroke-[2.5]" /></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold tracking-tight text-white uppercase transition-colors">{product.title}</h4>
                  <div className="flex justify-between items-center pt-3 border-t border-[#1a1a1c]">
                    <span className="text-xs font-mono font-bold text-[#66666f]">{product.price}</span>
                    <span className="text-[10px] tracking-widest font-black text-white uppercase flex items-center gap-1 group-hover:gap-2 transition-all">LAB VIEW <ArrowRight className="h-3 w-3 stroke-[3]" /></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-center">
          <Link href="/shop" className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-[#333] hover:text-white transition-all duration-300">
            SEE FULL CATALOGUE <ArrowRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}