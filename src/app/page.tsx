import Link from "next/link";
import Image from "next/image";
import { LeadCta } from "@/components/lead-cta";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
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
              <div className="hero-photo"><Image src="/brand/gabinet.png" alt="Gabinet Kancelarii Szuwara z logo na ścianie" fill priority sizes="(min-width: 960px) 50vw, 100vw" />
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
              <details open>
                <summary>Czy fiskus naprawdę może iść po mój dom?</summary>
                <p>
                  Art. 116 O.p. to decyzja na cały majątek członka zarządu — dom, lokata, udział w
                  mieszkaniu — gdy egzekucja ze spółki padła. To nie kara za spółkę. To osobista
                  odpowiedzialność. Diagnostyk porządkuje przesłanki i dokumenty potrzebne do indywidualnej oceny.
                </p>
              </details>
              <details>
                <summary>Wyroki TSUE z 2025 r. zamykają sprawę?</summary>
                <p>
                  Nie. Wyroki potwierdzają gwarancje obrony, ale nie uchylają odpowiedzialności członków zarządu. Należy sprawdzić przesłanki, sformułować konkretne zarzuty i dotrzymać terminów. Brak dostępu do akt sam w sobie nie oznacza wygranej.
                </p>
              </details>
              <details>
                <summary>Dla kogo jest ten diagnostyk?</summary>
                <p>
                  Dla członka albo byłego członka zarządu spółki z o.o., S.A. albo prostej spółki
                  akcyjnej, gdy na stole jest zaległość spółki albo już pismo z art. 116. JDG,
                  cywilna, jawna i komandytowa — art. 116 raczej nie. Tam idziesz do Licznika
                  Fiskusa.
                </p>
              </details>
              <details>
                <summary>VAT, CIT i ZUS liczycie tak samo?</summary>
                <p>
                  Nie. Wyroki TSUE dotyczą VAT. Przy CIT i należnościach płatnika trzeba ocenić przepisy krajowe i interpretację MF. Składki ZUS wymagają odrębnej analizy. Licznik wyznacza tylko bazowy termin podatkowy.
                </p>
              </details>
              <details>
                <summary>Co się dzieje z numerem telefonu?</summary>
                <p>
                  Dane i odpowiedzi pozostają w tej karcie przeglądarki. Formularz przygotowuje wiadomość w Twoim programie pocztowym — dopiero Ty ją wysyłasz do kancelarii. Sam wynik możesz pobrać bez podawania danych kontaktowych.
                </p>
              </details>
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
