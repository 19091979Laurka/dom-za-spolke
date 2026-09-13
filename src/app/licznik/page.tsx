import type { Metadata } from "next";
import { Disclaimer } from "@/components/disclaimer";
import { LicznikForm } from "@/components/licznik-form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Licznik Fiskusa",
  description: "Ile dni zostało urzędowi na VAT 2021, PIT i CIT. Bazowy termin przedawnienia z art. 70 O.p. i sygnał instrumentalnego KKS.",
  alternates: { canonical: "/licznik" },
};

export default function LicznikPage() {
  return (
    <>
      <SiteHeader current="licznik" />
      <main id="main-content" className="brand-page">
        <div className="brand-container brand-page-narrow">
          <p className="brand-eyebrow">Art. 70 O.p. · 31.12.2026</p>
          <h1>Licznik Fiskusa</h1>
          <p className="brand-page-lead">
            Sprawdź bazowy termin i zdarzenia, które wymagają analizy. Dla VAT I–XI 2021
            punktem wyjścia jest 31 grudnia 2026. Wynik nie potwierdza przedawnienia.
          </p>
          <div className="mt-6">
            <Disclaimer compact />
          </div>
          <div className="mt-8">
            <LicznikForm />
          </div>
        </div>
      </main>
    </>
  );
}
