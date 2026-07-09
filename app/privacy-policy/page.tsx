import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Perfect Prints collects, uses & protects your information when you order custom printing products from perfectprints.pk in Pakistan.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-black text-white min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-[#88888f] uppercase block mb-4">Legal</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter">PRIVACY POLICY</h1>
          <p className="text-neutral-500 text-sm mt-4">Last updated: May 2026</p>
        </div>

        {[
          {
            title: "Information We Collect",
            content: "Jab aap PerfectPrints.pk pe order karte hain, hum yeh information collect karte hain: naam, delivery address, phone number, aur payment details. Yeh information sirf aapka order process karne ke liye use hoti hai."
          },
          {
            title: "How We Use Your Information",
            content: "Aapki information in kamon ke liye use hoti hai: order process karna aur deliver karna, WhatsApp pe order updates dena, customer support provide karna. Hum aapki information kabhi bhi third parties ko sell nahi karte."
          },
          {
            title: "Data Security",
            content: "Aapka data secure rakha jata hai. Hum standard security measures use karte hain taake aapki personal information unauthorized access se protected rahe."
          },
          {
            title: "Cookies",
            content: "Hamari website basic cookies use karti hai taake aapka browsing experience better ho. Aap browser settings se cookies disable kar sakte hain."
          },
          {
            title: "Contact",
            content: "Privacy se related koi bhi sawal ke liye hamse rabta karein:\n📞 +92-301-0148055\n📍 Mian Ichra Bazar, Lahore"
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