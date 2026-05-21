"use client";
import React, { useState } from "react";

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState("");

  const handleTrack = () => {
    if (!orderNum) return;
    const msg = `Order Track Request\nOrder Number: ${orderNum}`;
    window.open(`https://wa.me/923010148055?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <main className="bg-black text-white min-h-screen py-24 px-6 md:px-16 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-10">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-[#88888f] uppercase block mb-4">Order Status</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter">TRACK ORDER</h1>
          <p className="text-neutral-500 text-sm mt-4">
            Apna order number enter karo — hum WhatsApp pe status bhej denge.
          </p>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Order Number (e.g. PP-2024-1234)"
            value={orderNum}
            onChange={(e) => setOrderNum(e.target.value)}
            className="w-full bg-transparent border border-[#1a1a1c] p-4 text-sm outline-none focus:border-white text-white placeholder:text-neutral-600"
          />
          <button
            onClick={handleTrack}
            disabled={!orderNum}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all disabled:opacity-30"
          >
            Track via WhatsApp
          </button>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1c] p-6 space-y-2">
          <p className="text-xs font-black uppercase tracking-widest mb-4">Order Status Guide</p>
          {[
            { status: "Confirmed", desc: "Order receive ho gaya hai" },
            { status: "In Production", desc: "Printing/manufacturing chal rahi hai" },
            { status: "Dispatched", desc: "Courier ko hand over kar diya" },
            { status: "Out for Delivery", desc: "Aaj deliver hoga" },
            { status: "Delivered", desc: "Order deliver ho gaya" },
          ].map((s) => (
            <div key={s.status} className="flex gap-4 text-sm py-2 border-b border-[#1a1a1c] last:border-0">
              <span className="font-bold text-white w-32 flex-shrink-0">{s.status}</span>
              <span className="text-neutral-500">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}