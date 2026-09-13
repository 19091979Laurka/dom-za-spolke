import Image from "next/image";
import { FIRM } from "@/lib/firm";

type Item = { title: string; body: string; meta?: string };
type Props = {
  kind: string; date: string; title: string; summary: string;
  signal: "red" | "yellow" | "green" | "out";
  steps: string[]; groups: { title: string; items: Item[] }[];
  sources: { cite: string; note: string; url?: string }[];
  answers: { label: string; value: string }[];
  stats?: { label: string; value: string }[];
  note?: string; compact?: boolean;
};
function Letterhead({ label }: { label: string }) {
  return <header className="pdf-letterhead"><Image src="/brand/logo.png" alt={FIRM.shortName} width={170} height={70} unoptimized loading="eager" /><span>{label}<br />{FIRM.city}</span></header>;
}
export function PrintReport(p: Props) {
  const labels = { red: "Wymaga pilnej analizy", yellow: "Wymaga weryfikacji", green: "Wynik warunkowo korzystny", out: "Poza zakresem diagnostyki" };
  return <article className={p.compact ? "pdf-document pdf-compact" : "pdf-document"} aria-label="Wersja raportu do PDF">
    <section className="pdf-sheet">
      <Letterhead label="Raport indywidualny" />
      <div className="pdf-meta"><span>DOM ZA SPÓŁKĘ / {p.kind}</span><span>{p.date}</span></div>
      <h1>Twoja sytuacja.<br /><span>Kolejne kroki.</span></h1>
      <div className="pdf-verdict" data-tone={p.signal}><p className="pdf-kicker"><i />{labels[p.signal]}</p><h2>{p.title}</h2><p>{p.summary}</p></div>
      {p.stats && <dl className="pdf-stats">{p.stats.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>}
      {p.note && <p className="pdf-note">{p.note}</p>}
      <h3 className="pdf-section-title"><span>01</span> Plan działania</h3>
      <ol className="pdf-actions">{p.steps.map((s,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{s}</p></li>)}</ol>
      {!p.steps.length && <p>Ten przypadek wymaga indywidualnego ustalenia właściwej podstawy odpowiedzialności.</p>}
      <aside className="pdf-scope"><strong>Jak czytać ten raport</strong><p>Wstępna kwalifikacja na podstawie podanych odpowiedzi. Nie jest poradą prawną, nie zastępuje analizy dokumentów i nie zatrzymuje terminów. Kolor nie określa procentowych szans powodzenia.</p></aside>
    </section>
    {p.groups.length > 0 && <section className="pdf-sheet"><Letterhead label="Uzasadnienie wyniku" /><h3 className="pdf-section-title"><span>02</span> Co wynika z odpowiedzi</h3>{p.groups.map(g=><section className="pdf-group" key={g.title}><h4>{g.title}</h4>{g.items.length ? g.items.map((item,i)=><div className="pdf-finding" key={i}><div><strong>{item.title}</strong>{item.meta && <small>{item.meta}</small>}</div><p>{item.body}</p></div>) : <p>Brak wskazań na podstawie podanych odpowiedzi.</p>}</section>)}</section>}
    <section className="pdf-sheet"><Letterhead label="Dane i podstawa analizy" /><h3 className="pdf-section-title"><span>{p.groups.length ? "03" : "02"}</span> Dane i źródła</h3>
      <h4>Dane przyjęte do raportu</h4><dl className="pdf-inputs">{p.answers.map((a,i)=><div key={i}><dt>{a.label}</dt><dd>{a.value}</dd></div>)}</dl>
      <section className="pdf-sources"><h4>Podstawy prawne i orzecznictwo</h4>{p.sources.map((s,i)=><div key={i}><span>{String(i+1).padStart(2,"0")}</span><p><a href={s.url}>{s.cite}</a><br />{s.note}</p></div>)}</section>
      <aside className="pdf-contact"><p>Porozmawiajmy o dokumentach.</p><span>{FIRM.name}<br />{FIRM.offices.map(o => `${o.locality}, ${o.street}, ${o.zip}`).join(" · ")}<br />{FIRM.phone} · {FIRM.email}<br />kancelaria-szuwara.pl</span></aside>
      <p className="pdf-fine">Raport wygenerowany automatycznie z odpowiedzi użytkownika. Nie stanowi podpisanej opinii kancelarii. Reguły diagnostyczne: 12.09.2026. Źródła w wersji elektronicznej są klikalne.</p>
    </section>
  </article>;
}
