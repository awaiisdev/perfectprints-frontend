// Builds a URL that goes through Next.js's built-in image optimizer
// (/_next/image) for images we render as plain <img>/<motion.img> —
// used where next/image's <Image> component isn't practical (e.g. inside
// framer-motion crossfade animations). Requires the source hostname to be
// listed in next.config.ts -> images.remotePatterns.
export function optimizedSrc(src: string | undefined, width: number, quality = 75): string {
  if (!src) return "";
  // Don't double-optimize local/relative paths or data URLs
  if (src.startsWith("/_next/image") || src.startsWith("data:")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}