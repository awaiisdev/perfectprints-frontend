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
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("Description");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
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

      if (data.type === "variable") {
        fetch(`/api/variations?id=${data.id}`)
          .then(r => r.json())
          .then(v => setVariations(Array.isArray(v) ? v : []));
      }

      // Real Related Products Fetching
      if (data.related_ids && data.related_ids.length > 0) {
        Promise.all(data.related_ids.map((rid: number) => getProduct(rid.toString())))
          .then(res => setRelatedProducts(res.filter(p => p)));
      }
    });
  }, [id]);

  const getVariationImage = (attrs: Record<string, string>) => {
    if (!variations.length) return null;
    const match = variations.find((v: any) =>
      v.attributes?.every((a: any) => !attrs[a.name] || attrs[a.name] === a.option)
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

  if (loading) return <main className="bg-black text-white min-h-screen flex items-center justify-center">Loading...</main>;
  if (!product) return <main className="bg-black text-white min-h-screen flex items-center justify-center">Product not found</main>;

  const images = product.images?.length > 0 ? product.images : [{ src: null }];
  const price = product.sale_price || product.regular_price || product.price;
  const variationAttrs = product.attributes?.filter((a: any) => a.variation) || [];

  return (
    <main className="bg-black text-white min-h-screen py-20 px-6 md:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <button onClick={() => router.back()} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white mb-12">← Back</button>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="w-full aspect-[4/5] bg-[#0a0a0a] border border-[#1a1a1c] overflow-hidden">
              <img src={images[selectedImage]?.src} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-black uppercase" dangerouslySetInnerHTML={{ __html: product.name }} />
            <p className="text-2xl font-bold">PKR {parseFloat(price || "0").toLocaleString()}</p>
            {variationAttrs.map((attr: any) => (
              <div key={attr.id}>
                <p className="text-[10px] font-bold uppercase text-neutral-400 mb-4">{attr.name}</p>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((option: string) => (
                    <button key={option} onClick={() => handleAttributeSelect(attr.name, option)} className={`px-4 h-11 border text-xs font-bold uppercase ${selectedAttributes[attr.name] === option ? "bg-white text-black" : "border-[#1a1a1c]"}`}>{option}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-3">
              <button onClick={handleAddToBag} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em]">{added ? "✓ Added to Bag!" : "Add to Bag"}</button>
              <button onClick={() => { handleAddToBag(); router.push("/checkout"); }} className="w-full py-5 border border-white text-white font-black uppercase tracking-[0.2em]">Buy Now</button>
            </div>
            
            <div className="border-t border-[#1a1a1c]">
              {[
                { title: "Description", content: product.short_description || product.description },
                { title: "Details", content: product.description },
                { title: "Shipping & Returns", content: "Delivery across Pakistan in 3-5 working days. Free shipping on orders over PKR 5,000." },
              ].map((section) => (
                <div key={section.title} className="border-b border-[#1a1a1c]">
                  <button className="w-full py-6 flex justify-between uppercase font-bold text-xs tracking-widest" onClick={() => setOpenSection(openSection === section.title ? null : section.title)}>
                    {section.title} <span>{openSection === section.title ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {openSection === section.title && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden pb-6 text-neutral-400 text-sm" dangerouslySetInnerHTML={{ __html: section.content }} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-[#1a1a1c] pt-12">
            <h3 className="text-xl font-bold uppercase tracking-tighter text-white mb-10">You Might Also Like</h3>
            <div className="flex overflow-hidden">
              <motion.div className="flex gap-6" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }}>
                {[...relatedProducts, ...relatedProducts].map((rel, i) => (
                  <div key={i} className="min-w-[200px] cursor-pointer" onClick={() => router.push(`/product/${rel.id}`)}>
                    <div className="h-64 bg-[#0a0a0a] border border-[#1a1a1c] mb-3">
                      <img src={rel.images?.[0]?.src} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs uppercase font-bold tracking-widest">{rel.name}</p>
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