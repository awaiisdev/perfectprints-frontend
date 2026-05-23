"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CartDrawer({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const router = useRouter();
  const { items, removeItem, updateQty, total, count } = useCart();
  const shipping = items.length > 0 ? 200 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-[999]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white dark:bg-black border-l border-black/10 dark:border-white/10 z-[1000] flex flex-col transition-colors duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 sm:px-8 py-6 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-black dark:text-white" />
                <h2
                  className="text-sm font-black uppercase tracking-widest text-black dark:text-white"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Your Bag
                  {count > 0 && (
                    <span className="text-neutral-400 font-normal ml-1">({count})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black dark:text-white hover:text-neutral-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <ShoppingBag className="w-10 h-10 text-neutral-200 dark:text-neutral-700" />
                  <p
                    className="text-xs uppercase tracking-widest text-neutral-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Your bag is empty
                  </p>
                  <button
                    onClick={() => { setIsOpen(false); router.push("/shop"); }}
                    className="text-[10px] uppercase tracking-widest border border-black/20 dark:border-white/20 px-6 py-3 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.attributes)}`} className="flex gap-4 border-b border-black/10 dark:border-white/10 pb-6">
                    {/* Image */}
                    <div className="w-16 sm:w-20 h-20 sm:h-24 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3
                          className="text-xs font-black uppercase text-black dark:text-white leading-tight pr-2"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                          dangerouslySetInnerHTML={{ __html: item.name }}
                        />
                        <button
                          onClick={() => removeItem(item.id, item.attributes)}
                          className="text-neutral-300 dark:text-neutral-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {Object.entries(item.attributes || {}).map(([k, v]) => (
                        <p
                          key={k}
                          className="text-[10px] text-neutral-400 uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {k}: {v}
                        </p>
                      ))}

                      <div className="flex justify-between items-center mt-2">
                        {/* Qty Controls */}
                        <div className="flex items-center border border-black/10 dark:border-white/10">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1, item.attributes)}
                            className="px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            className="px-3 text-xs font-black text-black dark:text-white"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1, item.attributes)}
                            className="px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <p
                          className="text-sm font-black text-black dark:text-white"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 sm:px-8 py-6 border-t border-black/10 dark:border-white/10 space-y-4 bg-white dark:bg-black">
                <div className="flex justify-between text-xs text-neutral-400 uppercase" style={{ fontFamily: "var(--font-inter)" }}>
                  <span>Shipping</span>
                  <span>PKR {shipping}</span>
                </div>
                <div
                  className="flex justify-between text-black dark:text-white font-black text-lg uppercase"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <span>Total</span>
                  <span>PKR {(total + shipping).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); router.push("/checkout"); }}
                  className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:opacity-80 transition-all"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Checkout Now
                </button>
                <p
                  className="text-[10px] text-neutral-400 text-center uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Free shipping on orders above PKR 3,000
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}