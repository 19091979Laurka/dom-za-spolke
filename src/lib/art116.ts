import {
  endOfYear,
  isOnOrAfter,
  isOnOrBefore,
  parseIsoDate,
  startOfDay,
  formatIsoLocal,
} from "@/lib/dates";

export type CompanyForm = "spzoo" | "sa" | "psa" | "other";
export type ArrearKind = "vat" | "cit" | "pit4" | "zus";
export type YesNoUnknown = "yes" | "no" | "unknown";
export type Signal = "red" | "yellow" | "green" | "out";
export type PremiseStatus = "met" | "missing" | "unclear" | "na";
export type DefenseStrength = "strong" | "medium" | "cite";

export type Art116Answers = {
  companyForm: CompanyForm | "";
  decisionIssued: YesNoUnknown | "";
  specialCase: YesNoUnknown | "";
  noFault: YesNoUnknown | "";
  tenureStart: string;
  stillServing: boolean;
  tenureEnd: string;
  resignationBeforeKrs: YesNoUnknown | "";
  arrearKind: ArrearKind | "";
  paymentDue: string;
  enforcementFruitless: YesNoUnknown | "";
  proceeding116: YesNoUnknown | "";
  insolvencyFiled: YesNoUnknown | "";
  insolvencyDate: string;
  hadCompanyDecision: YesNoUnknown | "";
  hadFileAccess: YesNoUnknown | "";
  kksNearLimitation: YesNoUnknown | "";
  companyAssetsPointed: YesNoUnknown | "";
};

export type Art116Premise = {
  label: string;
  status: PremiseStatus;
  detail: string;
};

export type Art116Defense = {
  title: string;
  body: string;
  strength: DefenseStrength;
};

export type Art116Result = {
  signal: Signal;
  title: string;
  summary: string;
  assessmentDate: string;
  answerSummary: { label: string; value: string }[];
  premises: Art116Premise[];
  defenses: Art116Defense[];
  legalBasis: { cite: string; note: string; url?: string }[];
  nextSteps: string[];
  adjakStrength: "hard" | "analogy" | "none";
  zusPath: boolean;
  notApplicableReason?: string;
};

export const emptyArt116Answers = (): Art116Answers => ({
  companyForm: "",
  decisionIssued: "",
  specialCase: "",
  noFault: "",
  tenureStart: "",
  stillServing: true,
  tenureEnd: "",
  resignationBeforeKrs: "",
  arrearKind: "",
  paymentDue: "",
  enforcementFruitless: "",
  proceeding116: "",
  insolvencyFiled: "",
  insolvencyDate: "",
  hadCompanyDecision: "",
  hadFileAccess: "",
  kksNearLimitation: "",
  companyAssetsPointed: "",
});

const OP = "https://eli.gov.pl/api/acts/DU/2026/622/text/T/D20260622L.pdf";
const MF = "https://www.gov.pl/web/finanse/interpretacja-ogolna-nr-dts2801252025-ministra-finansow-i-gospodarki";
const YES_NO = { yes: "Tak", no: "Nie", unknown: "Nie wiem", "": "Nie podano" };

/** Ordinary unpaid tax: the arrear arises on the day after the payment deadline. */
export function art118Deadline(paymentDue: Date): Date {
  const arrearDate = new Date(paymentDue.getFullYear(), paymentDue.getMonth(), paymentDue.getDate() + 1);
  return endOfYear(arrearDate.getFullYear() + 5);
}

export function validateArt116Step(a: Art116Answers, step: number, today = new Date()): string {
  const now = startOfDay(today);
  const pastDate = (v: string) => { const d = parseIsoDate(v); return d && d <= now; };
  if (step === 0 && !["spzoo", "sa", "psa", "other"].includes(a.companyForm)) return "Wybierz formę działalności.";
  if (a.companyForm === "other") return "";
  if (step === 1) {
    if (!pastDate(a.tenureStart)) return "Podaj prawidłowy początek pełnienia funkcji, nie późniejszy niż dziś.";
    if (!a.stillServing && (!pastDate(a.tenureEnd) || a.tenureEnd < a.tenureStart)) return "Koniec pełnienia funkcji musi przypadać między jej początkiem a dzisiejszą datą.";
    if (!a.stillServing && !a.resignationBeforeKrs) return "Wskaż, czy zakończenie funkcji poprzedzało wykreślenie z KRS.";
  }
  if (step === 2) {
    if (!["vat", "cit", "pit4", "zus"].includes(a.arrearKind)) return "Wybierz rodzaj zaległości.";
    const due = parseIsoDate(a.paymentDue);
    if (!due || due >= now) return "Podaj prawidłowy, już miniony termin płatności zaległości.";
    if (!a.specialCase) return "Odpowiedz na pytanie o przypadki szczególne.";
  }
  if (step === 3 && (!a.enforcementFruitless || !a.proceeding116 || !a.decisionIssued)) return "Odpowiedz na wszystkie pytania o egzekucję i postępowanie. Możesz wybrać „Nie wiem”.";
  if (step === 4) {
    if (!a.insolvencyFiled || !a.companyAssetsPointed || !a.noFault) return "Odpowiedz na wszystkie pytania o możliwe podstawy obrony.";
    if (a.insolvencyFiled === "yes" && a.insolvencyDate && !pastDate(a.insolvencyDate)) return "Data zdarzenia musi być prawidłowa i nie późniejsza niż dziś.";
  }
  if (step === 5 && (!a.hadCompanyDecision || !a.hadFileAccess || (a.arrearKind !== "zus" && !a.kksNearLimitation))) return "Odpowiedz na pytania o dostęp do akt i postępowanie. Możesz wybrać „Nie wiem”.";
  return "";
}

export function diagnoseArt116(a: Art116Answers, today = new Date()): Art116Result {
  const now = startOfDay(today);
  const zusPath = a.arrearKind === "zus";
  const vat = a.arrearKind === "vat";
  const labels = { spzoo: "Spółka z o.o.", sa: "Spółka akcyjna", psa: "Prosta spółka akcyjna", other: "Inna forma", "": "Nie podano" };
  const answerSummary = [
    { label: "Forma", value: labels[a.companyForm] },
    { label: "Pełnienie funkcji", value: `${a.tenureStart || "brak daty"} — ${a.stillServing ? "nadal" : a.tenureEnd || "brak daty"}` },
    { label: "Zaległość / termin płatności", value: `${a.arrearKind.toUpperCase() || "nie podano"} / ${a.paymentDue || "brak daty"}` },
    ...([
      ["Przypadek szczególny", a.specialCase], ["Egzekucja bezskuteczna", a.enforcementFruitless],
      ["Postępowanie wobec Ciebie", a.proceeding116], ["Wydana decyzja wobec Ciebie", a.decisionIssued],
      ["Terminowa upadłość / restrukturyzacja / układ", a.insolvencyFiled], ["Dowody braku winy", a.noFault],
      ["Wskazane mienie", a.companyAssetsPointed], ["Znajomość decyzji spółki", a.hadCompanyDecision],
      ["Dostęp do akt", a.hadFileAccess],
    ] as const).map(([label, value]) => ({ label, value: YES_NO[value] })),
    ...(!a.stillServing ? [{ label: "Zakończenie funkcji przed wpisem KRS", value: YES_NO[a.resignationBeforeKrs] }] : []),
    ...(a.insolvencyFiled === "yes" ? [{ label: "Data zdarzenia upadłościowego / restrukturyzacyjnego", value: a.insolvencyDate || "Nie podano" }] : []),
    ...(!zusPath ? [{ label: "KKS blisko przedawnienia", value: YES_NO[a.kksNearLimitation] }] : []),
  ];
  const legalBasis = [
    { cite: "art. 116 O.p.", note: "Przesłanki odpowiedzialności i uwolnienia się od niej; zakres podmiotowy i czasowy.", url: OP },
    { cite: "art. 118 § 1–2 O.p.", note: "Odrębne terminy wydania decyzji i przedawnienia zobowiązania z doręczonej decyzji.", url: OP },
  ];
  const base = { assessmentDate: formatIsoLocal(now), answerSummary, legalBasis, zusPath, adjakStrength: (vat ? "hard" : zusPath ? "none" : "analogy") as Art116Result["adjakStrength"] };
  if (a.companyForm === "other") return {
    ...base, signal: "out", title: "Potrzebna jest inna ścieżka analizy",
    summary: "Ten formularz dotyczy członków zarządu spółek kapitałowych. JDG i wspólnicy spółek osobowych mogą odpowiadać na innych podstawach. Ten wynik nie oznacza braku odpowiedzialności.",
    premises: [], defenses: [], nextSteps: ["Ustal właściwą podstawę odpowiedzialności z kancelarią. Licznik dotyczy przedawnienia podatków, nie składek ZUS."],
  };
  if (zusPath) legalBasis.push({ cite: "art. 31 ustawy o systemie ubezpieczeń społecznych", note: "Odpowiednie stosowanie przepisów Ordynacji; terminy składkowe i droga sądowa wymagają odrębnej oceny.", url: "https://eli.gov.pl/eli/DU/1998/887/ogl" });
  else {
    legalBasis.push({ cite: "TSUE 27.02.2025, C-277/24 Adjak", note: "VAT: prawo do podważenia ustaleń i kwalifikacji prawnych oraz dostępu do akt przy ustalaniu odpowiedzialności osoby trzeciej.", url: "https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:62024CJ0277" });
    legalBasis.push({ cite: "TSUE 30.04.2025, C-278/24 Genzyński", note: "VAT: dopuszczalność odpowiedzialności przy realnej możliwości wykazania braku winy; znaczenie terminowego wniosku także przy jednym wierzycielu.", url: "https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:62024CJ0278" });
    legalBasis.push({ cite: "Interpretacja ogólna DTS2.8012.5.2025, 29.08.2025", note: "Wykładnia art. 116 po wyrokach TSUE; nie stanowi automatycznego zwolnienia z odpowiedzialności.", url: MF });
  }
  const premises: Art116Premise[] = [];
  const defenses: Art116Defense[] = [];
  const start = parseIsoDate(a.tenureStart);
  const end = a.stillServing ? now : parseIsoDate(a.tenureEnd);
  const due = parseIsoDate(a.paymentDue);
  const valid = Array.from({ length: 6 }, (_, i) => validateArt116Step(a, i, now)).every(e => !e);
  const covers = !!(start && end && due && isOnOrAfter(due, start) && isOnOrBefore(due, end));
  const ordinary = a.specialCase === "no";
  const outside = valid && ordinary && !covers;
  premises.push({ label: "Okres pełnienia funkcji", status: !valid || !ordinary ? "unclear" : covers ? "met" : "missing", detail: outside ? "Podany termin płatności wypada poza okresem funkcji. Wymaga to potwierdzenia dokumentami." : "Zestawienie dat nie zastępuje badania skuteczności powołania, odwołania lub rezygnacji. Przypadki po likwidacji i zwrotów podatku wymagają odrębnej oceny." });
  premises.push({ label: "Bezskuteczność egzekucji", status: a.enforcementFruitless === "yes" ? "met" : a.enforcementFruitless === "no" ? "missing" : "unclear", detail: "Organ musi wykazać bezskuteczność w całości lub w części. Samo wszczęcie postępowania wobec członka zarządu jej nie zastępuje." });
  if (due && !zusPath && ordinary) {
    const deadline = art118Deadline(due);
    const expired = now > deadline;
    premises.push({ label: "Termin wydania decyzji — art. 118 § 1", status: "unclear", detail: `Dla zwykłej niezapłaconej należności bazowy termin wynosi ${formatIsoLocal(deadline)}. ${expired ? "Minął, ale trzeba sprawdzić, czy decyzję wydano wcześniej." : "Nie minął."} Nie jest to termin wygaśnięcia zobowiązania z już doręczonej decyzji. Zegar spółki z art. 70 bada się osobno.` });
    if (expired) defenses.push({ title: "Sprawdź datę wydania decyzji", body: "Upływ bazowego terminu z art. 118 § 1 nie usuwa odpowiedzialności ustalonej wcześniej. Potrzebne są decyzja i dowód doręczenia; art. 118 § 2 reguluje osobny termin. Sam kalendarz nie daje zielonego wyniku.", strength: "medium" });
  }
  if (outside) defenses.push({ title: "Termin płatności poza okresem funkcji", body: "Zbierz uchwały, skuteczną rezygnację i dowód jej złożenia. Sprawdź, czy nie chodzi o zaległości ze zwrotów podatku albo powstałe po likwidacji spółki.", strength: "strong" });
  if (!a.stillServing && a.resignationBeforeKrs === "yes") defenses.push({ title: "Rzeczywisty koniec funkcji a KRS", body: "Porównaj datę skutecznego zakończenia funkcji z wpisem. Samo oświadczenie bez oceny sposobu jego złożenia nie przesądza skuteczności rezygnacji.", strength: "medium" });
  const hasDefense = a.insolvencyFiled === "yes" || a.companyAssetsPointed === "yes" || a.noFault === "yes";
  if (a.insolvencyFiled === "yes") defenses.push({ title: "Terminowa upadłość, restrukturyzacja lub układ", body: "Należy sprawdzić właściwy czas i dokumenty. Dla upadłości istotne jest zgłoszenie wniosku; dla restrukturyzacji — otwarcie postępowania lub zatwierdzenie układu w postępowaniu o zatwierdzenie układu. Sam wniosek restrukturyzacyjny nie jest tym samym zdarzeniem.", strength: "medium" });
  if (a.noFault === "yes") defenses.push({ title: "Brak winy w niezgłoszeniu upadłości", body: "Zbierz dowody sytuacji finansowej, podjętych działań i obiektywnych przeszkód. Brak winy trzeba wykazać; samo istnienie zaległości VAT nie wyznacza daty niewypłacalności.", strength: "medium" });
  if (a.companyAssetsPointed === "yes") defenses.push({ title: "Mienie umożliwiające realną egzekucję", body: "Wskaż składniki majątku, ich wartość, położenie i obciążenia. Trzeba wykazać możliwość zaspokojenia zaległości w znacznej części.", strength: "medium" });
  premises.push({ label: "Możliwość uwolnienia się od odpowiedzialności", status: "unclear", detail: hasDefense ? "Wskazano podstawę obrony, która wymaga potwierdzenia. Deklaracja w formularzu nie oznacza spełnienia przesłanki." : "Nie potwierdzono podstawy obrony. Odpowiedź „Nie wiem” nie oznacza, że taka podstawa nie istnieje." });
  if (a.hadFileAccess === "no") defenses.push({ title: "Dostęp do akt i prawo do obrony", body: zusPath ? "Wystąp o akta we właściwym trybie ZUS. Wyroki dotyczące VAT nie rozstrzygają automatycznie spraw składkowych." : "Wystąp o potrzebne akta i wskaż konkretne kwestionowane ustalenia oraz dowody. Brak dostępu może uzasadniać zarzut proceduralny, ale sam nie znosi zaległości ani odpowiedzialności.", strength: "medium" });
  if (!zusPath && a.kksNearLimitation === "yes") defenses.push({ title: "Weryfikacja celu i przebiegu KKS", body: "Bliskość przedawnienia jest sygnałem do sprawdzenia akt, nie dowodem instrumentalności. Zbadaj czynności, ich uzasadnienie i prawidłowość zawiadomienia. Nie odejmujemy za to ryzyka odpowiedzialności.", strength: "medium" });
  if (a.decisionIssued === "yes") {
    defenses.unshift({ title: "Masz już decyzję — pilnuj terminu odwołania", body: "Od doręczenia decyzji o odpowiedzialności biegnie zwykle 14 dni na wniesienie odwołania (art. 223 § 2 O.p.). Sprawdź datę doręczenia i pouczenie w samej decyzji — to one wyznaczają termin. Jeśli 14 dni już biegnie, nie zwlekaj; złożenie odwołania nie zależy od wyniku tego formularza. Przy uchybieniu terminu pozostaje wniosek o jego przywrócenie, który wymaga uprawdopodobnienia braku winy.", strength: "strong" });
    legalBasis.push({ cite: "art. 223 § 2 O.p.", note: "Odwołanie od decyzji organu pierwszej instancji wnosi się w terminie 14 dni od dnia jej doręczenia.", url: OP });
  }
  // Decision rules, deliberately no additive score or percentage of winning.
  let signal: Signal = "yellow";
  if (valid && ordinary && !zusPath) {
    if (a.decisionIssued === "yes") signal = "red";
    else if (outside && a.decisionIssued === "no" && a.proceeding116 === "no") signal = "green";
    else if (covers && a.enforcementFruitless === "yes" && !hasDefense && a.insolvencyFiled === "no" && a.noFault === "no" && a.companyAssetsPointed === "no") signal = "red";
  }
  if (a.decisionIssued === "yes") signal = "red";
  const titles = { red: "Potrzebna jest pilna analiza dokumentów", yellow: "Wynik wymaga wyjaśnienia i dowodów", green: "Data przemawia na Twoją korzyść" };
  const summaries = {
    red: "Wskazujesz istniejącą decyzję albo istotne przesłanki odpowiedzialności bez potwierdzonej podstawy obrony. Sprawdź pouczenie i terminy. Czerwony oznacza pilność analizy, a nie przesądzoną utratę majątku.",
    yellow: "Formularz nie pozwala potwierdzić bezpieczeństwa. Niewiadome, zadeklarowane podstawy obrony i przypadki szczególne wymagają akt. Zarzuty proceduralne nie są automatycznym zwolnieniem z odpowiedzialności.",
    green: "W zwykłym przypadku podany termin płatności wypada poza okresem pełnienia funkcji, a według odpowiedzi nie ma postępowania ani decyzji wobec Ciebie. Potwierdź te dane dokumentami. Zielony nie jest gwarancją ani oceną innych podstaw odpowiedzialności.",
  };
  return { ...base, signal, title: titles[signal], summary: summaries[signal], premises, defenses,
    nextSteps: [
      "Sprawdź każde pismo, datę doręczenia i pouczenie. Formularz ani kontakt z kancelarią nie zatrzymują terminów. Nie ignoruj wezwania i nie odkładaj wymaganej odpowiedzi.",
      "Zgromadź dokumenty funkcji, decyzje, deklaracje, akta egzekucji oraz dowody dotyczące niewypłacalności i majątku.",
      zusPath ? "Sprawę składek oceń osobno z uwzględnieniem przepisów ubezpieczeniowych i właściwego sądu." : "Podnieś konkretne zarzuty i wnioski dowodowe możliwie wcześnie. Osobno sprawdź przedawnienie spółki oraz terminy decyzji i zobowiązania osoby trzeciej.",
    ] };
}

export function resultPlainText(result: Art116Result): string {
  return [
    "KANCELARIA SZUWARA · DOM ZA SPÓŁKĘ", `Data analizy: ${result.assessmentDate} · wersja reguł 2026-09-12`,
    `Wynik: ${result.signal.toUpperCase()} — ${result.title}`, result.summary,
    "", "TWOJE ODPOWIEDZI", ...result.answerSummary.map(p => `${p.label}: ${p.value}`),
    "", "PRZESŁANKI", ...result.premises.map(p => `- ${p.label}: ${p.detail}`),
    "", "KIERUNKI OBRONY DO WERYFIKACJI", ...result.defenses.map(d => `- ${d.title}: ${d.body}`),
    "", "CO ZROBIĆ TERAZ", ...result.nextSteps.map((s, i) => `${i + 1}. ${s}`),
    "", "PODSTAWY", ...result.legalBasis.map(l => `- ${l.cite}: ${l.note} ${l.url || ""}`),
    "", "Wstępna kwalifikacja na podstawie odpowiedzi, nie porada prawna. Nie zatrzymuje terminów. Wynik nie określa prawdopodobieństwa wygranej.",
  ].join("\n");
}
