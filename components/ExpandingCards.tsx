"use client";

import * as React from "react";
import {
  Gift,
  Shirt,
  Briefcase,
  Printer,
  Layers,
  Calendar,
  Trophy,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils"; 

const CATEGORY_ITEMS = [
  { id: "personalized-gifts", title: "Personalized Gifts", description: "Custom gifts made memorable with photos, names, and personal messages.", imgSrc: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80", icon: <Gift className="h-5 w-5" /> },
  { id: "custom-clothing", title: "Custom T-Shirts & Clothing", description: "Premium custom apparel printing for brands, fans, and everyday fashion.", imgSrc: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", icon: <Shirt className="h-5 w-5" /> },
  { id: "corporate-bulk", title: "Corporate & Bulk Printing", description: "Professional bulk printing solutions for companies, events, and promotions.", imgSrc: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80", icon: <Briefcase className="h-5 w-5" /> },
  { id: "dtf-printing", title: "DTF Printing", description: "High-quality DTF transfer printing for vibrant and durable designs.", imgSrc: "https://images.unsplash.com/photo-1571945153237-4929e78394a9?w=800&q=80", icon: <Printer className="h-5 w-5" /> },
  { id: "sublimation-raw", title: "Sublimation Raw Material", description: "Complete sublimation supplies for printing businesses across Pakistan.", imgSrc: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=800&q=80", icon: <Layers className="h-5 w-5" /> },
  { id: "occasion-gifts", title: "Occasion Gifts", description: "Unique personalized gifts for birthdays, Eid, anniversaries, and special moments.", imgSrc: "https://images.unsplash.com/photo-1513201099495-a6697de526a2?w=800&q=80", icon: <Calendar className="h-5 w-5" /> },
  { id: "cricket-merch", title: "Cricket Fan Merchandise", description: "Custom cricket fan apparel and merchandise for passionate supporters.", imgSrc: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80", icon: <Trophy className="h-5 w-5" /> },
  { id: "promotional-branded", title: "Promotional & Branded Items", description: "Branded promotional products designed to grow your business identity.", imgSrc: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80", icon: <Tag className="h-5 w-5" /> }
];

export default function ExpandingCards({ className, defaultActiveIndex = 0, ...props }: any) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridStyle = React.useMemo(() => {
    if (activeIndex === null) return {};
    return isDesktop 
      ? { gridTemplateColumns: CATEGORY_ITEMS.map((_, i) => (i === activeIndex ? "5fr" : "1fr")).join(" ") }
      : { gridTemplateRows: CATEGORY_ITEMS.map((_, i) => (i === activeIndex ? "4fr" : "1fr")).join(" ") };
  }, [activeIndex, isDesktop]);

  return (
    <section className="w-full bg-black py-20 px-4 border-t border-[#1a1a1c]">
      <div className="max-w-7xl mx-auto mb-12 px-2">
        <span className="text-[10px] tracking-[0.4em] text-[#55555a] font-black uppercase block mb-2">PRODUCTION CATALOGUE // COLLECTIONS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white uppercase font-serif">CORE CAPABILITIES</h2>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <ul
          className={cn("w-full gap-2 grid h-[750px] md:h-[550px] transition-[grid-template-columns,grid-template-rows] duration-500 ease-out", className)}
          style={gridStyle}
          {...props}
        >
          {CATEGORY_ITEMS.map((item, index) => (
            <li
              key={item.id}
              className={cn("group relative cursor-pointer overflow-hidden rounded-none border border-[#1a1a1c] bg-[#09090b] text-white shadow-sm min-h-0 min-w-0 transition-all duration-300")}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              data-active={activeIndex === index}
            >
              <img src={item.imgSrc} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-all duration-500 scale-105 grayscale opacity-35 group-data-[active=true]:opacity-60 group-data-[active=true]:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <article className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
                <h3 className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 rotate-90 text-[11px] font-black uppercase tracking-[0.3em] text-[#66666f] group-data-[active=true]:hidden transition-all">
                  {item.title}
                </h3>
                <div className="opacity-0 group-data-[active=true]:opacity-100 transition-opacity duration-300 delay-75">
                  <div className="w-8 h-8 border border-white/20 bg-black/40 flex items-center justify-center text-white">{item.icon}</div>
                </div>
                <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-white opacity-0 group-data-[active=true]:opacity-100 transition-opacity duration-300 delay-150 font-serif">
                  {item.title}
                </h3>
                <p className="w-full max-w-sm text-xs text-[#88888f] font-light tracking-wide opacity-0 group-data-[active=true]:opacity-100 transition-opacity duration-300 delay-225">
                  {item.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}