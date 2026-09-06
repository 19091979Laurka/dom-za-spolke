import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { leadsKeyOk, readLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skrzynka zgłoszeń",
  robots: { index: false, follow: false },
};

export default async function LeadyPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;
  const allowed = leadsKeyOk(k);
  const leads = allowed ? await readLeads() : [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold">Skrzynka zgłoszeń</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tylko dla kancelarii. Klucz ustawiasz w <code>LEADS_KEY</code>. Domyślnie lokalnie:{" "}
          <code>szuwara</code>.
        </p>

        {!allowed ? (
          <form className="mt-6 flex flex-col gap-3 sm:flex-row" method="get">
            <input
              name="k"
              type="password"
              placeholder="Klucz"
              className="h-12 flex-1 rounded-lg border border-input bg-card px-3"
              required
            />
            <button
              type="submit"
              className="h-12 rounded-lg bg-primary px-5 font-bold text-primary-foreground"
            >
              Otwórz
            </button>
          </form>
        ) : leads.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-muted-foreground">
            Jeszcze pusto. Jak ktoś zostawi telefon na stronie — pojawi się tutaj.
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {leads.map((lead) => (
              <li key={lead.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-lg font-bold">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleString("pl-PL")} · {lead.source}
                  </p>
                </div>
                <p className="mt-2 font-semibold">
                  <a className="text-primary" href={`tel:${lead.phone}`}>
                    {lead.phone}
                  </a>
                  {lead.email ? (
                    <>
                      {" · "}
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </>
                  ) : null}
                </p>
                {lead.note ? <p className="mt-2 text-sm">{lead.note}</p> : null}
                {lead.resultText ? (
                  <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">
                    {lead.resultText}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
