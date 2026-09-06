"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { firmTelHref } from "@/lib/firm";

export function StickyCta() {
  const path = usePathname();
  if (path === "/leady") return null;

  return (
    <div className="brand-dock print:hidden" aria-label="Szybki kontakt">
      <a href={firmTelHref()}>Zadzwoń</a>
      <Link href={path === "/" ? "#kontakt" : "/diagnostyk"}>
        {path === "/" ? "Napisz" : "Art. 116"}
      </Link>
    </div>
  );
}
