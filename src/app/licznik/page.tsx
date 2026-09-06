import type { Metadata } from "next";
import { Disclaimer } from "@/components/disclaimer";
import { LicznikForm } from "@/components/licznik-form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Licznik Fiskusa",
  description: "Ile dni zostało urzędowi na VAT 2021, PIT i CIT. Art. 70 O.p. i instrumentalne KKS.",
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
            Pięć lat od końca roku, w którym upłynął termin płatności. VAT I–XI 2021 spada 31 grudnia
            2026. Jeśli urząd wszczął KKS w grudniu — to zarzut instrumentalności, nie magia.
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
