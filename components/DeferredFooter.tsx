"use client";

import dynamic from "next/dynamic";

// CinematicFooter uses GSAP + ScrollTrigger and renders on every page via
// the root layout. Loading it dynamically (client-side only, after the
// initial critical JS) keeps that animation library out of the main-thread
// work done during the initial page load, which was contributing to TBT.
const CinematicFooter = dynamic(() => import("./CinematicFooter"), {
  ssr: false,
  loading: () => <div className="w-full h-40 bg-black" />,
});

export default function DeferredFooter() {
  return <CinematicFooter />;
}