"use client";
import React, { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function CheckoutPage() {
  const { items, total, clearCart, removeItem } = useCart();
  const router = useRouter();
  const shipping = 200;
  const grandTotal = total + shipping;
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError("Order submit karne mein masla hua. Dobara koshish karein.");
        setLoading(false);
        return;
      }

      const itemsList = items.map((i) => {
        const attrs = Object.entries(i.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
        return `• ${i.name}${attrs ? ` | ${attrs}` : ""} | x${i.quantity} = PKR ${(parseFloat(i.price) * i.quantity).toLocaleString()}`;
      }).join("\n");

      const ownerMessage =
        `🛍️ *New Order #${data.orderNumber} - PerfectPrints*\n\n` +
        `*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*Address:* ${form.address}, ${form.city}\n\n` +
        `*Items:*\n${itemsList}\n\n*Shipping:* PKR ${shipping}\n*Total:* PKR ${grandTotal.toLocaleString()}\n\n*Payment:* ${paymentMethod}`;

      const customerPhone = form.phone.replace(/^0/, "92").replace(/\s+/g, "");
      const customerMessage =
        `✅ *Order Confirmed! - PerfectPrints*\n\n` +
        `Assalam o Alaikum ${form.name}! 🎉\n\n` +
        `Aapka order *#${data.orderNumber}* successfully place ho gaya hai.\n\n` +
        `*Order Details:*\n${itemsList}\n\n` +
        `*Delivery Address:* ${form.address}, ${form.city}\n` +
        `*Shipping:* PKR ${shipping}\n` +
        `*Total Amount:* PKR ${grandTotal.toLocaleString()}\n` +
        `*Payment Method:* ${paymentMethod}\n\n` +
        `Delivery 3-5 working days mein ho gi.\n` +
        `Koi sawal ho to reply karein. Shukriya! 🙏\n\n` +
        `— *PerfectPrints Team*`;

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

      clearCart();
      router.push(`/thank-you?order=${orderData}`);

      setTimeout(() => {
        window.open(`https://wa.me/923010148055?text=${encodeURIComponent(ownerMessage)}`, "_blank");
      }, 800);

      setTimeout(() => {
        window.open(`https://wa.me/${customerPhone}?text=${encodeURIComponent(customerMessage)}`, "_blank");
      }, 2000);

    } catch (err) {
      setError("Network error. Internet check karein aur dobara koshish karein.");
      setLoading(false);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen py-16 px-4 sm:px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16">

        {/* LEFT — FORM */}
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">
            Delivery Info
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
                className="w-full bg-[#0a0a0a] border border-white/10 p-4 text-sm outline-none focus:border-white text-white placeholder:text-neutral-600 transition-colors"
              />
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Cash on Delivery", "EasyPaisa / JazzCash", "Bank Transfer"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-4 border text-[10px] font-black uppercase tracking-widest transition-all ${
                    paymentMethod === method
                      ? "bg-white text-black border-white"
                      : "border-white/10 text-neutral-400 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs uppercase tracking-widest border border-red-400/20 bg-red-400/5 p-3">
              ⚠ {error}
            </p>
          )}

          <button
            onClick={handleOrder}
            disabled={!isFormValid || loading}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>

          <p className="text-[10px] text-neutral-600 uppercase tracking-widest text-center">
            Order confirm hone ke baad WhatsApp message aayega
          </p>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="bg-[#050507] border border-white/10 p-6 sm:p-8 h-fit md:sticky md:top-10 order-first md:order-last">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
            Order Summary
          </h2>
          {items.length === 0 ? (
            <p className="text-neutral-600 text-xs uppercase tracking-widest text-center py-8">
              Cart is empty
            </p>
          ) : (
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="w-16 h-20 bg-[#0a0a0a] border border-white/10 overflow-hidden flex-shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-1 flex-grow">
                    <h3
                      className="text-xs font-bold uppercase text-white leading-tight"
                      dangerouslySetInnerHTML={{ __html: item.name }}
                    />
                    {Object.entries(item.attributes || {}).map(([k, v]) => (
                      <p key={k} className="text-[10px] text-neutral-500 uppercase">{k}: {v}</p>
                    ))}
                    <p className="text-[10px] text-neutral-600">Qty: {item.quantity}</p>
                    <p className="text-xs font-bold text-white">
                      PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-600 hover:text-red-400 transition-colors flex-shrink-0 mt-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3 border-t border-white/10 pt-6 text-xs uppercase font-bold">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span>PKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Shipping</span>
              <span>PKR {shipping}</span>
            </div>
            <div className="flex justify-between items-center text-white text-lg pt-2 border-t border-white/10">
              <span>Total</span>
              <span>PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}