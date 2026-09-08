import { clsxLite as cx } from '../lib/cx'

/* Kichik, qayta ishlatiladigan UI primitivlari. */

export function Card({ num, title, subtitle, action, className = '', bodyClass = 'p-4', children }) {
  return (
    <section className={cx('card', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-ink-200 px-4 py-3 dark:border-brand-400/10">
          <div className="flex min-w-0 items-start gap-2.5">
            {/* Infografikadagi "01", "02" bo'lim raqamlari */}
            {num && <span className="section-num mt-0.5">{num}</span>}
            <div className="min-w-0">
              {title && <h2 className="card-title">{title}</h2>}
              {subtitle && <p className="mt-0.5 text-xs muted">{subtitle}</p>}
            </div>
          </div>
          {action}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

const TONES = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-400/35',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/35',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/35',
  rose: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/35',
  sky: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/35',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/35',
  slate: 'bg-ink-100 text-ink-600 ring-ink-400/20 dark:bg-ink-800/70 dark:text-ink-300 dark:ring-ink-600/40',
}

export function Badge({ tone = 'slate', children, className = '' }) {
  return (
    <span className={cx(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
      TONES[tone] ?? TONES.slate, className,
    )}>
      {children}
    </span>
  )
}

export function Dot({ tone = 'emerald', pulse = false }) {
  const color = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500', slate: 'bg-ink-400' }[tone]
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {pulse && <span className={cx('absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-ring', color)} />}
      <span className={cx('relative inline-flex h-2 w-2 rounded-full', color)} />
    </span>
  )
}

export function Avatar({ name, size = 'md', color }) {
  const dims = { sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm' }[size]
  const letters = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-ink-950', dims)}
      style={{ background: color ?? '#22c3f5' }}
      aria-hidden="true"
    >
      {letters}
    </span>
  )
}

export function Progress({ value, max = 100, tone = 'brand' }) {
  const percent = Math.min(100, (value / max) * 100)
  const bar = {
    brand: 'bg-brand-500 dark:bg-brand-400 dark:shadow-glow-sm',
    emerald: 'bg-emerald-500 dark:shadow-glow-sm',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500',
  }[tone]
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800/80">
      <div className={cx('h-full rounded-full transition-all duration-500', bar)} style={{ width: `${percent}%` }} />
    </div>
  )
}

export function Empty({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && <Icon className="h-8 w-8 text-ink-300 dark:text-ink-600" />}
      <p className="text-sm font-medium text-ink-700 dark:text-ink-200">{title}</p>
      {hint && <p className="max-w-xs text-xs muted">{hint}</p>}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500 dark:text-brand-300/80">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
