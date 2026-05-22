import { NextResponse } from "next/server";

const BASE = "https://perfectprints.pk";
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, city, paymentMethod, items, shipping } = body;

    const firstName = name.split(" ")[0] || name;
    const lastName = name.split(" ").slice(1).join(" ") || ".";

    const orderData = {
      payment_method: paymentMethod === "Cash on Delivery" ? "cod" : "bacs",
      payment_method_title: paymentMethod,
      set_paid: false,
      status: "pending",
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: city,
        country: "PK",
        phone: phone,
        email: `${phone}@perfectprints.pk`,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: city,
        country: "PK",
      },
      line_items: items.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity,
        ...(item.attributes && Object.keys(item.attributes).length > 0
          ? {
              meta_data: Object.entries(item.attributes).map(([key, value]) => ({
                key,
                value,
              })),
            }
          : {}),
      })),
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: String(shipping),
        },
      ],
      customer_note: `Phone: ${phone} | Payment: ${paymentMethod}`,
    };

    const url = `${BASE}/wp-json/wc/v3/orders?consumer_key=${KEY}&consumer_secret=${SECRET}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("WooCommerce error:", data);
      return NextResponse.json({ error: "Order create nahi hua", details: data }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      orderNumber: data.number,
      orderKey: data.order_key,
    });
  } catch (err) {
    console.error("Orders route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}