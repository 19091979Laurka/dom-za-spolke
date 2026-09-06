"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChoiceCard } from "@/components/choice-card";
import { Disclaimer } from "@/components/disclaimer";
import { LeadCta } from "@/components/lead-cta";
import { LegalList, Semafor } from "@/components/result-panel";
import {
  diagnoseArt116,
  emptyArt116Answers,
  resultPlainText,
  type Art116Answers,
  type YesNoUnknown,
} from "@/lib/art116";

const STEPS = [
  "Spółka",
  "Kadencja",
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

  const result = useMemo(
    () => (done ? diagnoseArt116(answers) : null),
    [done, answers],
  );

  function patch(partial: Partial<Art116Answers>) {
    setAnswers((prev) => ({ ...prev, ...partial }));
    setError("");
  }

  function validate(current: number): string {
    if (current === 0 && !answers.companyForm) return "Wskaż formę, w której zasiadałeś.";
    if (current === 1) {
      if (answers.companyForm === "other") return "";
      if (!answers.tenureStart) return "Podaj początek kadencji.";
      if (!answers.stillServing && !answers.tenureEnd) {
        return "Podaj koniec kadencji albo zaznacz, że nadal siedzisz w zarządzie.";
      }
      if (
        answers.tenureStart &&
        answers.tenureEnd &&
        !answers.stillServing &&
        answers.tenureEnd < answers.tenureStart
      ) {
        return "Koniec kadencji nie może być wcześniejszy niż początek.";
      }
      if (!answers.resignationBeforeKrs) {
        return "Powiedz, czy rezygnacja była wcześniej niż wykreślenie z KRS.";
      }
    }
    if (current === 2) {
      if (!answers.arrearKind) return "Wskaż rodzaj zaległości.";
      if (!answers.paymentDue) return "Podaj termin płatności tej zaległości.";
    }
    if (current === 3) {
      if (!answers.enforcementFruitless) return "Czy egzekucja ze spółki padła?";
      if (!answers.proceeding116) return "Czy toczy się już postępowanie z art. 116?";
    }
    if (current === 4) {
      if (!answers.insolvencyFiled) return "Czy złożono wniosek o upadłość albo otwarto restrukturyzację?";
      if (!answers.companyAssetsPointed) return "Czy wskazałeś mienie spółki do egzekucji?";
    }
    if (current === 5) {
      if (!answers.hadCompanyDecision) return "Czy znasz decyzję wobec spółki?";
      if (!answers.hadFileAccess) return "Czy miałeś wgląd do akt spółki?";
      if (!answers.kksNearLimitation) return "Czy KKS wszczęto tuż przed przedawnieniem?";
    }
    return "";
  }

  function next() {
    const message = validate(step);
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
      <div id="wynik-do-druku" className="space-y-6">
        <Semafor signal={result.signal} title={result.title} summary={result.summary} />
        {result.zusPath ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            ZUS: ścieżka z art. 31 u.s.u.s. Semafor jest ostrożniejszy. Adjak nie cytuje się tu jak przy VAT.
          </p>
        ) : result.adjakStrength === "analogy" ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            TSUE orzekał na VAT. Przy tej zaległości wynik opiera się na analogii z interpretacji MF z 29.08.2025 r., nie na twardej sentencji Adjak.
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
              heading="Zarzuty do pisma — nie gotowa opinia"
              items={result.defenses.map((d) => ({
                title: d.title,
                body: d.body,
                meta: d.strength === "strong" ? "silny" : d.strength === "medium" ? "do akt" : "cytat",
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
                    <span className="font-semibold text-foreground">{item.cite}</span>
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
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide text-primary uppercase">
          <span>
            Krok {step + 1} / {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} />
      </div>

      {step === 0 ? (
        <Step title="W jakiej spółce siedziałeś w zarządzie?">
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
            terminem płatności w czasie kadencji.
          </p>
          <Field label="Początek kadencji" htmlFor="tenure-start">
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
            onClick={() => patch({ stillServing: true, tenureEnd: "" })}
          />
          <ChoiceCard
            selected={!answers.stillServing}
            title="Już nie pełnię funkcji"
            onClick={() => patch({ stillServing: false })}
          />
          {!answers.stillServing ? (
            <Field label="Koniec kadencji (rezygnacja, odwołanie)" htmlFor="tenure-end">
              <Input
                id="tenure-end"
                className="h-11"
                type="date"
                value={answers.tenureEnd}
                onChange={(e) => patch({ tenureEnd: e.target.value })}
              />
            </Field>
          ) : null}
          <YesNo
            label="Czy złożyłeś rezygnację albo zostałeś odwołany wcześniej, niż wykreślono Cię z KRS?"
            value={answers.resignationBeforeKrs}
            onChange={(value) => patch({ resignationBeforeKrs: value })}
          />
        </Step>
      ) : null}

      {step === 2 ? (
        <Step title="Jaka zaległość i kiedy była płatna?">
          <ChoiceCard
            selected={answers.arrearKind === "vat"}
            title="VAT"
            hint="Tu Adjak i Genzyński działają wprost."
            onClick={() => patch({ arrearKind: "vat" })}
          />
          <ChoiceCard
            selected={answers.arrearKind === "cit"}
            title="CIT"
            hint="Analogia z interpretacji MF, nie twarda sentencja TSUE."
            onClick={() => patch({ arrearKind: "cit" })}
          />
          <ChoiceCard
            selected={answers.arrearKind === "pit4"}
            title="PIT-4 / zaliczki za pracowników"
            onClick={() => patch({ arrearKind: "pit4" })}
          />
          <ChoiceCard
            selected={answers.arrearKind === "zus"}
            title="Składki ZUS"
            hint="Osobna ustawa. Semafor będzie ostrożniejszy."
            onClick={() => patch({ arrearKind: "zus" })}
          />
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
            label="Czy egzekucja ze spółki jest bezskuteczna albo komornik wrócił z kwitkiem?"
            value={answers.enforcementFruitless}
            onChange={(value) => patch({ enforcementFruitless: value })}
          />
          <YesNo
            label="Czy dostałeś wezwanie albo decyzję o odpowiedzialności z art. 116?"
            value={answers.proceeding116}
            onChange={(value) => patch({ proceeding116: value })}
          />
        </Step>
      ) : null}

      {step === 4 ? (
        <Step title="Furtki ustawowe: upadłość i mienie">
          <YesNo
            label="Czy we właściwym czasie złożono wniosek o upadłość albo otwarto restrukturyzację?"
            value={answers.insolvencyFiled}
            onChange={(value) => patch({ insolvencyFiled: value })}
          />
          {answers.insolvencyFiled === "yes" ? (
            <Field label="Data wniosku (jeśli pamiętasz)" htmlFor="insolvency-date">
              <Input
                id="insolvency-date"
                className="h-11"
                type="date"
                value={answers.insolvencyDate}
                onChange={(e) => patch({ insolvencyDate: e.target.value })}
              />
            </Field>
          ) : null}
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
          <YesNo
            label="Czy postępowanie karnoskarbowe wszczęto tuż przed końcem przedawnienia spółki?"
            value={answers.kksNearLimitation}
            onChange={(value) => patch({ kksNearLimitation: value })}
          />
        </Step>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
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
    <div className="space-y-3">
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
    <div className="space-y-2 pt-2">
      <p className="text-sm font-semibold">{label}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <ChoiceCard selected={value === "yes"} title="Tak" onClick={() => onChange("yes")} />
        <ChoiceCard selected={value === "no"} title="Nie" onClick={() => onChange("no")} />
        <ChoiceCard
          selected={value === "unknown"}
          title="Nie wiem"
          onClick={() => onChange("unknown")}
        />
      </div>
    </div>
  );
}

function statusLabel(status: "met" | "missing" | "unclear" | "na"): string {
  if (status === "met") return "spełnione / jest";
  if (status === "missing") return "brak";
  if (status === "unclear") return "niejasne";
  return "n/d";
}
