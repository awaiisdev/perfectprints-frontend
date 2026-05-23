"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, MapPin, Phone, CreditCard, Calendar, MessageCircle } from "lucide-react";

declare global {
  interface Window { fbq?: (...args: any[]) => void; }
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const raw = searchParams.get("order");
    if (raw) {
      try { setOrder(JSON.parse(decodeURIComponent(raw))); } catch {}
    }
  }, [searchParams]);

  useEffect(() => {
    if (order && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", {
        value: order.total,
        currency: "PKR",
        content_ids: order.items?.map((i: any) => String(i.id)) ?? [],
        content_type: "product",
        num_items: order.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) ?? 0,
      });
    }
  }, [order]);

  if (!order) {
    return (
      <main className="bg-white dark:bg-black min-h-screen flex items-center justify-center transition-colors duration-300">
        <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const itemsList = order.items?.map((i: any) => {
    const attrs = Object.entries(i.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
    return `• ${i.name}${attrs ? ` | ${attrs}` : ""} | x${i.quantity} = PKR ${(parseFloat(i.price) * i.quantity).toLocaleString()}`;
  }).join("\n");

  const whatsappMessage =
    `🛍️ *New Order #${order.orderNumber} — PerfectPrints*\n\n` +
    `*Customer:* ${order.name}\n*Phone:* ${order.phone}\n*Address:* ${order.address}, ${order.city}\n\n` +
    `*Items:*\n${itemsList}\n\n*Shipping:* PKR ${order.shipping}\n*Total:* PKR ${order.total?.toLocaleString()}\n\n` +
    `*Payment:* ${order.paymentMethod}\n*Date:* ${order.date}`;

  return (
    <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen py-16 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">

        {/* SUCCESS HEADER */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 border border-black/20 dark:border-white/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-black dark:text-white" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
            PerfectPrints — Order Confirmed
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
            Thank You!
          </h1>
          <p className="text-neutral-500 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
            {order.name} — your order has been successfully placed.
          </p>
        </div>

        {/* ORDER NUMBER */}
        <div className="border border-black/10 dark:border-white/10 p-8 mb-6 text-center bg-neutral-50 dark:bg-[#050507]">
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
            Order Number
          </p>
          <p className="text-6xl font-black tracking-tighter text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
            #{order.orderNumber}
          </p>
          <p className="text-neutral-400 text-xs mt-3 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
            {order.date}
          </p>
        </div>

        {/* WHATSAPP BUTTON */}
        <button
          onClick={() => window.open(`https://wa.me/923010148055?text=${encodeURIComponent(whatsappMessage)}`, "_blank")}
          className="w-full mb-6 py-4 bg-[#25D366] text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-[#1da851] transition-all flex items-center justify-center gap-3"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          <MessageCircle className="w-5 h-5" />
          Send Order Details on WhatsApp
        </button>

        {/* ORDER DETAILS */}
        <div className="border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#050507] mb-6">

          {/* Items */}
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <Package className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                Items Ordered
              </h2>
            </div>
            <div className="space-y-5">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 items-center">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-16 object-cover border border-black/10 dark:border-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-grow">
                    <p className="text-xs font-black uppercase text-black dark:text-white leading-snug" style={{ fontFamily: "var(--font-montserrat)" }} dangerouslySetInnerHTML={{ __html: item.name }} />
                    {Object.entries(item.attributes || {}).map(([k, v]: any) => (
                      <p key={k} className="text-[11px] text-neutral-400 uppercase mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>{k}: {v}</p>
                    ))}
                    <p className="text-[11px] text-neutral-400 mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                    PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-6 border-b border-black/10 dark:border-white/10 space-y-2">
            {[
              ["Subtotal", `PKR ${(order.total - order.shipping).toLocaleString()}`],
              ["Shipping", `PKR ${order.shipping}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-xs text-neutral-400 uppercase" style={{ fontFamily: "var(--font-inter)" }}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-black uppercase pt-3 border-t border-black/10 dark:border-white/10 text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              <span>Total</span>
              <span>PKR {order.total?.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Phone, label: "Phone", value: order.phone },
              { icon: MapPin, label: "Delivery Address", value: `${order.address}, ${order.city}` },
              { icon: CreditCard, label: "Payment Method", value: order.paymentMethod },
              { icon: Calendar, label: "Order Date", value: order.date },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3 items-start">
                <Icon className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1" style={{ fontFamily: "var(--font-inter)" }}>{label}</p>
                  <p className="text-sm font-black text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DELIVERY NOTE */}
        <div className="border border-black/10 dark:border-white/10 p-5 mb-8 text-center bg-neutral-50 dark:bg-[#050507]">
          <p className="text-xs text-neutral-500 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
            📦 Estimated delivery: 3–5 working days
          </p>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
            Any questions? Use the WhatsApp button above
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:opacity-80 transition-all"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/shop")}
            className="flex-1 py-4 border border-black/20 dark:border-white/20 text-black dark:text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            style={{ fontFamily: "var(--font-montserrat)" }}
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
    <Suspense fallback={<div className="bg-white dark:bg-black min-h-screen transition-colors duration-300" />}>
      <ThankYouContent />
    </Suspense>
  );
}