import {
  endOfYear,
  isOnOrAfter,
  isOnOrBefore,
  parseIsoDate,
  startOfDay,
} from "@/lib/dates";

export type CompanyForm = "spzoo" | "sa" | "psa" | "other";
export type ArrearKind = "vat" | "cit" | "pit4" | "zus";
export type YesNoUnknown = "yes" | "no" | "unknown";
export type Signal = "red" | "yellow" | "green" | "out";
export type PremiseStatus = "met" | "missing" | "unclear" | "na";
export type DefenseStrength = "strong" | "medium" | "cite";

export type Art116Answers = {
  companyForm: CompanyForm | "";
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
  score: number;
  premises: Art116Premise[];
  defenses: Art116Defense[];
  legalBasis: { cite: string; note: string }[];
  nextSteps: string[];
  adjakStrength: "hard" | "analogy" | "none";
  zusPath: boolean;
  notApplicableReason?: string;
};

export const emptyArt116Answers = (): Art116Answers => ({
  companyForm: "",
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

const COMPANY_LABEL: Record<Exclude<CompanyForm, "other">, string> = {
  spzoo: "spółka z o.o.",
  sa: "spółka akcyjna",
  psa: "prosta spółka akcyjna",
};

function fiveYearArt116Deadline(paymentDue: Date): Date {
  return endOfYear(paymentDue.getFullYear() + 5);
}

export function diagnoseArt116(
  answers: Art116Answers,
  today = new Date(),
): Art116Result {
  const now = startOfDay(today);

  if (answers.companyForm === "other") {
    return {
      signal: "out",
      title: "Art. 116 raczej Cię nie dotyczy",
      summary:
        "Odpowiedzialność z art. 116 Ordynacji podatkowej obejmuje członków zarządu spółek kapitałowych (z o.o., S.A., PSA). Przy JDG, spółce cywilnej albo osobowej ten przepis nie jest właściwą podstawą. Urząd może iść inną drogą — ale nie tą.",
      score: 0,
      premises: [],
      defenses: [],
      legalBasis: [
        {
          cite: "art. 116 § 1 O.p.",
          note: "Krąg podmiotów: członkowie zarządu spółek kapitałowych.",
        },
      ],
      nextSteps: [
        "Sprawdź Licznik Fiskusa — ile dni zostało urzędowi na stary VAT albo PIT.",
        "Jeśli masz wezwanie jako wspólnik spółki osobowej, to inna ścieżka (art. 115 O.p.).",
      ],
      adjakStrength: "none",
      zusPath: false,
      notApplicableReason: "Brak spółki kapitałowej",
    };
  }

  const premises: Art116Premise[] = [];
  const defenses: Art116Defense[] = [];
  const legalBasis: { cite: string; note: string }[] = [
    {
      cite: "art. 116 § 1–5 O.p.",
      note: "Odpowiedzialność subsydiarna i solidarna członka zarządu za zaległości spółki.",
    },
    {
      cite: "TSUE 27.02.2025, C-277/24 Adjak",
      note: "Prawo do obrony: można kwestionować ustalenia z decyzji wobec spółki.",
    },
    {
      cite: "TSUE 30.04.2025, C-278/24 Genzyński",
      note: "Domniemanie winy do obalenia; sama zaległość VAT nie oznacza obowiązku upadłości.",
    },
    {
      cite: "interpretacja ogólna MF 29.08.2025, DTS2.8012.5.2025",
      note: "Organ nie może automatycznie przekleić decyzji spółki na człowieka.",
    },
  ];

  let score = 48;
  const form = answers.companyForm as Exclude<CompanyForm, "other" | "">;
  const zusPath = answers.arrearKind === "zus";
  const vatPath = answers.arrearKind === "vat";
  const adjakStrength: Art116Result["adjakStrength"] = vatPath
    ? "hard"
    : answers.arrearKind
      ? "analogy"
      : "none";

  if (zusPath) {
    legalBasis.push({
      cite: "art. 31 ustawy o systemie ubezpieczeń społecznych",
      note: "ZUS idzie własną ścieżką. Analogia do Adjak jest słabsza niż przy VAT.",
    });
  }

  premises.push({
    label: "Spółka kapitałowa",
    status: form ? "met" : "unclear",
    detail: form
      ? `Pełniłeś funkcję w ${COMPANY_LABEL[form]}.`
      : "Nie wskazano formy spółki.",
  });

  const tenureStart = parseIsoDate(answers.tenureStart);
  const tenureEnd = answers.stillServing
    ? now
    : parseIsoDate(answers.tenureEnd);
  const paymentDue = parseIsoDate(answers.paymentDue);

  let tenureCovers = false;
  if (tenureStart && tenureEnd && paymentDue) {
    tenureCovers =
      isOnOrAfter(paymentDue, tenureStart) &&
      isOnOrBefore(paymentDue, tenureEnd);
    premises.push({
      label: "Kadencja na dzień wymagalności",
      status: tenureCovers ? "met" : "missing",
      detail: tenureCovers
        ? "Termin płatności przypada w okresie, który podałeś jako kadencję."
        : "Termin płatności wypada poza podaną kadencją — art. 116 § 2 wiąże odpowiedzialność z tym okresem.",
    });
    if (tenureCovers) score += 18;
    else {
      score -= 38;
      defenses.push({
        title: "Zaległość poza kadencją",
        body: "Art. 116 § 2 wiąże odpowiedzialność z czasem pełnienia obowiązków i z terminami płatności przypadającymi w tym czasie. Jeśli rezygnacja była skuteczna wcześniej niż wykreślenie z KRS, liczy się rzeczywistość, nie sam odpis.",
        strength: "strong",
      });
    }
  } else {
    premises.push({
      label: "Kadencja na dzień wymagalności",
      status: "unclear",
      detail: "Brakuje dat kadencji albo terminu płatności.",
    });
  }

  if (answers.resignationBeforeKrs === "yes") {
    defenses.push({
      title: "Rezygnacja wcześniej niż KRS",
      body: "Wpis w KRS jest deklaratoryjny. W sporze liczy się rzeczywisty okres pełnienia funkcji — oświadczenie o rezygnacji, protokół, odwołanie. Sam późniejszy odpis nie przesądza kadencji.",
      strength: "medium",
    });
    score -= 6;
  }

  if (paymentDue) {
    const art116Deadline = fiveYearArt116Deadline(paymentDue);
    const expired = isOnOrAfter(now, new Date(art116Deadline.getTime() + 86_400_000));
    premises.push({
      label: "Pięcioletni termin z art. 116 § 5",
      status: expired ? "missing" : "met",
      detail: expired
        ? `Od końca ${paymentDue.getFullYear()} r. minęło 5 lat. Co do zasady nie można już orzec odpowiedzialności członka zarządu.`
        : `Zaległość powstała w ${paymentDue.getFullYear()} r. Termin na orzeczenie odpowiedzialności biegnie do ${art116Deadline.getFullYear()}-12-31 — o ile nic go nie wydłużyło.`,
    });
    if (expired) {
      score -= 40;
      defenses.push({
        title: "Upłynął termin z art. 116 § 5",
        body: "Nie można orzec o odpowiedzialności członka zarządu, jeżeli od końca roku kalendarzowego, w którym powstała zaległość, upłynęło 5 lat. To osobny zegar od przedawnienia zobowiązania spółki.",
        strength: "strong",
      });
    }
  }

  const enforcementYes = answers.enforcementFruitless === "yes";
  const proceedingYes = answers.proceeding116 === "yes";
  const premiseTriggered = enforcementYes || proceedingYes;

  if (enforcementYes) {
    premises.push({
      label: "Bezskuteczność egzekucji ze spółki",
      status: "met",
      detail: "To klasyczna przesłanka subsydiarności — urząd może iść po majątek osoby trzeciej.",
    });
    score += 16;
  } else if (answers.enforcementFruitless === "no") {
    premises.push({
      label: "Bezskuteczność egzekucji ze spółki",
      status: "missing",
      detail: "Dopóki egzekucja ze spółki nie jest bezskuteczna, art. 116 zwykle jeszcze nie startuje.",
    });
    score -= 14;
  } else {
    premises.push({
      label: "Bezskuteczność egzekucji ze spółki",
      status: "unclear",
      detail: "Nie wiadomo, czy egzekucja ze spółki padła.",
    });
  }

  if (proceedingYes) {
    premises.push({
      label: "Postępowanie z art. 116",
      status: "met",
      detail: "Sprawa już idzie po Ciebie osobiście. Nie czekaj na decyzję z klauzulą natychmiastowej wykonalności.",
    });
    score += 10;
  }

  if (!premiseTriggered && answers.enforcementFruitless === "no") {
    defenses.push({
      title: "Przesłanki jeszcze nie dojrzały",
      body: "Odpowiedzialność jest subsydiarna. Samo istnienie zaległości spółki nie wystarczy. Ryzyko jednak rośnie, gdy egzekucja ze spółki stoi w miejscu.",
      strength: "medium",
    });
  }

  if (answers.insolvencyFiled === "yes") {
    score -= 32;
    defenses.push({
      title: "Wniosek o upadłość albo restrukturyzacja",
      body: "Złożenie wniosku we właściwym czasie — a nie jego skuteczność — zwalnia z odpowiedzialności. TSUE w sprawie Genzyński i interpretacja MF potwierdzają: nawet jeden wierzyciel nie zamyka tej furtki, jeśli przesłanki upadłości były.",
      strength: "strong",
    });
    premises.push({
      label: "Egzoneracja: upadłość / restrukturyzacja",
      status: "met",
      detail: answers.insolvencyDate
        ? `Wskazano datę wniosku: ${answers.insolvencyDate}. Kancelaria sprawdzi, czy to był „właściwy czas”.`
        : "Złożono wniosek. Trzeba zestawić datę z niewypłacalnością, nie z datą decyzji.",
    });
  } else if (answers.insolvencyFiled === "no") {
    premises.push({
      label: "Egzoneracja: upadłość / restrukturyzacja",
      status: "missing",
      detail: "Brak wniosku nie kończy sprawy — po Genzyńskim urząd musi badać winę, a nie zakładać ją z samego VAT.",
    });
    if (vatPath) {
      defenses.push({
        title: "Sama zaległość VAT to nie upadłość",
        body: "Wyrok C-278/24 (Genzyński): powstanie zaległości, zwłaszcza w VAT, nie oznacza automatycznie obowiązku złożenia wniosku o upadłość. Domniemanie winy da się obalić.",
        strength: "medium",
      });
      score -= 10;
    }
  }

  if (answers.companyAssetsPointed === "yes") {
    score -= 16;
    defenses.push({
      title: "Wskazanie mienia spółki",
      body: "Można uwolnić się, wskazując konkretne, istniejące i nadające się do egzekucji mienie spółki, z którego da się zaspokoić zaległość w znacznej części. Ogólnik „spółka coś ma” nie wystarczy.",
      strength: "medium",
    });
  }

  if (answers.hadFileAccess === "no") {
    score -= 18;
    defenses.push({
      title:
        adjakStrength === "hard"
          ? "Brak prawa do obrony (Adjak — twardy, VAT)"
          : "Brak prawa do obrony (analogia z interpretacji MF)",
      body:
        adjakStrength === "hard"
          ? "TSUE w sprawie Adjak: członek zarządu musi móc kwestionować ustalenia faktyczne i prawne z postępowania wobec spółki oraz mieć dostęp do akt w zakresie potrzebnym do obrony. Automatyczne przeniesienie decyzji spółki na Ciebie jest wadliwe."
          : "TSUE orzekał na gruncie VAT. Minister Finansów w interpretacji z 29.08.2025 r. rozciągnął tę wykładnię na cały art. 116. Przy CIT, PIT-4 albo ZUS to analogia — silna, ale do argumentacji, nie do cytowania sentencji 1:1.",
      strength: adjakStrength === "hard" ? "strong" : "medium",
    });
  } else if (
    answers.hadCompanyDecision === "yes" &&
    answers.hadFileAccess === "yes"
  ) {
    defenses.push({
      title: "Akt były, ale ustalenia spółki nie są automatyczne",
      body: "Nawet przy wglądzie do akt organ nie może poprzestać na przeklejeniu sentencji. Po interpretacji MF potrzebna jest zindywidualizowana ocena Twojej sytuacji.",
      strength: "cite",
    });
    score -= 4;
  }

  if (answers.kksNearLimitation === "yes") {
    defenses.push({
      title: "KKS tuż przed przedawnieniem",
      body: "Instrumentalne wszczęcie postępowania karnoskarbowego nie zawiesza przedawnienia zobowiązania spółki (uchwała NSA I FPS 1/21, wyrok I FSK 379/22 z 21.03.2025). Jeśli zegar spółki stanął sztucznie, spada też presja na art. 116.",
      strength: "medium",
    });
    score -= 8;
  }

  if (zusPath) {
    defenses.push({
      title: "Ścieżka ZUS nie jest kopią VAT",
      body: "Składki idą art. 31 u.s.u.s. Mechanika podobna, sentencje Adjak i Genzyński nie przenoszą się automatycznie. Semafor zostaje ostrożniejszy.",
      strength: "cite",
    });
    score += 6;
  }

  score = Math.max(0, Math.min(100, score));

  let signal: Signal;
  if (score >= 62) signal = "red";
  else if (score >= 28) signal = "yellow";
  else signal = "green";

  const titles: Record<Exclude<Signal, "out">, string> = {
    red: "Ryzyko sięgnięcia po Twój majątek jest realne",
    yellow: "Są furtki — nie podpisuj ugody w ciemno",
    green: "Przesłanki art. 116 wyglądają słabo",
  };

  const summaries: Record<Exclude<Signal, "out">, string> = {
    red: "Z tego, co podałeś, urząd ma z czego zbudować decyzję na Ciebie: kadencja, zaległość, bezskuteczność albo już otwarte postępowanie. To nie wyrok. To sygnał, żeby nie iść na żywioł i nie składać wyjaśnień bez akt.",
    yellow:
      "Nie wszystko układa się po myśli urzędu. Po wyrokach Adjak i Genzyński oraz interpretacji MF z sierpnia 2025 r. odpowiedzialność nie może być automatyczna. Lista zarzutów poniżej nadaje się na szkielet pisma — nie na gotową opinię.",
    green:
      "Albo kadencja nie pokrywa wymagalności, albo minął termin z art. 116 § 5, albo masz silną egzonerację (wniosek upadłościowy). Urząd i tak może próbować. Diagnostyka mówi: punkt wyjścia jest po Twojej stronie.",
  };

  const nextSteps =
    signal === "red"
      ? [
          "Nie składaj wyjaśnień ani nie podpisuj rozłożenia na raty bez wglądu do akt spółki.",
          "Jeśli postępowanie z art. 116 już trwa — zarzuty co do ustaleń spółki podnieś teraz, przed organem. NSA (III FSK 605/24): milczenie na tym etapie zamyka Adjak później.",
          "Zleć analizę decyzji wobec spółki i Twojej kadencji (rezygnacja vs KRS).",
        ]
      : signal === "yellow"
        ? [
            "Spisz zarzuty z wyniku i dołącz dokumenty kadencji oraz ewentualnego wniosku upadłościowego.",
            "Wystąp o dostęp do akt postępowania wobec spółki — to trzon Adjak.",
            "Zarzuty podnieś już przed organem. NSA (III FSK 605/24): później Adjak nie ratuje milczenia.",
          ]
        : [
            "Zachowaj dowody końca kadencji i dat wymagalności.",
            "Jeśli pismo z urzędu i tak przyjdzie — nie ignoruj fikcji doręczenia.",
            "Przy JDG albo starym VAT przejdź do Licznika Fiskusa.",
          ];

  return {
    signal,
    title: titles[signal],
    summary: summaries[signal],
    score,
    premises,
    defenses,
    legalBasis,
    nextSteps,
    adjakStrength,
    zusPath,
  };
}

export function resultPlainText(result: Art116Result): string {
  const lines = [
    `Dom za spółkę — ${result.title}`,
    result.summary,
    "",
    "Przesłanki:",
    ...result.premises.map((p) => `- [${p.status}] ${p.label}: ${p.detail}`),
    "",
    "Zarzuty do pisma:",
    ...result.defenses.map((d) => `- ${d.title}: ${d.body}`),
    "",
    "Podstawy:",
    ...result.legalBasis.map((l) => `- ${l.cite} — ${l.note}`),
    "",
    "To diagnostyka, nie porada prawna.",
  ];
  return lines.join("\n");
}
