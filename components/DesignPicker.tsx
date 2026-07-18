"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, CheckCircle, ChevronLeft, Loader2 } from "lucide-react";
import { DESIGN_LIST, DesignDef } from "@/lib/designPickerConfig";

// ─────────────────────────────────────────────────────────────────────────
// Canvas helpers (mirrors the standalone 14-August design-maker tool)
// ─────────────────────────────────────────────────────────────────────────

function useImageLoader(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!src) {
      // Defer so we never call setState synchronously inside the effect body.
      Promise.resolve().then(() => { if (!cancelled) setImg(null); });
      return () => { cancelled = true; };
    }
    const image = new Image();
    image.onload = () => { if (!cancelled) setImg(image); };
    image.src = src;
    return () => { cancelled = true; };
  }, [src]);
  return img;
}

function clipPath(ctx: CanvasRenderingContext2D, shape: string, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  if (shape === "circle") {
    const r = Math.min(w, h) / 2;
    ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
  } else if (shape === "oval") {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  } else if (shape === "rounded_rect") {
    const r = Math.min(w, h) * 0.06;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.closePath();
  ctx.clip();
}

interface Adjust { scale: number; ox: number; oy: number; fontScale?: number; }

function drawCovered(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, adjust: Adjust) {
  const scale = adjust.scale || 1;
  const ox = adjust.ox || 0;
  const oy = adjust.oy || 0;
  const boxRatio = w / h;
  const imgRatio = img.width / img.height;
  let baseW, baseH;
  if (imgRatio > boxRatio) { baseH = h; baseW = h * imgRatio; }
  else { baseW = w; baseH = w / imgRatio; }
  const drawW = baseW * scale;
  const drawH = baseH * scale;
  const drawX = x + (w - drawW) / 2 + ox;
  const drawY = y + (h - drawH) / 2 + oy;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

// A small, print-friendly set of display fonts for the customer's name.
// Loaded on demand (only once the picker actually opens) so regular
// product pages never pay for these fonts.
export const NAME_FONTS = [
  { id: "poppins", label: "Classic", css: "'Poppins','Inter',sans-serif", weight: "600" },
  { id: "bebas", label: "Bold", css: "'Bebas Neue',sans-serif", weight: "400" },
  { id: "anton", label: "Chunky", css: "'Anton',sans-serif", weight: "400" },
  { id: "passion", label: "Elegant", css: "'Passion One',cursive", weight: "700" },
  { id: "marker", label: "Marker", css: "'Permanent Marker',cursive", weight: "400" },
  { id: "lobster", label: "Script", css: "'Lobster',cursive", weight: "400" },
];

let fontsInjected = false;
function ensureNameFontsLoaded(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (!fontsInjected) {
    fontsInjected = true;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Passion+One:wght@700&family=Permanent+Marker&family=Lobster&display=swap";
    document.head.appendChild(link);
  }
  const specs = ["400 60px 'Bebas Neue'", "400 60px 'Anton'", "700 60px 'Passion One'", "400 60px 'Permanent Marker'", "400 60px 'Lobster'"];
  return Promise.all(specs.map((s) => document.fonts.load(s).catch(() => {}))).then(() => undefined);
}

function drawName(ctx: CanvasRenderingContext2D, name: string, d: DesignDef, fontScale = 1, fontCss = "'Poppins','Inter',sans-serif", fontWeight = "600") {
  if (!name || d.nx === undefined) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = d.color || "#222";
  let fontSize = Math.floor((d.nh || 0) * 0.46 * fontScale);
  ctx.font = `${fontWeight} ${fontSize}px ${fontCss}`;
  const maxTextW = (d.nw || 0) * 0.72;
  let textW = ctx.measureText(name).width;
  while (textW > maxTextW && fontSize > 10) {
    fontSize -= 2;
    ctx.font = `${fontWeight} ${fontSize}px ${fontCss}`;
    textW = ctx.measureText(name).width;
  }
  const cx = (d.nx || 0) + (d.nw || 0) / 2;
  const cy = (d.ny || 0) + (d.nh || 0) / 2;
  ctx.fillText(name, cx, cy);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────
// Urdu step-by-step guide — shown the first time the tool opens
// ─────────────────────────────────────────────────────────────────────────

function GuideModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { num: 1, icon: "📷", title: "Photo Upload Karein", desc: "بچے کی تصویر اپلوڈ کریں (نام لکھنا اختیاری ہے)۔" },
    { num: 2, icon: "🖼️", title: "Design Chunein", desc: "آپ کی تصویر خودبخود ہر ڈیزائن پر پیش نظر آئے گی — جو ڈیزائن پسند آئے اس پر ٹیپ کریں۔" },
    { num: 3, icon: "🔍✋", title: "Adjust Karein", desc: "زوم اور اوپر نیچے، دائیں بائیں کے سلائیڈرز سے تصویر کی جگہ ٹھیک کریں۔" },
    { num: 4, icon: "✅", title: "Confirm Karein", desc: "\"Confirm Design\" دبائیں — تیار شدہ ڈیزائن خودبخود محفوظ ہو جائے گا اور آپ آرڈر مکمل کر سکتے ہیں۔" },
  ];
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4">
      <div className="bg-white dark:bg-[#0a0a0a] max-w-sm w-full max-h-[85vh] overflow-y-auto p-5 rounded-lg space-y-3">
        <div className="text-center space-y-1">
          <div className="text-2xl">🇵🇰</div>
          <p className="text-[11px] font-black uppercase tracking-widest text-black dark:text-white">Istemal Ka Tareeqa</p>
          <p className="text-[10px] text-neutral-400">4 asaan steps</p>
        </div>
        {steps.map((s) => (
          <div key={s.num} className="flex gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-black/5 dark:border-white/5">
            <div className="shrink-0 w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold">
              {s.num}
            </div>
            <div className="flex-1">
              <div className="text-lg leading-none mb-1">{s.icon}</div>
              <div className="text-[11px] font-bold text-black dark:text-white">{s.title}</div>
              <div dir="rtl" className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{s.desc}</div>
            </div>
          </div>
        ))}
        <button
          onClick={onClose}
          className="w-full py-3 text-[11px] uppercase tracking-widest font-bold bg-black text-white dark:bg-white dark:text-black"
        >
          Shuru Karein
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Gallery thumbnail — draws a live low-res preview of photo+name on a design
// ─────────────────────────────────────────────────────────────────────────

function DesignThumb({ design, photoImg, name, adjust, onClick, selected, fontCss, fontWeight }: {
  design: DesignDef; photoImg: HTMLImageElement | null; name: string;
  adjust: Adjust; onClick: () => void; selected: boolean; fontCss: string; fontWeight: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImg = useImageLoader(design.thumb);

  useEffect(() => {
    if (!bgImg) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = 300;
    const ch = Math.round(cw * (design.h / design.w));
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    const scaleF = cw / design.w;

    ctx.drawImage(bgImg, 0, 0, cw, ch);
    if (photoImg && design.type !== "name_only") {
      ctx.save();
      const scaledAdjust = { scale: adjust.scale, ox: (adjust.ox || 0) * scaleF, oy: (adjust.oy || 0) * scaleF };
      clipPath(ctx, design.shape, design.x * scaleF, design.y * scaleF, design.pw * scaleF, design.ph * scaleF);
      drawCovered(ctx, photoImg, design.x * scaleF, design.y * scaleF, design.pw * scaleF, design.ph * scaleF, scaledAdjust);
      ctx.restore();
    }
    if (name && design.type !== "photo_only" && design.nx !== undefined) {
      drawName(ctx, name, { ...design, nx: design.nx! * scaleF, ny: design.ny! * scaleF, nw: design.nw! * scaleF, nh: design.nh! * scaleF }, adjust.fontScale, fontCss, fontWeight);
    }
  }, [bgImg, photoImg, name, adjust, design, fontCss, fontWeight]);

  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg overflow-hidden border-2 transition-all bg-white ${selected ? "border-black dark:border-white shadow-md" : "border-black/10 dark:border-white/10"}`}
    >
      <canvas ref={canvasRef} className="w-full block" />
      <span className="absolute top-1.5 right-1.5 bg-black/80 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
        {design.type === "photo_only" ? "Photo" : design.type === "name_only" ? "Name" : "Photo+Name"}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Main DesignPicker
// ─────────────────────────────────────────────────────────────────────────

export default function DesignPicker({ onComplete }: { onComplete: (url: string, previewDataUrl: string) => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showGuide, setShowGuide] = useState(true);
  const [name, setName] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Record<string, Adjust>>({});
  const [uploading, setUploading] = useState(false);
  const [fontId, setFontId] = useState(NAME_FONTS[0].id);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const selectedFont = NAME_FONTS.find((f) => f.id === fontId) || NAME_FONTS[0];

  useEffect(() => {
    let cancelled = false;
    ensureNameFontsLoaded().then(() => { if (!cancelled) setFontsLoaded(true); });
    return () => { cancelled = true; };
  }, []);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmedUrl, setConfirmedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);

  const photoImg = useImageLoader(photoDataUrl);
  const selectedDesign = DESIGN_LIST.find((d) => d.id === selectedId) || null;
  const bgImg = useImageLoader(selectedDesign ? selectedDesign.file : null);

  const getAdjust = useCallback((id: string): Adjust => adjustments[id] || { scale: 1, ox: 0, oy: 0, fontScale: 1 }, [adjustments]);

  // Downscale big phone-camera photos before we ever touch them — keeps the
  // editor smooth on mobile and avoids memory-related crashes.
  const UPLOAD_MAX_DIM = 1600;
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, UPLOAD_MAX_DIM / Math.max(img.width, img.height));
        if (scale >= 1) { setPhotoDataUrl(ev.target?.result as string); return; }
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const off = document.createElement("canvas");
        off.width = w; off.height = h;
        off.getContext("2d")?.drawImage(img, 0, 0, w, h);
        try { setPhotoDataUrl(off.toDataURL("image/jpeg", 0.9)); }
        catch { setPhotoDataUrl(ev.target?.result as string); }
      };
      img.onerror = () => setPhotoDataUrl(ev.target?.result as string);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const canProceed = !!(photoDataUrl || name.trim());

  // ── Live preview at reduced resolution (fast + crash-safe on mobile) ──
  const PREVIEW_MAX = 700;
  const redrawEditor = useCallback(() => {
    if (!selectedDesign || !bgImg) return;
    const canvas = editorCanvasRef.current;
    if (!canvas) return;
    const scaleF = Math.min(1, PREVIEW_MAX / Math.max(selectedDesign.w, selectedDesign.h));
    const cw = Math.max(1, Math.round(selectedDesign.w * scaleF));
    const ch = Math.max(1, Math.round(selectedDesign.h * scaleF));
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    const adj = getAdjust(selectedDesign.id);
    const scaledAdj = { scale: adj.scale, ox: (adj.ox || 0) * scaleF, oy: (adj.oy || 0) * scaleF };

    ctx.drawImage(bgImg, 0, 0, cw, ch);
    if (photoImg && selectedDesign.type !== "name_only") {
      ctx.save();
      clipPath(ctx, selectedDesign.shape, selectedDesign.x * scaleF, selectedDesign.y * scaleF, selectedDesign.pw * scaleF, selectedDesign.ph * scaleF);
      drawCovered(ctx, photoImg, selectedDesign.x * scaleF, selectedDesign.y * scaleF, selectedDesign.pw * scaleF, selectedDesign.ph * scaleF, scaledAdj);
      ctx.restore();
    }
    if (name && selectedDesign.type !== "photo_only" && selectedDesign.nx !== undefined) {
      drawName(ctx, name, { ...selectedDesign, nx: selectedDesign.nx * scaleF, ny: selectedDesign.ny! * scaleF, nw: selectedDesign.nw! * scaleF, nh: selectedDesign.nh! * scaleF }, adj.fontScale, selectedFont.css, selectedFont.weight);
    }
  }, [selectedDesign, bgImg, photoImg, name, getAdjust, selectedFont]);

  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => redrawEditor());
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [redrawEditor]);

  // ── Full-resolution render, only used when the customer confirms ──
  const renderFullResolution = useCallback((): HTMLCanvasElement | null => {
    if (!selectedDesign || !bgImg) return null;
    const off = document.createElement("canvas");
    off.width = selectedDesign.w; off.height = selectedDesign.h;
    const ctx = off.getContext("2d");
    if (!ctx) return null;
    const adj = getAdjust(selectedDesign.id);
    ctx.drawImage(bgImg, 0, 0, selectedDesign.w, selectedDesign.h);
    if (photoImg && selectedDesign.type !== "name_only") {
      ctx.save();
      clipPath(ctx, selectedDesign.shape, selectedDesign.x, selectedDesign.y, selectedDesign.pw, selectedDesign.ph);
      drawCovered(ctx, photoImg, selectedDesign.x, selectedDesign.y, selectedDesign.pw, selectedDesign.ph, adj);
      ctx.restore();
    }
    if (name && selectedDesign.type !== "photo_only" && selectedDesign.nx !== undefined) {
      drawName(ctx, name, selectedDesign, adj.fontScale, selectedFont.css, selectedFont.weight);
    }
    return off;
  }, [selectedDesign, bgImg, photoImg, name, getAdjust, selectedFont]);

  const handleZoom = (val: number) => {
    if (!selectedDesign) return;
    setAdjustments((prev) => ({ ...prev, [selectedDesign.id]: { ...getAdjust(selectedDesign.id), scale: val / 100 } }));
  };
  const handleVerticalPos = (val: number) => {
    if (!selectedDesign) return;
    setAdjustments((prev) => ({ ...prev, [selectedDesign.id]: { ...getAdjust(selectedDesign.id), oy: val } }));
  };
  const handleHorizontalPos = (val: number) => {
    if (!selectedDesign) return;
    setAdjustments((prev) => ({ ...prev, [selectedDesign.id]: { ...getAdjust(selectedDesign.id), ox: val } }));
  };
  const handleFontSize = (val: number) => {
    if (!selectedDesign) return;
    setAdjustments((prev) => ({ ...prev, [selectedDesign.id]: { ...getAdjust(selectedDesign.id), fontScale: val / 100 } }));
  };
  const handleResetAdjust = () => {
    if (!selectedDesign) return;
    setAdjustments((prev) => ({ ...prev, [selectedDesign.id]: { scale: 1, ox: 0, oy: 0, fontScale: 1 } }));
  };

  // ── Confirm: bake final image, upload via existing WordPress media route ──
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleConfirm = async () => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    try {
      // Only worth waiting for name-fonts if the design actually has a name
      // on it — photo-only designs shouldn't pay this cost at all.
      if (name && selectedDesign?.nx !== undefined) {
        await ensureNameFontsLoaded();
      }
      const canvas = renderFullResolution();
      if (!canvas || !selectedDesign) { setUploading(false); return; }
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

      const data = await new Promise<{ success: boolean; url?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/custom-upload");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try { resolve(JSON.parse(xhr.responseText)); }
          catch { reject(new Error("bad response")); }
        };
        xhr.onerror = () => reject(new Error("network error"));
        xhr.send(JSON.stringify({ image: dataUrl }));
      });

      if (data.success && data.url) {
        setConfirmedUrl(data.url);
        onComplete(data.url, dataUrl);
      } else {
        setUploadError("Design upload nahi hui, dobara try karein.");
      }
    } catch {
      setUploadError("Design upload nahi hui, dobara try karein.");
    } finally {
      setUploading(false);
    }
  };

  const labelCls = "text-[10px] uppercase tracking-widest text-neutral-400";
  const fontFamily = { fontFamily: "var(--font-inter)" };

  if (confirmedUrl) {
    return (
      <div className="border border-black/10 dark:border-white/10 p-5 bg-neutral-50 dark:bg-[#0a0a0a] space-y-3">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-widest font-black" style={fontFamily}>Design Ready</span>
        </div>
        <img src={confirmedUrl} alt="Your design" className="w-32 border border-black/10 dark:border-white/10" />
        <button
          onClick={() => { setConfirmedUrl(null); setStep(2); }}
          className={`${labelCls} underline`}
          style={fontFamily}
        >
          Design Badlein
        </button>
      </div>
    );
  }

  return (
    <div className="border border-black/10 dark:border-white/10 p-5 bg-neutral-50 dark:bg-[#0a0a0a] space-y-4" style={fontFamily}>
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
          🇵🇰 14 August Design Banayein
        </p>
        <button
          onClick={() => setShowGuide(true)}
          className="w-6 h-6 rounded-full border border-black/20 dark:border-white/20 text-[10px] text-black dark:text-white flex items-center justify-center shrink-0"
          aria-label="Guide dekhein"
        >
          ?
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className={labelCls}>Kuch Design Ye Hain</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {DESIGN_LIST.slice(0, 6).map((d) => (
                <img
                  key={d.id}
                  src={d.thumb}
                  alt=""
                  className="w-16 h-20 object-cover rounded border border-black/10 dark:border-white/10 shrink-0"
                />
              ))}
            </div>
            <p className="text-[10px] text-neutral-400">Photo upload karte hi aapki tasveer in sab designs par dikhne lagegi 👇</p>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Bache Ka Naam (Optional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Khan"
              className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 p-3 text-sm outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Bache Ki Photo *</label>
            <label className="flex items-center gap-2 cursor-pointer w-fit border border-black/20 dark:border-white/20 px-4 py-2.5 text-[10px] uppercase tracking-widest text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
              <Upload className="w-3.5 h-3.5" />
              {photoDataUrl ? "Change Photo" : "Choose Photo"}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            {photoDataUrl && (
              <img src={photoDataUrl} alt="" className="w-20 h-20 object-cover border border-black/10 dark:border-white/10 mt-2" />
            )}
          </div>
          <button
            disabled={!canProceed}
            onClick={() => setStep(2)}
            className={`w-full py-3 text-[11px] uppercase tracking-widest font-bold transition-all ${canProceed ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-90" : "bg-neutral-200 text-neutral-400 dark:bg-neutral-800 cursor-not-allowed"}`}
          >
            Designs Dekhein →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[10px] uppercase tracking-widest underline text-neutral-500">
            <ChevronLeft className="w-3 h-3" /> Photo/Naam Tabdeel Karein
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            {DESIGN_LIST.map((d) => (
              <DesignThumb
                key={d.id}
                design={d}
                photoImg={photoImg}
                name={name}
                adjust={getAdjust(d.id)}
                selected={selectedId === d.id}
                fontCss={selectedFont.css}
                fontWeight={selectedFont.weight}
                onClick={() => { setSelectedId(d.id); setStep(3); }}
              />
            ))}
          </div>
        </div>
      )}

      {step === 3 && selectedDesign && (
        <div className="space-y-3">
          <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[10px] uppercase tracking-widest underline text-neutral-500">
            <ChevronLeft className="w-3 h-3" /> Doosra Design Chunein
          </button>

          <div className="max-w-[280px] mx-auto rounded-lg overflow-hidden shadow-md">
            <canvas ref={editorCanvasRef} className="w-full block" style={{ pointerEvents: "none" }} />
          </div>

          {photoImg && selectedDesign.type !== "name_only" && (
            <div className="max-w-[280px] mx-auto space-y-2">
              <div className="flex items-center gap-2 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded px-3 py-2">
                <span className="text-sm">🔍</span>
                <input type="range" min={50} max={300} value={Math.round(getAdjust(selectedDesign.id).scale * 100)} onChange={(e) => handleZoom(Number(e.target.value))} className="flex-1" />
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded px-3 py-2">
                <span className="text-sm">⬆️⬇️</span>
                <input type="range" min={-Math.round(selectedDesign.ph * 0.7)} max={Math.round(selectedDesign.ph * 0.7)} value={Math.round(getAdjust(selectedDesign.id).oy || 0)} onChange={(e) => handleVerticalPos(Number(e.target.value))} className="flex-1" />
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded px-3 py-2">
                <span className="text-sm">⬅️➡️</span>
                <input type="range" min={-Math.round(selectedDesign.pw * 0.7)} max={Math.round(selectedDesign.pw * 0.7)} value={Math.round(getAdjust(selectedDesign.id).ox || 0)} onChange={(e) => handleHorizontalPos(Number(e.target.value))} className="flex-1" />
              </div>
              <p className="text-[9px] text-neutral-400 text-center">Sliders se photo set karein — screen ko chune se photo nahi hilegi</p>
            </div>
          )}

          {name && selectedDesign.type !== "photo_only" && selectedDesign.nx !== undefined && (
            <div className="max-w-[280px] mx-auto space-y-2">
              <p className="text-[9px] uppercase tracking-widest text-neutral-400 text-center">
                Naam Ka Style {!fontsLoaded && "(loading...)"}
              </p>
              <div className={`flex flex-wrap gap-1.5 justify-center transition-opacity ${fontsLoaded ? "opacity-100" : "opacity-50"}`}>
                {NAME_FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontId(f.id)}
                    style={{ fontFamily: f.css, fontWeight: f.weight as React.CSSProperties["fontWeight"] }}
                    className={`px-3 py-1.5 text-xs rounded border transition-all ${fontId === f.id ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" : "border-black/15 dark:border-white/15 text-black dark:text-white"}`}
                  >
                    {name.slice(0, 8) || f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded px-3 py-2">
                <span className="text-sm">🔤</span>
                <input
                  type="range" min={50} max={180}
                  value={Math.round((getAdjust(selectedDesign.id).fontScale || 1) * 100)}
                  onChange={(e) => handleFontSize(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
              <p className="text-[9px] text-neutral-400 text-center">Slider se naam chota/bara karein</p>
            </div>
          )}

          {uploadError && <p className="text-[10px] text-red-500 text-center">{uploadError}</p>}

          <div className="flex gap-2 max-w-[280px] mx-auto">
            <button onClick={handleResetAdjust} className="flex-1 py-2.5 text-[10px] uppercase tracking-widest border border-black/20 dark:border-white/20">
              Reset
            </button>
            <button
              onClick={handleConfirm}
              disabled={uploading}
              className="flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold bg-black text-white dark:bg-white dark:text-black flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {uploading ? (<><Loader2 className="w-3 h-3 animate-spin" /> Save ho raha hai {uploadProgress > 0 ? `${uploadProgress}%` : "..."}</>) : "✓ Confirm Design"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}