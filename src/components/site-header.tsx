"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FIRM, firmTelHref } from "@/lib/firm";

export function SiteHeader({
  current,
}: {
  current?: "home" | "diagnostyk" | "licznik";
}) {
  const [open, setOpen] = useState(false);
  const tel = firmTelHref();

  return (
    <header className="brand-nav">
      <div className="brand-container brand-nav-inner">
        <Link href="/" className="brand-logo" aria-label={`${FIRM.shortName} — strona główna`}>
          <Image
            src="/brand/logo-kancelaria.png"
            alt={FIRM.name}
            width={1500}
            height={266}
            priority
          />
        </Link>
        <nav aria-label="Nawigacja główna">
          <Link href="/diagnostyk" data-active={current === "diagnostyk"}>
            Art. 116
          </Link>
          <Link href="/licznik" data-active={current === "licznik"}>
            Licznik
          </Link>
          <Link href="/#kontakt">Kontakt</Link>
          <a href={FIRM.accountingSite} target="_blank" rel="noreferrer">
            Biuro rachunkowe
          </a>
        </nav>
        <a className="brand-nav-cta" href={tel} aria-label={`Zadzwoń: ${FIRM.phone}`}>
          <PhoneIcon />
          <small>Zadzwoń</small>
          <strong>{FIRM.phone}</strong>
          <span aria-hidden>→</span>
        </a>
        <button
          type="button"
          className="brand-menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="brand-container brand-mobile-nav">
          <Link href="/diagnostyk" onClick={() => setOpen(false)}>
            Art. 116
          </Link>
          <Link href="/licznik" onClick={() => setOpen(false)}>
            Licznik
          </Link>
          <Link href="/#kontakt" onClick={() => setOpen(false)}>
            Kontakt
          </Link>
          <a href={tel}>Zadzwoń {FIRM.phone}</a>
        </div>
      ) : null}
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6.7 3.5 9.1 3l1.7 4.4-1.9 1.4a15.2 15.2 0 0 0 6.3 6.3l1.4-1.9 4.4 1.7-.5 2.4a2.7 2.7 0 0 1-3 2.1C9.9 18.6 5.4 14.1 4.6 6.5a2.7 2.7 0 0 1 2.1-3Z" />
    </svg>
  );
}
