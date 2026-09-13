# Dom za spółkę — przekazanie do niezależnego audytu

Stan: 13.09.2026. Projekt jest odrębny od strony głównej Kancelarii Szuwara.
Repozytorium: https://github.com/19091979Laurka/dom-za-spolke
Wersja robocza online: https://dom-za-spolke.vercel.app/

## Cel audytu

Oceń, czy diagnostyk odpowiedzialności członków zarządu, licznik przedawnienia i generowane raporty nadają się do udostępnienia klientom. Nie zakładaj poprawności istniejących reguł ani testów. Najpierw ustal oczekiwane wyniki z aktualnych źródeł pierwotnych, następnie porównaj je z kodem i działaniem strony. Wskaż błędy, brakujące pytania, mylące wnioski i konkretne poprawki.

Kod wyjściowy: 78cf4db8dc9ac423f0bea3a7bbe8cdf637ad1086 (06.09.2026).
Zmiany funkcjonalne: 45521ca. Bezstratna optymalizacja zdjęcia: fad06bef7e94a43f88602fa7a8d6a90c60406d15. Niniejsza dokumentacja i przykłady zostały dodane osobnym commitem.

## Co zmieniono

### Diagnostyk art. 116

- Usunięto addytywną punktację i pozorne procentowe szanse. Wprowadzono jawne reguły kwalifikacji.
- Wskazana decyzja wobec użytkownika daje pilny wynik czerwony. Czerwony opisano jako pilność analizy, nie przesądzoną utratę majątku.
- Braki danych, zadeklarowane podstawy obrony, ZUS i przypadki szczególne nie dają automatycznej korzystnej oceny. Zarzuty dotyczące akt/KKS nie odejmują materialnego ryzyka.
- Dodano pytania o decyzję, brak winy i przypadki szczególne. Doprecyzowano upadłość, otwarcie restrukturyzacji i zatwierdzenie układu.
- Poprawiono błędne odwołanie do art. 116 § 5 na art. 118; rozdzielono termin wydania decyzji i zobowiązania z doręczonej decyzji. Uwzględniono powstanie zwykłej zaległości następnego dnia po terminie płatności.
- Zmieniono zbyt szerokie obietnice dotyczące TSUE/KKS. Dodano źródła i ostrożniejsze zalecenia.
- Uzupełniono walidację dat, cofanie, zachowanie i edycję odpowiedzi, reset, focus oraz przewijanie.

### Licznik

- Wynik jest terminem bazowym, nie pełnym ustaleniem przedawnienia.
- CIT wymaga podania rzeczywistego terminu; nie zakłada terminu PIT ani braku przedłużeń.
- Podpowiedzi VAT/PIT uwzględniają weekendy i święta. Dodano upadłość, inne/nieznane zdarzenia i informację o niepełności katalogu.
- KKS w ostatnich 90 dniach opisano jako umowny sygnał do kontroli, nie dowód instrumentalności.
- Poprawiono formatowanie dat bez przesunięcia do poprzedniego dnia przez UTC.

### Raporty i wygląd

- Osobny komponent print-report.tsx dla wydruku klienta, używany przez oba narzędzia; PDF powstaje przez druk przeglądarki.
- Logo kancelarii, leśna zieleń #1e3a2f, złoto #b08d57, krem #f3efe6, zielone panele, boksy kroków, numeracja stron, dane i klikalne źródła.
- Wzorzec marki: nowa, nieopublikowana strona https://kancelaria-szuwara.vercel.app/. Logo/zdjęcie zapisane lokalnie w public/brand. Zdjęcie WebP skompresowane bezstratnie.
- Eksport TXT i kopiowanie raportu. Formularz kontaktowy wyłączony z wydruku.
- Przykłady z syntetycznych odpowiedzi: docs/examples/raport-art116.pdf (3 strony), raport-licznik.pdf (2 strony). To przykłady, nie pełny przegląd wszystkich kombinacji.

### Kontakt i bezpieczeństwo

- Formularz przygotowuje wyłącznie `mailto:`; klient sam wysyła wiadomość ze swojego programu pocztowego. Nie ma potwierdzenia dostarczenia ani automatycznego zapisu zgłoszenia.
- Usunięto całą serwerową obsługę leadów: endpointy `POST /api/lead` i `GET /api/leads`, stronę `/leady` oraz bibliotekę zapisu/odczytu plikowego. Strona nie przyjmuje zgłoszeń przez API i nie prowadzi skrzynki odbiorczej — brak magazynu danych osobowych po stronie serwera (usunięte ryzyko RODO oraz błąd 500/read-only na Vercelu z pierwotnego audytu).
- Nie wysyłano rzeczywistych zgłoszeń ani nie pobierano danych klientów. Kanałem kontaktu pozostaje e-mail i telefon kancelarii.

## Znane punkty wymagające decyzji lub poprawki

1. Licznik daje zielony wynik, gdy termin bazowy minął i nie zaznaczono zdarzeń. Zastrzeżenia istnieją, ale sam kolor może sugerować pewne przedawnienie. Rozważyć neutralny wynik wymagający weryfikacji.
2. Data wszczęcia KKS wpływa na wynik, lecz nie jest przenoszona do zestawienia danych w PDF licznika. Raport powinien zachować wszystkie istotne dane wejściowe.
3. Zalecenie „Jeśli decyzja zapadła po terminie — badamy umorzenie postępowania” jest zbyt skrótowe: należy rozdzielić rodzaj decyzji, termin bazowy/rzeczywisty oraz wpływ zdarzeń.
4. Ocenić, czy zielona kwalifikacja poza kadencją oraz czerwony wynik na podstawie samej deklaracji o decyzji są właściwie opisane, i czy pytania wystarczają dla art. 116, PSA, likwidacji, należności płatnika i ZUS.
5. Sprawdzić aktualny zakres zastosowania interpretacji MF do CIT/płatników i odrębność ZUS. Nie opierać oceny wyłącznie na nazwach „VAT” lub „analogia” w implementacji.
6. Zweryfikować terminy doręczeń i zaskarżenia, skuteczność rezygnacji, właściwy czas upadłości, wyjątki art. 118 i art. 70, przedłużenia terminów podatkowych, przypadki historyczne PIT-28 oraz szczególne rozliczenia CIT.
7. Sprawdzić PDF przy maksymalnej liczbie podstaw obrony i wszystkich zdarzeniach, w innych przeglądarkach i przy różnych ustawieniach druku. Dotychczasowe renderowanie: Chromium/A4.
8. Przed finalną domeną: potwierdzić NAP/adres kancelarii (obecnie Płock–Warszawa; wcześniejsza notatka wskazywała Bielsk), informacje o prywatności, właściwą obsługę zgłoszeń, SEO/canonical/robots/sitemap/OG i nazwę subdomeny.

## Weryfikacja już wykonana i jej granice

ESLint, TypeScript i produkcyjny build przeszły. 18 testów logiki obejmuje m.in. 8748 kombinacji odpowiedzi i 128 kombinacji zdarzeń. Wszystkie 13 testów Playwright przeszło na opublikowanym adresie 13.09.2026: VAT/CIT/PIT-4/ZUS, brak danych, obrona, decyzja, daty poza kadencją, walidacja/cofanie/edycja/reset, TXT, licznik, mobile, PDF i odmowa dostępu do API. Obejrzano każdą stronę obu przykładowych PDF-ów.

To potwierdza zgodność wykonania z zakodowanymi założeniami, a nie prawną poprawność wszystkich założeń. Nie wykonano niezależnej opinii prawnej, pełnego audytu bezpieczeństwa ani testu rzeczywistej dostawy zgłoszenia.

```sh
npm ci
npm run lint
npm test
npm run build
npm run dev
# W drugim terminalu:
npm run test:e2e
# Sprawdzenie wersji wdrożonej (testy zapisują przykładowe PDF-y do ../../outputs):
TEST_BASE_URL=https://dom-za-spolke.vercel.app npm run test:e2e
```

## Źródła do niezależnego sprawdzenia

- Ordynacja: https://eli.gov.pl/api/acts/DU/2026/622/text/T/D20260622L.pdf
- Adjak C-277/24: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:62024CJ0277
- Genzyński C-278/24: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:62024CJ0278
- Interpretacja MF DTS2.8012.5.2025: https://www.gov.pl/web/finanse/interpretacja-ogolna-nr-dts2801252025-ministra-finansow-i-gospodarki
- NSA I FPS 1/21: https://orzeczenia.nsa.gov.pl/doc/2A0AA77DCD

Reguły oznaczono datą 12.09.2026. Daty wejścia zmian Dz.U. 2026 poz. 825, 846 i 875 sprawdzono, ale nie wykonano pełnej analizy ich przyszłych skutków. Audytor powinien sam potwierdzić aktualność źródeł na dzień oceny.

## Oczekiwany wynik audytu

Dla każdego ustalenia podaj wagę (blokuje klientów / istotne / kosmetyczne), dokładny scenariusz i odpowiedzi, wynik obecny oraz oczekiwany, podstawę prawną lub techniczną, plik/funkcję i proponowaną poprawkę. Oddziel błędy potwierdzone od pytań wymagających interpretacji. Zakończ warunkami dopuszczenia do klientów; nie uznawaj samego przejścia testów za akceptację prawną.
