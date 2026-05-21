"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CartDrawer({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const router = useRouter();
  const { items, removeItem, updateQty, total, count } = useCart();
  const shipping = items.length > 0 ? 200 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-black border-l border-white/10 z-[1000] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 sm:px-8 py-6 border-b border-white/10">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Your Bag {count > 0 && <span className="text-neutral-400">({count})</span>}
              </h2>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-600 gap-4">
                  <p className="text-xs uppercase tracking-widest">Your bag is empty</p>
                  <button
                    onClick={() => { setIsOpen(false); router.push("/shop"); }}
                    className="text-[10px] uppercase tracking-widest border border-white/20 px-6 py-3 text-white hover:bg-white hover:text-black transition-all"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-white/10 pb-6">
                    <div className="w-16 sm:w-20 h-20 sm:h-24 bg-neutral-900 border border-white/10 overflow-hidden flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase text-white leading-tight pr-2"
                          dangerouslySetInnerHTML={{ __html: item.name }} />
                        <button onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-neutral-500 hover:text-white" />
                        </button>
                      </div>
                      {Object.entries(item.attributes || {}).map(([k, v]) => (
                        <p key={k} className="text-[10px] text-neutral-500 uppercase tracking-wider">{k}: {v}</p>
                      ))}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-white/10">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-white/10">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-white/10">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-black">
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
              <div className="px-6 sm:px-8 py-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-xs text-neutral-400 uppercase">
                  <span>Shipping</span><span>PKR {shipping}</span>
                </div>
                <div className="flex justify-between text-white font-black text-lg uppercase">
                  <span>Total</span>
                  <span>PKR {(total + shipping).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); router.push("/checkout"); }}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}