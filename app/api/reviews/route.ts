import { NextResponse } from "next/server";

const BASE = "https://darkgreen-sardine-406947.hostingersite.com";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;
const CLOUD_NAME = "db8fp3as7";
const CLOUD_UPLOAD_PRESET = "pp_reviews";

async function uploadToCloudinary(base64: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: base64,
        upload_preset: CLOUD_UPLOAD_PRESET,
        folder: "reviews",
      }),
    });
    const data = await res.json();
    return data.secure_url || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");
  if (!productId) return NextResponse.json([]);
  const url = `${BASE}/wp-json/wc/v3/products/reviews?product=${productId}&consumer_key=${KEY}&consumer_secret=${SECRET}&per_page=20&status=approved`;
  const res = await fetch(url);
  const data = await res.json();
  if (!Array.isArray(data)) return NextResponse.json([]);

  // Parse images from review text if stored as JSON at end
  const reviews = data.map((r: any) => {
    let reviewText = r.review || "";
    let images: string[] = [];
    const match = reviewText.match(/<!--IMAGES:(.*?)-->/);
    if (match) {
      try { images = JSON.parse(match[1]); } catch {}
      reviewText = reviewText.replace(/<!--IMAGES:(.*?)-->/, "").trim();
    }
    return { ...r, review: reviewText, review_images: images };
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, reviewer, review, rating, images } = body;

    // Upload images to Cloudinary
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      const uploads = await Promise.all(
        images.slice(0, 3).map((img: string) => uploadToCloudinary(img))
      );
      imageUrls = uploads.filter(Boolean) as string[];
    }

    // Store images as hidden comment in review text
    const reviewText = imageUrls.length > 0
      ? `${review}<!--IMAGES:${JSON.stringify(imageUrls)}-->`
      : review;

    const reviewData = {
      product_id: Number(product_id),
      reviewer: reviewer || "Customer",
      reviewer_email: `customer_${Date.now()}@perfectprints.pk`,
      review: reviewText,
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