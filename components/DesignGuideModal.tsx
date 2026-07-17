"use client";
import React from "react";

// A very lightweight, plain-language guide that lives directly on the
// product page (not inside the design-picker bundle) so it costs nothing
// extra to load and can be opened even before the customer taps in to the
// tool itself. Every step is shown in Roman Urdu AND Urdu script side by
// side, in short simple sentences — for customers who may not be big
// readers.

export default function DesignGuideModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: "📸", roman: "Bache ki achi tasveer upload karein", urdu: "بچے کی اچھی تصویر اپلوڈ کریں" },
    { icon: "🖼️", roman: "Pasand ka design chunein", urdu: "پسند کا ڈیزائن منتخب کریں" },
    { icon: "✋", roman: "Ungli se thoda upar-neeche karein", urdu: "انگلی سے تھوڑا اوپر نیچے کریں" },
    { icon: "✅", roman: "\"Confirm\" dabayein, order kar dein", urdu: "\"Confirm\" دبائیں، آرڈر کر دیں" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#0a0a0a] max-w-sm w-full p-6 rounded-2xl space-y-4 shadow-2xl border border-black/5 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-1.5">
          <div className="text-4xl">🇵🇰</div>
          <p className="text-base font-black text-black dark:text-white">
            Design Kaise Banayein?
          </p>
          <p dir="rtl" className="text-sm font-bold text-neutral-500">
            ڈیزائن کیسے بنائیں؟
          </p>
        </div>

        <div className="space-y-2.5">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-3 border border-black/5 dark:border-white/5"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-lg">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-black dark:text-white leading-snug">
                  {s.roman}
                </p>
                <p dir="rtl" className="text-[13px] text-neutral-500 leading-snug mt-0.5">
                  {s.urdu}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl text-sm font-black bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
        >
          Samajh Gaya — سمجھ گیا
        </button>
      </div>
    </div>
  );
}