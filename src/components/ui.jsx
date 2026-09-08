import { clsxLite as cx } from '../lib/cx'

/* Kichik, qayta ishlatiladigan UI primitivlari. */

export function Card({ title, subtitle, action, className = '', bodyClass = 'p-4', children }) {
  return (
    <section className={cx('card', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-ink-200 px-4 py-3 dark:border-ink-800">
          <div>
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

const TONES = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-400/20',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  rose: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20',
  sky: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20',
  slate: 'bg-ink-100 text-ink-600 ring-ink-400/20 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-600/30',
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
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white', dims)}
      style={{ background: color ?? '#028090' }}
      aria-hidden="true"
    >
      {letters}
    </span>
  )
}

export function Progress({ value, max = 100, tone = 'brand' }) {
  const percent = Math.min(100, (value / max) * 100)
  const bar = { brand: 'bg-brand-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', indigo: 'bg-indigo-500' }[tone]
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
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
        <h1 className="text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
