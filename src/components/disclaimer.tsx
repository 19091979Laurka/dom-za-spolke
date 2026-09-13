export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="border border-[var(--forest-line)] bg-[var(--cream-card)] px-4 py-3">
      <p className="text-sm font-extrabold">To nie jest porada prawna</p>
      <p className={compact ? "mt-1 text-xs leading-relaxed text-muted-foreground" : "mt-1 text-sm leading-relaxed text-muted-foreground"}>
        Wstępna kwalifikacja na podstawie Twoich odpowiedzi, nie ocena procentowych szans.
        Nie zastępuje analizy dokumentów i nie zatrzymuje terminów. Wyroki TSUE dotyczą VAT;
        sprawy CIT, płatników i ZUS wymagają uwzględnienia właściwych przepisów. Źródła znajdziesz w raporcie.
      </p>
    </aside>
  );
}
