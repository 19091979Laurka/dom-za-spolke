import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = { title: "Obsługa zgłoszeń", robots: { index: false, follow: false } };
export default function LeadyPage() {
  return <><SiteHeader /><main id="main-content" className="brand-page brand-container"><h1 className="text-3xl font-bold">Obsługa zgłoszeń</h1><p className="mt-4">Zgłoszenia odbieraj w skonfigurowanym systemie kancelarii. Ten publiczny adres nie udostępnia danych klientów.</p></main></>;
}
