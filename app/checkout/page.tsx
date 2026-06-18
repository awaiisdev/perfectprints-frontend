"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

// ─── Pakistani number auto-format ───────────────────────────────────────────
function formatPakistaniNumber(input: string): string {
  const num = input.replace(/\D/g, "");
  if (num.startsWith("92") && num.length === 12) return "+" + num;
  if (num.startsWith("0") && num.length === 11) return "+92" + num.slice(1);
  if (num.length === 10) return "+92" + num;
  if (num.length > 0) return "+" + num;
  return num;
}

// ─── Google Maps Popup ───────────────────────────────────────────────────────
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

function MapPopup({ onConfirm, onClose }: { onConfirm: (address: string, lat: number, lng: number, city?: string) => void; onClose: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) { initMap(); return; }
    const existing = document.getElementById("google-maps-script");
    if (existing) { existing.addEventListener("load", initMap); return; }

    window.initGoogleMaps = initMap;
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  function initMap() {
    if (!mapRef.current) return;
    const defaultCenter = { lat: 31.5204, lng: 74.3587 }; // Lahore

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: "all", stylers: [{ saturation: -20 }] },
      ],
    });

    const marker = new window.google.maps.Marker({
      position: defaultCenter,
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    const geocoder = new window.google.maps.Geocoder();
    mapInstanceRef.current = map;
    markerRef.current = marker;
    geocoderRef.current = geocoder;

    // Marker drag end
    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      reverseGeocode(pos.lat(), pos.lng());
    });

    // Map click
    map.addListener("click", (e: any) => {
      marker.setPosition(e.latLng);
      reverseGeocode(e.latLng.lat(), e.latLng.lng());
    });

    // Search autocomplete
    if (inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "pk" },
        fields: ["geometry", "formatted_address"],
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        map.setCenter(place.geometry.location);
        map.setZoom(16);
        marker.setPosition(place.geometry.location);
        setAddress(place.formatted_address || "");
        // Extract city
        const components = place.address_components || [];
        const cityComp = components.find((c: any) =>
          c.types.includes("locality") || c.types.includes("administrative_area_level_2")
        );
        if (cityComp) setCity(cityComp.long_name);
      });
      autocompleteRef.current = autocomplete;
    }

    setMapReady(true);

    // Auto detect location
    detectLocation();
  }

  const [city, setCity] = useState("");

  function reverseGeocode(lat: number, lng: number) {
    if (!geocoderRef.current) return;
    geocoderRef.current.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
        // Extract city from address components
        const components = results[0].address_components || [];
        const cityComp = components.find((c: any) =>
          c.types.includes("locality") || c.types.includes("administrative_area_level_2")
        );
        if (cityComp) setCity(cityComp.long_name);
      }
    });
  }

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        mapInstanceRef.current?.setCenter({ lat, lng });
        mapInstanceRef.current?.setZoom(16);
        markerRef.current?.setPosition({ lat, lng });
        reverseGeocode(lat, lng);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  function handleConfirm() {
    const pos = markerRef.current?.getPosition();
    if (!pos || !address) return;
    onConfirm(address, pos.lat(), pos.lng(), city);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-t-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh", animation: "slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)" }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-black/10 dark:bg-white/10" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-black/10 dark:border-white/10">
          <div>
            <p className="font-black text-sm uppercase tracking-widest text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              📍 Select Your Address
            </p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
              Drag the pin or search your area
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 bg-neutral-50 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 rounded-lg">
            <span className="text-neutral-400 text-sm">🔍</span>
            <input
              ref={inputRef}
              placeholder="Search your area or street..."
              className="flex-1 bg-transparent outline-none text-sm text-black dark:text-white placeholder:text-neutral-400"
              style={{ fontFamily: "var(--font-inter)" }}
            />
          </div>
        </div>

        {/* Current Location Button */}
        <div className="px-4 pb-2">
          <button
            onClick={detectLocation}
            disabled={locating}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-blue-200 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-400/5 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-blue-100 dark:hover:bg-blue-400/10 disabled:opacity-60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {locating ? (
              <><span className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Detecting location...</>
            ) : (
              <><span>🎯</span> Use My Current Location</>
            )}
          </button>
        </div>

        {/* Map */}
        <div className="mx-4 mb-2 rounded-xl overflow-hidden border border-black/10 dark:border-white/10" style={{ height: 240 }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-black/50">
              <span className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Address Preview */}
        <div className={`mx-4 mb-3 px-4 py-3 rounded-xl border transition-all ${address ? "border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-500/5" : "border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5"}`}>
          {address ? (
            <p className="text-xs text-green-700 dark:text-green-400 font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
              ✅ {address}
            </p>
          ) : (
            <p className="text-xs text-neutral-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
              📍 Tap on the map or use location button
            </p>
          )}
        </div>

        {/* Confirm Button */}
        <div className="px-4 pb-6">
          <button
            onClick={handleConfirm}
            disabled={!address}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-80"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {address ? "✓ Confirm This Address" : "Select a Location First"}
          </button>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
    </div>
  );
}

// ─── Main Checkout ───────────────────────────────────────────────────────────
function CheckoutInner() {
  const { items, total, clearCart, removeItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipping = 200;
  const grandTotal = total + shipping;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
  });
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState("Direct");

  useEffect(() => {
    const utm = searchParams.get("utm_source");
    const fbclid = searchParams.get("fbclid");
    const ref = document.referrer;
    if (fbclid || utm === "fb" || utm === "facebook") setSource("Source: Fb");
    else if (utm === "ig" || utm === "instagram") setSource("Source: Ig");
    else if (utm) setSource(`Source: ${utm}`);
    else if (ref.includes("facebook")) setSource("Source: Fb");
    else if (ref.includes("instagram")) setSource("Source: Ig");
    else if (ref.includes("google")) setSource("Source: Google");
    else if (ref.includes("tiktok")) setSource("Source: TikTok");
    const saved = localStorage.getItem("pp_source");
    if (saved) setSource(saved);
    if (fbclid || utm) {
      const s = fbclid ? "Source: Fb" : `Source: ${utm}`;
      localStorage.setItem("pp_source", s);
      setSource(s);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Phone blur pe auto-format
  const handlePhoneBlur = (field: "phone" | "whatsapp") => {
    const val = form[field];
    if (val) setForm((prev) => ({ ...prev, [field]: formatPakistaniNumber(val) }));
  };

  // Map confirm — auto fill address + city
  const handleMapConfirm = (address: string, lat: number, lng: number, city?: string) => {
    setForm((prev) => ({ 
      ...prev, 
      address,
      city: city || prev.city,
    }));
    setMapCoords({ lat, lng });
    setShowMap(false);
  };

  // WhatsApp number = phone agar same checkbox checked
  const whatsappNumber = sameAsPhone ? form.phone : form.whatsapp;

  const isFormValid =
    form.name &&
    form.phone &&
    form.address &&
    form.city &&
    whatsappNumber &&
    paymentMethod &&
    items.length > 0;

  const handleOrder = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError(null);

    const finalPhone = formatPakistaniNumber(form.phone);
    const finalWhatsapp = formatPakistaniNumber(whatsappNumber);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: finalPhone,
          whatsapp: finalWhatsapp,
          address: form.address,
          city: form.city,
          mapCoords,
          paymentMethod,
          items,
          shipping,
          total: grandTotal,
          source,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const itemsList = items.map((i) => {
        const attrs = Object.entries(i.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
        return `• ${i.quantity}x ${i.name}${attrs ? ` (${attrs})` : ""} = PKR ${(parseFloat(i.price) * i.quantity).toLocaleString()}`;
      }).join("\n");

      const mapsLink = mapCoords ? `\n📌 Google Maps: https://maps.google.com/?q=${mapCoords.lat},${mapCoords.lng}` : "";

      const ownerMessage =
        `🛍️ *New Order #${data.orderNumber} — PerfectPrints*\n\n` +
        `*Customer:* ${form.name}\n*Phone:* ${finalPhone}\n*WhatsApp:* ${finalWhatsapp}\n*Address:* ${form.address}, ${form.city}${mapsLink}\n\n` +
        `*Items:*\n${itemsList}\n\n*Shipping:* PKR ${shipping}\n*Total:* PKR ${grandTotal.toLocaleString()}\n\n*Payment:* ${paymentMethod}\n*Source:* ${source}`;

      const customerMessage =
        `✅ *Order Confirmed — PerfectPrints*\n\nHi ${form.name}! 🎉\n\n` +
        `Your order *#${data.orderNumber}* has been placed.\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Delivery Address:* ${form.address}, ${form.city}\n` +
        `*Shipping:* PKR ${shipping}\n*Total:* PKR ${grandTotal.toLocaleString()}\n` +
        `*Payment:* ${paymentMethod}\n\nEstimated delivery: 3–5 working days.\n— *PerfectPrints Team* 🙏`;

      const orderData = encodeURIComponent(JSON.stringify({
        orderNumber: data.orderNumber,
        name: form.name,
        phone: finalPhone,
        whatsapp: finalWhatsapp,
        address: form.address,
        city: form.city,
        mapCoords,
        paymentMethod,
        items,
        shipping,
        total: grandTotal,
        ownerMessage,
        customerMessage,
        customerPhone: finalWhatsapp,
        date: new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" }),
      }));

      localStorage.removeItem("pp_source");
      clearCart();
      router.push(`/thank-you?order=${orderData}`);

      setTimeout(() => {
        window.open(`https://wa.me/923010148055?text=${encodeURIComponent(ownerMessage)}`, "_blank");
      }, 800);

      setTimeout(() => {
        window.open(`https://wa.me/${finalWhatsapp.replace("+", "")}?text=${encodeURIComponent(customerMessage)}`, "_blank");
      }, 2000);

    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen py-16 px-4 sm:px-6 md:px-16 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16">

          {/* LEFT — FORM */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b border-black/10 dark:border-white/10 pb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
              Delivery Information
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-4 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400 transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              />

              {/* Phone */}
              <input
                name="phone"
                placeholder="Phone Number (03XXXXXXXXX)"
                value={form.phone}
                onChange={handleChange}
                onBlur={() => handlePhoneBlur("phone")}
                className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-4 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400 transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              />

              {/* WhatsApp field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="w-3.5 h-3.5 accent-black dark:accent-white"
                  />
                  <span className="text-[11px] text-neutral-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-inter)" }}>
                    WhatsApp number same as phone
                  </span>
                </label>

                {!sameAsPhone && (
                  <input
                    name="whatsapp"
                    placeholder="WhatsApp Number (03XXXXXXXXX)"
                    value={form.whatsapp}
                    onChange={handleChange}
                    onBlur={() => handlePhoneBlur("whatsapp")}
                    className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-4 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400 transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <input
                  name="address"
                  placeholder="Full Address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-4 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400 transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>

              {/* City */}
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-4 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400 transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>

            {/* Payment */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>
                Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Cash on Delivery", "EasyPaisa / JazzCash", "Bank Transfer"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-4 border text-[10px] font-semibold uppercase tracking-widest transition-all ${paymentMethod === method ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "border-black/10 dark:border-white/10 text-neutral-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"}`}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs uppercase tracking-widest border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-400/5 p-3" style={{ fontFamily: "var(--font-inter)" }}>
                ⚠ {error}
              </p>
            )}

            <button
              onClick={handleOrder}
              disabled={!isFormValid || loading}
              className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs hover:opacity-80 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />Processing...</>
              ) : "Confirm Order"}
            </button>

            <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center" style={{ fontFamily: "var(--font-inter)" }}>
              A WhatsApp confirmation will be sent after order is placed
            </p>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="bg-neutral-50 dark:bg-[#050507] border border-black/10 dark:border-white/10 p-6 sm:p-8 h-fit md:sticky md:top-10 order-first md:order-last">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
              Order Summary
            </h2>
            {items.length === 0 ? (
              <p className="text-neutral-400 text-xs uppercase tracking-widest text-center py-8" style={{ fontFamily: "var(--font-inter)" }}>Your cart is empty</p>
            ) : (
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.attributes)}`} className="flex gap-4 items-start">
                    <div className="w-16 h-20 bg-neutral-100 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 overflow-hidden flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-grow">
                      <h3 className="text-xs font-black uppercase text-black dark:text-white leading-tight" style={{ fontFamily: "var(--font-montserrat)" }} dangerouslySetInnerHTML={{ __html: item.name }} />
                      {Object.entries(item.attributes || {}).map(([k, v]) => (
                        <p key={k} className="text-[10px] text-neutral-400 uppercase" style={{ fontFamily: "var(--font-inter)" }}>{k}: {v}</p>
                      ))}
                      <p className="text-[10px] text-neutral-400" style={{ fontFamily: "var(--font-inter)" }}>Qty: {item.quantity}</p>
                      <p className="text-xs font-black text-black dark:text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                        PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-neutral-300 dark:text-neutral-600 hover:text-red-500 transition-colors flex-shrink-0 mt-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-3 border-t border-black/10 dark:border-white/10 pt-6 text-xs uppercase font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
              <div className="flex justify-between text-neutral-400"><span>Subtotal</span><span>PKR {total.toLocaleString()}</span></div>
              <div className="flex justify-between text-neutral-400"><span>Shipping</span><span>PKR {shipping}</span></div>
              <div className="flex justify-between items-center text-black dark:text-white text-base pt-2 border-t border-black/10 dark:border-white/10 font-black" style={{ fontFamily: "var(--font-montserrat)" }}>
                <span>Total</span><span>PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <CheckoutInner />
    </Suspense>
  );
}