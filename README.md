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

## Kontakt i API

Formularz przygotowuje wiadomość w programie pocztowym użytkownika. Użytkownik musi wysłać ją sam; strona nie potwierdza dostarczenia ani nie zapisuje formularza na serwerze.

Pozostawione API POST /api/lead wymaga działającego HTTPS LEAD_WEBHOOK; błąd lub brak dostarczenia zwraca 503. Nie używać lokalnego pliku jako produkcyjnego magazynu zgłoszeń. GET /api/leads wymaga Authorization: Bearer oraz LEADS_KEY o długości co najmniej 24 znaków. Nie ma domyślnego klucza ani autoryzacji sekretem w URL. Automatyczna dostawa i magazyn zgłoszeń nie zostały skonfigurowane ani przetestowane produkcyjnie.

## Do niezależnego audytu i wdrożenia końcowego

Sprawdzić reguły prawne na aktualnych źródłach, przypadki brzegowe i wszystkie raporty; potwierdzić dane kancelarii, informacje o przetwarzaniu danych, docelową subdomenę oraz SEO. Następnie przetestować wdrożoną wersję i ewentualną rzeczywistą dostawę zgłoszeń. Wygenerowany raport nie jest podpisaną opinią kancelarii.
