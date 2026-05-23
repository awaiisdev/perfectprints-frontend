import { NextResponse } from "next/server";

const BASE = "https://perfectprints.pk";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids"); // comma-separated IDs

  if (!ids) {
    return NextResponse.json([]);
  }

  const idArray = ids.split(",").filter(Boolean);

  try {
    const products = await Promise.all(
      idArray.map(async (id) => {
        const url = `${BASE}/wp-json/wc/v3/products/${id.trim()}?consumer_key=${KEY}&consumer_secret=${SECRET}`;
        const res = await fetch(url);
        if (!res.ok) return null;
        return res.json();
      })
    );

    const valid = products.filter((p) => p && p.id && p.status === "publish");
    return NextResponse.json(valid);
  } catch (err) {
    console.error("Linked products fetch error:", err);
    return NextResponse.json([]);
  }
}