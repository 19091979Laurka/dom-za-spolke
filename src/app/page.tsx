import Link from "next/link";
import Image from "next/image";
import { LeadCta } from "@/components/lead-cta";
import { SiteHeader } from "@/components/site-header";

const FAQ = [
  {
    q: "Czy fiskus naprawdę może iść po mój dom?",
    a: "Art. 116 O.p. pozwala wydać decyzję na cały majątek osobisty członka zarządu — dom, lokatę, udział w mieszkaniu — gdy egzekucja ze spółki okazała się bezskuteczna. To osobista odpowiedzialność, nie kara za spółkę. Diagnostyk porządkuje przesłanki i dokumenty potrzebne do indywidualnej oceny.",
  },
  {
    q: "Wyroki TSUE z 2025 r. zamykają sprawę?",
    a: "Nie. Wyroki Adjak i Genzyński potwierdzają gwarancje obrony, ale nie uchylają odpowiedzialności członków zarządu. Należy sprawdzić przesłanki, sformułować konkretne zarzuty i dotrzymać terminów. Sam brak dostępu do akt nie oznacza wygranej.",
  },
  {
    q: "Dla kogo jest ten diagnostyk?",
    a: "Dla obecnego albo byłego członka zarządu spółki z o.o., S.A. albo prostej spółki akcyjnej, gdy pojawia się zaległość spółki albo pismo z art. 116. Dla JDG oraz spółek cywilnej, jawnej i komandytowej art. 116 zwykle nie ma zastosowania — tam pomocny jest Licznik Fiskusa.",
  },
  {
    q: "VAT, CIT i ZUS liczycie tak samo?",
    a: "Nie. Wyroki TSUE dotyczą VAT. Przy CIT i należnościach płatnika trzeba ocenić przepisy krajowe i interpretację MF. Składki ZUS wymagają odrębnej analizy. Licznik wyznacza tylko bazowy termin podatkowy.",
  },
  {
    q: "Co się dzieje z numerem telefonu?",
    a: "Dane i odpowiedzi pozostają w tej karcie przeglądarki. Formularz przygotowuje wiadomość w Twoim programie pocztowym — dopiero Ty ją wysyłasz do kancelarii. Strona nie zapisuje danych na serwerze. Sam wynik możesz pobrać bez podawania danych kontaktowych.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <SiteHeader current="home" />
      <main id="main-content">
        <section className="brand-hero">
          <div className="brand-container brand-hero-layout">
            <div>
              <p className="brand-eyebrow">KANCELARIA · ART. 116 · TSUE 2025</p>
              <h1>Czy fiskus może zająć <span className="hero-emphasis">Twój dom</span> za długi spółki?</h1>
              <p className="brand-hero-copy">
                Spółka ma zaległości. Ty masz prawo do obrony. Sprawdź, które przesłanki
                odpowiedzialności wymagają uwagi i jakie dokumenty przygotować.
                Kilka minut, sześć kroków i czytelny raport.
              </p>
              <div className="brand-hero-actions">
                <Link href="/diagnostyk" className="brand-button brand-button-cta">
                  Sprawdź ryzyko art. 116 <span>→</span>
                </Link>
                <Link href="/licznik" className="brand-button brand-button-secondary">
                  Ile dni ma fiskus? <span>→</span>
                </Link>
              </div>
              <ul className="brand-hero-meta">
                <li>6 kroków</li>
                <li>Bez konta</li>
                <li>Wynik + plan działania</li>
              </ul>
            </div>
            <aside className="hero-visual" aria-label="Kancelaria Szuwara — prawo i podatki">
              <div className="hero-photo"><Image src="/brand/gabinet.webp" alt="Gabinet Kancelarii Szuwara z logo na ścianie" fill priority sizes="(min-width: 960px) 50vw, 100vw" />
                <div className="hero-photo-label"><span>01 / PRAWO DO OBRONY</span><span>ART. 116 O.P.</span></div>
                <div className="hero-orbit" aria-hidden="true" />
              </div>
              <div className="hero-note"><div className="hero-note-mark" aria-hidden="true">§</div><div><small>ODPOWIEDZIALNOŚĆ NIE JEST AUTOMATYCZNA</small><p>Najpierw przesłanki.<br /><strong>Potem decyzja.</strong></p></div><span className="hero-note-arrow" aria-hidden="true">↗</span></div>
              <p className="hero-caption">Kancelaria Szuwara <span>Prawo i podatki pod jednym dachem</span></p>
            </aside>
          </div>
        </section>

        <section className="brand-proof" aria-label="Podstawy 2025">
          <div className="brand-container brand-proof-grid">
            <div>
              <a href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:62024CJ0277" target="_blank" rel="noreferrer"><small>27.02.2025 · C-277/24 ↗</small></a>
              <p>Adjak: możliwość kwestionowania ustaleń i kwalifikacji prawnych oraz dostęp do akt w sprawie odpowiedzialności za VAT.</p>
            </div>
            <div>
              <a href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:62024CJ0278" target="_blank" rel="noreferrer"><small>30.04.2025 · C-278/24 ↗</small></a>
              <p>Genzyński: możliwość wykazania braku winy. Samo powstanie zobowiązania VAT nie wyznacza momentu niewypłacalności.</p>
            </div>
            <div>
              <a href="https://www.gov.pl/web/finanse/interpretacja-ogolna-nr-dts2801252025-ministra-finansow-i-gospodarki" target="_blank" rel="noreferrer"><small>29.08.2025 · INTERPRETACJA MF ↗</small></a>
              <p>MF: wykładnia art. 116 po wyrokach TSUE. ZUS wymaga odrębnej oceny na podstawie ustawy ubezpieczeniowej.</p>
            </div>
          </div>
        </section>

        <section className="brand-section">
          <div className="brand-container">
            <p className="brand-eyebrow-plain">Jak to działa</p>
            <h2>Poznaj swoją sytuację.<br />Zaplanuj kolejny krok.</h2>
            <div className="brand-pillars">
              <article className="brand-pillar">
                <span>01</span>
                <h3>Odpowiadasz</h3>
                <p>Kadencja, zaległość, egzekucja, upadłość, wgląd do akt. Sześć etapów, bez konta.</p>
              </article>
              <article className="brand-pillar">
                <span>02</span>
                <h3>Dostajesz semafor</h3>
                <p>Wynik wynika z konkretnych odpowiedzi. Dostajesz listę niewiadomych, kierunki obrony i podstawy prawne.</p>
              </article>
              <article className="brand-pillar">
                <span>03</span>
                <h3>Rozmawiasz z kancelarią</h3>
                <p>Możesz przekazać wynik kancelarii i ustalić dalsze działania. Sam formularz nie zastępuje zlecenia prowadzenia sprawy.</p>
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
                Odpowiedzialność może objąć majątek osobisty. Sprawdź okres funkcji, egzekucję
                i możliwe podstawy obrony. Wynik nie przesądza zajęcia konkretnej nieruchomości.
              </p>
              <Link href="/diagnostyk">Wejdź do diagnostyka →</Link>
            </article>
            <article className="brand-tool">
              <small>Kalendarz</small>
              <h2>Licznik Fiskusa</h2>
              <p>
                Dla VAT za styczeń–listopad 2021 bazowy termin to 31 grudnia 2026.
                Sprawdź, co może zmienić ten rachunek: egzekucja, ulgi, upadłość, skarga czy KKS.
              </p>
              <Link href="/licznik">Uruchom licznik →</Link>
            </article>
          </div>
        </section>

        <section className="brand-section" style={{ paddingTop: 0 }} aria-labelledby="faq-heading">
          <div className="brand-container">
            <p className="brand-eyebrow-plain">Najczęściej pytacie</p>
            <h2 id="faq-heading">Najpierw porządkujemy pytania. Potem semafor.</h2>
            <div className="brand-faq">
              {FAQ.map(({ q, a }, i) => (
                <details key={q} open={i === 0}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="kontakt" className="brand-contact">
          <div className="brand-container brand-contact-inner">
            <p className="brand-eyebrow">Kontakt</p>
            <h2>Masz już pismo z urzędu? Porozmawiajmy.</h2>
            <p className="brand-contact-copy">
              Opisz krótko swoją sytuację i przygotuj e-mail do kancelarii.
              W pilnej sprawie zadzwoń — terminy biegną niezależnie od formularza.
            </p>
            <LeadCta
              source="landing"
              subject="Dom za spółkę — prośba o kontakt"
              resultText=""
              tone="dark"
              heading="Jedna rozmowa. Jasne kolejne kroki."
              blurb="Formularz przygotuje gotową wiadomość — wysyłasz ją samodzielnie ze swojej poczty."
            />
          </div>
        </section>
      </main>
    </>
  );
}
