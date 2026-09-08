import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell, ClipboardList, Cog, Home, LayoutDashboard, LineChart, MapPinned, Menu, Moon,
  MessageSquareText, Search, Sun, Users, Wifi, WifiOff, X,
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useApp } from '../store'
import { Badge, Dot } from './ui'
import { clsxLite as cx } from '../lib/cx'
import { time } from '../lib/format'

const NAV = [
  { to: '/', label: 'Boshqaruv paneli', icon: LayoutDashboard, end: true },
  { to: '/buyurtmalar', label: 'Buyurtmalar', icon: ClipboardList, badge: 'active' },
  { to: '/ustalar', label: 'Ustalar', icon: Users, badge: 'verify' },
  { to: '/xarita', label: 'Real-vaqt xarita', icon: MapPinned },
  { to: '/analitika', label: 'Analitika', icon: LineChart },
  { to: '/sms', label: 'SMS marketing', icon: MessageSquareText },
  { to: '/sozlamalar', label: 'Sozlamalar', icon: Cog },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white
                       dark:bg-brand-500/15 dark:text-brand-300 dark:ring-1 dark:ring-brand-400/40 dark:shadow-glow-sm">
        <Home className="h-[18px] w-[18px]" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-tight text-ink-900 dark:text-white">
          Usta<span className="text-brand-600 dark:text-brand-300">Top</span>
        </span>
        <span className="block text-[10px] uppercase tracking-widest muted">Admin panel</span>
      </span>
    </div>
  )
}

function Sidebar({ onNavigate }) {
  const { stats } = useApp()
  const counts = { active: stats.active, verify: stats.pendingVerification }

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-4"><Logo /></div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Asosiy menyu">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate}
            className={({ isActive }) => cx(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-1 dark:ring-brand-400/25'
                : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800/60 dark:hover:text-white',
            )}>
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1 truncate">{label}</span>
            {badge && counts[badge] > 0 && (
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold tnum text-white">
                {counts[badge]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-ink-200 bg-ink-50 p-3 dark:border-brand-400/15 dark:bg-brand-500/5">
        <p className="text-xs font-semibold text-ink-900 dark:text-ink-100">Pilot: Navoiy shahri</p>
        <p className="mt-1 text-[11px] leading-relaxed muted">
          Keyingi bosqich — Buxoro va Samarqand (2026).
        </p>
        <div className="mt-2 flex gap-1.5">
          <Badge tone="emerald">Navoiy ✓</Badge>
          <Badge tone="slate">Buxoro</Badge>
        </div>
      </div>
    </div>
  )
}

function Topbar({ onMenu }) {
  const { theme, toggle } = useTheme()
  const { connected, lastEventAt, liveEnabled, setLiveEnabled, stats } = useApp()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-ink-200 bg-white/90 px-4 backdrop-blur dark:border-brand-400/10 dark:bg-ink-950/80">
      <button type="button" onClick={onMenu}
        className="btn-ghost !px-2 lg:hidden" aria-label="Menyuni ochish">
        <Menu className="h-5 w-5" />
      </button>

      <label className="relative hidden max-w-sm flex-1 sm:block">
        <span className="sr-only">Qidirish</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input className="input pl-9" placeholder="Buyurtma, usta yoki telefon raqami…" />
      </label>

      <div className="ml-auto flex items-center gap-2">
        <button type="button" onClick={() => setLiveEnabled((v) => !v)}
          className={cx(
            'hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium sm:inline-flex',
            connected
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-1 dark:ring-emerald-400/30'
              : 'bg-ink-100 text-ink-600 dark:bg-ink-800/70 dark:text-ink-300',
          )}
          title={connected ? 'Socket.io ulangan — bosib to‘xtatish mumkin' : 'Real-vaqt oqim o‘chirilgan'}>
          {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {connected ? 'Real-vaqt' : 'Pauza'}
          {connected && lastEventAt && <span className="tnum opacity-70">{time(lastEventAt)}</span>}
        </button>

        <button type="button" className="btn-ghost relative !px-2" aria-label="Bildirishnomalar">
          <Bell className="h-[18px] w-[18px]" />
          {stats.active > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-ink-950" />
          )}
        </button>

        <button type="button" onClick={toggle} className="btn-ghost !px-2"
          aria-label={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}>
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        <div className="flex items-center gap-2 border-l border-ink-200 pl-2 dark:border-brand-400/10">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white
                           dark:bg-brand-500/15 dark:text-brand-300 dark:ring-1 dark:ring-brand-400/40">AB</span>
          <span className="hidden leading-tight md:block">
            <span className="block text-xs font-semibold text-ink-900 dark:text-white">Admin</span>
            <span className="block text-[11px] muted">Navoiy</span>
          </span>
        </div>
      </div>
    </header>
  )
}

function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white shadow-pop dark:bg-brand-500 dark:text-ink-950">
        <Dot tone="emerald" />
        {toast.message}
      </div>
    </div>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Sahifa almashganda mobil menyu yopilsin va tepaga qaytilsin.
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="min-h-screen">
      {/* doimiy yon panel — katta ekranlar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-ink-200 bg-white dark:border-brand-400/10 dark:bg-ink-950/80 dark:backdrop-blur lg:block">
        <Sidebar />
      </aside>

      {/* mobil yon panel */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Menyuni yopish"
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 animate-fade-in border-r border-ink-200 bg-white dark:border-brand-400/10 dark:bg-ink-950">
            <button type="button" onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-ink-400 hover:text-ink-900 dark:hover:text-white"
              aria-label="Yopish">
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  )
}
