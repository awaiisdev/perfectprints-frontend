"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function NavHeader() {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  const mainLinks = [
    { name: "Home", link: "/" },
    { name: "Shop All", link: "/shop" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
    { name: "FAQ", link: "/faq" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-black backdrop-blur-md border-b border-black/10 dark:border-white/10 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300">

        {/* LOGO */}
        <Link href="/" className="text-xl font-black tracking-tighter text-black dark:text-white uppercase" style={{ fontFamily: "var(--font-montserrat)" }}>
          PERFECT<span className="text-neutral-400">PRINTS</span>
        </Link>

        {/* DESKTOP NAV */}
        <ul
          className="relative hidden md:flex items-center w-fit rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-1"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          {mainLinks.map((item) => (
            <Tab key={item.name} setPosition={setPosition} link={item.link}>
              {item.name}
            </Tab>
          ))}
          <motion.li
            animate={position}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="absolute z-0 h-8 rounded-full bg-black/10 dark:bg-white/10"
          />
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4">

          {/* DARK/LIGHT TOGGLE */}
          <button
            onClick={toggle}
            className="text-black dark:text-white hover:text-neutral-500 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* SEARCH */}
          <button
            onClick={() => setSearchOpen(true)}
            className="text-black dark:text-white hover:text-neutral-500 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* CART */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-black dark:text-white hover:text-neutral-500 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-black dark:text-white flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`w-6 h-0.5 bg-black dark:bg-white block transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-black dark:bg-white block transition-all ${isOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-black dark:bg-white block transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/98 dark:bg-black/98 z-50 flex items-center justify-center px-6"
          >
            <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 text-black dark:text-white hover:text-neutral-400 transition-colors">
              <X className="w-7 h-7" />
            </button>
            <div className="w-full max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 text-center" style={{ fontFamily: "var(--font-inter)" }}>
                Search Products
              </p>
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="T-shirts, mugs, custom prints..."
                  className="w-full bg-transparent border-b-2 border-black dark:border-white text-black dark:text-white text-2xl md:text-4xl font-black uppercase tracking-tight outline-none pb-4 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 placeholder:font-normal placeholder:text-xl"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                />
                <button type="submit" className="absolute right-0 bottom-4 text-[10px] uppercase tracking-widest text-black dark:text-white hover:text-neutral-400 transition-colors font-black">
                  Search →
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] z-40 bg-white dark:bg-black p-6 md:hidden flex flex-col gap-6 items-center justify-center"
          >
            {mainLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="text-black dark:text-white text-2xl font-black uppercase tracking-widest hover:text-neutral-400 transition-colors"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} setIsOpen={setCartOpen} />
      <div className="h-[76px]" />
    </>
  );
}

const Tab = ({ children, setPosition, link }: any) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      className="relative z-10 cursor-pointer"
    >
      <Link
        href={link}
        className="block px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-black dark:text-white"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {children}
      </Link>
    </li>
  );
};