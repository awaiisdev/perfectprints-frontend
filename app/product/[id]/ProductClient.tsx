"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { getProduct, getProducts } from "@/lib/woocommerce";
import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2, Heart, Star, Upload, X, CheckCircle } from "lucide-react";
import CinematicFooter from "@/components/CinematicFooter";

declare global {
  interface Window { fbq?: (...args: any[]) => void; }
}

export default function ProductClient() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct]               = useState<any>(null);
  const [variations, setVariations]         = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, text: "", images: [] as string[] });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage]   = useState(0);
  const [openSection, setOpenSection]       = useState<string | null>("Description");
  const [added, setAdded]                   = useState(false);
  const [wished, setWished]                 = useState(false);
  const [currentPrice, setCurrentPrice]     = useState<string>("");

  // ── Custom Order fields (up to 2 photos + 2 names, labels set in WP admin) ──
  const [customValues, setCustomValues]     = useState<Record<string, string>>({});
  const [customPreviews, setCustomPreviews] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey]     = useState<string | null>(null);
  const [customError, setCustomError]       = useState<string | null>(null);


  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSelectedAttributes({});
    setSelectedImage(0);

    getProduct(id).then((data) => {
      setProduct(data);
      setCurrentPrice(data.sale_price || data.regular_price || data.price || "0");
      setLoading(false);

      // Fetch reviews
      fetch(`/api/reviews?product_id=${data.id}`)
        .then(r => r.json())
        .then(r => setReviews(Array.isArray(r) ? r : []));

      if (data.type === "variable") {
        fetch(`/api/variations?id=${data.id}`)
          .then(r => r.json())
          .then(v => setVariations(Array.isArray(v) ? v : []));
      }

      if (data.related_ids?.length > 0) {
        const ids = data.related_ids.slice(0, 10);
        Promise.all(ids.map((rid: number) => getProduct(rid.toString())))
          .then(res => setRelatedProducts(res.filter(Boolean)));
      } else {
        getProducts(10).then(all => {
          const others = Array.isArray(all)
            ? all.filter((p: any) => String(p.id) !== String(id)).slice(0, 10)
            : [];
          setRelatedProducts(others);
        });
      }

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
      const vPrice = matched.sale_price || matched.regular_price || matched.price;
      if (vPrice) setCurrentPrice(vPrice);
      if (matched.image?.src) {
        const imgs = product.images || [];
        const idx = imgs.findIndex((img: any) => img.src === matched.image.src);
        setSelectedImage(idx >= 0 ? idx : 0);
      }
    }
  };

  const allAttrsSelected = () => {
    if (!product) return false;
    const varAttrs = product.attributes?.filter((a: any) => a.variation) || [];
    if (varAttrs.length === 0) return true;
    return varAttrs.every((a: any) => selectedAttributes[a.name]);
  };

  const handleAddToBag = () => {
    if (!canAdd) return;
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
      ...(isCustomOrder ? {
        isCustomOrder: true,
        customFields: customFieldDefs.map((f) => ({
          label: f.label,
          type: f.type,
          value: customValues[f.key] || "",
        })),
      } : {}),
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
    if (!canAdd) return;
    handleAddToBag();
    setTimeout(() => router.push("/checkout"), 300);
  };

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

  // Custom Order field definitions — driven by labels set in WordPress admin.
  // Empty label = field not used for this product.
  const customFieldDefs: { key: string; type: "name" | "photo"; label: string }[] = [
    { key: "name1",  type: "name" as const,  label: product.pp_name1_label  || "" },
    { key: "name2",  type: "name" as const,  label: product.pp_name2_label  || "" },
    { key: "photo1", type: "photo" as const, label: product.pp_photo1_label || "" },
    { key: "photo2", type: "photo" as const, label: product.pp_photo2_label || "" },
  ].filter((f) => f.label.trim().length > 0);

  const isCustomOrder = !!product.pp_custom_order && customFieldDefs.length > 0;
  const customFieldsValid =
    !isCustomOrder || customFieldDefs.every((f) => !!customValues[f.key]?.trim());

  const canAdd = allAttrsSelected() && customFieldsValid;

  // Photo ko upload se pehle chhota/compress karta hai (max 1400px, JPEG 75%)
  // taake customer ke phone ki 5-8MB photo turant upload ho jaye, atki na rahe.
  const compressImage = (file: File, maxDimension = 1400, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("canvas error")); return; }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCustomPhotoChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomError(null);
    setUploadingKey(key);
    try {
      const base64 = await compressImage(file);
      setCustomPreviews((prev) => ({ ...prev, [key]: base64 }));
      const res = await fetch("/api/custom-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        setCustomValues((prev) => ({ ...prev, [key]: data.url }));
      } else {
        setCustomError("Photo upload nahi hui, dobara try karein.");
        setCustomPreviews((prev) => ({ ...prev, [key]: "" }));
      }
    } catch {
      setCustomError("Photo upload nahi hui, dobara try karein.");
      setCustomPreviews((prev) => ({ ...prev, [key]: "" }));
    } finally {
      setUploadingKey(null);
    }
  };

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

          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]?.src}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
                  </button>
                  <button onClick={() => setSelectedImage(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-black dark:text-white" />
                  </button>
                </>
              )}
              {product.sale_price && (
                <span className="absolute top-4 left-4 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black px-3 py-1 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>SALE</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: any, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-16 h-20 border-2 overflow-hidden transition-all ${selectedImage === i ? "border-black dark:border-white" : "border-transparent opacity-50 hover:opacity-80"}`}>
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col gap-6">
            {product.categories?.[0] && (
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-black" style={{ fontFamily: "var(--font-inter)" }}>{product.categories[0].name}</span>
            )}
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-tight break-words w-full" style={{ fontFamily: "var(--font-montserrat)" }} dangerouslySetInnerHTML={{ __html: (product.name || "").replace(/[\|–—-]\s*(www\.)?perfectprints\.pk\s*/gi, "").replace(/[\|–—-]\s*(darkgreen-sardine-406947\.hostingersite\.com)\s*/gi, "").trim() }} />

            {/* Star Rating — click karo reviews pe scroll ho */}
            {reviews.length > 0 && (
              <button
                onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 group"
              >
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviews.reduce((a,r) => a + r.rating, 0) / reviews.length) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`} />
                  ))}
                </div>
                <span className="text-sm font-black text-black dark:text-white">{(reviews.reduce((a,r) => a + r.rating, 0) / reviews.length).toFixed(1)}</span>
                <span className="text-xs text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors underline underline-offset-2" style={{ fontFamily: "var(--font-inter)" }}>
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </button>
            )}

            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1" style={{ fontFamily: "var(--font-inter)" }}>Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black" style={{ fontFamily: "var(--font-montserrat)" }}>PKR {parseFloat(currentPrice || "0").toLocaleString()}</span>
                {product.sale_price && product.regular_price && currentPrice === product.sale_price && (
                  <span className="text-sm text-neutral-400 line-through" style={{ fontFamily: "var(--font-inter)" }}>PKR {parseFloat(product.regular_price).toLocaleString()}</span>
                )}
              </div>
            </div>
            {variantAttrs.map((attr: any) => (
              <div key={attr.id}>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
                  {attr.name}{selectedAttributes[attr.name] && <span className="text-black dark:text-white ml-2">— {selectedAttributes[attr.name]}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((option: string) => (
                    <button key={option} onClick={() => handleAttributeSelect(attr.name, option)}
                      className={`px-4 h-10 border text-[11px] font-semibold uppercase tracking-wider transition-all ${selectedAttributes[attr.name] === option ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "border-black/20 dark:border-white/20 text-black dark:text-white hover:border-black dark:hover:border-white"}`}
                      style={{ fontFamily: "var(--font-inter)" }}>{option}</button>
                  ))}
                </div>
              </div>
            ))}
            {hasVariants && !allAttrsSelected() && (
              <p className="text-[11px] text-neutral-400 uppercase tracking-widest border border-black/10 dark:border-white/10 px-4 py-3" style={{ fontFamily: "var(--font-inter)" }}>
                ⚠ Please select {variantAttrs.filter((a: any) => !selectedAttributes[a.name]).map((a: any) => a.name).join(" & ")} to continue
              </p>
            )}

            {/* ── CUSTOM ORDER FIELDS ── */}
            {isCustomOrder && (
              <div className="border border-black/10 dark:border-white/10 p-5 space-y-4 bg-neutral-50 dark:bg-[#0a0a0a]">
                <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white" style={{ fontFamily: "var(--font-inter)" }}>
                  ✏️ Customize This Order
                </p>

                {customFieldDefs.filter((f) => f.type === "name").map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>
                      {f.label} *
                    </label>
                    <input
                      value={customValues[f.key] || ""}
                      onChange={(e) => setCustomValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.label}
                      className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 p-3 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                ))}

                {customFieldDefs.filter((f) => f.type === "photo").map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>
                      {f.label} *
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer w-fit border border-black/20 dark:border-white/20 px-4 py-2.5 text-[10px] uppercase tracking-widest text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingKey === f.key ? "Uploading..." : customValues[f.key] ? "Change Photo" : `Choose Photo`}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCustomPhotoChange(f.key, e)} disabled={uploadingKey === f.key} />
                    </label>
                    {customPreviews[f.key] && (
                      <div className="flex items-center gap-2 mt-2">
                        <img src={customPreviews[f.key]} alt="" className="w-16 h-16 object-cover border border-black/10 dark:border-white/10" />
                        {uploadingKey === f.key ? (
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Uploading...</span>
                        ) : customValues[f.key] ? (
                          <span className="text-[10px] text-green-600 uppercase tracking-widest flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Uploaded</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}

                {customError && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest">⚠ {customError}</p>
                )}
              </div>
            )}

            {allAttrsSelected() && !customFieldsValid && (
              <p className="text-[11px] text-neutral-400 uppercase tracking-widest border border-black/10 dark:border-white/10 px-4 py-3" style={{ fontFamily: "var(--font-inter)" }}>
                ⚠ Please fill all required fields above to continue
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button onClick={handleAddToBag} disabled={!canAdd}
                className={`w-full py-5 font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 ${canAdd ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-80 cursor-pointer" : "bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed"}`}
                style={{ fontFamily: "var(--font-montserrat)" }}>{added ? "✓ Added to Bag!" : "Add to Bag"}</button>
              <button onClick={handleBuyNow} disabled={!canAdd}
                className={`w-full py-5 font-black uppercase tracking-[0.2em] text-xs transition-all border ${canAdd ? "border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer" : "border-black/10 dark:border-white/10 text-black/30 dark:text-white/30 cursor-not-allowed"}`}
                style={{ fontFamily: "var(--font-montserrat)" }}>Buy Now</button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[{ icon: "🚚", label: "Free Shipping", sub: "Orders above PKR 3,000" }, { icon: "✅", label: "Verified Quality", sub: "100% print guarantee" }, { icon: "💳", label: "Cash on Delivery", sub: "Available nationwide" }].map((b) => (
                <div key={b.label} className="border border-black/10 dark:border-white/10 p-3 text-center">
                  <div className="text-lg mb-1">{b.icon}</div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-black dark:text-white" style={{ fontFamily: "var(--font-inter)" }}>{b.label}</p>
                  <p className="text-[9px] text-neutral-400 mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>{b.sub}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setWished(w => !w)} className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors ${wished ? "text-red-500" : "text-neutral-400 hover:text-black dark:hover:text-white"}`} style={{ fontFamily: "var(--font-inter)" }}>
                <Heart className={`w-4 h-4 ${wished ? "fill-red-500" : ""}`} />{wished ? "Wishlisted" : "Wishlist"}
              </button>
              <button onClick={() => { if (navigator.share) { navigator.share({ title: product.name, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                <Share2 className="w-4 h-4" />Share
              </button>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 mt-2">
              {[
                { title: "Description", content: (product.short_description || product.description || "").replace(/(www\.)?perfectprints\.pk/gi, "Perfect Prints").replace(/darkgreen-sardine-406947\.hostingersite\.com/gi, "Perfect Prints") },
                { title: "Product Details", content: (product.description || "").replace(/(www\.)?perfectprints\.pk/gi, "Perfect Prints").replace(/darkgreen-sardine-406947\.hostingersite\.com/gi, "Perfect Prints") },
                { title: "Shipping & Returns", content: "<p>Standard delivery across Pakistan in 3–5 working days. Free shipping on orders above PKR 3,000. Cash on Delivery available. Returns accepted within 7 days of delivery if item is defective or incorrect.</p>" },
              ].map((sec) => (
                <div key={sec.title} className="border-b border-black/10 dark:border-white/10">
                  <button className="w-full py-5 flex justify-between items-center uppercase font-black text-[11px] tracking-widest text-black dark:text-white" onClick={() => setOpenSection(openSection === sec.title ? null : sec.title)} style={{ fontFamily: "var(--font-inter)" }}>
                    {sec.title}<span className="text-neutral-400 text-lg leading-none">{openSection === sec.title ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {openSection === sec.title && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="pb-6 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed prose prose-sm max-w-none" style={{ fontFamily: "var(--font-inter)" }} dangerouslySetInnerHTML={{ __html: sec.content || "No information available." }} />
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
          <div className="border-t border-black/10 dark:border-white/10 pt-12 pb-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] tracking-[0.4em] text-neutral-400 font-black uppercase block mb-1" style={{ fontFamily: "var(--font-inter)" }}>RELATED PRODUCTS</span>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>You Might Also Like</h3>
              </div>
              <Link href="/shop" className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-black" style={{ fontFamily: "var(--font-inter)" }}>View All →</Link>
            </div>

            {/* Desktop: single marquee | Mobile: 2 rows opposite direction */}
            <style>{`
              @keyframes marquee-ltr { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              @keyframes marquee-rtl { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
              .marquee-ltr { display:flex; width:max-content; animation: marquee-ltr 25s linear infinite; }
              .marquee-rtl { display:flex; width:max-content; animation: marquee-rtl 25s linear infinite; }
              .marquee-ltr:hover, .marquee-rtl:hover { animation-play-state: paused; }
            `}</style>

            {/* DESKTOP — single row marquee */}
            <div className="hidden md:block overflow-hidden w-full">
              <div className="marquee-ltr">
                {[...relatedProducts, ...relatedProducts].map((rel, i) => (
                  <div key={i} className="cursor-pointer group flex-shrink-0 pr-3" style={{ width: "calc((100vw - 8rem) / 5)" }} onClick={() => router.push(`/product/${rel.id}`)}>
                    <div className="w-full aspect-square bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 mb-2 overflow-hidden">
                      {rel.images?.[0]?.src ? <img src={rel.images[0].src} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs uppercase">No Image</div>}
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-tight text-black dark:text-white line-clamp-2 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }} dangerouslySetInnerHTML={{ __html: rel.name }} />
                    <p className="text-[11px] text-neutral-400 mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>PKR {parseFloat(rel.price || "0").toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MOBILE — 2 rows, opposite directions */}
            <div className="md:hidden space-y-3">
              {/* Row 1 — left to right */}
              <div className="overflow-hidden w-full">
                <div className="marquee-ltr">
                  {[...relatedProducts.slice(0, Math.ceil(relatedProducts.length / 2)), ...relatedProducts.slice(0, Math.ceil(relatedProducts.length / 2))].map((rel, i) => (
                    <div key={i} className="cursor-pointer group flex-shrink-0 pr-2" style={{ width: "calc((100vw - 2rem) / 2.5)" }} onClick={() => router.push(`/product/${rel.id}`)}>
                      <div className="w-full aspect-square bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 mb-1.5 overflow-hidden">
                        {rel.images?.[0]?.src ? <img src={rel.images[0].src} alt={rel.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">No Image</div>}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-black dark:text-white line-clamp-2 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }} dangerouslySetInnerHTML={{ __html: rel.name }} />
                      <p className="text-[10px] text-neutral-400 mt-0.5">PKR {parseFloat(rel.price || "0").toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Row 2 — right to left */}
              <div className="overflow-hidden w-full">
                <div className="marquee-rtl">
                  {[...relatedProducts.slice(Math.ceil(relatedProducts.length / 2)), ...relatedProducts.slice(Math.ceil(relatedProducts.length / 2))].map((rel, i) => (
                    <div key={i} className="cursor-pointer group flex-shrink-0 pr-2" style={{ width: "calc((100vw - 2rem) / 2.5)" }} onClick={() => router.push(`/product/${rel.id}`)}>
                      <div className="w-full aspect-square bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 mb-1.5 overflow-hidden">
                        {rel.images?.[0]?.src ? <img src={rel.images[0].src} alt={rel.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">No Image</div>}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-black dark:text-white line-clamp-2 leading-tight" style={{ fontFamily: "var(--font-montserrat)" }} dangerouslySetInnerHTML={{ __html: rel.name }} />
                      <p className="text-[10px] text-neutral-400 mt-0.5">PKR {parseFloat(rel.price || "0").toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* ── REVIEWS SECTION ── */}
      {product && (
        <div id="reviews-section" className="max-w-7xl mx-auto px-4 md:px-16 py-16 border-t border-black/10 dark:border-white/10">

          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.4em] text-neutral-400 font-black uppercase block mb-1" style={{ fontFamily: "var(--font-inter)" }}>CUSTOMER REVIEWS</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                What Our Customers Say
              </h3>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviews.reduce((a,r) => a + r.rating, 0) / reviews.length) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`} />
                  ))}
                </div>
                <span className="text-sm font-black text-black dark:text-white">{(reviews.reduce((a,r) => a + r.rating, 0) / reviews.length).toFixed(1)}</span>
                <span className="text-xs text-neutral-400">({reviews.length} reviews)</span>
              </div>
            )}
          </div>

          {/* Reviews Grid */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {reviews.map((rev, i) => (
                <div key={i} className="border border-black/10 dark:border-white/10 p-5 bg-neutral-50 dark:bg-[#09090b]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>{rev.reviewer}</span>
                        <span className="flex items-center gap-1 text-[10px] text-green-600 font-black uppercase">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>
                      {new Date(rev.date_created).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }} dangerouslySetInnerHTML={{ __html: rev.review }} />
                  {/* Review Images */}
                  {rev.review_images && rev.review_images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {rev.review_images.map((img: string, idx: number) => (
                        <img key={idx} src={img} alt="" className="w-16 h-16 object-cover border border-black/10 dark:border-white/10" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-black/10 dark:border-white/10 mb-12">
              <p className="text-xs text-neutral-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>No reviews yet — be the first!</p>
            </div>
          )}

          {/* Review Form */}
          <div className="border border-black/10 dark:border-white/10 p-6 md:p-8 bg-neutral-50 dark:bg-[#09090b]">
            <h4 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
              Write a Review
            </h4>

            {reviewSubmitted ? (
              <div className="flex items-center gap-3 text-green-600 py-4">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-montserrat)" }}>Review submitted! Thank you.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <input
                  placeholder="Your Name"
                  value={reviewForm.name}
                  onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                  className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 p-3 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400"
                  style={{ fontFamily: "var(--font-inter)" }}
                />

                {/* Star Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>Rating:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setReviewForm({...reviewForm, rating: s})}>
                        <Star className={`w-6 h-6 cursor-pointer transition-colors ${s <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 hover:text-yellow-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <textarea
                  placeholder="Share your experience with this product..."
                  value={reviewForm.text}
                  onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                  rows={4}
                  className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 p-3 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400 resize-none"
                  style={{ fontFamily: "var(--font-inter)" }}
                />

                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer w-fit border border-black/10 dark:border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all" style={{ fontFamily: "var(--font-inter)" }}>
                    <Upload className="w-3 h-3" />
                    Add Photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        const urls: string[] = [];
                        for (const file of files.slice(0, 3)) {
                          const reader = new FileReader();
                          await new Promise<void>(resolve => {
                            reader.onload = () => { urls.push(reader.result as string); resolve(); };
                            reader.readAsDataURL(file);
                          });
                        }
                        setReviewImages(prev => [...prev, ...urls].slice(0, 3));
                      }}
                    />
                  </label>
                  {reviewImages.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {reviewImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt="" className="w-16 h-16 object-cover border border-black/10 dark:border-white/10" />
                          <button onClick={() => setReviewImages(prev => prev.filter((_,i) => i !== idx))} className="absolute -top-1 -right-1 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={async () => {
                    if (!reviewForm.name || !reviewForm.text) return;
                    setReviewSubmitting(true);
                    await fetch("/api/reviews", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        product_id: product.id,
                        reviewer: reviewForm.name,
                        review: reviewForm.text,
                        rating: reviewForm.rating,
                        images: reviewImages,
                      }),
                    });
                    setReviewSubmitting(false);
                    setReviewSubmitted(true);
                    setReviewForm({ name: "", rating: 5, text: "", images: [] });
                    setReviewImages([]);
                  }}
                  disabled={!reviewForm.name || !reviewForm.text || reviewSubmitting}
                  className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <CinematicFooter />
    </main>
  );
}