"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, getCategories } from "@/lib/woocommerce";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<any>("all");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    Promise.all([getProducts(100), getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeCat !== "all") {
      list = list.filter(p => p.categories?.some((c: any) => c.id === activeCat));
    }
    if (search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === "low") list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sort === "high") list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    return list;
  }, [products, activeCat, sort, search]);

  const activeCatName = activeCat === "all" ? "All Products" : categories.find(c => c.id === activeCat)?.name ?? "";

  return (
    <main className="bg-black text-white min-h-screen pt-24 pb-20 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#1a1a1c] pb-12 mb-12 gap-8">
          <button onClick={() => setIsModalOpen(true)} className="group text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-2">Browse By</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter group-hover:text-neutral-400 transition-colors">
              {activeCatName} +
            </h1>
          </button>
          <input
            type="text"
            placeholder="SEARCH ITEMS..."
            value={search}
            className="bg-transparent border-b border-white w-full md:w-64 text-sm focus:border-neutral-500 outline-none pb-2 text-white placeholder-white uppercase tracking-widest transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-4xl font-light hover:text-neutral-500">✕</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-4xl">
                <button
                  onClick={() => { setActiveCat("all"); setIsModalOpen(false); }}
                  className="text-2xl md:text-3xl font-black uppercase hover:text-neutral-500 transition-colors"
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); setIsModalOpen(false); }}
                    className="text-2xl md:text-3xl font-black uppercase hover:text-neutral-500 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SORT */}
        <div className="flex justify-between items-center mb-16">
          <select
            className="bg-black text-white border border-white px-6 py-2 text-[10px] uppercase font-black tracking-widest outline-none cursor-pointer hover:bg-white hover:text-black transition-all"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Sort: Latest</option>
            <option value="low">Price: Low – High</option>
            <option value="high">Price: High – Low</option>
          </select>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
            {filteredProducts.length} items
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-[#111] mb-4" />
                <div className="h-3 bg-[#111] w-3/4 mb-2" />
                <div className="h-3 bg-[#111] w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <p className="col-span-4 text-center text-neutral-500 uppercase tracking-widest text-xs py-20">
                  Koi product nahi mila
                </p>
              ) : (
                filteredProducts.map(p => (
                  <motion.div
                    layout
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/product/${p.id}`}>
                      <div className="aspect-[4/5] bg-[#0a0a0a] border border-[#1a1a1c] mb-4 overflow-hidden relative">
                        {p.images?.[0]?.src ? (
                          <img
                            src={p.images[0].src}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700 text-xs uppercase tracking-widest">No Image</div>
                        )}
                        {p.on_sale && (
                          <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-black px-2 py-1 uppercase tracking-widest">Sale</span>
                        )}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-1" dangerouslySetInnerHTML={{ __html: p.name }} />
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] text-white font-mono">
                          PKR {parseFloat(p.sale_price || p.price || "0").toLocaleString()}
                        </p>
                        {p.on_sale && p.regular_price && (
                          <p className="text-[11px] text-neutral-600 font-mono line-through">
                            PKR {parseFloat(p.regular_price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <ShopContent />
    </Suspense>
  );
}