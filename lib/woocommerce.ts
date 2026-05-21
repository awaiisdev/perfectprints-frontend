export async function getProducts(perPage = 20, category?: string) {
  let url = `/api/products?per_page=${perPage}`;
  if (category) url += `&category=${category}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Products fetch nahi hue");
  return res.json();
}

export async function getProduct(id: string) {
  const BASE_URL = "https://perfectprints.pk";
  const KEY = "ck_70e3e17da14411576a0e69afa5e75ff626b6b280";
  const SECRET = "cs_92cb33426c9458216fb2632b72c4e5afecf5e839";
  const url = `${BASE_URL}/wp-json/wc/v3/products/${id}?consumer_key=${KEY}&consumer_secret=${SECRET}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Product nahi mila");
  return res.json();
}

export async function getCategories() {
  const BASE_URL = "https://perfectprints.pk";
  const KEY = "ck_70e3e17da14411576a0e69afa5e75ff626b6b280";
  const SECRET = "cs_92cb33426c9458216fb2632b72c4e5afecf5e839";
  const url = `${BASE_URL}/wp-json/wc/v3/products/categories?consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=20&hide_empty=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Categories fetch nahi hui");
  return res.json();
}