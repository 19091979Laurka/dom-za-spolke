import { FIRM } from "@/lib/firm";

/**
 * Canonical origin of the deployed site, without a trailing slash.
 * Set NEXT_PUBLIC_SITE_URL in the Vercel project once the final subdomain is
 * attached (planned: https://dom-za-spolke.kancelaria-szuwara.pl). The default
 * matches that plan so canonical/OG/sitemap URLs are correct even before the env
 * is set; override it if the subdomain name changes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://dom-za-spolke.kancelaria-szuwara.pl"
).replace(/\/+$/, "");

export const SITE_NAME = `${FIRM.product} · ${FIRM.shortName}`;

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
