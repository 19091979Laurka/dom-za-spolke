import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  LEAD_SOURCES,
  type Lead,
  type LeadInput,
  type LeadSource,
} from "@/lib/lead-types";

export type { Lead, LeadInput, LeadSource };
export { LEAD_SOURCES };

const FILE = path.join(process.cwd(), "data", "leads.json");
const MAX_RESULT = 20_000;
const hits = new Map<string, number[]>();

export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function validateLeadInput(body: unknown):
  | { ok: true; data: LeadInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Puste zgłoszenie." };
  }

  const rec = body as Record<string, unknown>;
  const name = typeof rec.name === "string" ? rec.name.trim() : "";
  const phone = typeof rec.phone === "string" ? rec.phone.trim() : "";
  const email = typeof rec.email === "string" ? rec.email.trim() : "";
  const note = typeof rec.note === "string" ? rec.note.trim() : "";
  const subject = typeof rec.subject === "string" ? rec.subject.trim() : "Zgłoszenie z Dom za spółkę";
  const resultText = typeof rec.resultText === "string" ? rec.resultText.trim() : "";
  const source = rec.source;
  const consent = rec.consent === true;

  if (name.length < 2) return { ok: false, error: "Podaj imię." };
  if (phoneDigits(phone).length < 9) {
    return { ok: false, error: "Podaj numer telefonu (min. 9 cyfr)." };
  }
  if (email && !/[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^[^^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "E-mail wygląda na błędny." };
  }
  if (!LEAD_SOURCES.includes(source as LeadSource)) {
    return { ok: false, error: "Nieznane źródło zgłoszenia." };
  }
  if (!consent) {
    return { ok: false, error: "Zaznacz zgodę na kontakt w sprawie wyniku." };
  }
  if (resultText.length > MAX_RESULT) {
    return { ok: false, error: "Wynik jest za długi." };
  }

  return {
    ok: true,
    data: {
      name: name.slice(0, 120),
      phone: phone.slice(0, 40),
      email: email.slice(0, 160),
      note: note.slice(0, 800),
      source: source as LeadSource,
      subject: subject.slice(0, 180),
      resultText,
    },
  };
}

export function allowLeadFrom(ip: string, limit = 8, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Lead[]) : [];
  } catch {
    return [];
  }
}

export async function saveLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  await mkdir(path.dirname(FILE), { recursive: true });
  const existing = await readLeads();
  existing.unshift(lead);
  await writeFile(FILE, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  return lead;
}

export function leadsKeyOk(key: string | undefined): boolean {
  const expected = process.env.LEADS_KEY?.trim() || "szuwara";
  return Boolean(key) && key === expected;
}

export async function notifyLeadWebhook(lead: Lead): Promise<void> {
  const url = process.env.LEAD_WEBHOOK?.trim();
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
    });
  } catch {
    // Lokalny zapis i tak zostaje. Webhook jest dodatkiem.
  }
}
