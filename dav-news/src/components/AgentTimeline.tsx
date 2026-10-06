import { AlertTriangle, CheckCircle2, Circle, Loader2, MinusCircle } from "lucide-react";
import type { AgentStep } from "@/lib/types";

const ICONS = {
  pending: <Circle className="h-5 w-5 text-white/30" />,
  running: <Loader2 className="h-5 w-5 animate-spin text-violet-300" />,
  done: <CheckCircle2 className="h-5 w-5 text-emerald-300" />,
  error: <AlertTriangle className="h-5 w-5 text-amber-300" />,
  skipped: <MinusCircle className="h-5 w-5 text-white/40" />,
};

export function AgentTimeline({ steps, logs }: { steps: AgentStep[]; logs: string[] }) {
  return (
    <section className="glass p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Avtonom agent qadamlari</h2>
      <ol className="space-y-1">
        {steps.map((s, i) => (
          <li key={s.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < steps.length - 1 && <span className="absolute left-[9px] top-6 h-full w-px bg-white/10" />}
            <span className="relative z-10 mt-0.5 shrink-0 self-start rounded-full bg-[#141433]">{ICONS[s.status]}</span>
            <div className="min-w-0">
              <p className={`text-sm font-medium ${s.status === "pending" ? "text-white/40" : "text-white"}`}>
                {s.id}. {s.title}
              </p>
              {s.detail && <p className="mt-0.5 break-words text-xs text-white/55">{s.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
      {logs.length > 0 && (
        <div className="glass-soft mt-4 max-h-40 space-y-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed text-white/50">
          {logs.map((l, i) => (
            <p key={i}>› {l}</p>
          ))}
        </div>
      )}
    </section>
  );
}
