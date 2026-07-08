import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Image Optimization ───────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],   // serve AVIF first, WebP fallback
    minimumCacheTTL: 60 * 60 * 24 * 30,      // cache images 30 days
    remotePatterns: [
      { protocol: "https", hostname: "perfectprints.pk" },
      { protocol: "https", hostname: "www.perfectprints.pk" },
      { protocol: "https", hostname: "darkgreen-sardine-406947.hostingersite.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // ─── Compiler: Remove console.* in production ─────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ─── Compression ──────────────────────────────────────
  compress: true,

  // ─── Power Flags ──────────────────────────────────────
  experimental: {
    optimizeCss: true,          // inline critical CSS
    optimizePackageImports: [   // tree-shake large icon packages
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },

  // ─── HTTP Headers ─────────────────────────────────────
  async headers() {
    return [
      // API CORS
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
      // Aggressive caching for static assets
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache public images / fonts
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      // Security + performance headers on all pages
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;