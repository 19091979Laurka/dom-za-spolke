import Image from "next/image";
import Link from "next/link";
import { FIRM, firmMailto, firmTelHref } from "@/lib/firm";

export function SiteFooter() {
  return (
    <footer className="brand-footer">
      <div className="brand-container brand-footer-grid">
        <div className="brand-footer-brand">
          <Image
            src="https://www.ksiegowoscplock.pl/images/brand/logo-szuwara-kancelaria-cream.png"
            alt={FIRM.name}
            width={1500}
            height={266}
          />
          <p>{FIRM.name}</p>
          <p>{FIRM.city}</p>
          <p>Diagnostyk art. 116 · Licznik Fiskusa · spory podatkowe</p>
          <p>To narzędzie kancelarii, nie porada prawna i nie zastępstwo procesowe.</p>
        </div>
        <div>
          <p className="brand-footer-label">Kontakt</p>
          <a href={firmTelHref()}>{FIRM.phone}</a>
          <a href={firmMailto()}>{FIRM.email}</a>
          <Link href="/#kontakt">Zostaw numer</Link>
        </div>
        <div>
          <p className="brand-footer-label">Narzędzia</p>
          <Link href="/diagnostyk">Diagnostyk art. 116</Link>
          <Link href="/licznik">Licznik Fiskusa</Link>
          <Link href="/">Strona główna</Link>
        </div>
        <div>
          <p className="brand-footer-label">Grupa</p>
          <a href={FIRM.site} target="_blank" rel="noreferrer">
            kancelaria-szuwara.pl ↗
          </a>
          <a href={FIRM.accountingSite} target="_blank" rel="noreferrer">
            ksiegowoscplock.pl ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
