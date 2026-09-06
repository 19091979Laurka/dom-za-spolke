"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FIRM, firmMailto } from "@/lib/firm";
import type { LeadSource } from "@/lib/lead-types";

export function LeadCta({
  subject,
  resultText,
  source,
  heading,
  blurb,
  tone = "light",
}: {
  subject: string;
  resultText: string;
  source: LeadSource;
  heading?: string;
  blurb?: string;
  tone?: "light" | "dark";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const dark = tone === "dark";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          note,
          subject,
          resultText,
          source,
          consent,
        }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error || "Nie udało się zapisać. Napisz maila.");
        return;
      }
      setStatus("ok");
      setMessage(data.message || "Dostaliśmy numer.");
    } catch {
      setStatus("err");
      setMessage("Sieć padła. Zostaw maila albo spróbuj jeszcze raz.");
    }
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (status === "ok") {
    return (
      <div id="wynik-kontakt" className="brand-ok scroll-mt-24">
        <p className="brand-eyebrow">Zgłoszenie przyjęte</p>
        <h3 className="text-2xl font-extrabold tracking-tight">
          Oddzwonimy. Nie czekaj z terminem.
        </h3>
        <p className="mt-2 text-sm opacity-80">{message}</p>
        <p className="mt-2 text-sm opacity-80">
          Jeśli sprawa pali się dziś — napisz na{" "}
          <a className="underline" href={firmMailto(subject, resultText)}>
            {FIRM.email}
          </a>{" "}
          albo zadzwoń {FIRM.phone}.
        </p>
        {resultText ? (
          <div className="mt-4 flex flex-wrap gap-2 print:hidden">
            <button type="button" className="brand-button brand-button-ghost" onClick={() => window.print()}>
              Drukuj wynik <span>→</span>
            </button>
            <button type="button" className="brand-button brand-button-ghost" onClick={copyResult}>
              {copied ? "Skopiowano" : "Kopiuj wynik"} <span>→</span>
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form
      id="wynik-kontakt"
      onSubmit={submit}
      className={`scroll-mt-24 ${dark ? "brand-form" : "brand-form-light"}`}
    >
      {!dark ? (
        <>
          <p className="brand-eyebrow">{FIRM.shortName} · bez konta</p>
          <h3 className="text-2xl font-extrabold tracking-tight">
            {heading ?? "Zostaw telefon. Przejrzymy wynik."}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {blurb ??
              "Numer idzie do kancelarii, nie do newslettera. Oddzwonimy w 1 dzień roboczy."}
          </p>
        </>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label htmlFor={`lead-name-${source}`}>
          Imię i nazwisko
          <input
            id={`lead-name-${source}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label htmlFor={`lead-phone-${source}`}>
          Telefon
          <input
            id={`lead-phone-${source}`}
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="500 013 269"
            required
          />
        </label>
        <label htmlFor={`lead-email-${source}`}>
          E-mail (opcjonalnie)
          <input
            id={`lead-email-${source}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label htmlFor={`lead-note-${source}`}>
          O co chodzi
          <textarea
            id={`lead-note-${source}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Decyzja, wezwanie, data pisma…"
          />
        </label>
      </div>
      <label className="mt-4 !flex !grid-cols-none flex-row items-start gap-3 !font-medium !tracking-normal">
        <Checkbox
          checked={consent}
          onCheckedChange={(value) => setConsent(value === true)}
          className="mt-0.5"
        />
        <span className="text-sm font-medium tracking-normal">
          Zgadzam się, żeby {FIRM.shortName} skontaktowała się ze mną w sprawie tego wyniku. Nie
          zapisuję się na newsletter.
        </span>
      </label>
      {status === "err" ? (
        <p className="mt-3 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {message}{" "}
          <a className="font-semibold underline" href={firmMailto(subject, resultText)}>
            Wyślij maila
          </a>
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          className="brand-button brand-button-cta"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Wysyłam…" : "Oddzwońcie do mnie"} <span>→</span>
        </button>
        {resultText ? (
          <>
            <button type="button" className="brand-button brand-button-ghost" onClick={() => window.print()}>
              Drukuj / PDF <span>→</span>
            </button>
            <button type="button" className="brand-button brand-button-ghost" onClick={copyResult}>
              {copied ? "Skopiowano" : "Kopiuj wynik"} <span>→</span>
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}
