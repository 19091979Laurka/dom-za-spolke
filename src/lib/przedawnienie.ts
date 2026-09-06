import {
  daysBetween,
  endOfYear,
  formatPl,
  parseIsoDate,
  startOfDay,
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
  legalBasis: { cite: string; note: string }[];
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
});

export function suggestPaymentDue(input: Pick<LicznikInput, "taxKind" | "year" | "month" | "quarter">): string {
  const year = Number(input.year);
  if (!year) return "";

  if (input.taxKind === "vat-m") {
    const month = Number(input.month);
    const dueMonth = month === 12 ? 1 : month + 1;
    const dueYear = month === 12 ? year + 1 : year;
    return `${dueYear}-${String(dueMonth).padStart(2, "0")}-25`;
  }

  if (input.taxKind === "vat-q") {
    const q = Number(input.quarter);
    const dueMonth = q === 4 ? 1 : q * 3 + 1;
    const dueYear = q === 4 ? year + 1 : year;
    return `${dueYear}-${String(dueMonth).padStart(2, "0")}-25`;
  }

  if (input.taxKind === "pit" || input.taxKind === "cit") {
    return `${year + 1}-04-30`;
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
  if (!input.taxKind) {
    return { error: "Wybierz podatek." };
  }
  const paymentDue = parseIsoDate(input.paymentDue);
  if (!paymentDue) {
    return { error: "Podaj prawidłowy termin płatności." };
  }

  const now = startOfDay(today);
  const baseEnd = baseLimitationEnd(paymentDue);
  const daysLeft = daysBetween(now, baseEnd);
  const expired = daysLeft < 0;

  const suspensions: string[] = [];
  if (input.enforcement) {
    suspensions.push(
      "Zastosowanie środka egzekucyjnego, o którym Cię zawiadomiono, przerywa bieg — po przerwie termin biegnie od nowa.",
    );
  }
  if (input.mortgage) {
    suspensions.push("Hipoteka przymusowa albo zastaw skarbowy wydłużają dochodzenie z zajętego mienia.");
  }
  if (input.installments) {
    suspensions.push("Raty albo odroczenie zawieszają bieg na czas ulgi.");
  }
  if (input.courtComplaint) {
    suspensions.push("Skarga do sądu administracyjnego zawiesza bieg na czas postępowania.");
  }
  if (input.kks70c) {
    suspensions.push(
      "Zawiadomienie z art. 70c O.p. o sprawie karnoskarbowej zawiesza bieg — o ile wszczęcie nie było instrumentalne.",
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
    } else {
      instrumentalRisk = true;
    }
  }

  let signal: LicznikResult["signal"];
  if (expired && suspensions.length === 0) signal = "green";
  else if (instrumentalRisk) signal = "yellow";
  else if (daysLeft <= 120 && !expired) signal = "red";
  else if (suspensions.length > 0) signal = "yellow";
  else signal = daysLeft <= 180 ? "red" : "yellow";

  if (expired && suspensions.length > 0) signal = "yellow";

  const label = periodLabel(input);

  const title = expired
    ? suspensions.length
      ? `${label}: bazowo przedawnione, ale zegar mógł stanąć`
      : `${label}: bazowy termin minął ${formatPl(baseEnd)}`
    : daysLeft <= 120
      ? `${label}: urzędowi zostało ${daysLeft} dni`
      : `${label}: bazowo do ${formatPl(baseEnd)}`;

  const summary = expired
    ? suspensions.length
      ? "Według art. 70 § 1 termin już minął. Zaznaczyłeś jednak zdarzenia, które mogły zawiesić albo przerwać bieg. Urząd często liczy inaczej niż podatnik — i tu wygrywa kancelaria, nie kalkulator ZUS."
      : "Pięcioletni termin liczony od końca roku, w którym upłynął termin płatności, już się skończył. Kontrola okresu przedawnionego jest bezprzedmiotowa, chyba że bieg wcześniej przerwano albo zawieszono."
    : `Art. 70 § 1 O.p.: 5 lat od końca ${paymentDue.getFullYear()} r. daje ${formatPl(baseEnd)}. ${
        daysLeft <= 120
          ? "To jest sezon, w którym urzędy wszczynają KKS, żeby sztucznie zatrzymać zegar."
          : "Masz czas, ale każdy środek egzekucyjny i każde zawiadomienie 70c zmienia rachunek."
      }`;

  const nextSteps = expired
    ? [
        "Nie składaj korekty „na wszelki wypadek” za okres, który uważasz za przedawniony, bez oceny skutków.",
        "Jeśli decyzja zapadła po terminie — badamy umorzenie postępowania.",
        "Przy KKS przy końcu roku: zarzut instrumentalności (I FPS 1/21, I FSK 379/22).",
      ]
    : [
        `Odłóż w kalendarzu ${formatPl(baseEnd)} i trzymaj księgi do tego dnia plus zapas.`,
        "Sprawdź, czy nie ma zawiadomienia 70c i czy data KKS nie klei się do końca roku.",
        "Jeśli toczy się kontrola — nie tłumacz się z okresów, które zaraz padną, bez strategii.",
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
      },
      {
        cite: "art. 70 § 2–8, art. 70c O.p.",
        note: "Przerwanie i zawieszenie: egzekucja, ulgi, sąd, zawiadomienie o KKS.",
      },
      {
        cite: "uchwała NSA I FPS 1/21; wyrok NSA 21.03.2025, I FSK 379/22",
        note: "Instrumentalne KKS nie zawiesza przedawnienia.",
      },
    ],
    nextSteps,
  };
}

export function licznikPlainText(result: LicznikResult): string {
  return [
    `Licznik Fiskusa — ${result.title}`,
    result.summary,
    `Termin płatności: ${result.paymentDue.toISOString().slice(0, 10)}`,
    `Bazowy koniec: ${result.baseEnd.toISOString().slice(0, 10)}`,
    `Dni: ${result.daysLeft}`,
    result.instrumentalRisk ? "Flaga: ryzyko instrumentalnego KKS" : "",
    "",
    "To diagnostyka, nie porada prawna.",
  ]
    .filter(Boolean)
    .join("\n");
}
