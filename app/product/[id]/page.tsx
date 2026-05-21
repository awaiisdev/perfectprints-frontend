"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { getProduct } from "@/lib/woocommerce";
import { useCart } from "@/lib/CartContext";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [variations, setVariations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("Description");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProduct(id).then((data) => {
      setProduct(data);
      const defaults: Record<string, string> = {};
      data.attributes?.forEach((attr: any) => {
        if (attr.variation && attr.options?.length > 0) {
          defaults[attr.name] = attr.options[0];
        }
      });
      setSelectedAttributes(defaults);
      setLoading(false);

      // Variations fetch
      if (data.type === "variable") {
        fetch(`/api/variations?id=${data.id}`)
          .then(r => r.json())
          .then(v => setVariations(Array.isArray(v) ? v : []));
      }
    });
  }, [id]);

  // Variation se matching image dhundo
  const getVariationImage = (attrs: Record<string, string>) => {
    if (!variations.length) return null;
    const match = variations.find((v: any) =>
      v.attributes?.every((a: any) =>
        !attrs[a.name] || attrs[a.name] === a.option
      )
    );
    return match?.image?.src || null;
  };

  const handleAttributeSelect = (attrName: string, option: string) => {
    const newAttrs = { ...selectedAttributes, [attrName]: option };
    setSelectedAttributes(newAttrs);
    const varImg = getVariationImage(newAttrs);
    if (varImg) {
      const images = product.images || [];
      const idx = images.findIndex((img: any) => img.src === varImg);
      setSelectedImage(idx >= 0 ? idx : 0);
    }
  };

  const handleAddToBag = () => {
    const varImg = getVariationImage(selectedAttributes);
    addItem({
      id: product.id,
      name: product.name,
      sku: product.sku || "",
      price: product.sale_price || product.regular_price || product.price || "0",
      image: varImg || product.images?.[0]?.src || "",
      quantity: 1,
      attributes: selectedAttributes,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs tracking-widest uppercase text-neutral-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-neutral-500 uppercase tracking-widest text-xs">Product not found</p>
      </main>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ src: null }];
  const price = product.sale_price || product.regular_price || product.price;
  const onSale = product.on_sale;
  const variationAttrs = product.attributes?.filter((a: any) => a.variation) || [];

  return (
    <main className="bg-black text-white min-h-screen py-20 px-6 md:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <button
          onClick={() => router.back()}
          className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white mb-12 flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-16">
          {/* LEFT — Images */}
          <div className="space-y-4">
            <div className="w-full aspect-[4/5] bg-[#0a0a0a] border border-[#1a1a1c] overflow-hidden">
              {images[selectedImage]?.src ? (
                <img src={images[selectedImage].src} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-700 text-xs uppercase tracking-widest">No Image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-[4/5] bg-[#0a0a0a] border overflow-hidden transition-all ${selectedImage === i ? "border-white" : "border-[#1a1a1c]"}`}
                  >
                    {img.src && <img src={img.src} alt="" className="w-full h-full object-cover" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col gap-8">
            <div>
              {product.categories?.length > 0 && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
                  {product.categories[0].name}
                </p>
              )}
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-4"
                dangerouslySetInnerHTML={{ __html: product.name }} />
              {product.sku && (
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-2">SKU: {product.sku}</p>
              )}
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold">PKR {parseFloat(price || "0").toLocaleString()}</p>
                {onSale && product.regular_price && (
                  <p className="text-lg text-neutral-500 line-through">PKR {parseFloat(product.regular_price).toLocaleString()}</p>
                )}
                {onSale && <span className="text-[10px] bg-white text-black px-2 py-1 font-black uppercase tracking-widest">SALE</span>}
              </div>
            </div>

            {variationAttrs.map((attr: any) => (
              <div key={attr.id}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">
                  {attr.name}: <span className="text-white">{selectedAttributes[attr.name]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((option: string) => (
                    <button
                      key={option}
                      onClick={() => handleAttributeSelect(attr.name, option)}
                      className={`px-4 h-11 border text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedAttributes[attr.name] === option
                          ? "bg-white text-black border-white"
                          : "border-[#1a1a1c] text-neutral-400 hover:border-white hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3">
              <button onClick={handleAddToBag}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all">
                {added ? "✓ Added to Bag!" : "Add to Bag"}
              </button>
              <button onClick={() => { handleAddToBag(); router.push("/checkout"); }}
                className="w-full py-5 border border-white text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                Buy Now
              </button>
            </div>

            <div className="border-t border-[#1a1a1c]">
              {[
                { title: "Description", content: product.short_description || product.description },
                { title: "Details", content: product.description },
                { title: "Shipping & Returns", content: "Delivery across Pakistan in 3-5 working days. Free shipping on orders over PKR 5,000." },
              ].map((section) => (
                <div key={section.title} className="border-b border-[#1a1a1c]">
                  <button
                    className="w-full py-6 flex justify-between uppercase font-bold text-xs tracking-widest hover:text-neutral-400 transition-colors"
                    onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                  >
                    {section.title}
                    <span>{openSection === section.title ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {openSection === section.title && section.content && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pb-6 text-neutral-400 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}