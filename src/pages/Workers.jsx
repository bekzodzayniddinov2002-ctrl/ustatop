import { useMemo, useState } from 'react'
import { BadgeCheck, Ban, Search, ShieldQuestion, Users } from 'lucide-react'
import { useApp } from '../store'
import { Avatar, Badge, Card, Dot, Empty, PageHeader } from '../components/ui'
import { StatCard } from '../components/StatCard'
import { categories } from '../data/mockData'
import { date, num, pct, sum } from '../lib/format'
import { clsxLite as cx } from '../lib/cx'

const TABS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'online', label: 'Online' },
  { id: 'offline', label: 'Offline' },
  { id: 'unverified', label: 'Tekshirilmagan' },
  { id: 'blocked', label: 'Bloklangan' },
]

export default function Workers() {
  const { workers, stats, categoryById, setWorkerStatus, toggleVerified } = useApp()
  const [tab, setTab] = useState('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return workers.filter((w) => {
      if (category !== 'all' && w.categoryId !== category) return false
      if (tab === 'unverified' && w.verified) return false
      if (['online', 'offline', 'blocked'].includes(tab) && w.status !== tab) return false
      if (!q) return true
      return [w.name, w.phone, w.id, w.district].some((v) => v.toLowerCase().includes(q))
    })
  }, [workers, tab, category, query])

  const avgRating = workers.reduce((s, w) => s + w.rating, 0) / workers.length
  const totalPayout = workers.reduce((s, w) => s + w.earnings, 0)

  return (
    <>
      <PageHeader title="Ustalar" subtitle="Ro‘yxatdan o‘tgan ustalarni tekshirish va boshqarish" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Jami ustalar" value={num(workers.length)}
          hint={`${stats.onlineWorkers} tasi hozir online`} tone="brand" />
        <StatCard icon={BadgeCheck} label="Tekshirilgan" value={num(workers.filter((w) => w.verified).length)}
          hint={`${stats.pendingVerification} ta kutmoqda`} tone="emerald" />
        <StatCard icon={ShieldQuestion} label="O‘rtacha reyting" value={avgRating.toFixed(2)}
          hint="5 ballik shkala" tone="amber" />
        <StatCard icon={Ban} label="Ustalarga to‘lovlar" value={sum(totalPayout, { short: true })}
          hint="pilot davomida jami" tone="indigo" />
      </div>

      <Card className="mt-4" bodyClass="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-200 p-4 dark:border-ink-800">
          <div className="flex flex-wrap gap-1">
            {TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={cx(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  tab === t.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700',
                )}>
                {t.label}
              </button>
            ))}
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="input w-auto py-1.5 text-xs" aria-label="Kategoriya bo‘yicha filtr">
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label className="relative ml-auto w-full sm:w-64">
            <span className="sr-only">Ustalar ichida qidirish</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              className="input py-1.5 pl-9 text-xs" placeholder="Ism, telefon yoki ID…" />
          </label>
        </div>

        {rows.length === 0 ? (
          <Empty icon={Users} title="Usta topilmadi" hint="Boshqa filtr yoki qidiruv so‘rovini sinab ko‘ring." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] [&_td]:px-3 [&_th]:px-3">
              <thead className="border-b border-ink-200 dark:border-ink-800">
                <tr>
                  <th className="th">Usta</th>
                  <th className="th">Kategoriya</th>
                  <th className="th">Reyting</th>
                  <th className="th">Ishlar</th>
                  <th className="th">Qabul %</th>
                  <th className="th">Daromad</th>
                  <th className="th">Holat</th>
                  <th className="th">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {rows.map((w) => (
                  <tr key={w.id} className="transition-colors hover:bg-ink-50 dark:hover:bg-ink-800/50">
                    <td className="td whitespace-nowrap">
                      <span className="flex items-center gap-3">
                        <Avatar name={w.name} color={categoryById[w.categoryId]?.color} />
                        <span className="min-w-0">
                          <span className="flex items-center gap-1 font-medium text-ink-900 dark:text-white">
                            <span className="truncate">{w.name}</span>
                            {w.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand-600" />}
                          </span>
                          <span className="block text-xs muted">{w.id} · {w.phone}</span>
                        </span>
                      </span>
                    </td>
                    <td className="td whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: categoryById[w.categoryId]?.color }} />
                        {categoryById[w.categoryId]?.name}
                      </span>
                    </td>
                    <td className="td tnum">★ {w.rating}</td>
                    <td className="td tnum">{w.jobs}</td>
                    <td className="td tnum">{pct(w.acceptRate)}</td>
                    <td className="td whitespace-nowrap tnum">{sum(w.earnings, { short: true })}</td>
                    <td className="td">
                      <Badge tone={w.status === 'online' ? 'emerald' : w.status === 'blocked' ? 'rose' : 'slate'}>
                        <Dot tone={w.status === 'online' ? 'emerald' : w.status === 'blocked' ? 'rose' : 'slate'}
                          pulse={w.status === 'online'} />
                        {w.status === 'online' ? 'Online' : w.status === 'blocked' ? 'Bloklangan' : 'Offline'}
                      </Badge>
                    </td>
                    <td className="td whitespace-nowrap">
                      <span className="flex gap-1.5">
                        <button type="button" onClick={() => toggleVerified(w.id)}
                          className="btn-ghost !px-2 !py-1 !text-[11px]"
                          title={w.verified ? 'Tekshiruvni bekor qilish' : 'Tekshirilgan deb belgilash'}>
                          {w.verified ? 'Bekor' : 'Tasdiq'}
                        </button>
                        {w.status === 'blocked' ? (
                          <button type="button" onClick={() => setWorkerStatus(w.id, 'offline')}
                            className="btn-ghost !px-2 !py-1 !text-[11px]"
                            title="Blokdan chiqarish">Blokdan</button>
                        ) : (
                          <button type="button" onClick={() => setWorkerStatus(w.id, 'blocked')}
                            className="btn-ghost !px-2 !py-1 !text-[11px] !text-rose-600 dark:!text-rose-400"
                            title="Ustani bloklash">Bloklash</button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-ink-200 px-4 py-3 text-xs muted dark:border-ink-800">
          {rows.length} ta usta ko‘rsatilmoqda · eng erta ro‘yxatdan o‘tgan:{' '}
          {date([...workers].sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt))[0].joinedAt)}
        </div>
      </Card>
    </>
  )
}
