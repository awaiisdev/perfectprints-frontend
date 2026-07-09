import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "Perfect Prints delivery info — 2-3 day standard delivery Pakistan-wide, same-day Lahore delivery, free shipping on bulk orders above Rs. 5,000.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <main className="bg-black text-white min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-[#88888f] uppercase block mb-4">Info</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter">SHIPPING & DELIVERY</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🚀", title: "Standard", time: "2-3 Days", desc: "Pakistan-wide delivery" },
            { icon: "📦", title: "Bulk Orders", time: "5-7 Days", desc: "Custom & large quantity" },
            { icon: "🏙️", title: "Lahore", time: "Same Day", desc: "Available on request" },
          ].map((item) => (
            <div key={item.title} className="bg-[#0a0a0a] border border-[#1a1a1c] p-6 space-y-2">
              <span className="text-3xl">{item.icon}</span>
              <p className="font-black uppercase tracking-tight">{item.title}</p>
              <p className="text-2xl font-black text-white">{item.time}</p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider">{item.desc}</p>
            </div>
          ))}
        </div>

        {[
          {
            title: "Shipping Charges",
            content: "• Lahore: Free delivery available\n• Other cities: Rs. 150-250 (courier charges)\n• Bulk orders (above Rs. 5,000): Free shipping Pakistan-wide\n• Same-day Lahore delivery: Rs. 200 extra"
          },
          {
            title: "Courier Partners",
            content: "Hum trusted courier companies use karte hain:\n• TCS\n• Leopards Courier\n• M&P (Call Courier)\n\nTracking number delivery ke baad WhatsApp pe send kiya jata hai."
          },
          {
            title: "Important Notes",
            content: "• Delivery time production complete hone ke baad shuru hoti hai.\n• Public holidays pe delivery delay ho sakti hai.\n• Remote areas mein 1-2 extra days lag sakte hain.\n• Order receive karte waqt condition check karein — damaged parcel ki photo lein."
          },
        ].map((section) => (
          <div key={section.title} className="border-t border-[#1a1a1c] pt-8 space-y-3">
            <h2 className="text-lg font-black uppercase tracking-tight">{section.title}</h2>
            <p className="text-neutral-400 leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}