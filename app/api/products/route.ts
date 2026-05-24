import { NextResponse } from "next/server";

const BASE = "https://darkgreen-sardine-406947.hostingersite.com";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const perPage = searchParams.get("per_page") || "20";
  const category = searchParams.get("category") || "";

  let url = `${BASE}/wp-json/wc/v3/products?consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=${perPage}&status=publish`;
  if (category) url += `&category=${category}`;

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}