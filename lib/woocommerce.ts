// Client-side ke liye NEXT_PUBLIC_ variables use karo
const BASE_URL = "https://perfectprints.pk";
const CONSUMER_KEY = "ck_70e3e17da14411576a0e69afa5e75ff626b6b280";
const CONSUMER_SECRET = "cs_92cb33426c9458216fb2632b72c4e5afecf5e839";

function getAuthParams() {
  return `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
}

export async function getProducts(perPage = 20, category?: string) {
  let url = `${BASE_URL}/wp-json/wc/v3/products?${getAuthParams()}&per_page=${perPage}&status=publish`;
  if (category) url += `&category=${category}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Products fetch nahi hue");
  return res.json();
}

export async function getProduct(id: string) {
  const url = `${BASE_URL}/wp-json/wc/v3/products/${id}?${getAuthParams()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Product nahi mila");
  return res.json();
}

export async function getCategories() {
  const url = `${BASE_URL}/wp-json/wc/v3/products/categories?${getAuthParams()}&per_page=20&hide_empty=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Categories fetch nahi hui");
  return res.json();
}