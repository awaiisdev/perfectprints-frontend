"use client";
import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen py-16 px-4 sm:px-6 md:px-16">
      <div className="max-w-4xl mx-auto space-y-16 sm:space-y-20">

        <div className="border-b border-[#1a1a1c] pb-12 sm:pb-16">
          <span className="text-[10px] tracking-[0.4em] text-[#88888f] uppercase block mb-4">Our Story</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 sm:mb-8">
            BUILT IN<br />LAHORE.<br />MADE FOR<br />PAKISTAN.
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            Perfect Prints Lahore ke dil — Mian Ichra Bazar — se shuru hua ek simple vision ke saath: Pakistan mein premium quality custom printing accessible banana.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">Hamara Mission</h2>
            <p className="text-neutral-400 leading-relaxed">Hum believe karte hain ke har business, har individual deserves karta hai professional quality printing — chahe order 1 piece ka ho ya 10,000 ka. DTF printing, sublimation, custom t-shirts, mugs, keychains — hum sab kuch offer karte hain ek hi jagah se.</p>
            <p className="text-neutral-400 leading-relaxed">Lahore se poore Pakistan mein delivery. 2-3 business days mein aapke ghar tak.</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">Kyun Perfect Prints?</h2>
            <ul className="space-y-3 text-neutral-400">
              {[
                "Premium DTF & Sublimation printing technology",
                "Minimum order flexibility — 1 piece se bulk tak",
                "Pakistan-wide delivery in 2-3 business days",
                "Corporate & bulk orders ka complete solution",
                "WhatsApp support — 24/7 available",
                "100% satisfaction guarantee",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-white mt-0.5 flex-shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-y border-[#1a1a1c] py-12 sm:py-16">
          {[
            { number: "5000+", label: "Happy Customers" },
            { number: "50+", label: "Product Categories" },
            { number: "2-3", label: "Days Delivery" },
            { number: "100%", label: "Quality Guarantee" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white mb-2">{stat.number}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#88888f]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1c] p-6 sm:p-10 space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight">Find Us</h2>
          <div className="text-neutral-400 space-y-2 text-sm sm:text-base">
            <p>📍 Mian Ichra Bazar, Street No 4, Lahore, Punjab, Pakistan</p>
            <p>📞 <a href="tel:+923010148055" className="hover:text-white transition-colors">+92-301-0148055</a></p>
            <p>🌐 <a href="https://perfectprints.pk" className="hover:text-white transition-colors">perfectprints.pk</a></p>
          </div>
        </div>

        <div className="text-center space-y-6 pb-8">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Ready to Order?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="px-8 sm:px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all text-center">
              Shop Now
            </Link>
            <a href="https://wa.me/923010148055" target="_blank"
              className="px-8 sm:px-10 py-4 border border-white text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all text-center">
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}