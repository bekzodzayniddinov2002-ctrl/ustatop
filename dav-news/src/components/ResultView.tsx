import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  ExternalLink,
  FileText,
  GitCompareArrows,
  History,
  Landmark,
  ListChecks,
  Users,
} from "lucide-react";
import type { AnalysisResult, DistrictTask } from "@/lib/types";

const PRIORITY_STYLE: Record<DistrictTask["priority"], string> = {
  yuqori: "border-rose-300/30 bg-rose-400/15 text-rose-200",
  "o'rta": "border-amber-300/30 bg-amber-400/15 text-amber-200",
  past: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200",
};

function SectionTitle({ icon: Icon, children }: { icon: typeof FileText; children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
      <Icon className="h-5 w-5 text-violet-300" />
      {children}
    </h3>
  );
}

export function ResultView({ result }: { result: AnalysisResult }) {
  const { document: doc } = result;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Sarlavha: hujjat turi, raqami, sanasi, mavzusi */}
      <section className="glass p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-violet-300/30 bg-violet-400/20 px-3 py-1 text-sm font-bold tracking-wide text-violet-100">
            {doc.number}
          </span>
          <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80">{doc.type}</span>
          {doc.date && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80">
              <CalendarDays className="h-3.5 w-3.5" /> {doc.date}
            </span>
          )}
          {result.mode === "demo" && (
            <span className="rounded-lg border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-200">
              DEMO · namunaviy ma'lumot
            </span>
          )}
        </div>
        <h2 className="mt-4 text-xl font-semibold leading-snug text-white md:text-2xl">{doc.title}</h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
          <Landmark className="h-4 w-4" /> {doc.issuer}
          {doc.url && (
            <a href={doc.url} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 text-violet-300 hover:text-violet-200">
              Lex.uz <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="glass p-6">
          <SectionTitle icon={FileText}>Umumiy mazmuni</SectionTitle>
          <p className="leading-relaxed text-white/80">{result.summary}</p>
          {result.keyPoints.length > 0 && (
            <ul className="mt-4 space-y-2">
              {result.keyPoints.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass p-6">
          <SectionTitle icon={History}>O'zgartirilgan eski hujjatlar</SectionTitle>
          {result.oldDocuments.length === 0 ? (
            <p className="text-sm text-white/50">Eski hujjat aniqlanmadi.</p>
          ) : (
            <ul className="space-y-3">
              {result.oldDocuments.map((o, i) => (
                <li key={i} className="glass-soft p-4">
                  <p className="text-sm font-semibold text-white">
                    {o.type} № {o.number}
                    {o.date && <span className="font-normal text-white/50"> · {o.date}</span>}
                  </p>
                  {o.title && <p className="mt-1 text-sm text-white/65">{o.title}</p>}
                  <p className="mt-2 inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/70">{o.relation}</p>
                  {o.url && (
                    <a href={o.url} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 text-xs text-violet-300">
                      Lex.uz <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Qiyosiy tahlil */}
      <section className="glass p-6">
        <SectionTitle icon={GitCompareArrows}>Qiyosiy tahlil: avval va hozir</SectionTitle>
        <div className="space-y-3">
          {result.comparison.map((c, i) => (
            <div key={i} className="glass-soft p-4">
              <p className="mb-3 text-sm font-semibold text-violet-100">{c.topic}</p>
              <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-lg border border-rose-300/15 bg-rose-500/10 p-3">
                  <p className="mb-1 text-[11px] uppercase tracking-wider text-rose-200/70">Eski hujjatda</p>
                  <p className="text-sm text-white/80">{c.before}</p>
                </div>
                <ArrowRight className="hidden h-5 w-5 self-center text-white/40 md:block" />
                <div className="rounded-lg border border-emerald-300/15 bg-emerald-500/10 p-3">
                  <p className="mb-1 text-[11px] uppercase tracking-wider text-emerald-200/70">Yangi hujjatda</p>
                  <p className="text-sm text-white/80">{c.after}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/55">
                <span className="text-white/75">Ta'siri:</span> {c.impact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tuman vazifalari */}
      <section className="glass p-6">
        <SectionTitle icon={Building2}>{result.district}: hokimlik va mahalliy tashkilotlar vazifalari</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {result.districtTasks.map((t, i) => (
            <article key={i} className="glass-soft flex flex-col p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-white">{t.responsible}</p>
                <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLE[t.priority]}`}>
                  {t.priority}
                </span>
              </div>
              <p className="flex gap-2 text-sm text-white/80">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" /> {t.task}
              </p>
              <p className="mt-2 flex gap-2 text-xs text-white/55">
                <ClipboardList className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {t.mechanism}
              </p>
              <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-white/60">
                <CalendarDays className="h-3.5 w-3.5" /> {t.deadline}
              </p>
            </article>
          ))}
        </div>
      </section>

      {result.affectedGroups.length > 0 && (
        <section className="glass p-6">
          <SectionTitle icon={Users}>Ta'sir ko'rsatadigan guruhlar</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {result.affectedGroups.map((g, i) => (
              <div key={i} className="glass-soft p-4">
                <p className="text-sm font-semibold text-white">{g.group}</p>
                <p className="mt-1 text-sm text-white/65">{g.effect}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-white/35">
        {result.mode === "demo" ? "Demo rejim" : `Model: ${result.model}`} · {new Date(result.generatedAt).toLocaleString("uz-UZ")}
        {" · "}AI tahlili yordamchi vosita; rasmiy matnni Lex.uz da tekshiring.
      </p>
    </div>
  );
}
