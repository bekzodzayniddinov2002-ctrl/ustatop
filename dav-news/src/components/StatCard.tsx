import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string; hint?: string }) {
  return (
    <div className="glass flex items-center gap-4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
        <Icon className="h-5 w-5 text-violet-200" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
        <p className="truncate text-base font-semibold text-white" title={value}>{value}</p>
        {hint && <p className="truncate text-xs text-white/40">{hint}</p>}
      </div>
    </div>
  );
}
