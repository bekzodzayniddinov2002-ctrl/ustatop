"use client";

import { Bot, Cpu, FileStack, Gavel, MapPin, ScrollText, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AgentTimeline } from "@/components/AgentTimeline";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { MeshBackground } from "@/components/MeshBackground";
import { ResultView } from "@/components/ResultView";
import { StatCard } from "@/components/StatCard";
import type { AgentEvent, AgentStep, AnalysisResult } from "@/lib/types";

const DEFAULT_DISTRICT = "Konimex tumani, Navoiy viloyati";
const HISTORY_KEY = "dav-news-history";

const INITIAL_STEPS: AgentStep[] = [
  { id: 1, title: "So'rovni qabul qilish", status: "pending" },
  { id: 2, title: "Yangi hujjatni Lex.uz dan olish", status: "pending" },
  { id: 3, title: "Eski hujjat(lar)ni aniqlash (Claude)", status: "pending" },
  { id: 4, title: "Eski hujjatni qidirish va yuklab olish", status: "pending" },
  { id: 5, title: "Qiyosiy tahlil va tuman vazifalari (Claude)", status: "pending" },
];

interface Status {
  mode: "demo" | "live";
  hasApiKey: boolean;
  mainModel: string;
  fastModel: string;
}

function loadHistory(): AnalysisResult[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as AnalysisResult[];
  } catch {
    return [];
  }
}

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>(INITIAL_STEPS);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
    fetch("/api/analyze")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const saveToHistory = useCallback((r: AnalysisResult) => {
    setHistory((prev) => {
      const next = [r, ...prev.filter((p) => p.document.number !== r.document.number)].slice(0, 8);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* localStorage mavjud bo'lmasa tarix faqat sessiyada saqlanadi */
      }
      return next;
    });
  }, []);

  const run = useCallback(
    async (payload: { query?: string; district: string; demo?: boolean }) => {
      setBusy(true);
      setStarted(true);
      setSteps(INITIAL_STEPS);
      setLogs([]);
      setResult(null);
      setError(null);

      const handle = (event: AgentEvent) => {
        if (event.type === "step") setSteps((prev) => prev.map((s) => (s.id === event.step.id ? event.step : s)));
        else if (event.type === "log") setLogs((prev) => [...prev, event.message]);
        else if (event.type === "result") {
          setResult(event.result);
          saveToHistory(event.result);
        } else if (event.type === "error") setError(event.message);
      };

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Server xatosi: ${res.status}`);
        }
        // NDJSON oqimini qatorma-qator o'qiymiz
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) if (line.trim()) handle(JSON.parse(line) as AgentEvent);
        }
        if (buffer.trim()) handle(JSON.parse(buffer) as AgentEvent);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBusy(false);
      }
    },
    [saveToHistory],
  );

  return (
    <>
      <MeshBackground />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="glass flex h-12 w-12 items-center justify-center !rounded-xl">
              <Gavel className="h-6 w-6 text-violet-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Dav News</h1>
              <p className="text-sm text-white/55">Yangi qonunchilik → tuman miqyosidagi vazifalar</p>
            </div>
          </div>
          {status && (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                status.mode === "live"
                  ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
                  : "border-amber-300/30 bg-amber-400/15 text-amber-200"
              }`}
            >
              {status.mode === "live" ? "Jonli rejim · Claude API ulangan" : "Demo rejim · API kaliti yo'q"}
            </span>
          )}
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Bot} label="Agent" value="5 qadamli" hint="Lex.uz → Claude → Lex.uz → Claude" />
          <StatCard icon={Cpu} label="Tahlil modeli" value={status?.mainModel ?? "—"} hint={status ? `Tezkor: ${status.fastModel}` : undefined} />
          <StatCard icon={MapPin} label="Hudud" value="Konimex tumani" hint="Navoiy viloyati" />
          <StatCard icon={FileStack} label="Tahlillar" value={`${history.length} ta`} hint="Shu brauzerda saqlangan" />
        </div>

        <AnalyzeForm
          busy={busy}
          defaultDistrict={DEFAULT_DISTRICT}
          onSubmit={(query, district) => run({ query, district })}
          onDemo={(district) => run({ query: "PF-181", district, demo: true })}
        />

        {error && (
          <div className="glass flex items-start gap-3 !border-rose-300/30 !bg-rose-500/10 p-4 text-sm text-rose-100">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
            <div>
              <p className="font-medium">Tahlil yakunlanmadi</p>
              <p className="mt-1 text-rose-100/80">{error}</p>
            </div>
          </div>
        )}

        {started && (
          <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <AgentTimeline steps={steps} logs={logs} />
            </div>
            <div>{result ? <ResultView result={result} /> : <Placeholder busy={busy} />}</div>
          </div>
        )}

        {!started && history.length > 0 && (
          <section className="glass p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <ScrollText className="h-5 w-5 text-violet-300" /> Oxirgi tahlillar
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setStarted(true);
                    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "done" })));
                    setLogs([]);
                    setError(null);
                    setResult(h);
                  }}
                  className="glass-soft p-4 text-left transition hover:bg-white/10"
                >
                  <p className="text-sm font-semibold text-violet-100">
                    {h.document.number} · <span className="font-normal text-white/50">{h.document.date}</span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/70">{h.document.title}</p>
                  <p className="mt-2 text-xs text-white/45">
                    {h.district} · {h.districtTasks.length} ta vazifa
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function Placeholder({ busy }: { busy: boolean }) {
  return (
    <div className="glass flex min-h-64 flex-col items-center justify-center gap-3 p-10 text-center">
      <Bot className={`h-10 w-10 text-violet-300/70 ${busy ? "animate-pulse" : ""}`} />
      <p className="text-white/60">{busy ? "Agent hujjatlarni o'qimoqda va tahlil qilmoqda..." : "Natija shu yerda ko'rinadi."}</p>
    </div>
  );
}
