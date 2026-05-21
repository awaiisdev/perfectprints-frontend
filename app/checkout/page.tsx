"use client";
import React, { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const shipping = 200;
  const grandTotal = total + shipping;
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = form.name && form.address && form.city && form.phone && paymentMethod;

  const handleOrder = () => {
    if (!isFormValid) return;
    const itemsList = items.map(i =>
      `• ${i.name} x${i.quantity} = PKR ${(parseFloat(i.price) * i.quantity).toLocaleString()}`
    ).join("\n");
    const message =
      `🛍️ *New Order - PerfectPrints*\n\n` +
      `*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*Address:* ${form.address}, ${form.city}\n\n` +
      `*Items:*\n${itemsList}\n\n*Shipping:* PKR ${shipping}\n*Total:* PKR ${grandTotal.toLocaleString()}\n\n*Payment:* ${paymentMethod}`;
    window.open(`https://wa.me/923010148055?text=${encodeURIComponent(message)}`, "_blank");
    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="text-5xl">✓</div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Order Sent!</h1>
          <p className="text-neutral-400 text-sm">Our team will contact you on WhatsApp shortly.</p>
          <button onClick={() => router.push("/")}
            className="px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition-all">
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen py-16 px-4 sm:px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16">

        {/* Form */}
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Delivery Info</h2>
          <div className="space-y-4">
            {[
              { name: "name", placeholder: "Full Name" },
              { name: "phone", placeholder: "Phone Number (03XXXXXXXXX)" },
              { name: "address", placeholder: "Full Address" },
              { name: "city", placeholder: "City" },
            ].map((field) => (
              <input key={field.name} name={field.name} placeholder={field.placeholder}
                value={form[field.name as keyof typeof form]} onChange={handleChange}
                className="w-full bg-transparent border border-white/20 p-4 text-sm outline-none focus:border-white text-white placeholder:text-neutral-600" />
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Cash on Delivery", "EasyPaisa / JazzCash", "Bank Transfer"].map((method) => (
                <button key={method} onClick={() => setPaymentMethod(method)}
                  className={`py-4 border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === method ? "bg-white text-black border-white" : "border-white/20 text-white hover:border-white"}`}>
                  {method}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleOrder} disabled={!isFormValid}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            Place Order via WhatsApp
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 h-fit md:sticky md:top-10 order-first md:order-last">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p className="text-neutral-500 text-xs uppercase tracking-widest text-center py-8">Cart is empty</p>
          ) : (
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-neutral-900 border border-white/10 overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <h3 className="text-xs font-bold uppercase text-white leading-tight" dangerouslySetInnerHTML={{ __html: item.name }} />
                    <p className="text-[10px] text-neutral-500">Qty: {item.quantity}</p>
                    <p className="text-xs font-bold text-white">PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3 border-t border-white/10 pt-6 text-xs uppercase font-bold">
            <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span>PKR {total.toLocaleString()}</span></div>
            <div className="flex justify-between text-neutral-400"><span>Shipping</span><span>PKR {shipping}</span></div>
            <div className="flex justify-between items-center text-white text-lg pt-2"><span>Total</span><span>PKR {grandTotal.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}