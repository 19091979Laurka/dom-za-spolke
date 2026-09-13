"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FIRM, firmMailto, firmTelHref } from "@/lib/firm";
import type { LeadSource } from "@/lib/lead-types";

export function LeadCta({ subject, resultText, source, heading, blurb, tone = "light" }: {
  subject: string; resultText: string; source: LeadSource; heading?: string; blurb?: string; tone?: "light" | "dark";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const dark = tone === "dark";
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) { setMessage("Zaznacz, że chcesz przygotować wiadomość do kancelarii."); return; }
    window.location.href = firmMailto(subject, [
      `Imię i nazwisko: ${name}`, `Telefon: ${phone}`, `E-mail: ${email}`, note,
      "", "Proszę o kontakt w sprawie poniższego wyniku.", resultText,
    ].join("\n"));
    setMessage("Przygotowano wiadomość. Wyślij ją samodzielnie w programie pocztowym. Formularz nie potwierdza jej wysłania ani odbioru.");
  }
  return <form id="wynik-kontakt" onSubmit={submit} className={`print:hidden scroll-mt-24 ${dark ? "brand-form" : "brand-form-light"}`}>
    {!dark && <><p className="brand-eyebrow">{FIRM.shortName} · bez konta</p><h3 className="text-2xl font-extrabold tracking-tight">{heading ?? "Porozmawiajmy o Twojej sytuacji."}</h3><p className="mt-2 text-sm text-muted-foreground">{blurb ?? "Przygotuj e-mail z numerem telefonu i wynikiem. Samodzielnie wyślesz go w swoim programie pocztowym."}</p></>}
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <label htmlFor={`lead-name-${source}`}>Imię i nazwisko<input id={`lead-name-${source}`} maxLength={120} value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required /></label>
      <label htmlFor={`lead-phone-${source}`}>Telefon<input id={`lead-phone-${source}`} maxLength={40} pattern="[+0-9 ()-]{9,40}" type="tel" inputMode="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" required /></label>
      <label htmlFor={`lead-email-${source}`}>E-mail (opcjonalnie)<input id={`lead-email-${source}`} type="email" maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></label>
      <label htmlFor={`lead-note-${source}`}>O co chodzi<textarea id={`lead-note-${source}`} maxLength={800} value={note} onChange={e=>setNote(e.target.value)} placeholder="Rodzaj pisma i termin — bez PESEL ani danych innych osób" /></label>
    </div>
    <label className="mt-4 !flex flex-row items-start gap-3 !font-medium !tracking-normal"><Checkbox checked={consent} onCheckedChange={v=>setConsent(v===true)} className="mt-0.5" /><span className="text-sm">Chcę przygotować wiadomość do kancelarii z podanymi danymi i wynikiem. Wysyłam ją samodzielnie, bez zapisu na newsletter.</span></label>
    <p className="mt-3 text-xs opacity-80">Pola nie są wysyłane do serwera formularza. Jeśli program pocztowy nie otwiera długiej wiadomości, pobierz raport TXT i dołącz go do e-maila.</p>
    <p role="status" className="mt-3 text-sm">{message}</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="submit" className="brand-button brand-button-cta">Przygotuj e-mail <span>→</span></button><a className={`brand-button ${dark ? "brand-button-cta" : "brand-button-ghost"}`} href={firmTelHref()}>Zadzwoń {FIRM.phone}</a></div>
  </form>;
}
