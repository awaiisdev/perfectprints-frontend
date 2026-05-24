export async function getProducts(perPage = 20, category?: string) {
  const base = typeof window !== "undefined" 
    ? "" 
    : process.env.NEXT_PUBLIC_SITE_URL || "https://www.perfectprints.pk";
  let url = `${base}/api/products?per_page=${perPage}`;
  if (category) url += `&category=${category}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Products fetch nahi hue");
  return res.json();
}

export async function getProduct(id: string) {
  const base = typeof window !== "undefined" 
    ? "" 
    : process.env.NEXT_PUBLIC_SITE_URL || "https://www.perfectprints.pk";
  const res = await fetch(`${base}/api/product?id=${id}`);
  if (!res.ok) throw new Error("Product nahi mila");
  return res.json();
}

export async function getCategories() {
  const base = typeof window !== "undefined" 
    ? "" 
    : process.env.NEXT_PUBLIC_SITE_URL || "https://www.perfectprints.pk";
  const res = await fetch(`${base}/api/categories`);
  if (!res.ok) throw new Error("Categories fetch nahi hui");
  return res.json();
}