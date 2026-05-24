const BASE = typeof window !== "undefined"
  ? ""
  : "https://www.perfectprints.pk";

export async function getProducts(perPage = 20, category?: string) {
  let url = `${BASE}/api/products?per_page=${perPage}`;
  if (category) url += `&category=${category}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Products fetch nahi hue");
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${BASE}/api/product?id=${id}`);
  if (!res.ok) throw new Error("Product nahi mila");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE}/api/categories`);
  if (!res.ok) throw new Error("Categories fetch nahi hui");
  return res.json();
}