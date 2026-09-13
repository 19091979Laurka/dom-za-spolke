"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChoiceCard } from "@/components/choice-card";
import { Disclaimer } from "@/components/disclaimer";
import { ReportActions } from "@/components/report-actions";
import { LeadCta } from "@/components/lead-cta";
import { PrintReport } from "@/components/print-report";
import { LegalList, Semafor } from "@/components/result-panel";
import { formatPl } from "@/lib/dates";
import {
  diagnoseLimitation,
  emptyLicznikInput,
  licznikPlainText,
  suggestPaymentDue,
  type LicznikInput,
  type TaxKind,
} from "@/lib/przedawnienie";

export function LicznikForm() {
  const [input, setInput] = useState<LicznikInput>(emptyLicznikInput);
  const [error, setError] = useState("");
  const [resultState, setResultState] = useState<ReturnType<typeof diagnoseLimitation> | null>(
    null,
  );

  function patch(partial: Partial<LicznikInput>) {
    setInput((prev) => {
      const next = { ...prev, ...partial };
      if (
        partial.taxKind !== undefined ||
        partial.year !== undefined ||
        partial.month !== undefined ||
        partial.quarter !== undefined
      ) {
        next.paymentDue = suggestPaymentDue(next);
      }
      return next;
    });
    setError("");
    setResultState(null);
  }

  const empty = !input.taxKind;

  function submit() {
    const diagnosed = diagnoseLimitation(input);
    if ("error" in diagnosed) {
      setError(diagnosed.error);
      setResultState(null);
      return;
    }
    setResultState(diagnosed);
  }

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => String(current - i));
  }, []);

  const result = resultState && !("error" in resultState) ? resultState : null;

  return (
    <div className="timer-shell space-y-6">
      {empty && !result ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-5 py-8 text-center">
          <p className="text-2xl font-bold">Wybierz podatek</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Dla VAT 2021 (I–XI) bazowy koniec to zwykle 31 grudnia 2026 — urzędy już liczą dni.
          </p>
        </div>
      ) : null}

      <div className="grid gap-2">
        <p className="text-sm font-semibold">Jaki podatek?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ChoiceCard
            selected={input.taxKind === "vat-m"}
            title="VAT miesięczny"
            hint="I–XI 2021 → 31.12.2026; grudzień 2021 → 31.12.2027."
            onClick={() => patch({ taxKind: "vat-m" as TaxKind })}
          />
          <ChoiceCard
            selected={input.taxKind === "vat-q"}
            title="VAT kwartalny"
            hint="Q4 2021 płatny w styczniu 2022 — rok później."
            onClick={() => patch({ taxKind: "vat-q" as TaxKind })}
          />
          <ChoiceCard
            selected={input.taxKind === "pit"}
            title="PIT roczny"
            hint="Standardowy PIT roczny; terminy szczególne potwierdź w dokumentach."
            onClick={() => patch({ taxKind: "pit" as TaxKind })}
          />
          <ChoiceCard
            selected={input.taxKind === "cit"}
            title="CIT roczny"
            onClick={() => patch({ taxKind: "cit" as TaxKind })}
          />
        </div>
      </div>

      {input.taxKind ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Rok" htmlFor="year">
            <select
              id="year"
              className={selectClass}
              value={input.year}
              onChange={(e) => patch({ year: e.target.value })}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </Field>
          {input.taxKind === "vat-m" ? (
            <Field label="Miesiąc" htmlFor="month">
              <select
                id="month"
                className={selectClass}
                value={input.month}
                onChange={(e) => patch({ month: e.target.value })}
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(
                  (month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ),
                )}
              </select>
            </Field>
          ) : null}
          {input.taxKind === "vat-q" ? (
            <Field label="Kwartał" htmlFor="quarter">
              <select
                id="quarter"
                className={selectClass}
                value={input.quarter}
                onChange={(e) => patch({ quarter: e.target.value })}
              >
                {["1", "2", "3", "4"].map((q) => (
                  <option key={q} value={q}>
                    Q{q}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          <Field label={input.taxKind === "cit" ? "Rzeczywisty termin CIT (wpisz)" : "Termin płatności (sprawdź)"} htmlFor="due">
            <Input
              id="due"
              className="h-11"
              type="date"
              value={input.paymentDue}
              onChange={(e) => patch({ paymentDue: e.target.value })}
            />
          </Field>
        </div>
      ) : null}

      {input.taxKind ? <p className="text-sm text-muted-foreground">{input.taxKind === "cit" ? "CIT nie ma jednego terminu dla każdego roku i podatnika. Standardowo to koniec trzeciego miesiąca po roku podatkowym, ale były przedłużenia (np. za 2021). Wpisz właściwą datę. Licznik nie obejmuje CIT estońskiego." : "Podpowiedź uwzględnia weekendy i święta, ale nie indywidualne ulgi ani szczególne przedłużenia. Dla starszego PIT-28 sprawdź odmienny termin."}</p> : null}
      {input.taxKind ? (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold">Co mogło zatrzymać zegar?</legend>
          <Check id="bankruptcy" checked={input.bankruptcy} onChange={(bankruptcy) => patch({ bankruptcy })} label="Ogłoszenie upadłości" />
          <Check id="other-events" checked={input.otherEvents} onChange={(otherEvents) => patch({ otherEvents })} label="Nie wiem / inne zdarzenia lub przepisy szczególne" />
          <Check
            id="enforcement"
            checked={input.enforcement}
            onChange={(enforcement) => patch({ enforcement })}
            label="Środek egzekucyjny, o którym mnie zawiadomiono"
          />
          <Check
            id="mortgage"
            checked={input.mortgage}
            onChange={(mortgage) => patch({ mortgage })}
            label="Hipoteka przymusowa albo zastaw skarbowy"
          />
          <Check
            id="installments"
            checked={input.installments}
            onChange={(installments) => patch({ installments })}
            label="Raty albo odroczenie"
          />
          <Check
            id="court"
            checked={input.courtComplaint}
            onChange={(courtComplaint) => patch({ courtComplaint })}
            label="Skarga do WSA / NSA"
          />
          <Check
            id="kks"
            checked={input.kks70c}
            onChange={(kks70c) => patch({ kks70c })}
            label="Zawiadomienie art. 70c — sprawa karnoskarbowa"
          />
          {input.kks70c ? (
            <Field label="Data wszczęcia KKS (jeśli znasz)" htmlFor="kks-date">
              <Input
                id="kks-date"
                className="h-11"
                type="date"
                value={input.kksDate}
                onChange={(e) => patch({ kksDate: e.target.value })}
              />
            </Field>
          ) : null}
        </fieldset>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="brand-button brand-button-cta"
        onClick={submit}
        disabled={!input.taxKind}
      >
        Policz dni fiskusowi <span>→</span>
      </button>

      {result ? (
        <div id="wynik-do-druku" className="report-page space-y-6">
          <PrintReport compact kind="TERMIN PRZEDAWNIENIA" date={formatPl(new Date())} title={result.title} summary={result.summary} signal={result.signal}
            steps={result.nextSteps} sources={result.legalBasis}
            stats={[{label:"Termin płatności",value:formatPl(result.paymentDue)},{label:"Bazowy koniec 5 lat",value:formatPl(result.baseEnd)}]}
            answers={[{label:"Okres podatkowy",value:result.periodLabel},{label:"Termin płatności",value:formatPl(result.paymentDue)},{label:"Zaznaczone zdarzenia",value:result.suspensions.length ? result.suspensions.join("; ") : "Nie zaznaczono"}]}
            note={result.instrumentalRisk ? "KKS w ostatnich 90 dniach przed terminem bazowym: sprawdź akta. To umowny próg diagnostyczny, nie dowód instrumentalności ani automatyczny brak zawieszenia." : undefined}
            groups={[{title:"Zdarzenia wpływające na termin",items:result.suspensions.length ? result.suspensions.map((body,i)=>({title:`Zdarzenie ${i+1}`,body})) : [{title:"Brak zaznaczonych zdarzeń",body:"Pokazujemy datę bazową. Brak zaznaczeń nie dowodzi braku zdarzeń; katalog w formularzu nie jest pełny."}]}]} />
          <Semafor signal={result.signal} title={result.title} summary={result.summary} />
        <ReportActions text={licznikPlainText(result)} />
          <dl className="grid gap-3 sm:grid-cols-3">
            <Stat label="Termin płatności" value={formatPl(result.paymentDue)} />
            <Stat label="Bazowy koniec 5 lat" value={formatPl(result.baseEnd)} />
            <Stat
              label="Dni"
              value={
                result.expired ? `${Math.abs(result.daysLeft)} po terminie` : String(result.daysLeft)
              }
            />
          </dl>
          {result.instrumentalRisk ? (
            <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              KKS w ostatnich 90 dniach przed terminem bazowym: sprawdź akta. To umowny próg diagnostyczny, nie dowód instrumentalności ani automatyczny brak zawieszenia.
            </p>
          ) : null}
          <LegalList
            heading="Zdarzenia, które mogły ruszyć zegar"
            items={
              result.suspensions.length
                ? result.suspensions.map((body, i) => ({
                    title: `Zdarzenie ${i + 1}`,
                    body,
                  }))
                : [
                    {
                      title: "Brak zaznaczonych zawieszeń",
                      body: "Pokazujemy datę bazową. Brak zaznaczeń nie dowodzi braku zdarzeń; katalog w formularzu nie jest pełny.",
                    },
                  ]
            }
          />
          <LegalList
            heading="Co zrobić"
            items={result.nextSteps.map((body, i) => ({
              title: `Krok ${i + 1}`,
              body,
            }))}
          />
          <section>
            <h3 className="text-xl font-bold">Podstawy</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {result.legalBasis.map((item) => (
                <li key={item.cite}>
                  <a className="font-semibold text-foreground underline" href={item.url} target="_blank" rel="noreferrer">{item.cite} ↗</a>
                  {" — "}
                  {item.note}
                </li>
              ))}
            </ul>
          </section>
          <Disclaimer />
          <LeadCta
            source="licznik"
            subject={`Licznik Fiskusa — ${result.periodLabel}`}
            resultText={licznikPlainText(result)}
          />
        </div>
      ) : null}
    </div>
  );
}

const selectClass =
  "h-11 w-full rounded-lg border border-input bg-card px-2.5 text-sm";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function Check({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-muted-foreground">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => onChange(value === true)} />
      <span>{label}</span>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <dt className="text-xs font-semibold tracking-wide text-primary uppercase">{label}</dt>
      <dd className="mt-1 text-xl font-bold">{value}</dd>
    </div>
  );
}
