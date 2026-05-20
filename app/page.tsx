"use client";

import NavHeader from "@/components/NavHeader";
import { AiHeroBackground } from "@/components/festivity-hero";
import OfferMarquee from "@/components/OfferMarquee";
import ExpandingCards from "@/components/ExpandingCards";
import ProductionShowcase from "@/components/ProductionShowcase";
import ShuffleVideoSection from "@/components/ShuffleVideoSection";
import ProductGrid from "@/components/ProductGrid";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import CinematicFooter from "@/components/CinematicFooter";

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen">
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