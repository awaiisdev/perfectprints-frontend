import { NextResponse } from "next/server";

const BASE = "https://perfectprints.pk";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const url = `${BASE}/wp-json/wc/v3/products/${id}?consumer_key=${KEY}&consumer_secret=${SECRET}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}