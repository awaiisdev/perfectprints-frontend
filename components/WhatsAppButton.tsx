"use client";
import React from "react";

// Floating WhatsApp button — shows on every page (added once in layout.tsx),
// opens WhatsApp with a pre-filled message to your number.
export default function WhatsAppButton() {
  const phoneNumber = "923010148055"; // 0301-0148055 in international format (92 = Pakistan, leading 0 removed)
  const message = "Hi! I visited your website perfectprints.pk and wanted to ask about a custom order.";
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.66 4.523 1.804 6.377L4 29l7.79-1.767A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.75c-1.98 0-3.83-.55-5.41-1.5l-.388-.23-4.62 1.05 1.03-4.5-.253-.402A9.71 9.71 0 0 1 5.25 15c0-5.936 4.818-10.75 10.754-10.75S26.75 9.064 26.75 15 21.94 24.75 16.004 24.75z"/>
        <path d="M21.6 17.87c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48c0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/>
      </svg>
    </a>
  );
}