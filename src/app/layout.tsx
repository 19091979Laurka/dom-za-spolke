import type { Metadata } from "next";
import { DM_Sans, Inter, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { FIRM, firmTelHref } from "@/lib/firm";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import "./globals.css";

const DESCRIPTION =
  "Darmowy diagnostyk odpowiedzialności członka zarządu za długi spółki (art. 116 Ordynacji podatkowej) po wyrokach TSUE Adjak i Genzyński: semafor ryzyka, kierunki obrony i podstawy prawne. Licznik Fiskusa liczy bazowy termin przedawnienia (art. 70). Kancelaria Szuwara.";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${FIRM.product} — ${FIRM.tagline}`,
    template: `%s · ${FIRM.product}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: FIRM.name, url: FIRM.site }],
  creator: FIRM.name,
  publisher: FIRM.name,
  category: "law",
  keywords: [
    "art. 116 Ordynacji podatkowej",
    "odpowiedzialność członka zarządu za długi spółki",
    "zaległości podatkowe spółki z o.o.",
    "VAT spółki",
    "TSUE Adjak C-277/24",
    "TSUE Genzyński C-278/24",
    "interpretacja ogólna MF art. 116",
    "przedawnienie zobowiązania podatkowego art. 70",
    "bezskuteczność egzekucji",
    "odwołanie od decyzji podatkowej",
    "kancelaria prawno-podatkowa Płock",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${FIRM.product} — ${FIRM.tagline}`,
    description: DESCRIPTION,
    images: [
      {
        url: "/brand/gabinet.webp",
        width: 1672,
        height: 941,
        alt: "Kancelaria Szuwara — diagnostyk art. 116 „Dom za spółkę”",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${FIRM.product} — ${FIRM.tagline}`,
    description: DESCRIPTION,
    images: ["/brand/gabinet.webp"],
  },
};

const legalServiceLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": `${SITE_URL}/#kancelaria`,
  name: FIRM.name,
  alternateName: FIRM.shortName,
  url: SITE_URL,
  image: absoluteUrl("/brand/gabinet.webp"),
  telephone: firmTelHref().replace("tel:", ""),
  email: FIRM.email,
  address: FIRM.offices.map((o) => ({
    "@type": "PostalAddress",
    streetAddress: o.street,
    postalCode: o.zip,
    addressLocality: o.locality,
    addressCountry: "PL",
  })),
  areaServed: ["Płock", "Warszawa", "województwo mazowieckie", "Polska"],
  knowsAbout: [
    "art. 116 Ordynacji podatkowej",
    "odpowiedzialność członków zarządu za zaległości podatkowe spółki",
    "podatek VAT",
    "przedawnienie zobowiązań podatkowych",
    "postępowanie podatkowe i sądowoadministracyjne",
  ],
  founder: { "@type": "Person", name: FIRM.lawyer },
  // sameAs asserts entity identity — the accounting office (ksiegowoscplock.pl)
  // is a separate legal entity (Laura Szuwara), so it must not be listed here.
  sameAs: [FIRM.site],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceLd) }}
        />
        <div className="brand-shell">
          <a className="brand-skip" href="#main-content">
            Przejdź do treści
          </a>
          {children}
          <SiteFooter />
          <StickyCta />
        </div>
      </body>
    </html>
  );
}
