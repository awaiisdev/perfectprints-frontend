"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowRight, Terminal } from "lucide-react";

// GSAP registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap');
.cinematic-footer-wrapper { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent); --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent); --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent); --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent); --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent); --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent); --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent); --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent); --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent); --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent); }
@keyframes footer-breathe { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; } 100% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.7; } }
@keyframes footer-scroll-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.animate-footer-breathe { animation: footer-breathe 8s ease-in-out infinite alternate; }
.animate-footer-scroll-marquee { animation: footer-scroll-marquee 35s linear infinite; }
.footer-bg-grid { background-size: 60px 60px; background-image: linear-gradient(to right, color-mix(in oklch, var(--foreground) 2%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 2%, transparent) 1px, transparent 1px); mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent); }
.footer-aurora { background: radial-gradient(circle at 50% 50%, #1a1a1e 0%, #09090b 60%, transparent 100%); }
.footer-glass-pill { background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%); box-shadow: 0 10px 30px -10px var(--pill-shadow), inset 0 1px 1px var(--pill-highlight); border: 1px solid var(--pill-border); backdrop-filter: blur(16px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.footer-glass-pill:hover { background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%); border-color: var(--pill-border-hover); color: #fff; }
.footer-giant-bg-text { font-size: 24vw; line-height: 0.75; font-weight: 900; letter-spacing: -0.05em; color: transparent; -webkit-text-stroke: 1px rgba(255, 255, 255, 0.03); background: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 70%); -webkit-background-clip: text; background-clip: text; }
.footer-text-glow { background: linear-gradient(180deg, #fff 0%, #666 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
`;

const MagneticButton = React.forwardRef<HTMLElement, any>(({ className, children, as: Component = "button", ...props }, forwardedRef) => {
  const localRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const element = localRef.current;
    if (!element) return;
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(element, { x: x * 0.35, y: y * 0.35, rotationX: -y * 0.1, rotationY: x * 0.1, scale: 1.03, ease: "power2.out", duration: 0.4 });
      };
      const handleMouseLeave = () => { gsap.to(element, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1, 0.3)", duration: 1.2 }); };
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => { element.removeEventListener("mousemove", handleMouseMove); element.removeEventListener("mouseleave", handleMouseLeave); };
    }, element);
    return () => ctx.revert();
  }, []);
  return <Component ref={(node: any) => { localRef.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }} className={cn("cursor-pointer", className)} {...props}>{children}</Component>;
});
MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>ZERO MINIMUM ORDER</span> <span className="text-white/20">✦</span>
    <span>HIGH-DENSITY DTF PRINTS</span> <span className="text-white/20">✦</span>
    <span>PREMIUM STREETWEAR OVERSIZED CARGOS</span> <span className="text-white/20">✦</span>
    <span>FREE SHIPPING ACROSS PAKISTAN</span> <span className="text-white/20">✦</span>
  </div>
);

export default function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(giantTextRef.current, { y: "12vh", scale: 0.85, opacity: 0 }, { y: "0vh", scale: 1, opacity: 1, ease: "power1.out", scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "bottom bottom", scrub: 1 } });
      gsap.fromTo([headingRef.current, linksRef.current], { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: wrapperRef.current, start: "top 45%", end: "bottom bottom", scrub: 1 } });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div ref={wrapperRef} className="relative h-screen w-full bg-black" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-black text-white cinematic-footer-wrapper border-t border-[#1a1a1c]">
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[100px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />
          <div ref={giantTextRef} className="footer-giant-bg-text absolute -bottom-[3vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none font-serif uppercase">PERFECT</div>
          <div className="absolute top-16 left-0 w-full overflow-hidden border-y border-[#1a1a1c] bg-black/80 backdrop-blur-md py-4 z-10 -rotate-1 scale-105">
            <div className="flex w-max animate-footer-scroll-marquee text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase font-mono"><MarqueeItem /><MarqueeItem /></div>
          </div>
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-24 w-full max-w-5xl mx-auto">
            <h2 ref={headingRef} className="text-4xl md:text-7xl font-black footer-text-glow tracking-tighter mb-12 text-center uppercase font-serif">READY TO BUILD <br />YOUR DROP?</h2>
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton as="a" href="#" className="footer-glass-pill px-8 py-4 rounded-none text-white font-black text-xs tracking-widest uppercase flex items-center gap-2 font-mono">START CUSTOM PROJECT <ArrowRight className="h-3 w-3" /></MagneticButton>
                <MagneticButton as="a" href="#" className="footer-glass-pill px-8 py-4 rounded-none text-neutral-400 font-black text-xs tracking-widest uppercase flex items-center gap-2 font-mono"><Terminal className="h-3 w-3" /> ENTER B2B CORE PANEL</MagneticButton>
              </div>
              <div className="flex flex-wrap justify-center gap-6 w-full mt-4 text-[11px] font-bold tracking-widest text-neutral-500 uppercase font-mono">
                <a href="#" className="hover:text-white transition-colors">PRIVACY PROTOCOL</a><a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a><a href="#" className="hover:text-white transition-colors">LAB SUPPORT</a>
              </div>
            </div>
          </div>
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
            <div className="text-neutral-600 text-[10px] tracking-widest uppercase order-2 md:order-1">© 2026 PERFECTPRINTS.PK. ALL RIGHTS RESERVED.</div>
            <div className="footer-glass-pill px-5 py-2.5 rounded-none flex items-center gap-2 order-1 md:order-2 cursor-default border-[#1a1a1c]"><span className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest">ENGINEERED BY</span><span className="text-white font-black text-xs tracking-wider">SCALEMETRIC</span></div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-10 h-10 rounded-none footer-glass-pill flex items-center justify-center text-neutral-500 hover:text-white group order-3">▲</button>
          </div>
        </footer>
      </div>
    </>
  );
}