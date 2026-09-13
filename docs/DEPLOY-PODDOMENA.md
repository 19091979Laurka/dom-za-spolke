# Wdrożenie na poddomenę kancelaria-szuwara.pl

Stan: przygotowane na branchu `fix/pre-prod`. **Bez scalania do `main` i bez nowego
deploymentu produkcyjnego bez wyraźnej zgody.** Poniższe kroki wykonuje się dopiero
po akceptacji.

Docelowa poddomena (robocza, do potwierdzenia): **`dom-za-spolke.kancelaria-szuwara.pl`**.
Projekt Vercel: `dom-za-spolke` (`prj_5lcYNaSazw0E1reIJAFISKbQsWcM`),
team `kancelariaszuwara-1066's projects` (`team_7Sj7DELf80G1y9YbJRGfzm10`).
Repo: `19091979Laurka/dom-za-spolke`.

## 1. Podgląd (bez produkcji)

Push na `fix/pre-prod` tworzy w Vercel **preview deployment** (osobny URL, nie produkcja).
Na nim można zweryfikować wszystko poniżej przed decyzją o wdrożeniu. Produkcja nie
zmienia się, dopóki zmiany nie trafią na `main`.

## 2. Zmienne środowiskowe (Vercel → Settings → Environment Variables)

| Zmienna | Wartość | Zakres | Uwagi |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://dom-za-spolke.kancelaria-szuwara.pl` | Production | Steruje canonical / OpenGraph / `sitemap.xml` / `robots.txt`. Jeśli nazwa poddomeny się zmieni — zmienić tu. |
| `NEXT_PUBLIC_FIRM_PHONE` | np. `500 013 269` | Production (opcjonalnie) | Tylko jeśli numer ma być inny niż domyślny w kodzie. |

Bez tej zmiennej kod użyje wartości domyślnej `https://dom-za-spolke.kancelaria-szuwara.pl`.
Zgłoszenia leadów są wyłącznie przez `mailto:` — **żadne** `LEAD_WEBHOOK` / `LEADS_KEY`
nie są już potrzebne (endpointy usunięte).

## 3. Podpięcie domeny w Vercel

1. Vercel → projekt `dom-za-spolke` → Settings → Domains → **Add** →
   `dom-za-spolke.kancelaria-szuwara.pl`.
2. Vercel pokaże wymagany rekord DNS (dla poddomeny zwykle **CNAME**).

## 4. DNS w Cyberfolks (rejestrator/DNS domeny kancelaria-szuwara.pl)

W panelu DNS domeny `kancelaria-szuwara.pl` dodać rekord dla hosta poddomeny:

```
Typ:   CNAME
Host:  dom-za-spolke
Cel:   cname.vercel-dns.com.        (użyć dokładnej wartości pokazanej przez Vercel)
TTL:   3600
```

Uwaga (do potwierdzenia przez Rafała): czy DNS domeny `kancelaria-szuwara.pl` jest
zarządzany rekordami w Cyberfolks, czy delegowany do Vercel (`ns1.vercel-dns.com`).
Jeśli delegowany do Vercel — poddomenę dodaje się tylko po stronie Vercel, bez ręcznego
CNAME w Cyberfolks.

## 5. Po podpięciu — weryfikacja

- `https://dom-za-spolke.kancelaria-szuwara.pl/` ładuje się po HTTPS (certyfikat wystawiony).
- `/robots.txt` i `/sitemap.xml` zawierają adresy z poddomeny.
- W `<head>` strony głównej: `link rel=canonical`, `og:*`, `twitter:*` wskazują poddomenę.
- `/api/leads` i `/leady` zwracają **404** (usunięte).
- JSON-LD (LegalService + FAQPage) waliduje się w Rich Results Test.
- Formularz kontaktu otwiera `mailto:` i niczego nie wysyła na serwer.

## 6. Do potwierdzenia przed produkcją (poza kodem)

- Ostateczna nazwa poddomeny.
- NAP/adres kancelarii (kod używa „Płock · Warszawa”; audyt sygnalizował rozbieżność
  z Bielskiem) — po ustaleniu można dodać `PostalAddress` do JSON-LD.
- Informacja o przetwarzaniu danych / prywatności (link w stopce).
- Google Search Console: dodać własność poddomeny i zgłosić `sitemap.xml`.
