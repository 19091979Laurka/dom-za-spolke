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
              <ul className="brand-hero-meta">
                <li>2 minuty</li>
                <li>Bez konta</li>
                <li>Semafor + zarzuty do pisma</li>
              </ul>
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

        <section className="brand-proof" aria-label="Podstawy 2025">
          <div className="brand-container brand-proof-grid">
            <div>
              <small>27.02.2025 · C-277/24</small>
              <p>Adjak: możesz kwestionować ustalenia z decyzji spółki i żądać akt. NSA: zarzuty trzeba podnieść już przed organem.</p>
            </div>
            <div>
              <small>30.04.2025 · C-278/24</small>
              <p>Genzyński: winę da się obalić starannością. Sam VAT to nie upadłość. Polskie sądy wciąż bywają surowe.</p>
            </div>
            <div>
              <small>29.08.2025 · DTS2.8012.5.2025</small>
              <p>MF: organ nie przekleja sentencji spółki na Ciebie. VAT = twardy Adjak. CIT, PIT-4 i ZUS = analogia.</p>
            </div>
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
                  odpowiedzialność. Diagnostyk mówi, czy urząd w ogóle ma z czego strzelać.
                </p>
              </details>
              <details>
                <summary>Wyroki TSUE z 2025 r. zamykają sprawę?</summary>
                <p>
                  Nie. Adjak (C-277/24) daje prawo kwestionować ustalenia z decyzji spółki i żądać
                  akt. Genzyński (C-278/24) pozwala obalać winę starannością. Interpretacja MF z 29
                  sierpnia 2025 r. zakazuje automatycznego przenoszenia sentencji. Ale NSA w III FSK
                  605/24 mówi wprost: zarzuty trzeba podnieść już w postępowaniu przed organem. Jak
                  milczysz — później Adjak Cię nie uratuje.
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
                  Nie. TSUE orzekał na VAT — tam Adjak jest twardy. Przy CIT i PIT-4 idziemy analogią
                  z interpretacji MF. Przy ZUS ścieżka to art. 31 u.s.u.s.; semafor jest ostrożniejszy.
                  VAT za styczeń–listopad 2021 przedawnia się 31 grudnia 2026.
                </p>
              </details>
              <details>
                <summary>Co się dzieje z numerem telefonu?</summary>
                <p>
                  Numer idzie do kancelarii Rafała Szuwary, nie do newslettera i nie do biura
                  rachunkowego Laury. Oddzwonimy i powiemy, czy pisać pismo, czy brać akt, czy czekać.
                  To nie jest porada prawna z kreatora — dopiero rozmowa otwiera sprawę.
                </p>
              </details>
            </div>
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
