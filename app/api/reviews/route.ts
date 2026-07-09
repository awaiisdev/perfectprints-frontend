import { NextResponse } from "next/server";

const BASE = "https://darkgreen-sardine-406947.hostingersite.com";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;
const CLOUD_NAME = "db8fp3as7";
const CLOUD_UPLOAD_PRESET = "pp_reviews";

// IMPORTANT: WordPress strips HTML comments (<!-- -->) from comment/review
// content for security reasons before saving. That was the bug — images
// were being encoded as an HTML comment, so WordPress deleted them before
// they were ever stored. Using a plain-text marker (no angle brackets)
// avoids this, since it isn't recognized as HTML and is left untouched.
const IMAGE_MARKER_START = "%%IMAGES:";
const IMAGE_MARKER_END = "%%";

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

  // Parse images from review text using the plain-text marker
  const reviews = data.map((r: any) => {
    let reviewText = r.review || "";
    let images: string[] = [];

    const startIdx = reviewText.indexOf(IMAGE_MARKER_START);
    if (startIdx !== -1) {
      const endIdx = reviewText.indexOf(IMAGE_MARKER_END, startIdx + IMAGE_MARKER_START.length);
      if (endIdx !== -1) {
        const jsonStr = reviewText.slice(startIdx + IMAGE_MARKER_START.length, endIdx);
        try { images = JSON.parse(jsonStr); } catch {}
        reviewText = (
          reviewText.slice(0, startIdx) +
          reviewText.slice(endIdx + IMAGE_MARKER_END.length)
        ).trim();
      }
    }

    // Backward compatibility: old reviews saved before this fix used an
    // HTML comment marker. WordPress likely stripped it, so nothing to
    // recover there — but this keeps old plain-text-surviving cases safe.
    const legacyMatch = reviewText.match(/<!--IMAGES:(.*?)-->/);
    if (legacyMatch) {
      try { images = JSON.parse(legacyMatch[1]); } catch {}
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

    // Store images using the plain-text marker (safe from WordPress's
    // HTML-comment-stripping behavior)
    const reviewText = imageUrls.length > 0
      ? `${review}${IMAGE_MARKER_START}${JSON.stringify(imageUrls)}${IMAGE_MARKER_END}`
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