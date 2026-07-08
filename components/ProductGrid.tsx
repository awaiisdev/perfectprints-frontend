"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/woocommerce";

const TABS = [
  { id: "all", label: "All Releases" },
  { id: "custom-clothing", label: "Streetwear" },
  { id: "personalized-gifts", label: "Gifts" },
  { id: "dtf-printing", label: "DTF Print" },
  { id: "sublimation-raw", label: "Raw Materials" },
];

export default function ProductGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts(12)
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  const filteredProducts = activeTab === "all"
    ? products
    : products.filter((p) => p.categories?.some((c: any) => c.slug?.includes(activeTab)));

  return (
    <section className="w-full bg-white dark:bg-black py-24 px-4 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <span
              className="text-[10px] tracking-[0.4em] text-neutral-400 font-black uppercase block mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              CATALOGUE SYSTEM // CURRENT RELEASES
            </span>
            <h2
              className="text-3xl md:text-5xl font-black tracking-tighter text-black dark:text-white uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              READY FOR EXECUTION
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[10px] font-semibold tracking-widest uppercase transition-all border ${
                  activeTab === tab.id
                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                    : "bg-transparent text-neutral-400 border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-neutral-50 dark:bg-[#050507] border border-black/10 dark:border-white/10 p-4 animate-pulse">
                <div className="aspect-square w-full bg-neutral-200 dark:bg-[#1a1a1c] mb-5" />
                <div className="h-4 bg-neutral-200 dark:bg-[#1a1a1c] mb-2 w-3/4" />
                <div className="h-3 bg-neutral-200 dark:bg-[#1a1a1c] w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <p
                  className="col-span-3 text-center text-neutral-400 uppercase tracking-widest text-xs py-20"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  No products found
                </p>
              ) : (
                filteredProducts.map((product) => {
                  const price = product.sale_price || product.regular_price || product.price || "0";
                  const img = product.images?.[0]?.src;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4 }}
                      key={product.id}
                      className="group relative bg-white dark:bg-[#050507] border border-black/10 dark:border-white/10 p-4 flex flex-col hover:border-black/30 dark:hover:border-white/30 transition-all"
                    >
                      <Link href={`/product/${product.id}`}>
                        {/* Image */}
                        <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-[#09090b] border border-black/10 dark:border-white/10 mb-5">
                          {/* Category Badge */}
                          <span
                            className="absolute top-3 left-3 z-20 bg-white dark:bg-black/80 border border-black/10 dark:border-white/10 px-2.5 py-1 text-[9px] font-black text-neutral-500 tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {product.categories?.[0]?.name ?? "NEW"}
                          </span>

                          {/* Sale Badge */}
                          {product.sale_price && (
                            <span className="absolute top-3 right-3 z-20 bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                              SALE
                            </span>
                          )}

                          {img ? (
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              className="object-cover opacity-95 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700 text-xs uppercase tracking-widest">
                              No Image
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                              <Plus className="h-5 w-5 stroke-[2.5]" />
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-3">
                          <h4
                            className="text-sm font-black tracking-tight text-black dark:text-white uppercase line-clamp-2"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                            dangerouslySetInnerHTML={{ __html: product.name }}
                          />
                          <div className="flex justify-between items-center pt-3 border-t border-black/10 dark:border-white/10">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-sm font-black text-black dark:text-white"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                              >
                                PKR {parseFloat(price).toLocaleString()}
                              </span>
                              {product.sale_price && product.regular_price && (
                                <span className="text-xs text-neutral-400 line-through">
                                  PKR {parseFloat(product.regular_price).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span
                              className="text-[10px] tracking-widest font-black text-black dark:text-white uppercase flex items-center gap-1 group-hover:gap-2 transition-all"
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              VIEW <ArrowRight className="h-3 w-3 stroke-[3]" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* See All Button */}
        <div className="flex justify-center">
          <Link
            href="/shop"
            className="group flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:opacity-80 transition-all"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            SEE FULL CATALOGUE
            <ArrowRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}