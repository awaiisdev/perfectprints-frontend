export default function TermsPage() {
  return (
    <main className="bg-black text-white min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-[#88888f] uppercase block mb-4">Legal</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter">TERMS & CONDITIONS</h1>
          <p className="text-neutral-500 text-sm mt-4">Last updated: May 2026</p>
        </div>

        {[
          {
            title: "Orders & Payment",
            content: "• Orders WhatsApp ya website ke zariye place ho sakte hain.\n• Payment options: Cash on Delivery (COD), EasyPaisa, JazzCash, Bank Transfer.\n• 50% advance payment bulk orders ke liye required hai.\n• Order confirm hone ke baad changes 24 hours ke andar kiye ja sakte hain."
          },
          {
            title: "Production & Delivery",
            content: "• Standard delivery: 2-3 business days Pakistan-wide.\n• Custom/bulk orders: 5-7 business days.\n• Lahore mein free delivery available hai.\n• Delivery charges baaki cities ke liye applicable hain."
          },
          {
            title: "Return & Refund Policy",
            content: "• Agar product mein manufacturing defect ho to hum free replacement denge.\n• Custom printed items return nahi ho sakte (printing already ho chuki hoti hai).\n• Damaged delivery ke case mein 24 hours ke andar photo ke saath complain karein.\n• Refund 5-7 business days mein process hoga."
          },
          {
            title: "Cancellation Policy",
            content: "• Order production shuru hone se pehle cancel ho sakta hai.\n• Production shuru hone ke baad cancellation possible nahi.\n• Advance payment waale orders cancel hone pe 80% refund milega."
          },
          {
            title: "Quality Guarantee",
            content: "Hum apne har product ki quality ki guarantee dete hain. Agar aap product se satisfied nahi hain, humse 48 hours ke andar rabta karein aur hum solution nikaalenge."
          },
          {
            title: "Contact Us",
            content: "📞 +92-301-0148055\n📍 Mian Ichra Bazar, Street No 4, Lahore\n🌐 perfectprints.pk"
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