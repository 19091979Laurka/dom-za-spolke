export const FIRM = {
  product: "Dom za spółkę",
  tagline: "Czy fiskus może zająć Twój dom za długi spółki?",
  name: "Kancelaria Prawno-Podatkowa Rafał Szuwara",
  shortName: "Kancelaria Szuwara",
  lawyer: "Rafał Szuwara",
  email: "kancelaria.szuwara@gmail.com",
  phone: process.env.NEXT_PUBLIC_FIRM_PHONE?.trim() || "500 013 269",
  city: "Płock · Warszawa",
  site: "https://kancelaria-szuwara.pl",
  accountingSite: "https://www.ksiegowoscplock.pl",
} as const;

export function firmTelHref(): string {
  const digits = FIRM.phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("48") ? digits : `48${digits}`;
  return `tel:+${withCountry}`;
}

export function firmMailto(subject?: string, body?: string): string {
  // RFC 6068: mailto params must be percent-encoded. URLSearchParams encodes
  // spaces as "+", which mail clients render literally — so encode manually.
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  const query = parts.join("&");
  return `mailto:${FIRM.email}${query ? `?${query}` : ""}`;
}
