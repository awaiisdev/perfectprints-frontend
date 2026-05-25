"use client";

import * as React from "react";
import { Gift, Shirt, Briefcase, Printer, Layers, Calendar, Trophy, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ITEMS = [
  { id: "personalized-gifts", title: "Personalized Gifts", description: "Custom gifts made memorable with photos, names, and personal messages.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_05_01_05_AM_sfupjk.png", icon: <Gift className="h-5 w-5" />, url: "/shop?category=occasion-gifts-pakistan" },
  { id: "custom-clothing", title: "Custom T-Shirts & Clothing", description: "Premium custom apparel printing for brands, fans, and everyday fashion.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451591/ChatGPT_Image_May_22_2026_04_54_45_AM_uwdszx.png", icon: <Shirt className="h-5 w-5" />, url: "/shop?category=custom-tshirts-pakistan" },
  { id: "corporate-bulk", title: "Corporate & Bulk Printing", description: "Professional bulk printing solutions for companies, events, and promotions.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_55_43_AM_r2pfpw.png", icon: <Briefcase className="h-5 w-5" />, url: "/shop?category=corporate-gifts-pakistan" },
  { id: "dtf-printing", title: "DTF Printing", description: "High-quality DTF transfer printing for vibrant and durable designs.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451594/ChatGPT_Image_May_22_2026_04_57_25_AM_mmcvya.png", icon: <Printer className="h-5 w-5" />, url: "/shop?category=dtf-printing-pakistan" },
  { id: "sublimation-raw", title: "Sublimation Raw Material", description: "Complete sublimation supplies for printing businesses across Pakistan.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_04_59_38_AM_fltole.png", icon: <Layers className="h-5 w-5" />, url: "/shop?category=sublimation-raw-material-pakistan" },
  { id: "occasion-gifts", title: "Occasion Gifts", description: "Unique personalized gifts for birthdays, Eid, anniversaries, and special moments.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451589/ChatGPT_Image_May_22_2026_05_01_05_AM_sfupjk.png", icon: <Calendar className="h-5 w-5" />, url: "/shop?category=occasion-gifts-pakistan" },
  { id: "cricket-merch", title: "Cricket Fan Merchandise", description: "Custom cricket fan apparel and merchandise for passionate supporters.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451593/ChatGPT_Image_May_22_2026_05_02_16_AM_iu4jqx.png", icon: <Trophy className="h-5 w-5" />, url: "/shop?category=cricket-merchandise-pakistan" },
  { id: "promotional-branded", title: "Promotional & Branded Items", description: "Branded promotional products designed to grow your business identity.", imgSrc: "https://res.cloudinary.com/db8fp3as7/image/upload/q_auto,f_auto/v1779451586/ChatGPT_Image_May_22_2026_05_03_26_AM_kpli5p.png", icon: <Tag className="h-5 w-5" />, url: "/shop?category=promotional-items-pakistan" }
];

export default function ExpandingCards({ className, defaultActiveIndex = 0, ...props }: any) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex);
  const [isDesktop, setIsDesktop] = React.useState(true);

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
    <section className="w-full bg-white dark:bg-black py-20 px-4 border-t border-black/10 dark:border-[#1a1a1c] transition-colors duration-300">
      <div className="max-w-7xl mx-auto mb-12 px-2">
        <span className="text-[10px] tracking-[0.4em] text-black dark:text-white font-black uppercase block mb-2">PRODUCTION CATALOGUE // COLLECTIONS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black dark:text-white uppercase font-serif">CORE CAPABILITIES</h2>
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
              className={cn("group relative cursor-pointer overflow-hidden rounded-none border border-black/10 dark:border-[#1a1a1c] bg-black text-white shadow-sm min-h-0 min-w-0 transition-all duration-300")}
              onMouseEnter={() => setActiveIndex(index)}
              data-active={activeIndex === index}
            >
              {/* IMAGE — always visible, no white wash */}
              <img
                src={item.imgSrc}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-500 scale-105 grayscale opacity-60 group-data-[active=true]:opacity-90 group-data-[active=true]:grayscale-0 group-data-[active=true]:scale-100"
              />
              {/* OVERLAY — only bottom dark gradient, no top fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

              <article className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
                {/* Rotated label for inactive cards */}
                <h3 className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 rotate-90 text-[11px] font-black uppercase tracking-[0.3em] text-white/70 group-data-[active=true]:hidden transition-all whitespace-nowrap">
                  {item.title}
                </h3>
                {/* Active card content */}
                <div className="opacity-0 group-data-[active=true]:opacity-100 transition-opacity duration-300 delay-75">
                  <div className="w-8 h-8 border border-white/20 bg-black/40 flex items-center justify-center text-white">{item.icon}</div>
                </div>
                <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-white opacity-0 group-data-[active=true]:opacity-100 transition-opacity duration-300 delay-150 font-serif">
                  {item.title}
                </h3>
                <p className="w-full max-w-sm text-xs text-white/70 font-light tracking-wide opacity-0 group-data-[active=true]:opacity-100 transition-opacity duration-300 delay-225">
                  {item.description}
                </p>
                <a
                  href={item.url}
                  className="mt-4 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest opacity-0 group-data-[active=true]:opacity-100 transition-opacity duration-300 delay-300 w-fit hover:bg-neutral-300"
                >
                  Shop Now
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}