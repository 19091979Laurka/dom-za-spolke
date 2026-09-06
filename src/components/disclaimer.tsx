export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="border border-[var(--forest-line)] bg-[var(--cream-card)] px-4 py-3">
      <p className="text-sm font-extrabold">To nie jest porada prawna</p>
      <p className={compact ? "mt-1 text-xs leading-relaxed text-muted-foreground" : "mt-1 text-sm leading-relaxed text-muted-foreground"}>
        Semafor szacuje ryzyko z Twoich odpowiedzi i z publicznego orzecznictwa (TSUE Adjak i
        Genzyński, interpretacja MF DTS2.8012.5.2025, art. 70 i 116 O.p.). Nie zastępuje analizy akt
        i nie przerywa żadnego terminu. Wyroki TSUE zapadły na VAT; przy CIT, PIT-4 i ZUS wynik to
        analogia, nie sentencja 1:1.
      </p>
    </aside>
  );
}
