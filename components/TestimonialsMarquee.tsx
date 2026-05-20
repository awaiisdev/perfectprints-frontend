"use client";

import React from "react";
import { Star } from "lucide-react";

const pakistaniReviews = [
  { name: "Zeeshan Ahmed", item: "Oversized Streetwear Tee", content: "Kamal ki cloth quality hai, 260 GSM btaiya tha aur sachi mein heavyweight fabric mila. Print bilkul soft hai.", rating: 5 },
  { name: "Asma Khan", item: "Personalized Anniversary Frame", content: "Zero minimum order limit bohot sahi cheez hai, maine sirf ek photo frame gift ke liye order kiya aur result perfect aya.", rating: 5 },
  { name: "Bilal Raza", item: "Corporate Bulk T-Shirts", content: "Hamari software company ke liye 120 polo shirts print karwayi thin. Rate market se bohot behtar tha aur delivery time par mili.", rating: 5 },
  { name: "Hamza Malik", item: "Cricket Fan Jersey", content: "High-density jersey print bilkul international quality jaisa lag raha hai. Wash karne ke baad bhi print kharab nahi hua.", rating: 5 },
  { name: "Fatima Jamil", item: "Customized Coffee Mug", content: "Birthday gift ke liye mug print karwaya tha, sublimation coating bohot clean thi aur print ekdum sharp aya.", rating: 5 },
  { name: "Usman Ghani", item: "DTF Roll Printing", content: "Bulk mein DTF prints order kiye thay, film quality aur hot peel execution bohot smooth thi. Recommended for print shops.", rating: 5 },
  { name: "Kamran Siddiqui", item: "Sublimation Raw Sheet", content: "Raw materials aur sublimation items ki wholesale pricing pure Lahore mein sabse best inhi ki hai.", rating: 5 },
  { name: "Ayesha Noor", item: "Custom Drop-Shoulder Hoodie", content: "Fleece material bohot garm hai aur customized back print bilkul huba-hu aya jo maine vector file di thi.", rating: 5 },
  { name: "Zainab Bibi", item: "Occasion Special Cushion", content: "Advance payment ki thi thoda dar tha lekin parcel 3 din mein safely delivered ho gaya. Bohot cooperative staff hai.", rating: 5 },
  { name: "Saad Ali", item: "Promotional Branded Keychains", content: "Exhibition ke liye 500 units keychains bulk printing karwaye thay, ek ek piece par precision bohot clear thi.", rating: 5 },
];

export default function TestimonialsMarquee() {
  return (
    <section className="bg-black py-20 border-t border-[#1a1a1c] overflow-hidden w-full">
      <div className="max-w-7xl mx-auto mb-12 px-6">
        <span className="text-[10px] tracking-[0.4em] text-white font-black uppercase block mb-2">
          CUSTOMER VOICE // TRUST METRIC
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white uppercase font-serif">
          VERIFIED TRANSACTIONS
        </h2>
      </div>

      <div className="flex gap-4 w-full overflow-hidden relative px-4 [--gap:1rem]">
        <div className="flex gap-4 shrink-0 animate-testimonialMarquee">
          {pakistaniReviews.map((rev, idx) => (
            <div key={idx} className="w-80 bg-[#09090b] border border-[#1a1a1c] p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase tracking-tight">{rev.name}</h4>
                    {/* Tagline colour updated to text-[#aaaaaa] for better visibility */}
                    <p className="text-[10px] text-[#aaaaaa] uppercase font-mono mt-0.5">{rev.item}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-white text-white" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#88888f] font-light leading-relaxed tracking-wide">
                  "{rev.content}"
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 shrink-0 animate-testimonialMarquee" aria-hidden="true">
          {pakistaniReviews.map((rev, idx) => (
            <div key={idx} className="w-80 bg-[#09090b] border border-[#1a1a1c] p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase tracking-tight">{rev.name}</h4>
                    {/* Tagline colour updated here too */}
                    <p className="text-[10px] text-[#aaaaaa] uppercase font-mono mt-0.5">{rev.item}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-white text-white" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#88888f] font-light leading-relaxed tracking-wide">
                  "{rev.content}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes testimonialMarquee {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
        .animate-testimonialMarquee {
          animation: testimonialMarquee 35s infinite linear;
        }
      `}</style>
    </section>
  );
}