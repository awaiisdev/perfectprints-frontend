import { NextResponse } from "next/server";

// Seedha WordPress Media Library mein upload karta hai (Cloudinary ki zaroorat nahi).
// WP_UPLOAD_USER / WP_UPLOAD_APP_PASSWORD .env.local mein honi chahiye
// (WordPress → Users → Profile → Application Passwords se banayein).
const WP_BASE = (process.env.NEXT_PUBLIC_WC_URL || "").replace("/wp-json/wc/v3", "");
const WP_USER = process.env.WP_UPLOAD_USER || "";
const WP_APP_PASSWORD = process.env.WP_UPLOAD_APP_PASSWORD || "";

async function uploadToWordPress(base64: string): Promise<string | null> {
  try {
    const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return null;
    const mimeType = matches[1];
    const ext = mimeType.split("/")[1] || "jpg";
    const buffer = Buffer.from(matches[2], "base64");
    const filename = `custom-order-${Date.now()}.${ext}`;

    const authHeader = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

    const res = await fetch(`${WP_BASE}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
      body: buffer,
    });

    const data = await res.json();
    if (!res.ok || !data.source_url) {
      console.error("WordPress media upload failed:", data.message || data);
      return null;
    }
    return data.source_url;
  } catch (err) {
    console.error("WordPress media upload exception:", err);
    return null;
  }
}

// body: { image: "data:image/...;base64,..." }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const url = await uploadToWordPress(image);

    if (!url) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}