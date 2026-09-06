import type { Metadata } from "next";
import { DM_Sans, Inter, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { FIRM } from "@/lib/firm";
import "./globals.css";

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
  title: {
    default: `${FIRM.product} — ${FIRM.tagline}`,
    template: `%s · ${FIRM.product}`,
  },
  description:
    "Darmowy diagnostyk art. 116 po wyrokach TSUE Adjak i Genzyński. Semafor ryzyka, zarzuty do pisma i kontakt z kancelarią. Licznik Fiskusa na VAT 2021.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full">
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
