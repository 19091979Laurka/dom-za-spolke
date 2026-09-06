import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Semafor({
  signal,
  title,
  summary,
}: {
  signal: "red" | "yellow" | "green" | "out";
  title: string;
  summary: string;
}) {
  const tone = {
    red: {
      label: "Czerwony",
      box: "border-[#8f1d2c] bg-[#f8ecec]",
      lamp: "bg-[#8f1d2c]",
    },
    yellow: {
      label: "Żółty",
      box: "border-[var(--gold)] bg-[#f7f0e2]",
      lamp: "bg-[var(--gold)]",
    },
    green: {
      label: "Zielony",
      box: "border-[var(--forest)] bg-[#e8efe9]",
      lamp: "bg-[var(--forest)]",
    },
    out: {
      label: "Poza art. 116",
      box: "border-[var(--forest-line)] bg-[var(--cream-card)]",
      lamp: "bg-[var(--gold)]",
    },
  }[signal];

  return (
    <section className={cn("border p-5 sm:p-7", tone.box)}>
      <div className="flex items-center gap-2">
        <span className={cn("size-3 rounded-full", tone.lamp)} aria-hidden />
        <Badge variant="secondary">{tone.label}</Badge>
      </div>
      <h2 className="mt-3 font-[family-name:var(--sans)] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{summary}</p>
    </section>
  );
}

export function LegalList({
  heading,
  items,
}: {
  heading: string;
  items: { title: string; body: string; meta?: string }[];
}) {
  if (items.length === 0) {
    return (
      <section>
        <h3 className="text-xl font-extrabold">{heading}</h3>
        <p className="mt-2 text-sm text-muted-foreground">Brak pozycji z tych odpowiedzi.</p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="text-xl font-extrabold">{heading}</h3>
      <ol className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.title} className="border border-[var(--forest-line)] bg-[var(--cream-card)] px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-extrabold">{item.title}</p>
              {item.meta ? (
                <span className="text-xs font-extrabold tracking-wide text-[var(--gold)] uppercase">
                  {item.meta}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
