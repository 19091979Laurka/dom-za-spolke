"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { firmTelHref } from "@/lib/firm";

export function StickyCta() {
  const path = usePathname();
  const secondary =
    path === "/"
      ? { href: "/#kontakt", label: "Napisz" }
      : path === "/diagnostyk"
        ? { href: "/licznik", label: "Licznik" }
        : path === "/licznik"
          ? { href: "/diagnostyk", label: "Art. 116" }
          : { href: "/diagnostyk", label: "Art. 116" };

  return (
    <div className="brand-dock print:hidden" aria-label="Szybki kontakt">
      <a href={firmTelHref()}>Zadzwoń</a>
      <Link href={secondary.href}>{secondary.label}</Link>
    </div>
  );
}
