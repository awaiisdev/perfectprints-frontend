"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "Minimum order kitna hai?", a: "Zyada tar products pe 1 piece se order ho sakta hai. Bulk orders ke liye alag pricing available hai — WhatsApp karo detail ke liye." },
  { q: "Payment options kya hain?", a: "Cash on Delivery (COD), EasyPaisa, JazzCash, aur Bank Transfer available hain. Bulk orders pe 50% advance required hai." },
  { q: "Delivery kitne din mein hoti hai?", a: "Standard orders 2-3 business days mein deliver hote hain. Bulk ya custom orders 5-7 days mein. Lahore mein same-day delivery bhi available hai." },
  { q: "Size chart kahan hai?", a: "Har clothing product ke page pe size chart available hai. Agar confusion ho to WhatsApp pe message karo — hum guide kar denge." },
  { q: "Custom design kaise submit karein?", a: "Order place karte waqt design WhatsApp pe send karo: +92-301-0148055. JPG, PNG ya PDF format mein high resolution file bhejo." },
  { q: "Return policy kya hai?", a: "Manufacturing defect pe free replacement milta hai. Custom printed items return nahi ho sakte. Damaged delivery 24 hours ke andar report karein photo ke saath." },
  { q: "Bulk order discount milta hai?", a: "Haan! 50+ pieces pe special pricing available hai. Bulk orders ke liye WhatsApp karo ya contact page pe message karo." },
  { q: "Tracking kaise karein?", a: "Dispatch hone ke baad tracking number WhatsApp pe milega. Track Order page pe apna order number daal ke status check kar sakte hain." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        .faq-root { font-family: 'DM Sans', sans-serif; }
        .faq-heading { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .faq-item { border-top: 1px solid #1f1f1f; transition: border-color 0.2s; }
        .faq-item:hover { border-color: #333; }
        .faq-btn { background: none; border: none; cursor: pointer; width: 100%; text-align: left; color: white; padding: 1.5rem 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; }
        .faq-btn:hover .faq-q { color: #e0e0e0; }
        .faq-q { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500; letter-spacing: 0.01em; transition: color 0.2s; line-height: 1.5; }
        .faq-icon { font-size: 1.2rem; color: #555; flex-shrink: 0; margin-top: 2px; transition: color 0.2s, transform 0.3s; }
        .faq-icon.open { color: #fff; transform: rotate(45deg); }
        .faq-answer { font-size: 0.875rem; color: #888; line-height: 1.8; padding-bottom: 1.5rem; font-weight: 300; }
        .tag { display: inline-block; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: #555; border: 1px solid #222; padding: 0.3rem 0.8rem; margin-bottom: 2rem; }
        .right-card { background: #111; border: 1px solid #1f1f1f; padding: 2.5rem; }
        .wa-btn { display: block; width: 100%; background: white; color: black; text-align: center; padding: 1rem; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: background 0.2s; margin-top: 2rem; }
        .wa-btn:hover { background: #e0e0e0; }
        .divider { width: 2rem; height: 1px; background: #333; margin: 1.5rem 0; }
        .contact-row { display: flex; gap: 0.75rem; align-items: flex-start; margin-bottom: 1.25rem; }
        .contact-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #555; margin-bottom: 0.2rem; }
        .contact-val { font-size: 0.875rem; color: #ccc; font-weight: 300; }
        .number-big { font-family: 'Bebas Neue', sans-serif; font-size: 5rem; line-height: 1; color: #1a1a1a; position: absolute; right: 0; top: -1rem; pointer-events: none; }
      `}</style>

      <div className="faq-root max-w-6xl mx-auto px-6 md:px-16 py-24">

        <div className="grid md:grid-cols-[1fr_380px] gap-16 items-start">

          {/* LEFT — FAQ */}
          <div>
            <span className="tag">Help Center</span>
            <div style={{ position: "relative", marginBottom: "3rem" }}>
              <span className="number-big">FAQ</span>
              <h1 className="faq-heading" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1, marginBottom: "0.5rem" }}>
                GOT<br />QUESTIONS?
              </h1>
              <p style={{ color: "#555", fontSize: "0.875rem", fontWeight: 300 }}>Sab kuch yahan milega. Nahi mila to WhatsApp karo.</p>
            </div>

            <div style={{ borderBottom: "1px solid #1f1f1f" }}>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
                    <span className="faq-q">
                      <span style={{ color: "#333", marginRight: "1rem", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.q}
                    </span>
                    <span className={`faq-icon ${open === i ? "open" : ""}`}>+</span>
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="faq-answer" style={{ paddingLeft: "calc(1rem + 2ch + 1rem)" }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Contact Card */}
          <div style={{ position: "sticky", top: "6rem" }}>
            <div className="right-card">
              <span className="tag">Direct Contact</span>
              <h2 className="faq-heading" style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>STILL UNSURE?</h2>
              <p style={{ color: "#555", fontSize: "0.8rem", fontWeight: 300, marginBottom: "2rem" }}>
                Hum 5 minute mein reply karte hain.
              </p>

              <div className="divider" />

              <div className="contact-row">
                <div>
                  <p className="contact-label">WhatsApp</p>
                  <p className="contact-val">+92-301-0148055</p>
                </div>
              </div>
              <div className="contact-row">
                <div>
                  <p className="contact-label">Address</p>
                  <p className="contact-val">Mian Ichra Bazar, Street No 4<br />Lahore, Punjab</p>
                </div>
              </div>
              <div className="contact-row">
                <div>
                  <p className="contact-label">Hours</p>
                  <p className="contact-val">Mon–Sat: 10am – 8pm<br />Sunday: 12pm – 6pm</p>
                </div>
              </div>

              <a href="https://wa.me/923010148055" target="_blank" className="wa-btn">
                Chat on WhatsApp →
              </a>
            </div>

            <p style={{ color: "#2a2a2a", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1.5rem", textAlign: "center" }}>
              Average reply · 5 minutes
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}