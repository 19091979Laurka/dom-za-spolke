import type { Metadata } from "next";
import { Art116Wizard } from "@/components/art116-wizard";
import { Disclaimer } from "@/components/disclaimer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Diagnostyk art. 116",
  description:
    "Czy fiskus może zająć Twój majątek za zaległości spółki? Semafor po Adjak i Genzyński.",
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
            Dwanaście pytań. Żadnego logowania. Na końcu semafor, zarzuty i pole na telefon — żeby
            kancelaria mogła wziąć akt, zanim minie termin.
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
