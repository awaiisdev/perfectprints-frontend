"use client";
import React from "react";
import { Star } from "lucide-react";

const reviews = [
  { name: "Zeeshan Ahmed", item: "Oversized Streetwear Tee", content: "Kamal ki cloth quality hai, 260 GSM tha aur sachi mein heavyweight fabric mila. Print bilkul soft hai.", rating: 5 },
  { name: "Asma Khan", item: "Personalized Anniversary Frame", content: "Zero minimum order limit bohot sahi cheez hai, maine sirf ek photo frame gift ke liye order kiya aur result perfect aya.", rating: 5 },
  { name: "Bilal Raza", item: "Corporate Bulk T-Shirts", content: "Hamari company ke liye 120 polo shirts print karwayi thin. Rate market se behtar tha aur delivery time par mili.", rating: 5 },
  { name: "Hamza Malik", item: "Cricket Fan Jersey", content: "High-density jersey print bilkul international quality jaisa. Wash karne ke baad bhi print kharab nahi hua.", rating: 5 },
  { name: "Fatima Jamil", item: "Customized Coffee Mug", content: "Birthday gift ke liye mug print karwaya, sublimation coating bohot clean thi aur print ekdum sharp aya.", rating: 5 },
  { name: "Usman Ghani", item: "DTF Roll Printing", content: "Bulk mein DTF prints order kiye, film quality aur hot peel execution bohot smooth thi. Recommended.", rating: 5 },
  { name: "Kamran Siddiqui", item: "Sublimation Raw Sheet", content: "Raw materials ki wholesale pricing pure Lahore mein sabse best inhi ki hai.", rating: 5 },
  { name: "Ayesha Noor", item: "Custom Drop-Shoulder Hoodie", content: "Fleece material bohot garm hai aur customized back print bilkul huba-hu aya jo maine vector file di thi.", rating: 5 },
  { name: "Zainab Bibi", item: "Occasion Special Cushion", content: "Advance payment ki thi thoda dar tha lekin parcel 3 din mein safely delivered ho gaya.", rating: 5 },
  { name: "Saad Ali", item: "Promotional Branded Keychains", content: "Exhibition ke liye 500 units keychains bulk printing karwaye, ek ek piece par precision bohot clear thi.", rating: 5 },
];

export default function TestimonialsMarquee() {
  return (
    <section className="bg-white dark:bg-black py-20 border-t border-black/10 dark:border-white/10 overflow-hidden w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto mb-12 px-6">
        <span className="text-[10px] tracking-[0.4em] text-neutral-400 font-black uppercase block mb-2" style={{ fontFamily: "var(--font-inter)" }}>
          CUSTOMER VOICE // TRUST METRIC
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black dark:text-white uppercase" style={{ fontFamily: "var(--font-montserrat)" }}>
          VERIFIED TRANSACTIONS
        </h2>
      </div>

      <div className="flex gap-4 w-full overflow-hidden relative px-4">
        {[0, 1].map((pass) => (
          <div key={pass} className="flex gap-4 shrink-0 animate-testimonial-scroll" aria-hidden={pass === 1}>
            {reviews.map((rev, idx) => (
              <div key={idx} className="w-80 bg-neutral-50 dark:bg-[#0f0f11] border border-black/10 dark:border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-sm text-black dark:text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                        {rev.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 uppercase mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
                        {rev.item}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-black dark:fill-white text-black dark:text-white" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                    "{rev.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes testimonial-scroll {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
        .animate-testimonial-scroll {
          animation: testimonial-scroll 35s infinite linear;
        }
      `}</style>
    </section>
  );
}