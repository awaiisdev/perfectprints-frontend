import type { MetadataRoute } from "next";

const SITE_URL = "https://perfectprints.pk";

// Next.js automatically serves this at https://perfectprints.pk/robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/api/", "/thank-you", "/track-order"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}