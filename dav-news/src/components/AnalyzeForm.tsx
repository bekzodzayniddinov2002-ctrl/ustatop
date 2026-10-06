"use client";

import { FileSearch, Loader2, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  busy: boolean;
  defaultDistrict: string;
  onSubmit: (query: string, district: string) => void;
  onDemo: (district: string) => void;
}

const EXAMPLES = ["PF-181", "https://lex.uz/uz/docs/-7058618", "PQ-45 2026"];

export function AnalyzeForm({ busy, defaultDistrict, onSubmit, onDemo }: Props) {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState(defaultDistrict);

  return (
    <form
      className="glass space-y-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) onSubmit(query.trim(), district);
      }}
    >
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <FileSearch className="h-5 w-5 text-violet-300" /> Yangi hujjatni tahlil qilish
        </h2>
        <p className="mt-1 text-sm text-white/55">
          Hujjat raqami (masalan, PF-181), Lex.uz havolasi yoki hujjat ID sini kiriting.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_minmax(0,18rem)]">
        <input
          className="glass-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="PF-181 yoki https://lex.uz/uz/docs/..."
          aria-label="Hujjat raqami yoki havolasi"
          disabled={busy}
        />
        <label className="relative block">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            className="glass-input pl-9"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Tuman / shahar"
            aria-label="Tuman yoki shahar"
            disabled={busy}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setQuery(ex)}
            disabled={busy}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy || !query.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {busy ? "Agent ishlamoqda..." : "Tahlilni boshlash"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDemo(district)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-medium text-white/85 transition hover:bg-white/10 disabled:opacity-50"
        >
          Demo: Konimex tumani
        </button>
      </div>
    </form>
  );
}
