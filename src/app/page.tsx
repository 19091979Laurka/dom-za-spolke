import Link from "next/link";
import { LeadCta } from "@/components/lead-cta";
import { SiteHeader } from "@/components/site-header";
import { FIRM } from "@/lib/firm";

export default function HomePage() {
  return (
    <>
      <SiteHeader current="home" />
      <main id="main-content">
        <section className="brand-hero">
          <div className="brand-container brand-hero-layout">
            <div>
              <p className="brand-eyebrow">KANCELARIA · ART. 116 · TSUE 2025</p>
              <h1>Czy fiskus może zająć Twój dom za długi spółki?</h1>
              <p className="brand-hero-copy">
                Rok temu urząd przeklejał decyzję spółki na członka zarządu i szedł po mieszkanie.
                Wyroki Adjak i Genzyński oraz interpretacja MF z 29 sierpnia 2025 r. to zatrzymały.
                Sprawdź w dwie minuty — zanim podpiszesz ugodę albo złożysz wyjaśnienia.
              </p>
              <div className="brand-hero-actions">
                <Link href="/diagnostyk" className="brand-button brand-button-cta">
                  Sprawdź ryzyko art. 116 <span>→</span>
                </Link>
                <Link href="/licznik" className="brand-button brand-button-secondary">
                  Ile dni ma fiskus? <span>→</span>
                </Link>
              </div>
            </div>
            <aside className="brand-hero-panel" aria-label="Podstawy 2025">
              <ol>
                <li>
                  <small>C-277/24 Adjak</small>
                  <p>Masz prawo kwestionować ustalenia z decyzji wobec spółki i żądać akt.</p>
                </li>
                <li>
                  <small>C-278/24 Genzyński</small>
                  <p>Winę się domniemywa, ale da się ją obalić. Sam VAT to nie upadłość.</p>
                </li>
                <li>
                  <small>MF 29.08.2025</small>
                  <p>Organ nie może automatycznie przenieść sentencji spółki na Ciebie.</p>
                </li>
              </ol>
              <div className="brand-hero-badge">
                <strong>{FIRM.lawyer}</strong>
                <span>{FIRM.phone}</span>
                <small>{FIRM.city}</small>
              </div>
            </aside>
          </div>
        </section>

        <section className="brand-section">
          <div className="brand-container">
            <p className="brand-eyebrow-plain">Jak to działa</p>
            <h2>Trzy rzeczy, zanim urząd wejdzie do domu.</h2>
            <div className="brand-pillars">
              <article className="brand-pillar">
                <span>01</span>
                <h3>Odpowiadasz</h3>
                <p>Kadencja, zaległość, egzekucja, upadłość, wgląd do akt. Dwanaście pytań, bez konta.</p>
              </article>
              <article className="brand-pillar">
                <span>02</span>
                <h3>Dostajesz semafor</h3>
                <p>Czerwony, żółty albo zielony plus zarzuty. VAT = twardy Adjak. CIT i ZUS = analogia.</p>
              </article>
              <article className="brand-pillar">
                <span>03</span>
                <h3>Kancelaria dzwoni</h3>
                <p>Zostawiasz numer. Przeglądamy wynik i mówimy, czy pisać pismo, czy czekać.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="brand-section" style={{ paddingTop: 0 }}>
          <div className="brand-container brand-tools">
            <article className="brand-tool">
              <small>Flaga</small>
              <h2>Dom za spółkę</h2>
              <p>
                Art. 116 to decyzja na cały majątek: dom, lokata, udział w mieszkaniu. Narzędzie nie
                liczy „ile zapłacisz”. Mówi, czy urząd w ogóle ma z czego strzelać.
              </p>
              <Link href="/diagnostyk">Wejdź do diagnostyka →</Link>
            </article>
            <article className="brand-tool">
              <small>Kalendarz</small>
              <h2>Licznik Fiskusa</h2>
              <p>
                VAT za styczeń–listopad 2021 przedawnia się 31 grudnia 2026. Urzędy wszczynają KKS,
                żeby zatrzymać zegar. NSA: instrumentalne KKS nie zawiesza.
              </p>
              <Link href="/licznik">Uruchom licznik →</Link>
            </article>
          </div>
        </section>

        <section id="kontakt" className="brand-contact">
          <div className="brand-container brand-contact-inner">
            <p className="brand-eyebrow">Kontakt</p>
            <h2>Nie masz czasu na kreator? Zostaw numer.</h2>
            <p className="brand-contact-copy">
              Napisz w dwóch zdaniach, co przyszło z urzędu. Oddzwonimy i powiemy, czy odpalać
              diagnostyk, czy od razu brać akt.
            </p>
            <LeadCta
              source="landing"
              subject="Dom za spółkę — oddzwońcie"
              resultText=""
              tone="dark"
              heading="Jedna rozmowa. Jasne kolejne kroki."
              blurb="Numer idzie do kancelarii, nie do newslettera."
            />
          </div>
        </section>
      </main>
    </>
  );
}
