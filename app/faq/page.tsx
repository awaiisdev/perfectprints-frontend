import type { Metadata } from "next";
import { faqs } from "@/lib/faqData";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about Perfect Prints orders, payment, delivery, returns & bulk pricing — custom printing across Pakistan from Lahore.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient />
    </>
  );
}