"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChoiceCard } from "@/components/choice-card";
import { Disclaimer } from "@/components/disclaimer";
import { ReportActions } from "@/components/report-actions";
import { LeadCta } from "@/components/lead-cta";
import { PrintReport } from "@/components/print-report";
import { LegalList, Semafor } from "@/components/result-panel";
import {
  diagnoseArt116,
  validateArt116Step,
  emptyArt116Answers,
  resultPlainText,
  type Art116Answers,
  type YesNoUnknown,
} from "@/lib/art116";

const STEPS = [
  "Spółka",
  "Funkcja",
  "Zaległość",
  "Egzekucja",
  "Upadłość",
  "Obrona",
] as const;

export function Art116Wizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Art116Answers>(emptyArt116Answers);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    region.current?.focus({ preventScroll: true });
    region.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [step, done]);

  const result = useMemo(
    () => (done ? diagnoseArt116(answers) : null),
    [done, answers],
  );

  function patch(partial: Partial<Art116Answers>) {
    setAnswers((prev) => ({ ...prev, ...partial }));
    setError("");
  }


  function next() {
    const message = validateArt116Step(answers, step);
    if (message) {
      setError(message);
      return;
    }
    if (answers.companyForm === "other") {
      setDone(true);
      return;
    }
    if (step === STEPS.length - 1) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    setError("");
    if (done) {
      setDone(false);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setAnswers(emptyArt116Answers());
    setStep(0);
    setDone(false);
    setError("");
  }

  if (done && result) {
    return (
      <div ref={region} tabIndex={-1} id="wynik-do-druku" className="report-page space-y-6" aria-label="Raport diagnostyczny">
        <PrintReport kind="ODPOWIEDZIALNOŚĆ ZARZĄDU" date={result.assessmentDate} title={result.title} summary={result.summary} signal={result.signal}
          steps={result.nextSteps} sources={result.legalBasis} answers={result.answerSummary}
          note={result.zusPath ? "ZUS wymaga odrębnej oceny. Nie stosujemy automatycznie zegara podatkowego ani wyroków dotyczących VAT." : result.adjakStrength === "analogy" ? "Sentencje TSUE zapadły w sprawach VAT. Interpretacja ogólna MF (29.08.2025) nakazuje stosować tę samą wykładnię art. 116 do CIT i należności płatnika (art. 14k § 2 O.p.); zakres odnieś do swojej sprawy." : undefined}
          groups={result.signal === "out" ? [] : [{title:"Przesłanki odpowiedzialności",items:result.premises.map(x=>({title:x.label,body:x.detail,meta:statusLabel(x.status)}))},{title:"Kierunki obrony do sprawdzenia",items:result.defenses.map(x=>({title:x.title,body:x.body,meta:x.strength === "strong" ? "potwierdź dokumentami" : x.strength === "medium" ? "do weryfikacji" : "kontekst"}))}]} />
        <div className="report-heading"><p className="brand-eyebrow-plain">Kancelaria Szuwara · Raport diagnostyczny</p><p>Data: {result.assessmentDate} · reguły 12.09.2026</p></div>
        <Semafor signal={result.signal} title={result.title} summary={result.summary} />
        <ReportActions text={resultPlainText(result)} />
        {result.zusPath ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            ZUS wymaga odrębnej oceny. Nie stosujemy tu automatycznie zegara podatkowego ani wyroków dotyczących VAT.
          </p>
        ) : result.adjakStrength === "analogy" ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Sentencje TSUE zapadły w sprawach VAT. Interpretacja ogólna MF (29.08.2025) nakazuje organom stosować tę samą wykładnię art. 116 do CIT i należności płatnika (art. 14k § 2 O.p.). Zakres argumentacji odnieś do swojej sprawy.
          </p>
        ) : null}

        {result.signal !== "out" ? (
          <>
            <LegalList
              heading="Przesłanki"
              items={result.premises.map((p) => ({
                title: p.label,
                body: p.detail,
                meta: statusLabel(p.status),
              }))}
            />
            <LegalList
              heading="Kierunki obrony do sprawdzenia"
              items={result.defenses.map((d) => ({
                title: d.title,
                body: d.body,
                meta: d.strength === "strong" ? "potwierdź dokumentami" : d.strength === "medium" ? "do weryfikacji" : "kontekst",
              }))}
            />
            <LegalList
              heading="Co zrobić teraz"
              items={result.nextSteps.map((stepText, i) => ({
                title: `Krok ${i + 1}`,
                body: stepText,
              }))}
            />
            <section>
              <h3 className="text-xl font-bold">Podstawy</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {result.legalBasis.map((item) => (
                  <li key={item.cite}>
                    <a className="font-semibold text-foreground underline underline-offset-4" href={item.url} target="_blank" rel="noreferrer">{item.cite} ↗</a>
                    {" — "}
                    {item.note}
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Przejdź do{" "}
            <Link href="/licznik" className="font-semibold text-primary underline">
              Licznika Fiskusa
            </Link>{" "}
            albo wróć i popraw formę spółki.
          </p>
        )}

        <details className="report-answers" open><summary>Twoje odpowiedzi — sprawdź dane wejściowe</summary><dl>{result.answerSummary.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></details>
        <Disclaimer />
        <LeadCta
          source="diagnostyk"
          subject={`Dom za spółkę — ${result.title}`}
          resultText={resultPlainText(result)}
        />
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" onClick={back}>
            Popraw odpowiedzi
          </Button>
          <Button variant="ghost" onClick={reset}>
            Zacznij od nowa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={region} tabIndex={-1} className="wizard-shell space-y-6" aria-label={`Krok ${step + 1}: ${STEPS[step]}`}>
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide text-primary uppercase">
          <span>
            Krok {step + 1} / {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <Progress aria-label="Postęp formularza" value={((step + 1) / STEPS.length) * 100} />
        <ol className="wizard-steps" aria-label="Etapy">{STEPS.map((label, i) => <li key={label} data-active={i === step} data-complete={i < step}><span>{i < step ? "✓" : String(i + 1).padStart(2, "0")}</span>{label}</li>)}</ol>
      </div>

      {step === 0 ? (
        <Step title="W jakiej spółce pełnisz lub pełniłeś funkcję?">
          <ChoiceCard
            selected={answers.companyForm === "spzoo"}
            title="Spółka z o.o."
            hint="Najczęstszy scenariusz art. 116."
            onClick={() => patch({ companyForm: "spzoo" })}
          />
          <ChoiceCard
            selected={answers.companyForm === "sa"}
            title="Spółka akcyjna"
            onClick={() => patch({ companyForm: "sa" })}
          />
          <ChoiceCard
            selected={answers.companyForm === "psa"}
            title="Prosta spółka akcyjna"
            onClick={() => patch({ companyForm: "psa" })}
          />
          <ChoiceCard
            selected={answers.companyForm === "other"}
            title="JDG, cywilna, jawna, komandytowa…"
            hint="Art. 116 raczej nie. Pokażemy wyjście do Licznika Fiskusa."
            onClick={() => patch({ companyForm: "other" })}
          />
        </Step>
      ) : null}

      {step === 1 ? (
        <Step title="Kiedy naprawdę pełniłeś funkcję?">
          <p className="text-sm text-muted-foreground">
            Liczy się rzeczywistość, nie sam odpis KRS. Art. 116 § 2 wiąże odpowiedzialność z
            terminem płatności przypadającym w czasie pełnienia obowiązków (mandatu).
          </p>
          <Field label="Początek pełnienia funkcji" htmlFor="tenure-start">
            <Input
              id="tenure-start"
              className="h-11"
              type="date"
              value={answers.tenureStart}
              onChange={(e) => patch({ tenureStart: e.target.value })}
            />
          </Field>
          <ChoiceCard
            selected={answers.stillServing}
            title="Nadal jestem w zarządzie"
            onClick={() => patch({ stillServing: true, tenureEnd: "", resignationBeforeKrs: "" })}
          />
          <ChoiceCard
            selected={!answers.stillServing}
            title="Już nie pełnię funkcji"
            onClick={() => patch({ stillServing: false })}
          />
          {!answers.stillServing ? (
            <Field label="Koniec pełnienia funkcji (rezygnacja, odwołanie, wygaśnięcie mandatu)" htmlFor="tenure-end">
              <Input
                id="tenure-end"
                className="h-11"
                type="date"
                value={answers.tenureEnd}
                onChange={(e) => patch({ tenureEnd: e.target.value })}
              />
            </Field>
          ) : null}
          {!answers.stillServing ? <YesNo
            label="Czy złożyłeś rezygnację albo zostałeś odwołany wcześniej, niż wykreślono Cię z KRS?"
            value={answers.resignationBeforeKrs}
            onChange={(value) => patch({ resignationBeforeKrs: value })}
          /> : null}
        </Step>
      ) : null}

      {step === 2 ? (
        <Step title="Jaka zaległość i kiedy była płatna?">
          <ChoiceCard
            selected={answers.arrearKind === "vat"}
            title="VAT"
            hint="Wyroki TSUE dotyczą właśnie zaległości VAT."
            onClick={() => patch({ arrearKind: "vat" })}
          />
          <ChoiceCard
            selected={answers.arrearKind === "cit"}
            title="CIT"
            hint="Wyroki TSUE dotyczą VAT; interpretację ogólną MF stosuje się do każdego podatku."
            onClick={() => patch({ arrearKind: "cit" })}
          />
          <ChoiceCard
            selected={answers.arrearKind === "pit4"}
            title="Zaliczki PIT za pracowników (płatnik)"
            onClick={() => patch({ arrearKind: "pit4" })}
          />
          <ChoiceCard
            selected={answers.arrearKind === "zus"}
            title="Składki ZUS"
            hint="Osobna ustawa. Wymaga odrębnej oceny składkowej."
            onClick={() => patch({ arrearKind: "zus" })}
          />
          <YesNo label="Czy sprawa dotyczy zwrotu / nadpłaty do oddania, zaległości po likwidacji spółki lub funkcji innej niż członek zarządu (np. likwidator, dyrektor PSA)?" value={answers.specialCase} onChange={(value) => patch({ specialCase: value })} />
          <Field label="Termin płatności tej zaległości" htmlFor="payment-due">
            <Input
              id="payment-due"
              className="h-11"
              type="date"
              value={answers.paymentDue}
              onChange={(e) => patch({ paymentDue: e.target.value })}
            />
          </Field>
        </Step>
      ) : null}

      {step === 3 ? (
        <Step title="Czy urząd już idzie po spółkę — i po Ciebie?">
          <YesNo
            label="Czy egzekucja z majątku spółki (urząd skarbowy lub komornik) okazała się bezskuteczna?"
            value={answers.enforcementFruitless}
            onChange={(value) => patch({ enforcementFruitless: value })}
          />
          <YesNo
            label="Czy wszczęto postępowanie dotyczące Twojej osobistej odpowiedzialności?"
            value={answers.proceeding116}
            onChange={(value) => patch({ proceeding116: value })}
          />
          <YesNo label="Czy wydano już decyzję o Twojej odpowiedzialności?" value={answers.decisionIssued} onChange={(value) => patch({ decisionIssued: value })} />
        </Step>
      ) : null}

      {step === 4 ? (
        <Step title="Furtki ustawowe: upadłość i mienie">
          <YesNo
            label="Czy we właściwym czasie zgłoszono upadłość, otwarto restrukturyzację lub zatwierdzono układ w postępowaniu o zatwierdzenie układu?"
            value={answers.insolvencyFiled}
            onChange={(value) => patch({ insolvencyFiled: value, insolvencyDate: value === "yes" ? answers.insolvencyDate : "" })}
          />
          {answers.insolvencyFiled === "yes" ? (
            <Field label="Data właściwego zdarzenia (jeśli pamiętasz)" htmlFor="insolvency-date">
              <Input
                id="insolvency-date"
                className="h-11"
                type="date"
                value={answers.insolvencyDate}
                onChange={(e) => patch({ insolvencyDate: e.target.value })}
              />
            </Field>
          ) : null}
          <p className="text-sm text-muted-foreground">Sam wniosek restrukturyzacyjny nie wystarcza. Wybierz „Nie wiem”, jeśli terminowość nie została sprawdzona.</p>
          <YesNo label="Czy masz dowody, że niezgłoszenie upadłości nastąpiło bez Twojej winy?" value={answers.noFault} onChange={(value) => patch({ noFault: value })} />
          <YesNo
            label="Czy wskazałeś konkretne mienie spółki, z którego da się ściągnąć zaległość w znacznej części?"
            value={answers.companyAssetsPointed}
            onChange={(value) => patch({ companyAssetsPointed: value })}
          />
        </Step>
      ) : null}

      {step === 5 ? (
        <Step title="Czy miałeś szansę się bronić?">
          <YesNo
            label="Czy znasz decyzję wymiarową wydaną wobec spółki?"
            value={answers.hadCompanyDecision}
            onChange={(value) => patch({ hadCompanyDecision: value })}
          />
          <YesNo
            label="Czy dostałeś realny wgląd do akt postępowania spółki — nie tylko sentencję?"
            value={answers.hadFileAccess}
            onChange={(value) => patch({ hadFileAccess: value })}
          />
          {answers.arrearKind !== "zus" ? <YesNo
            label="Czy postępowanie karnoskarbowe wszczęto tuż przed końcem przedawnienia spółki?"
            value={answers.kksNearLimitation}
            onChange={(value) => patch({ kksNearLimitation: value })}
          /> : null}
        </Step>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="brand-button brand-button-cta" onClick={next}>
          {step === STEPS.length - 1 || answers.companyForm === "other"
            ? "Pokaż semafor"
            : "Dalej"}{" "}
          <span>→</span>
        </button>
        {step > 0 ? (
          <button type="button" className="brand-button brand-button-ghost" onClick={back}>
            Wstecz
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="wizard-step space-y-3">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

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
    <div className="grid gap-1.5 pt-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNoUnknown | "";
  onChange: (value: YesNoUnknown) => void;
}) {
  return (
    <fieldset className="space-y-2 pt-2">
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        <ChoiceCard selected={value === "yes"} title="Tak" onClick={() => onChange("yes")} />
        <ChoiceCard selected={value === "no"} title="Nie" onClick={() => onChange("no")} />
        <ChoiceCard
          selected={value === "unknown"}
          title="Nie wiem"
          onClick={() => onChange("unknown")}
        />
      </div>
    </fieldset>
  );
}

function statusLabel(status: "met" | "missing" | "unclear" | "na"): string {
  if (status === "met") return "spełnione / jest";
  if (status === "missing") return "brak";
  if (status === "unclear") return "niejasne";
  return "n/d";
}
