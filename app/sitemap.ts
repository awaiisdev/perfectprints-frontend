import type { MetadataRoute } from "next";
import { getAllProductsServer, getCategoriesServer } from "@/lib/seo";

const SITE_URL = "https://perfectprints.pk";

// Next.js automatically serves this at https://perfectprints.pk/sitemap.xml
// No extra config needed — just having this file is enough.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getAllProductsServer(200),
    getCategoriesServer(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/shipping`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryPages: MetadataRoute.Sitemap = Array.isArray(categories)
    ? categories.map((cat: any) => ({
        url: `${SITE_URL}/shop?category=${cat.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    : [];

  const productPages: MetadataRoute.Sitemap = Array.isArray(products)
    ? products.map((p: any) => ({
        url: `${SITE_URL}/product/${p.id}`,
        lastModified: p.date_modified ? new Date(p.date_modified) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    : [];

  return [...staticPages, ...categoryPages, ...productPages];
}