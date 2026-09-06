# Dom za spółkę

Lead magnet kancelarii podatkowej: diagnostyk **art. 116** (czy fiskus może iść po majątek członka zarządu) i **Licznik Fiskusa** (ile dni zostało urzędowi na VAT / PIT / CIT).

Narzędzie ma sprzedawać konsultację, nie wyglądać jak gazeta. Semafor i zarzuty są haczykiem. Telefon idzie do kancelarii.

## Co robi

1. **Diagnostyk art. 116** — kadencja, zaległość, egzekucja, upadłość, wgląd do akt. Semafor po TSUE **Adjak C-277/24**, **Genzyński C-278/24** i interpretacji MF **DTS2.8012.5.2025** (29.08.2025).
2. **Licznik Fiskusa** — 5 lat od końca roku płatności. VAT I–XI 2021 → **31.12.2026**. Instrumentalne KKS nie zawiesza (NSA I FPS 1/21, I FSK 379/22).
3. **Zgłoszenie** — imię + telefon zapisują się w `data/leads.json` (`POST /api/lead`). Skrzynka: `/leady?k=…`.

To nie jest porada prawna.

## Uruchomienie

```bash
npm install
npm run dev
```

Serwer: `http://127.0.0.1:47321` na maszynie, na której leci Next.

```bash
npm run build
npm run start
```

## Kontakt kancelarii

Szablon i kolory jak na [ksiegowoscplock.pl](https://www.ksiegowoscplock.pl): krem `#f3efe6`, zieleń `#1e3a2f`, złoto `#b08d57`, Inter / DM Sans.

W `src/lib/firm.ts`:

- kancelaria: **Kancelaria Prawno-Podatkowa Rafał Szuwara**
- mail: **kancelaria.szuwara@gmail.com**
- telefon: **500 013 269**

Klucz skrzynki leadów (domyślnie `szuwara`): `LEADS_KEY`.
Webhook: `LEAD_WEBHOOK`.

## Ścieżki

- `/` — sprzedaż + szybki numer
- `/diagnostyk` — kreator art. 116
- `/licznik` — przedawnienie
- `/leady` — skrzynka zgłoszeń

Na Vercel plik `data/leads.json` jest nietrwały. Podłącz `LEAD_WEBHOOK` albo skrzynkę mailową.
