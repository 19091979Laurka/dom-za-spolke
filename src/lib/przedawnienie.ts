import {
  daysBetween,
  endOfYear,
  formatPl,
  parseIsoDate,
  startOfDay,
  formatIsoLocal,
} from "@/lib/dates";

export type TaxKind = "vat-m" | "vat-q" | "pit" | "cit";

export type LicznikInput = {
  taxKind: TaxKind | "";
  year: string;
  month: string;
  quarter: string;
  paymentDue: string;
  enforcement: boolean;
  mortgage: boolean;
  installments: boolean;
  courtComplaint: boolean;
  kks70c: boolean;
  kksDate: string;
  bankruptcy: boolean;
  otherEvents: boolean;
};

export type LicznikResult = {
  signal: "red" | "yellow" | "green";
  title: string;
  summary: string;
  periodLabel: string;
  paymentDue: Date;
  baseEnd: Date;
  daysLeft: number;
  expired: boolean;
  suspensions: string[];
  instrumentalRisk: boolean;
  legalBasis: { cite: string; note: string; url?: string }[];
  nextSteps: string[];
};

export const emptyLicznikInput = (): LicznikInput => ({
  taxKind: "",
  year: "2021",
  month: "01",
  quarter: "1",
  paymentDue: "",
  enforcement: false,
  mortgage: false,
  installments: false,
  courtComplaint: false,
  kks70c: false,
  kksDate: "",
  bankruptcy: false,
  otherEvents: false,
});

export function suggestPaymentDue(input: Pick<LicznikInput, "taxKind" | "year" | "month" | "quarter">): string {
  const year = Number(input.year);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return "";

  if (input.taxKind === "vat-m") {
    const month = Number(input.month);
    if (!Number.isInteger(month) || month < 1 || month > 12) return "";
    const dueMonth = month === 12 ? 1 : month + 1;
    const dueYear = month === 12 ? year + 1 : year;
    return businessDay(new Date(dueYear, dueMonth - 1, 25));
  }

  if (input.taxKind === "vat-q") {
    const q = Number(input.quarter);
    if (!Number.isInteger(q) || q < 1 || q > 4) return "";
    const dueMonth = q === 4 ? 1 : q * 3 + 1;
    const dueYear = q === 4 ? year + 1 : year;
    return businessDay(new Date(dueYear, dueMonth - 1, 25));
  }

  if (input.taxKind === "pit") {
    return businessDay(new Date(year + 1, 3, 30));
  }

  return "";
}

export function periodLabel(input: LicznikInput): string {
  if (input.taxKind === "vat-m") {
    return `VAT ${input.month}/${input.year}`;
  }
  if (input.taxKind === "vat-q") {
    return `VAT Q${input.quarter} ${input.year}`;
  }
  if (input.taxKind === "pit") {
    return `PIT za ${input.year}`;
  }
  if (input.taxKind === "cit") {
    return `CIT za ${input.year}`;
  }
  return "okres nierozpoznany";
}

export function baseLimitationEnd(paymentDue: Date): Date {
  return endOfYear(paymentDue.getFullYear() + 5);
}

export function diagnoseLimitation(
  input: LicznikInput,
  today = new Date(),
): LicznikResult | { error: string } {
  if (!["vat-m", "vat-q", "pit", "cit"].includes(input.taxKind)) {
    return { error: "Wybierz podatek." };
  }
  const paymentDue = parseIsoDate(input.paymentDue);
  if (!paymentDue) {
    return { error: "Podaj prawidłowy termin płatności." };
  }

  const now = startOfDay(today);
  if (paymentDue >= now) return { error: "Wskaż miniony termin płatności. Licznik dotyczy zaległości." };
  if (input.kks70c && input.kksDate && (!parseIsoDate(input.kksDate) || parseIsoDate(input.kksDate)! > now)) return { error: "Data wszczęcia KKS musi być prawidłowa i nie późniejsza niż dziś." };
  const baseEnd = baseLimitationEnd(paymentDue);
  const daysLeft = daysBetween(now, baseEnd);
  const expired = daysLeft < 0;

  const suspensions: string[] = [];
  if (input.bankruptcy) suspensions.push("Ogłoszenie upadłości może przerwać bieg. Potrzebne są daty orzeczeń i ich prawomocności.");
  if (input.otherEvents) suspensions.push("Nieznane lub inne zdarzenia wymagają analizy dokumentów. Lista w formularzu nie wyczerpuje wszystkich szczególnych przepisów.");
  if (input.enforcement) {
    suspensions.push(
      "Zastosowanie środka egzekucyjnego, o którym Cię zawiadomiono, przerywa bieg — po przerwie termin biegnie od nowa.",
    );
  }
  if (input.mortgage) {
    suspensions.push("Hipoteka lub zastaw: odrębnie oceń zakres zabezpieczenia i spór dotyczący art. 70 § 8. Sam wpis nie jest prostym dodaniem dni do terminu.");
  }
  if (input.installments) {
    suspensions.push("Raty albo odroczenie zawieszają bieg na czas ulgi.");
  }
  if (input.courtComplaint) {
    suspensions.push("Skarga do sądu administracyjnego zawiesza bieg na czas postępowania.");
  }
  if (input.kks70c) {
    suspensions.push(
      "Dla skutku KKS znaczenie ma wszczęcie powiązanej sprawy, prawidłowe zawiadomienie przed upływem terminu i rzeczywisty przebieg. Sama etykieta „70c” nie pozwala obliczyć skutku.",
    );
  }

  let instrumentalRisk = false;
  if (input.kks70c) {
    const kksDate = parseIsoDate(input.kksDate);
    if (kksDate) {
      const windowStart = new Date(baseEnd);
      windowStart.setDate(windowStart.getDate() - 90);
      instrumentalRisk =
        kksDate.getTime() >= windowStart.getTime() &&
        kksDate.getTime() <= baseEnd.getTime();
    }
  }

  let signal: LicznikResult["signal"];
  // Expired base term with nothing ticked is NOT a confirmed lapse — the user
  // often does not know about a 70c notice or an enforcement step. Absence of
  // clicks means "don't know", so this stays yellow (never a reassuring green).
  if (expired && suspensions.length === 0) signal = "yellow";
  else if (instrumentalRisk) signal = "yellow";
  else if (daysLeft <= 120 && !expired) signal = "red";
  else if (suspensions.length > 0) signal = "yellow";
  else signal = daysLeft <= 180 ? "red" : "yellow";

  if (expired && suspensions.length > 0) signal = "yellow";

  const label = periodLabel(input);

  const title = expired
    ? suspensions.length
      ? `${label}: termin bazowy minął — sprawdź wpływ zdarzeń`
      : `${label}: bazowy termin minął ${formatPl(baseEnd)} — wymaga potwierdzenia`
    : daysLeft <= 120
      ? `${label}: ${daysLeft} dni do terminu bazowego`
      : `${label}: bazowo do ${formatPl(baseEnd)}`;

  const summary = expired
    ? suspensions.length
      ? "Według art. 70 § 1 termin już minął. Zaznaczyłeś jednak zdarzenia, które mogły zawiesić albo przerwać bieg. Nie wyliczamy skorygowanej daty bez dokumentów i dat tych zdarzeń."
      : "Pięcioletni termin liczony od końca roku, w którym upłynął termin płatności, już się skończył. Nie jest to potwierdzenie wygaśnięcia zobowiązania. Sprawdź wszystkie zdarzenia wpływające na bieg i przepisy szczególne."
    : `Art. 70 § 1 O.p.: 5 lat od końca ${paymentDue.getFullYear()} r. daje ${formatPl(baseEnd)}. ${
        daysLeft <= 120
          ? "Bliskość terminu zwiększa pilność sprawdzenia akt. Nie przesądza celu działań organu."
          : "Zdarzenia zawieszające lub przerywające mogą zmienić wynik; ich skuteczność wymaga sprawdzenia."
      }`;

  const nextSteps = expired
    ? [
        "Nie składaj korekty „na wszelki wypadek” za okres, który uważasz za przedawniony, bez oceny skutków.",
        "Jeśli decyzja zapadła po upływie właściwego terminu — do zbadania jest, czy postępowanie podlega umorzeniu (art. 208 O.p.). Ten licznik tego nie rozstrzyga; osobno ocenia się decyzję wobec spółki i wobec osoby trzeciej.",
        "Przy KKS zbadaj cel i przebieg postępowania oraz zawiadomienie. Bliskość terminu sama nie dowodzi instrumentalności.",
      ]
    : [
        `Zapisz bazową datę ${formatPl(baseEnd)}. Nie niszcz dokumentów na podstawie tego wyniku; okres przechowywania wymaga odrębnej oceny.`,
        "Sprawdź, czy nie ma zawiadomienia 70c i czy data KKS nie klei się do końca roku.",
        "Odpowiadaj na wezwania w terminie. Ustal strategię i wnioski dowodowe z pełnomocnikiem.",
      ];

  return {
    signal,
    title,
    summary,
    periodLabel: label,
    paymentDue,
    baseEnd,
    daysLeft,
    expired,
    suspensions,
    instrumentalRisk,
    legalBasis: [
      {
        cite: "art. 70 § 1 O.p.",
        note: "5 lat od końca roku kalendarzowego, w którym upłynął termin płatności.",
        url: "https://eli.gov.pl/api/acts/DU/2026/622/text/T/D20260622L.pdf",
      },
      {
        cite: "art. 70 § 2–8, art. 70c O.p.",
        note: "Przerwanie i zawieszenie oraz szczególne zasady zabezpieczeń wymagają analizy dokumentów.",
        url: "https://eli.gov.pl/api/acts/DU/2026/622/text/T/D20260622L.pdf",
      },
      {
        cite: "uchwała NSA 24.05.2021, I FPS 1/21",
        note: "Sąd może badać przesłanki i instrumentalność wszczęcia KKS. Sam próg 90 dni nie jest regułą prawną.",
        url: "https://orzeczenia.nsa.gov.pl/doc/2A0AA77DCD",
      },
    ],
    nextSteps,
  };
}

export function licznikPlainText(result: LicznikResult): string {
  return [
    `Licznik Fiskusa — ${result.title}`,
    result.summary,
    `Termin płatności: ${formatIsoLocal(result.paymentDue)}`,
    `Bazowy koniec: ${formatIsoLocal(result.baseEnd)}`,
    `Dni: ${result.daysLeft}`,
    result.instrumentalRisk ? "Flaga: ryzyko instrumentalnego KKS" : "",
    "",
    "Zdarzenia:", ...result.suspensions,
    "Następne kroki:", ...result.nextSteps,
    "Źródła:", ...result.legalBasis.map(l => `${l.cite}: ${l.note} ${l.url || ""}`),
    "Wynik bazowy, nie potwierdzenie przedawnienia. Nie zatrzymuje terminów. Wersja reguł 2026-09-12.",
  ]
    .filter(Boolean)
    .join("\n");
}

// Art. 12 § 5 O.p.; standard deadline suggestions, not special extensions.
function businessDay(date: Date): string {
  const y = date.getFullYear();
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const easter = new Date(y, month - 1, day);
  const holidays = new Set(["01-01", "01-06", "05-01", "05-03", "08-15", "11-01", "11-11", "12-25", "12-26", ...(y >= 2025 ? ["12-24"] : [])]);
  for (const offset of [1, 60]) {
    const date = new Date(y, easter.getMonth(), easter.getDate() + offset);
    holidays.add(formatIsoLocal(date).slice(5));
  }
  while ([0, 6].includes(date.getDay()) || holidays.has(formatIsoLocal(date).slice(5))) date.setDate(date.getDate() + 1);
  return formatIsoLocal(date);
}
