import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { clsxLite as cx } from '../lib/cx'

// Ikonka doirasi — infografikadagi kabi rangli halqa ichida yorug' belgi
const ICON_TONES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-1 dark:ring-brand-400/30',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-1 dark:ring-emerald-400/30',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-1 dark:ring-amber-400/30',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-1 dark:ring-indigo-400/30',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-1 dark:ring-rose-400/30',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-1 dark:ring-sky-400/30',
}

// Qiymat rangi ham ikonkaga hamohang bo'lsin (qorong'i rejimda neon)
const VALUE_TONES = {
  brand: 'dark:text-brand-300',
  emerald: 'dark:text-emerald-300',
  amber: 'dark:text-amber-300',
  indigo: 'dark:text-indigo-300',
  rose: 'dark:text-rose-300',
  sky: 'dark:text-sky-300',
}

/** Asosiy KPI kartochkasi: qiymat, o'zgarish foizi va izoh. */
export function StatCard({ icon: Icon, label, value, hint, delta, tone = 'brand' }) {
  const up = delta != null && delta >= 0
  return (
    <div className="card p-4 animate-fade-in transition-shadow dark:hover:shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase leading-tight tracking-wide muted">{label}</p>
          <p className={cx('stat-value mt-2', VALUE_TONES[tone])}>{value}</p>
        </div>
        {Icon && (
          <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-full', ICON_TONES[tone])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start gap-2 text-xs">
        {delta != null && (
          <span className={cx(
            'inline-flex items-center gap-0.5 font-semibold',
            up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
          )}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {up ? '+' : ''}{delta}%
          </span>
        )}
        {hint && <span className="leading-snug muted">{hint}</span>}
      </div>
    </div>
  )
}
