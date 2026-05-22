"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, MapPin, Phone, CreditCard, Calendar, MessageCircle } from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const raw = searchParams.get("order");
    if (raw) {
      try {
        setOrder(JSON.parse(decodeURIComponent(raw)));
      } catch {}
    }
  }, [searchParams]);

  if (!order) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const itemsList = order.items?.map((i: any) => {
    const attrs = Object.entries(i.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
    return `• ${i.name}${attrs ? ` | ${attrs}` : ""} | x${i.quantity} = PKR ${(parseFloat(i.price) * i.quantity).toLocaleString()}`;
  }).join("\n");

  const whatsappMessage =
    `🛍️ *New Order #${order.orderNumber} - PerfectPrints*\n\n` +
    `*Customer:* ${order.name}\n` +
    `*Phone:* ${order.phone}\n` +
    `*Address:* ${order.address}, ${order.city}\n\n` +
    `*Items:*\n${itemsList}\n\n` +
    `*Shipping:* PKR ${order.shipping}\n` +
    `*Total:* PKR ${order.total?.toLocaleString()}\n\n` +
    `*Payment:* ${order.paymentMethod}\n` +
    `*Date:* ${order.date}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/923010148055?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
  };

  return (
    <main className="bg-black text-white min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* TOP SUCCESS */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-3">
            PerfectPrints — Order Confirmed
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-3">
            Thank You!
          </h1>
          <p className="text-neutral-400 text-sm">
            {order.name} — aapka order successfully place ho gaya hai.
          </p>
        </div>

        {/* ORDER NUMBER */}
        <div className="border border-white/10 p-8 mb-6 text-center bg-[#050507]">
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-3">Order Number</p>
          <p className="text-6xl font-black tracking-tighter text-white">#{order.orderNumber}</p>
          <p className="text-neutral-500 text-xs mt-3 uppercase tracking-widest">{order.date}</p>
        </div>

        {/* WHATSAPP BUTTON */}
        <button
          onClick={handleWhatsApp}
          className="w-full mb-6 py-4 bg-[#25D366] text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-[#1da851] transition-all flex items-center justify-center gap-3"
        >
          <MessageCircle className="w-5 h-5" />
          Send Order Details on WhatsApp
        </button>

        {/* ORDER DETAILS */}
        <div className="border border-white/10 bg-[#050507] mb-6">

          {/* Items */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <Package className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-white">Items Ordered</h2>
            </div>
            <div className="space-y-5">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 items-center">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-16 object-cover border border-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-grow">
                    <p className="text-xs font-bold uppercase text-white leading-snug" dangerouslySetInnerHTML={{ __html: item.name }} />
                    {Object.entries(item.attributes || {}).map(([k, v]: any) => (
                      <p key={k} className="text-[11px] text-neutral-400 uppercase mt-0.5">{k}: {v}</p>
                    ))}
                    <p className="text-[11px] text-neutral-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black text-white">
                    PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="p-6 border-b border-white/10 space-y-2">
            <div className="flex justify-between text-xs text-neutral-400 uppercase">
              <span>Subtotal</span>
              <span>PKR {(order.total - order.shipping).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400 uppercase">
              <span>Shipping</span>
              <span>PKR {order.shipping}</span>
            </div>
            <div className="flex justify-between text-sm font-black uppercase pt-3 border-t border-white/10 text-white">
              <span>Total</span>
              <span>PKR {order.total?.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Info — properly visible */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3 items-start">
              <Phone className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Phone</p>
                <p className="text-sm font-bold text-white">{order.phone}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <MapPin className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Delivery Address</p>
                <p className="text-sm font-bold text-white">{order.address}, {order.city}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <CreditCard className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Payment Method</p>
                <p className="text-sm font-bold text-white">{order.paymentMethod}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Calendar className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Order Date</p>
                <p className="text-sm font-bold text-white">{order.date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* DELIVERY NOTE */}
        <div className="border border-white/10 p-5 mb-8 text-center bg-[#050507]">
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            📦 Delivery 3-5 working days mein ho gi
          </p>
          <p className="text-xs text-neutral-600 mt-1 uppercase tracking-widest">
            Koi sawal? WhatsApp button se rabta karein
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/shop")}
            className="flex-1 py-4 border border-white/20 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <ThankYouContent />
    </Suspense>
  );
}