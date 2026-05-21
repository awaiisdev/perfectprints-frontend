"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/woocommerce";

const TABS = [
  { id: "all", label: "ALL LAB RELEASES" },
  { id: "custom-clothing", label: "STREETWEAR CLOTHING" },
  { id: "personalized-gifts", label: "PERSONALIZED GIFTS" },
  { id: "dtf-printing", label: "DTF PRINT SHOP" },
  { id: "sublimation-raw", label: "RAW MATERIALS" },
];

export default function ProductGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts(12)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) =>
          p.categories?.some((c: any) =>
            c.slug?.includes(activeTab)
          )
        );

  return (
    <section className="w-full bg-black py-24 px-4 border-t border-[#1a1a1c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-white font-black uppercase block mb-2">
              CATALOGUE SYSTEM // CURRENT RELEASES
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white uppercase font-serif">
              READY FOR EXECUTION
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-300 rounded-none border ${
                  activeTab === tab.id
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-[#44444a] border-[#1a1a1c] hover:border-[#44444a] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#050507] border border-[#1a1a1c] p-4 animate-pulse">
                <div className="aspect-square w-full bg-[#1a1a1c] mb-5" />
                <div className="h-4 bg-[#1a1a1c] mb-2 w-3/4" />
                <div className="h-3 bg-[#1a1a1c] w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <p className="col-span-3 text-center text-neutral-500 uppercase tracking-widest text-xs py-20">
                  Koi product nahi mila
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                    key={product.id}
                    className="group relative bg-[#050507] border border-[#1a1a1c] p-4 flex flex-col justify-between hover:border-[#333339]"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-square w-full overflow-hidden bg-[#09090b] border border-[#1a1a1c] mb-5">
                        <span className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md border border-[#1a1a1c] px-2.5 py-1 text-[9px] font-mono font-bold text-[#88888f] tracking-widest uppercase">
                          {product.categories?.[0]?.name ?? "NEW"}
                        </span>
                        {product.images?.[0]?.src ? (
                          <img
                            src={product.images[0].src}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#333]">
                            NO IMAGE
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="w-10 h-10 bg-white text-black flex items-center justify-center">
                            <Plus className="h-5 w-5 stroke-[2.5]" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-extrabold tracking-tight text-white uppercase">
                          {product.name}
                        </h4>
                        <div className="flex justify-between items-center pt-3 border-t border-[#1a1a1c]">
                          <span className="text-xs font-mono font-bold text-[#66666f]">
                            PKR {parseFloat(product.price || "0").toLocaleString()}
                          </span>
                          <span className="text-[10px] tracking-widest font-black text-white uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                            LAB VIEW <ArrowRight className="h-3 w-3 stroke-[3]" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="flex justify-center">
          <Link
            href="/shop"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-[#333] hover:text-white transition-all duration-300"
          >
            SEE FULL CATALOGUE{" "}
            <ArrowRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}