// lib/seo.ts
// Server-side only helpers — used inside generateMetadata() and sitemap.ts
// Fetches WooCommerce data directly (faster + more reliable than calling our
// own /api/* routes from the server).

const BASE = "https://darkgreen-sardine-406947.hostingersite.com";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function getProductServer(id: string) {
  const isNumber = /^\d+$/.test(id || "");
  try {
    if (isNumber) {
      const url = `${BASE}/wp-json/wc/v3/products/${id}?consumer_key=${KEY}&consumer_secret=${SECRET}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return null;
      return res.json();
    } else {
      const url = `${BASE}/wp-json/wc/v3/products?slug=${id}&consumer_key=${KEY}&consumer_secret=${SECRET}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    }
  } catch {
    return null;
  }
}

export async function getCategoriesServer() {
  try {
    const url = `${BASE}/wp-json/wc/v3/products/categories?consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=50&hide_empty=true`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getAllProductsServer(perPage = 100) {
  try {
    const url = `${BASE}/wp-json/wc/v3/products?consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=${perPage}&status=publish`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Strips HTML tags + trims to a clean length for meta descriptions
export function cleanDescription(html: string, maxLen = 155): string {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > maxLen ? text.slice(0, maxLen - 1).trim() + "…" : text;
}