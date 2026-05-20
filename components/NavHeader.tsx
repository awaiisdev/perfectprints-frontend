"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavHeader() {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const mainLinks = [
    { name: "Home", link: "/" },
    { name: "Shop All", link: "#" },
    { name: "Custom Lab", link: "#" },
    { name: "Bulk & Print", link: "#" },
    { name: "Track Order", link: "#" }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-[#1a1a1c] z-50 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-black tracking-tighter text-white font-serif uppercase">
          PERFECT<span className="text-[#88888f]">PRINTS</span>
        </div>

        <ul className="relative hidden md:flex items-center w-fit rounded-full border border-[#1a1a1c] bg-[#0a0a0c] p-1" onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}>
          {mainLinks.map((item) => (
            <Tab key={item.name} setPosition={setPosition} link={item.link}>{item.name}</Tab>
          ))}
          <motion.li animate={position} transition={{ type: "spring", stiffness: 400, damping: 35 }} className="absolute z-0 h-8 rounded-full bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/30" />
        </ul>

        <button onClick={() => setIsOpen(true)} className="md:hidden text-white flex flex-col gap-1.5 p-2">
          <span className="w-6 h-0.5 bg-white block"></span>
          <span className="w-6 h-0.5 bg-white block"></span>
        </button>
      </header>
      <div className="h-[76px]"></div>
    </>
  );
}

const Tab = ({ children, setPosition, link }: any) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li ref={ref} onMouseEnter={() => { if (!ref.current) return; const { width } = ref.current.getBoundingClientRect(); setPosition({ width, opacity: 1, left: ref.current.offsetLeft }); }} className="relative z-10 block cursor-pointer px-5 py-2.5 text-xs font-bold tracking-widest uppercase text-white transition-colors duration-200">
      <a href={link}>{children}</a>
    </li>
  );
};