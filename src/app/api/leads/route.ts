import { NextResponse } from "next/server";
import { leadsKeyOk, readLeads } from "@/lib/leads";

export async function GET(request: Request) {
  const key = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!leadsKeyOk(key)) {
    return NextResponse.json({ error: "Brak dostępu." }, { status: 401 });
  }
  const leads = await readLeads();
  return NextResponse.json({ count: leads.length, leads }, { headers: { "Cache-Control": "no-store" } });
}
