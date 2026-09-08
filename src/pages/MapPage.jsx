import { useMemo, useState } from 'react'
import { Radio } from 'lucide-react'
import { useApp } from '../store'
import { LiveMap, MapLegendStats } from '../components/LiveMap'
import { Badge, Card, Dot, PageHeader } from '../components/ui'
import { categories, statusLabels, statusTone } from '../data/mockData'
import { ago, num, sum } from '../lib/format'
import { clsxLite as cx } from '../lib/cx'

export default function MapPage() {
  const { workers, orders, stats, categoryById, connected, liveEnabled, setLiveEnabled } = useApp()
  const [category, setCategory] = useState('all')
  const [onlyOnline, setOnlyOnline] = useState(false)

  const visible = useMemo(() => workers.filter((w) => {
    if (category !== 'all' && w.categoryId !== category) return false
    if (onlyOnline && w.status !== 'online') return false
    return true
  }), [workers, category, onlyOnline])

  const activeOrders = orders
    .filter((o) => ['new', 'accepted', 'on_way', 'in_progress'].includes(o.status))
    .slice(0, 10)

  return (
    <>
      <PageHeader title="Real-vaqt xarita" subtitle="Navoiy shahri — ustalar va faol buyurtmalar">
        <Badge tone={connected ? 'emerald' : 'slate'}>
          <Dot tone={connected ? 'emerald' : 'slate'} pulse={connected} />
          {connected ? 'GPS oqimi faol' : 'Oqim to‘xtatilgan'}
        </Badge>
        <button type="button" onClick={() => setLiveEnabled((v) => !v)} className="btn-ghost">
          <Radio className="h-4 w-4" />
          {liveEnabled ? 'Pauza' : 'Davom ettirish'}
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" bodyClass="p-4"
          title="Ustalar joylashuvi"
          subtitle={`${visible.length} ta usta ko‘rsatilmoqda · yangilanish har 4 soniyada`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="input w-auto py-1.5 text-xs" aria-label="Kategoriya bo‘yicha filtr">
                <option value="all">Barcha kategoriyalar</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="button" onClick={() => setOnlyOnline((v) => !v)}
                className={cx('rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  onlyOnline
                    ? 'bg-brand-600 text-white'
                    : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300')}>
                Faqat online
              </button>
            </div>
          }>
          <LiveMap workers={visible} orders={orders} height={520} />
          <p className="mt-3 text-xs muted">
            Xarita sxematik: koordinatalar Navoiy shahri markazi atrofidagi ~10 km maydonga
            proyeksiya qilingan. Ishlab chiqarishda bu qatlam MapLibre / react-native-maps bilan almashtiriladi.
          </p>
        </Card>

        <div className="space-y-4">
          <Card title="Jonli ko‘rsatkichlar">
            <MapLegendStats items={[
              { label: 'Online ustalar', value: num(stats.onlineWorkers) },
              { label: 'Faol buyurtmalar', value: num(stats.active) },
              { label: 'O‘rtacha yetib borish', value: `${Math.round(visible.reduce((s, w) => s + w.avgArrivalMin, 0) / (visible.length || 1))} daq` },
              { label: 'Qamrov radiusi', value: '7 km' },
            ]} />
          </Card>

          <Card title="Faol buyurtmalar" subtitle="Hozir bajarilayotgan ishlar" bodyClass="p-0">
            <ul className="divide-y divide-ink-100 dark:divide-ink-800/70">
              {activeOrders.map((o) => (
                <li key={o.id} className="flex items-start gap-3 p-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: categoryById[o.categoryId]?.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold tnum text-ink-900 dark:text-white">{o.id}</span>
                      <Badge tone={statusTone[o.status]}>{statusLabels[o.status]}</Badge>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-600 dark:text-ink-300">{o.problem}</span>
                    <span className="mt-0.5 block text-xs muted">
                      {o.workerName ?? 'usta kutilmoqda'} · {o.district} · {ago(o.createdAt)}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold tnum text-ink-900 dark:text-white">
                    {sum(o.price, { short: true })}
                  </span>
                </li>
              ))}
              {activeOrders.length === 0 && (
                <li className="p-6 text-center text-xs muted">Hozircha faol buyurtma yo‘q.</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
