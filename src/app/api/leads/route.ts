import { NextResponse } from "next/server";
import { leadsKeyOk, readLeads } from "@/lib/leads";

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("k") ?? undefined;
  if (!leadsKeyOk(key)) {
    return NextResponse.json({ error: "Brak dostępu." }, { status: 401 });
  }
  const leads = await readLeads();
  return NextResponse.json({ count: leads.length, leads });
}
