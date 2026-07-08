import type { Metadata } from "next";
import { getProductServer, cleanDescription } from "@/lib/seo";
import ProductClient from "./ProductClient";

// This runs on the SERVER for every product page — gives each product its
// own unique <title> and <meta name="description"> (fixes the "every page
// has the same title" issue) and lets Google/crawlers see real product info
// even before any client JavaScript runs.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductServer(id);

  if (!product) {
    return {
      title: "Product Not Found | Perfect Prints",
    };
  }

  const cleanName = product.name?.replace(/&amp;/g, "&") || "Custom Print";
  const description =
    cleanDescription(product.short_description || product.description) ||
    `Order ${cleanName} online from Perfect Prints. Custom printing across Pakistan with fast delivery.`;
  const image = product.images?.[0]?.src;
  const price = product.sale_price || product.regular_price || product.price;

  return {
    title: `${cleanName} | Perfect Prints Pakistan`,
    description,
    openGraph: {
      title: cleanName,
      description,
      images: image ? [{ url: image }] : undefined,
      siteName: "Perfect Prints",
    },
    alternates: {
      canonical: `/product/${id}`,
    },
    other: {
      "og:type": "product",
      "product:price:amount": price || "",
      "product:price:currency": "PKR",
      "og:availability":
        product.stock_status === "instock" ? "instock" : "oos",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductServer(id);

  // JSON-LD structured data — this is what lets Google show price/stock/
  // reviews directly in search results, and is what AI tools (ChatGPT,
  // Gemini, etc.) read to understand and cite the product (GEO).
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name?.replace(/&amp;/g, "&"),
        image: product.images?.map((img: any) => img.src) || [],
        description: cleanDescription(
          product.short_description || product.description,
          300
        ),
        sku: product.sku || String(product.id),
        brand: {
          "@type": "Brand",
          name: "Perfect Prints",
        },
        offers: {
          "@type": "Offer",
          url: `https://perfectprints.pk/product/${id}`,
          priceCurrency: "PKR",
          price: product.sale_price || product.regular_price || product.price,
          availability:
            product.stock_status === "instock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
        ...(product.average_rating && parseFloat(product.average_rating) > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.average_rating,
                reviewCount: product.rating_count || 1,
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient />
    </>
  );
}