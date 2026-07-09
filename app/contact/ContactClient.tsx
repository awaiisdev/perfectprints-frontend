"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleWhatsApp = () => {
    if (!form.name || !form.message) return;
    const msg = `*Contact Form — PerfectPrints*\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage: ${form.message}`;
    window.open(`https://wa.me/923010148055?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <main className="bg-black text-white min-h-screen py-16 px-4 sm:px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <span className="text-[10px] tracking-[0.4em] text-[#88888f] uppercase block mb-4">Get In Touch</span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-10 sm:mb-16">CONTACT US</h1>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">

          {/* Form */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest border-b border-[#1a1a1c] pb-4">Send a Message</h2>
            <input placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent border border-[#1a1a1c] p-4 text-sm outline-none focus:border-white text-white placeholder:text-neutral-600" />
            <input placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border border-[#1a1a1c] p-4 text-sm outline-none focus:border-white text-white placeholder:text-neutral-600" />
            <input placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-transparent border border-[#1a1a1c] p-4 text-sm outline-none focus:border-white text-white placeholder:text-neutral-600" />
            <textarea placeholder="Your Message *" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-transparent border border-[#1a1a1c] p-4 text-sm outline-none focus:border-white text-white placeholder:text-neutral-600 resize-none" />
            <button onClick={handleWhatsApp} disabled={!form.name || !form.message}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all disabled:opacity-30">
              Send via WhatsApp
            </button>
          </div>

          {/* Info */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-sm font-black uppercase tracking-widest border-b border-[#1a1a1c] pb-4">Contact Info</h2>
            {[
              { icon: "📍", label: "Address", value: "Mian Ichra Bazar, Street No 4\nLahore, Punjab, Pakistan" },
              { icon: "📞", label: "Phone / WhatsApp", value: "+92-301-0148055" },
              { icon: "🌐", label: "Website", value: "perfectprints.pk" },
              { icon: "🕐", label: "Working Hours", value: "Mon–Sat: 10am – 8pm\nSunday: 12pm – 6pm" },
            ].map((info) => (
              <div key={info.label} className="flex gap-4">
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#88888f] mb-1">{info.label}</p>
                  <p className="text-white text-sm whitespace-pre-line">{info.value}</p>
                </div>
              </div>
            ))}
            <a href="https://wa.me/923010148055" target="_blank"
              className="flex items-center gap-3 w-full py-4 border border-[#1a1a1c] px-6 hover:border-white transition-all">
              <span className="text-xl">💬</span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Chat on WhatsApp</p>
                <p className="text-[10px] text-neutral-500">Average reply in 5 minutes</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}