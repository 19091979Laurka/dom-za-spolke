import type { Metadata } from "next";
import { Art116Wizard } from "@/components/art116-wizard";
import { Disclaimer } from "@/components/disclaimer";
import { SiteHeader } from "@/components/site-header";
import { pageOpenGraph, pageTwitter } from "@/lib/site";

const OG_TITLE = "Diagnostyk art. 116 — Dom za spółkę";
const DESC =
  "Czy fiskus może zająć Twój majątek za zaległości spółki? Sześć kroków, semafor ryzyka i kierunki obrony po wyrokach TSUE Adjak i Genzyński.";

export const metadata: Metadata = {
  title: "Diagnostyk art. 116",
  description: DESC,
  alternates: { canonical: "/diagnostyk" },
  openGraph: pageOpenGraph("/diagnostyk", OG_TITLE, DESC),
  twitter: pageTwitter(OG_TITLE, DESC),
};

export default function DiagnostykPage() {
  return (
    <>
      <SiteHeader current="diagnostyk" />
      <main id="main-content" className="brand-page">
        <div className="brand-container brand-page-narrow">
          <p className="brand-eyebrow">Diagnostyk · art. 116 O.p.</p>
          <h1>Dom za spółkę</h1>
          <p className="brand-page-lead">
            Sześć kroków do uporządkowania sytuacji. Na końcu otrzymasz wynik,
            listę dokumentów i kierunki obrony. Raport możesz pobrać bez zostawiania telefonu.
          </p>
          <div className="mt-6">
            <Disclaimer compact />
          </div>
          <div className="mt-8">
            <Art116Wizard />
          </div>
        </div>
      </main>
    </>
  );
}
