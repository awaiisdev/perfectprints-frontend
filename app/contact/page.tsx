import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Perfect Prints Lahore for custom t-shirt, mug, keychain & DTF printing orders. WhatsApp, call, or message us — average reply in 5 minutes.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}