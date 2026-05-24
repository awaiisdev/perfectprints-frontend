"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

function CheckoutInner() {
  const { items, total, clearCart, removeItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipping = 200;
  const grandTotal = total + shipping;
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState("Direct");

  useEffect(() => {
    // URL params se source capture karo
    const utm = searchParams.get("utm_source");
    const fbclid = searchParams.get("fbclid");
    const ref = document.referrer;

    if (fbclid || utm === "fb" || utm === "facebook") {
      setSource("Source: Fb");
    } else if (utm === "ig" || utm === "instagram") {
      setSource("Source: Ig");
    } else if (utm) {
      setSource(`Source: ${utm}`);
    } else if (ref.includes("facebook")) {
      setSource("Source: Fb");
    } else if (ref.includes("instagram")) {
      setSource("Source: Ig");
    } else if (ref.includes("google")) {
      setSource("Source: Google");
    } else if (ref.includes("tiktok")) {
      setSource("Source: TikTok");
    } else if (ref.includes("pinterest")) {
      setSource("Source: Pinterest");
    } else if (ref.includes("whatsapp")) {
      setSource("Source: WhatsApp");
    }

    // LocalStorage se bhi check karo agar pehle aaya tha
    const saved = localStorage.getItem("pp_source");
    if (saved) setSource(saved);

    // Save karo
    if (fbclid || utm) {
      const s = fbclid ? "Source: Fb" : `Source: ${utm}`;
      localStorage.setItem("pp_source", s);
      setSource(s);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = form.name && form.address && form.city && form.phone && paymentMethod && items.length > 0;

  const handleOrder = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          paymentMethod,
          items,
          shipping,
          total: grandTotal,
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const itemsList = items.map((i) => {
        const attrs = Object.entries(i.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
        return `• ${i.name}${attrs ? ` | ${attrs}` : ""} | x${i.quantity} = PKR ${(parseFloat(i.price) * i.quantity).toLocaleString()}`;
      }).join("\n");

      const ownerMessage =
        `🛍️ *New Order #${data.orderNumber} — PerfectPrints*\n\n` +
        `*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*Address:* ${form.address}, ${form.city}\n\n` +
        `*Items:*\n${itemsList}\n\n*Shipping:* PKR ${shipping}\n*Total:* PKR ${grandTotal.toLocaleString()}\n\n*Payment:* ${paymentMethod}\n*Source:* ${source}`;

      const customerPhone = form.phone.replace(/^0/, "92").replace(/\s+/g, "");
      const customerMessage =
        `✅ *Order Confirmed — PerfectPrints*\n\nHi ${form.name}! 🎉\n\n` +
        `Your order *#${data.orderNumber}* has been successfully placed.\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Delivery Address:* ${form.address}, ${form.city}\n` +
        `*Shipping:* PKR ${shipping}\n` +
        `*Total:* PKR ${grandTotal.toLocaleString()}\n` +
        `*Payment:* ${paymentMethod}\n\n` +
        `Estimated delivery: 3–5 working days.\nFor any queries, just reply to this message.\n\n— *PerfectPrints Team* 🙏`;

      const orderData = encodeURIComponent(JSON.stringify({
        orderNumber: data.orderNumber,
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        paymentMethod,
        items,
        shipping,
        total: grandTotal,
        ownerMessage,
        customerMessage,
        customerPhone,
        date: new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" }),
      }));

      localStorage.removeItem("pp_source");
      clearCart();
      router.push(`/thank-you?order=${orderData}`);

      setTimeout(() => {
        window.open(`https://wa.me/923010148055?text=${encodeURIComponent(ownerMessage)}`, "_blank");
      }, 800);

      setTimeout(() => {
        window.open(`https://wa.me/${customerPhone}?text=${encodeURIComponent(customerMessage)}`, "_blank");
      }, 2000);

    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen py-16 px-4 sm:px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16">

        {/* LEFT — FORM */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-black/10 dark:border-white/10 pb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
            Delivery Information
          </h2>
          <div className="space-y-4">
            {[
              { name: "name", placeholder: "Full Name" },
              { name: "phone", placeholder: "Phone Number (03XXXXXXXXX)" },
              { name: "address", placeholder: "Full Address" },
              { name: "city", placeholder: "City" },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-4 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400 transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>
              Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Cash on Delivery", "EasyPaisa / JazzCash", "Bank Transfer"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-4 border text-[10px] font-semibold uppercase tracking-widest transition-all ${
                    paymentMethod === method
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "border-black/10 dark:border-white/10 text-neutral-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs uppercase tracking-widest border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-400/5 p-3" style={{ fontFamily: "var(--font-inter)" }}>
              ⚠ {error}
            </p>
          )}

          <button
            onClick={handleOrder}
            disabled={!isFormValid || loading}
            className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:opacity-80 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>

          <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center" style={{ fontFamily: "var(--font-inter)" }}>
            A WhatsApp confirmation will be sent after order is placed
          </p>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="bg-neutral-50 dark:bg-[#050507] border border-black/10 dark:border-white/10 p-6 sm:p-8 h-fit md:sticky md:top-10 order-first md:order-last">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
            Order Summary
          </h2>
          {items.length === 0 ? (
            <p className="text-neutral-400 text-xs uppercase tracking-widest text-center py-8" style={{ fontFamily: "var(--font-inter)" }}>
              Your cart is empty
            </p>
          ) : (
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.attributes)}`} className="flex gap-4 items-start">
                  <div className="w-16 h-20 bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex flex-col justify-center gap-1 flex-grow">
                    <h3 className="text-xs font-black uppercase text-black dark:text-white leading-tight" style={{ fontFamily: "var(--font-montserrat)" }} dangerouslySetInnerHTML={{ __html: item.name }} />
                    {Object.entries(item.attributes || {}).map(([k, v]) => (
                      <p key={k} className="text-[10px] text-neutral-400 uppercase" style={{ fontFamily: "var(--font-inter)" }}>{k}: {v}</p>
                    ))}
                    <p className="text-[10px] text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>Qty: {item.quantity}</p>
                    <p className="text-xs font-black text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                      PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-neutral-300 dark:text-neutral-600 hover:text-red-500 transition-colors flex-shrink-0 mt-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3 border-t border-black/10 dark:border-white/10 pt-6 text-xs uppercase font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span><span>PKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Shipping</span><span>PKR {shipping}</span>
            </div>
            <div className="flex justify-between items-center text-black dark:text-white text-base pt-2 border-t border-black/10 dark:border-white/10 font-black" style={{ fontFamily: "var(--font-montserrat)" }}>
              <span>Total</span><span>PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <CheckoutInner />
    </Suspense>
  );
}