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
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeCat !== "all") list = list.filter(p => p.categories?.some((c: any) => c.id === activeCat));
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "low") list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sort === "high") list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    return list;
  }, [products, activeCat, sort, search]);

  const activeCatName = activeCat === "all" ? "All Products" : categories.find(c => c.id === activeCat)?.name ?? "";

  return (
    <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen pt-24 pb-20 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-black/10 dark:border-white/10 pb-12 mb-12 gap-8">
          <button onClick={() => setIsModalOpen(true)} className="group text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Browse By
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter group-hover:text-neutral-400 transition-colors" style={{ fontFamily: "var(--font-montserrat)" }}>
              {activeCatName} +
            </h1>
          </button>
          <input
            type="text"
            placeholder="SEARCH ITEMS..."
            value={search}
            className="bg-transparent border-b border-black dark:border-white w-full md:w-64 text-sm focus:border-neutral-400 outline-none pb-2 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 uppercase tracking-widest transition-all"
            style={{ fontFamily: "var(--font-inter)" }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {[["latest", "Latest"], ["low", "Price: Low"], ["high", "Price: High"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSort(val)}
              className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-widest border transition-all ${
                sort === val
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "bg-transparent text-black dark:text-white border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const price = product.sale_price || product.regular_price || product.price;
              const img = product.images?.[0]?.src;
              return (
                <Link key={product.id} href={`/product/${product.id}`} className="group block">
                  <div className="relative overflow-hidden bg-neutral-50 dark:bg-[#0f0f11] border border-black/10 dark:border-white/10 aspect-square mb-3">
                    {img ? (
                      <img
                        src={img}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700 text-xs uppercase tracking-widest">
                        No Image
                      </div>
                    )}
                    {product.sale_price && (
                      <span className="absolute top-2 left-2 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
                        Sale
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-xs font-black uppercase tracking-tight text-black dark:text-white mb-1 line-clamp-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                    dangerouslySetInnerHTML={{ __html: product.name }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                      PKR {parseFloat(price).toLocaleString()}
                    </span>
                    {product.sale_price && product.regular_price && (
                      <span className="text-xs text-neutral-400 line-through">
                        PKR {parseFloat(product.regular_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <p className="text-neutral-400 text-sm uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
              No products found
            </p>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center p-8 transition-colors duration-300"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-10 right-10 text-4xl font-light text-black dark:text-white hover:text-neutral-400 transition-colors"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center max-w-4xl w-full">
              <button
                onClick={() => { setActiveCat("all"); setIsModalOpen(false); }}
                className="text-2xl md:text-3xl font-black uppercase hover:text-neutral-400 transition-colors text-black dark:text-white"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCat(cat.id); setIsModalOpen(false); }}
                  className="text-2xl md:text-3xl font-black uppercase hover:text-neutral-400 transition-colors text-black dark:text-white"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="bg-white dark:bg-black min-h-screen" />}>
      <ShopContent />
    </Suspense>
  );
}