# Dom za spółkę

Roboczy diagnostyk odpowiedzialności członków zarządu (art. 116 Ordynacji podatkowej) i licznik bazowego terminu przedawnienia. Projekt Kancelarii Szuwara; wymaga niezależnego audytu przed uruchomieniem pod domeną kancelarii.

## Uruchomienie i weryfikacja

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
# Przy działającym serwerze na localhost:47321:
npm run test:e2e
```

## Aktualny zakres

- Reguły kwalifikacji zamiast punktacji ryzyka; niepełne dane, ZUS i przypadki szczególne wymagają weryfikacji.
- Licznik pokazuje termin bazowy, nie rozstrzyga skutków wszystkich zawieszeń/przerwań.
- Raport obejmuje odpowiedzi, uzasadnienie, plan działania i źródła. Druk/PDF korzysta z osobnego układu kancelarii; dostępny jest również eksport TXT.
- Wzorzec marki: nowa strona kancelaria-szuwara.vercel.app. Logo i zdjęcie w public/brand.

## Kontakt

Formularz przygotowuje wyłącznie wiadomość `mailto:` w programie pocztowym użytkownika. Użytkownik wysyła ją sam; strona nie zapisuje danych na serwerze, nie wysyła ich żadnym API i nie potwierdza dostarczenia. Nie ma serwerowego endpointu przyjmującego zgłoszenia ani skrzynki odbiorczej — dane kontaktowe nie są nigdzie po stronie serwera przechowywane (bez ryzyka RODO związanego z magazynem zgłoszeń).

## Do niezależnego audytu i wdrożenia końcowego

Sprawdzić reguły prawne na aktualnych źródłach, przypadki brzegowe i wszystkie raporty; potwierdzić dane kancelarii, informacje o przetwarzaniu danych, docelową subdomenę oraz SEO. Następnie przetestować wdrożoną wersję i ewentualną rzeczywistą dostawę zgłoszeń. Wygenerowany raport nie jest podpisaną opinią kancelarii.
