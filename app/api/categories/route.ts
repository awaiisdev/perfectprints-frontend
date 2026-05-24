import { NextResponse } from "next/server";

const BASE = "https://darkgreen-sardine-406947.hostingersite.com";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET() {
  const url = `${BASE}/wp-json/wc/v3/products/categories?consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=20&hide_empty=true`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}