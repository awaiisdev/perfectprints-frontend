import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-lg">
        <p className="text-[120px] font-black leading-none text-[#1a1a1c]">404</p>
        <div className="-mt-8 space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Page Not Found</h1>
          <p className="text-neutral-500 text-sm">
            Yeh page exist nahi karta ya move ho gaya hai.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all">
            Back to Home
          </Link>
          <Link href="/shop" className="px-8 py-4 border border-[#1a1a1c] text-white font-black uppercase tracking-widest text-xs hover:border-white transition-all">
            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  );
}