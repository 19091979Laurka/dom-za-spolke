import { NextResponse } from "next/server";
import {
  allowLeadFrom,
  deliverLead,
  validateLeadInput,
} from "@/lib/leads";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!allowLeadFrom(clientIp(request))) {
    return NextResponse.json(
      { error: "Za dużo zgłoszeń z tego adresu. Zadzwoń albo napisz maila." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieczytelne zgłoszenie." }, { status: 400 });
  }

  const parsed = validateLeadInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  let lead;
  try { lead = await deliverLead(parsed.data); }
  catch { return NextResponse.json({ error: "Nie potwierdzono odbioru zgłoszenia. Skorzystaj z wiadomości e-mail lub telefonu." }, { status: 503 }); }

  return NextResponse.json({
    ok: true,
    id: lead.id,
    message: "Zgłoszenie przekazano do kancelarii. Kontakt nie zatrzymuje terminów.",
  });
}
