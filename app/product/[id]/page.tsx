"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { getProduct, getProducts } from "@/lib/woocommerce";
import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react";

declare global {
  interface Window { fbq?: (...args: any[]) => void; }
}

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct]               = useState<any>(null);
  const [variations, setVariations]         = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage]   = useState(0);
  const [openSection, setOpenSection]       = useState<string | null>("Description");
  const [added, setAdded]                   = useState(false);
  const [wished, setWished]                 = useState(false);
  const [currentPrice, setCurrentPrice]     = useState<string>("");
  const marqueeRef = useRef<HTMLDivElement>(null);

  // ── LOAD PRODUCT ───────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSelectedAttributes({});
    setSelectedImage(0);

    getProduct(id).then((data) => {
      setProduct(data);
      setCurrentPrice(data.sale_price || data.regular_price || data.price || "0");
      setLoading(false);

      // Variations
      if (data.type === "variable") {
        fetch(`/api/variations?id=${data.id}`)
          .then(r => r.json())
          .then(v => setVariations(Array.isArray(v) ? v : []));
      }

      // Related products
      if (data.related_ids?.length > 0) {
        const ids = data.related_ids.slice(0, 8);
        Promise.all(ids.map((rid: number) => getProduct(rid.toString())))
          .then(res => setRelatedProducts(res.filter(Boolean)));
      } else {
        getProducts(8).then(all => {
          const others = Array.isArray(all)
            ? all.filter((p: any) => String(p.id) !== String(id)).slice(0, 8)
            : [];
          setRelatedProducts(others);
        });
      }

      // Meta Pixel ViewContent
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "ViewContent", {
          content_ids: [String(data.id)],
          content_name: data.name,
          content_type: "product",
          value: parseFloat(data.price || "0"),
          currency: "PKR",
        });
      }
    });
  }, [id]);

  // ── VARIATION IMAGE & PRICE ────────────────────
  const getMatchedVariation = (attrs: Record<string, string>) => {
    if (!variations.length) return null;
    return variations.find((v: any) =>
      v.attributes?.every((a: any) =>
        !attrs[a.name] || attrs[a.name].toLowerCase() === a.option.toLowerCase()
      )
    ) || null;
  };

  const handleAttributeSelect = (attrName: string, option: string) => {
    const newAttrs = { ...selectedAttributes, [attrName]: option };
    setSelectedAttributes(newAttrs);

    const matched = getMatchedVariation(newAttrs);
    if (matched) {
      // Update price
      const vPrice = matched.sale_price || matched.regular_price || matched.price;
      if (vPrice) setCurrentPrice(vPrice);

      // Update image
      if (matched.image?.src) {
        const imgs = product.images || [];
        const idx = imgs.findIndex((img: any) => img.src === matched.image.src);
        setSelectedImage(idx >= 0 ? idx : 0);
      }
    }
  };

  // ── ALL ATTRS SELECTED CHECK ───────────────────
  const allAttrsSelected = () => {
    if (!product) return false;
    const varAttrs = product.attributes?.filter((a: any) => a.variation) || [];
    if (varAttrs.length === 0) return true;
    return varAttrs.every((a: any) => selectedAttributes[a.name]);
  };

  // ── ADD TO BAG ────────────────────────────────
  const handleAddToBag = () => {
    if (!allAttrsSelected()) return;
    const matched = getMatchedVariation(selectedAttributes);
    const img = matched?.image?.src || product.images?.[0]?.src || "";
    addItem({
      id: product.id,
      name: product.name,
      sku: product.sku || "",
      price: currentPrice,
      image: img,
      quantity: 1,
      attributes: selectedAttributes,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", {
        content_ids: [String(product.id)],
        content_name: product.name,
        value: parseFloat(currentPrice),
        currency: "PKR",
      });
    }
  };

  const handleBuyNow = () => {
    if (!allAttrsSelected()) return;
    handleAddToBag();
    setTimeout(() => router.push("/checkout"), 300);
  };

  // ── LOADING / ERROR ───────────────────────────
  if (loading) return (
    <main className="bg-white dark:bg-black min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
    </main>
  );
  if (!product) return (
    <main className="bg-white dark:bg-black min-h-screen flex items-center justify-center text-black dark:text-white transition-colors duration-300">
      <p className="text-sm uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>Product not found</p>
    </main>
  );

  const images       = product.images?.length > 0 ? product.images : [{ src: "" }];
  const variantAttrs = product.attributes?.filter((a: any) => a.variation) || [];
  const hasVariants  = variantAttrs.length > 0;
  const canAdd       = allAttrsSelected();

  return (
    <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen py-20 px-4 md:px-16 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 mb-10 text-[10px] uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-black dark:text-white line-clamp-1" dangerouslySetInnerHTML={{ __html: product.name }} />
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-24">

          {/* ── LEFT: IMAGE GALLERY ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/5] bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]?.src}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Prev/Next arrows for mobile */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-4 h-4 text-black dark:text-white" />
                  </button>
                </>
              )}

              {/* Sale badge */}
              {product.sale_price && (
                <span className="absolute top-4 left-4 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black px-3 py-1 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
                  SALE
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-20 border-2 overflow-hidden transition-all ${
                      selectedImage === i
                        ? "border-black dark:border-white"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: PRODUCT INFO ── */}
          <div className="flex flex-col gap-6">

            {/* Category */}
            {product.categories?.[0] && (
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-black" style={{ fontFamily: "var(--font-inter)" }}>
                {product.categories[0].name}
              </span>
            )}

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
              dangerouslySetInnerHTML={{ __html: product.name }}
            />

            {/* Price */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1" style={{ fontFamily: "var(--font-inter)" }}>Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black" style={{ fontFamily: "var(--font-montserrat)" }}>
                  PKR {parseFloat(currentPrice || "0").toLocaleString()}
                </span>
                {product.sale_price && product.regular_price && currentPrice === product.sale_price && (
                  <span className="text-sm text-neutral-400 line-through" style={{ fontFamily: "var(--font-inter)" }}>
                    PKR {parseFloat(product.regular_price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Attribute Selectors */}
            {variantAttrs.map((attr: any) => (
              <div key={attr.id}>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
                  {attr.name}
                  {selectedAttributes[attr.name] && (
                    <span className="text-black dark:text-white ml-2">— {selectedAttributes[attr.name]}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((option: string) => (
                    <button
                      key={option}
                      onClick={() => handleAttributeSelect(attr.name, option)}
                      className={`px-4 h-10 border text-[11px] font-semibold uppercase tracking-wider transition-all ${
                        selectedAttributes[attr.name] === option
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                          : "border-black/20 dark:border-white/20 text-black dark:text-white hover:border-black dark:hover:border-white"
                      }`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Selection Warning */}
            {hasVariants && !canAdd && (
              <p className="text-[11px] text-neutral-400 uppercase tracking-widest border border-black/10 dark:border-white/10 px-4 py-3" style={{ fontFamily: "var(--font-inter)" }}>
                ⚠ Please select {variantAttrs.filter((a: any) => !selectedAttributes[a.name]).map((a: any) => a.name).join(" & ")} to continue
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAddToBag}
                disabled={!canAdd}
                className={`w-full py-5 font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 ${
                  canAdd
                    ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-80 cursor-pointer"
                    : "bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {added ? "✓ Added to Bag!" : "Add to Bag"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!canAdd}
                className={`w-full py-5 font-black uppercase tracking-[0.2em] text-xs transition-all border ${
                  canAdd
                    ? "border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                    : "border-black/10 dark:border-white/10 text-black/30 dark:text-white/30 cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: "🚚", label: "Free Shipping", sub: "Orders above PKR 3,000" },
                { icon: "✅", label: "Verified Quality", sub: "100% print guarantee" },
                { icon: "💳", label: "Cash on Delivery", sub: "Available nationwide" },
              ].map((b) => (
                <div key={b.label} className="border border-black/10 dark:border-white/10 p-3 text-center">
                  <div className="text-lg mb-1">{b.icon}</div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-black dark:text-white" style={{ fontFamily: "var(--font-inter)" }}>{b.label}</p>
                  <p className="text-[9px] text-neutral-400 mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Wishlist + Share */}
            <div className="flex gap-3">
              <button
                onClick={() => setWished(w => !w)}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors ${wished ? "text-red-500" : "text-neutral-400 hover:text-black dark:hover:text-white"}`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Heart className={`w-4 h-4 ${wished ? "fill-red-500" : ""}`} />
                {wished ? "Wishlisted" : "Wishlist"}
              </button>
              <button
                onClick={() => { if (navigator.share) { navigator.share({ title: product.name, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Accordion */}
            <div className="border-t border-black/10 dark:border-white/10 mt-2">
              {[
                { title: "Description", content: product.short_description || product.description },
                { title: "Product Details", content: product.description },
                { title: "Shipping & Returns", content: "<p>Standard delivery across Pakistan in 3–5 working days. Free shipping on orders above PKR 3,000. Cash on Delivery available. Returns accepted within 7 days of delivery if item is defective or incorrect.</p>" },
              ].map((sec) => (
                <div key={sec.title} className="border-b border-black/10 dark:border-white/10">
                  <button
                    className="w-full py-5 flex justify-between items-center uppercase font-black text-[11px] tracking-widest text-black dark:text-white"
                    onClick={() => setOpenSection(openSection === sec.title ? null : sec.title)}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {sec.title}
                    <span className="text-neutral-400 text-lg leading-none">{openSection === sec.title ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {openSection === sec.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="pb-6 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed prose prose-sm max-w-none"
                          style={{ fontFamily: "var(--font-inter)" }}
                          dangerouslySetInnerHTML={{ __html: sec.content || "No information available." }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS MARQUEE ── */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-black/10 dark:border-white/10 pt-16 pb-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] tracking-[0.4em] text-neutral-400 font-black uppercase block mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                  RELATED PRODUCTS
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                  You Might Also Like
                </h3>
              </div>
              <Link href="/shop" className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-black" style={{ fontFamily: "var(--font-inter)" }}>
                View All →
              </Link>
            </div>

            {/* Marquee */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
              >
                {[...relatedProducts, ...relatedProducts].map((rel, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] md:min-w-[240px] cursor-pointer group flex-shrink-0"
                    onClick={() => router.push(`/product/${rel.id}`)}
                  >
                    <div className="h-64 md:h-72 bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 mb-3 overflow-hidden">
                      {rel.images?.[0]?.src ? (
                        <img
                          src={rel.images[0].src}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700 text-xs uppercase tracking-widest">No Image</div>
                      )}
                    </div>
                    <p className="text-xs font-black uppercase tracking-tight text-black dark:text-white line-clamp-1" style={{ fontFamily: "var(--font-montserrat)" }}
                      dangerouslySetInnerHTML={{ __html: rel.name }}
                    />
                    <p className="text-xs text-neutral-400 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                      PKR {parseFloat(rel.price || "0").toLocaleString()}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
