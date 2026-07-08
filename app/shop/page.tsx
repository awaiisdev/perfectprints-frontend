import type { Metadata } from "next";
import { getCategoriesServer } from "@/lib/seo";
import ShopClient from "./ShopClient";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;

  if (!category) {
    return {
      title: "Shop All Products | Perfect Prints Pakistan",
      description:
        "Browse custom T-shirts, hoodies, mugs, DTF prints, keychains & personalized gifts. Zero minimum order, fast delivery across Pakistan.",
      alternates: { canonical: "/shop" },
    };
  }

  const categories = await getCategoriesServer();
  const matched = Array.isArray(categories)
    ? categories.find((c: any) => c.slug === category)
    : null;

  const name = matched?.name?.replace(/&amp;/g, "&") || category.replace(/-/g, " ");
  const description = matched?.description
    ? matched.description.replace(/<[^>]*>/g, "").trim()
    : `Shop ${name} online from Perfect Prints — custom printing across Pakistan, zero minimum order, fast delivery.`;

  return {
    title: `${name} | Perfect Prints Pakistan`,
    description: description.slice(0, 155),
    alternates: { canonical: `/shop?category=${category}` },
  };
}

export default function ShopPage() {
  return <ShopClient />;
}