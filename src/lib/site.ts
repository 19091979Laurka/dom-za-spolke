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

export const OG_IMAGE = {
  url: "/brand/gabinet.webp",
  width: 1672,
  height: 941,
  alt: "Kancelaria Szuwara — diagnostyk art. 116 „Dom za spółkę”",
} as const;

/**
 * Full OpenGraph object for a page. Next.js merges metadata shallowly, so a
 * child page that sets `openGraph` replaces the parent's entirely — each page
 * must therefore provide the complete object, otherwise og:url would keep
 * pointing at the home page.
 */
export function pageOpenGraph(path: string, title: string, description: string) {
  return {
    type: "website" as const,
    locale: "pl_PL",
    url: path,
    siteName: SITE_NAME,
    title,
    description,
    images: [OG_IMAGE],
  };
}

export function pageTwitter(title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [OG_IMAGE.url],
  };
}
