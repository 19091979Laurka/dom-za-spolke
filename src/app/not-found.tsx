import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="brand-page">
        <div className="brand-container brand-page-narrow">
          <p className="brand-eyebrow">Błąd 404</p>
          <h1>Nie znaleźliśmy tej strony.</h1>
          <p className="brand-page-lead">
            Adres mógł się zmienić albo strona nie istnieje. Skorzystaj z narzędzi kancelarii
            albo wróć na stronę główną.
          </p>
          <div className="brand-hero-actions" style={{ marginTop: 28 }}>
            <Link href="/diagnostyk" className="brand-button brand-button-cta">
              Diagnostyk art. 116 <span>→</span>
            </Link>
            <Link href="/licznik" className="brand-button brand-button-secondary">
              Licznik Fiskusa <span>→</span>
            </Link>
            <Link href="/" className="brand-button brand-button-ghost">
              Strona główna <span>→</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
