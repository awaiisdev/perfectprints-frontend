"use client";

import dynamic from "next/dynamic";
import NavHeader from "@/components/NavHeader";
import OfferMarquee from "@/components/OfferMarquee";
import ExpandingCards from "@/components/ExpandingCards";
import ProductionShowcase from "@/components/ProductionShowcase";
import ShuffleVideoSection from "@/components/ShuffleVideoSection";
import ProductGrid from "@/components/ProductGrid";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import CinematicFooter from "@/components/DeferredFooter";

// Heavy Three.js WebGL animation — loaded only in the browser, after the
// critical page JS has run, so it no longer blocks the main thread during
// initial load (this was the single biggest contributor to Total Blocking Time).
const AiHeroBackground = dynamic(
  () => import("@/components/festivity-hero"),
  { ssr: false, loading: () => <div className="w-full min-h-[90vh] bg-white dark:bg-black" /> }
);

export default function HomePage() {
  return (
    <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      <NavHeader />
      <AiHeroBackground />
      <OfferMarquee />
      <ExpandingCards />
      <ProductionShowcase />
      <ShuffleVideoSection />
      <ProductGrid />
      <TestimonialsMarquee />
      <CinematicFooter />
    </main>
  );
}