import { NextResponse } from "next/server";

const BASE = "https://perfectprints.pk";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const url = `${BASE}/wp-json/wc/v3/products/${id}/variations?consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=50`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  const data = await res.json();
  return NextResponse.json(data);
}