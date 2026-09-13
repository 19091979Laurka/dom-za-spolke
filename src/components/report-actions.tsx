"use client";
import { useState } from "react";
export function ReportActions({ text }: { text: string }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(text); setMessage("Raport skopiowany."); }
    catch { setMessage("Kopiowanie niedostępne. Pobierz plik TXT."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "szuwara-raport.txt"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="print:hidden"><div className="report-actions"><button className="brand-button brand-button-secondary" type="button" onClick={() => window.print()}>Drukuj / PDF ↗</button><button className="brand-button brand-button-ghost" type="button" onClick={download}>Pobierz TXT ↓</button><button className="brand-button brand-button-ghost" type="button" onClick={copy}>Kopiuj raport</button></div><p role="status" className="text-sm">{message}</p></div>;
}
