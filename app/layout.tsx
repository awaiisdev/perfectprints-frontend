import React from "react";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavHeader from "@/components/NavHeader";
import CinematicFooter from "@/components/CinematicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  // IMPORTANT: change this if your live domain is different from perfectprints.pk
  metadataBase: new URL("https://perfectprints.pk"),
  title: {
    default: "Perfect Prints — Custom Printing Pakistan",
    // Any page that sets its own title (via generateMetadata) will show as
    // "That Title | Perfect Prints" automatically because of this template.
    template: "%s | Perfect Prints",
  },
  description:
    "Premium custom T-shirts, hoodies, mugs, DTF prints & personalized gifts across Pakistan. Zero minimum order, fast delivery.",
  keywords: [
    "custom t-shirt printing Pakistan",
    "DTF printing Pakistan",
    "sublimation printing Lahore",
    "custom mugs Pakistan",
    "personalized gifts Pakistan",
    "cricket fan merchandise Pakistan",
  ],
  openGraph: {
    siteName: "Perfect Prints",
    type: "website",
    locale: "en_PK",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Perfect Prints",
    url: "https://perfectprints.pk",
    description:
      "Custom T-shirt, DTF, sublimation & personalized gift printing based in Lahore, Pakistan.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    priceRange: "PKR",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '428053909752447');
              fbq('track', 'PageView');
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <ThemeProvider>
          <CartProvider>
            <NavHeader />
            <main className="flex-grow">{children}</main>
            <CinematicFooter />
            <WhatsAppButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}