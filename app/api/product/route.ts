import { NextResponse } from "next/server";

const BASE = "https://darkgreen-sardine-406947.hostingersite.com";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const isNumber = /^\d+$/.test(id || "");

  if (isNumber) {
    const url = `${BASE}/wp-json/wc/v3/products/${id}?consumer_key=${KEY}&consumer_secret=${SECRET}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } else {
    const url = `${BASE}/wp-json/wc/v3/products?slug=${id}&consumer_key=${KEY}&consumer_secret=${SECRET}`;
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data[0]);
    }
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}