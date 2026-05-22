"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowRight, ShoppingBag, Phone, Mail, MapPin, Truck, FileText, Shield, HelpCircle, RotateCcw } from "lucide-react";

// GSAP registration - lazy to avoid SSR issues
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
.footer-link-col a { display: flex; align-items: center; gap: 6px; color: #525252; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: color 0.2s ease; font-family: monospace; padding: 4px 0; }
.footer-link-col a:hover { color: #fff; }
.footer-link-col a svg { opacity: 0.4; flex-shrink: 0; }
.footer-link-col a:hover svg { opacity: 1; }
.footer-col-title { font-size: 9px; font-weight: 900; letter-spacing: 0.35em; color: #333; text-transform: uppercase; font-family: monospace; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
.footer-col-title::after { content: ''; flex: 1; height: 1px; background: #1f1f1f; }
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
    <span>CASH ON DELIVERY AVAILABLE</span> <span className="text-white/20">✦</span>
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

          {/* Marquee Banner */}
          <div className="absolute top-16 left-0 w-full overflow-hidden border-y border-[#1a1a1c] bg-black/80 backdrop-blur-md py-4 z-10 -rotate-1 scale-105">
            <div className="flex w-max animate-footer-scroll-marquee text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase font-mono"><MarqueeItem /><MarqueeItem /></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-6xl mx-auto">
            <h2 ref={headingRef} className="text-4xl md:text-7xl font-black footer-text-glow tracking-tighter mb-10 text-center uppercase font-serif">
              WEAR YOUR<br />STORY.
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <MagneticButton as="a" href="/shop" className="footer-glass-pill px-8 py-4 rounded-none text-white font-black text-xs tracking-widest uppercase flex items-center gap-2 font-mono">
                <ShoppingBag className="h-3 w-3" /> SHOP THE COLLECTION <ArrowRight className="h-3 w-3" />
              </MagneticButton>
              <MagneticButton as="a" href="/contact" className="footer-glass-pill px-8 py-4 rounded-none text-neutral-400 font-black text-xs tracking-widest uppercase flex items-center gap-2 font-mono">
                <Phone className="h-3 w-3" /> CONTACT US
              </MagneticButton>
            </div>

            {/* Links Grid */}
            <div ref={linksRef} className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 mt-2 border-t border-[#1a1a1c] pt-8">
              {/* Quick Links */}
              <div className="footer-link-col">
                <div className="footer-col-title">Quick Links</div>
                <a href="/shop"><ShoppingBag className="h-3 w-3" />Shop All</a>
                <a href="/about"><FileText className="h-3 w-3" />About Us</a>
                <a href="/contact"><Mail className="h-3 w-3" />Contact</a>
                <a href="/track-order"><Truck className="h-3 w-3" />Track Order</a>
              </div>

              {/* Help */}
              <div className="footer-link-col">
                <div className="footer-col-title">Help Center</div>
                <a href="/faq"><HelpCircle className="h-3 w-3" />FAQ</a>
                <a href="/shipping"><Truck className="h-3 w-3" />Shipping Info</a>
                <a href="/returns"><RotateCcw className="h-3 w-3" />Returns Policy</a>
                <a href="/track-order"><MapPin className="h-3 w-3" />Order Tracking</a>
              </div>

              {/* Legal */}
              <div className="footer-link-col">
                <div className="footer-col-title">Legal</div>
                <a href="/privacy-policy"><Shield className="h-3 w-3" />Privacy Policy</a>
                <a href="/terms"><FileText className="h-3 w-3" />Terms of Service</a>
              </div>

              {/* Contact Info */}
              <div className="footer-link-col">
                <div className="footer-col-title">Get In Touch</div>
                <a href="tel:03034201319"><Phone className="h-3 w-3" />0303-4201319</a>
                <a href="mailto:info@perfectprints.pk"><Mail className="h-3 w-3" />info@perfectprints.pk</a>
                <a href="https://wa.me/923034201319" target="_blank" rel="noopener noreferrer">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a href="/contact"><MapPin className="h-3 w-3" />Pakistan</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-20 w-full pb-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-3 font-mono border-t border-[#111]">
            <div className="text-neutral-600 text-[10px] tracking-widest uppercase order-3 md:order-1">© 2026 PERFECTPRINTS.PK. ALL RIGHTS RESERVED.</div>
            
            {/* Website Created By - Center */}
            <div className="text-neutral-600 text-[9px] tracking-widest uppercase order-2 text-center flex items-center gap-2">
              <span>WEBSITE CREATED BY</span>
              <span className="text-neutral-400 font-black">AWAIS MALIK</span>
              <span className="text-[#1f1f1f]">|</span>
              <a href="tel:03034201319" className="text-neutral-500 hover:text-white transition-colors font-black">03034201319</a>
            </div>

            <div className="footer-glass-pill px-5 py-2.5 rounded-none flex items-center gap-2 order-1 md:order-3 cursor-default border-[#1a1a1c]">
              <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest">ENGINEERED BY</span>
              <span className="text-white font-black text-xs tracking-wider">SCALEMETRIC</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}