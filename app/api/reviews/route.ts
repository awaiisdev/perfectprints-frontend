import { NextResponse } from "next/server";

const BASE = "https://darkgreen-sardine-406947.hostingersite.com";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");
  if (!productId) return NextResponse.json([]);
  const url = `${BASE}/wp-json/wc/v3/products/reviews?product=${productId}&consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=20&status=approved`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(Array.isArray(data) ? data : []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, reviewer, review, rating } = body;
    const reviewData = {
      product_id: Number(product_id),
      reviewer: reviewer || "Customer",
      reviewer_email: `customer_${Date.now()}@perfectprints.pk`,
      review: review || "",
      rating: Number(rating) || 5,
      status: "approved",
    };
    const url = `${BASE}/wp-json/wc/v3/products/reviews?consumer_key=${KEY}&consumer_secret=${SECRET}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    const data = await res.json();
    return NextResponse.json({ success: true, review: data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}