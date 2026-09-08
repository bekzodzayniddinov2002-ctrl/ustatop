import { useMemo, useState } from 'react'
import { ClipboardList, Search, X } from 'lucide-react'
import { useApp } from '../store'
import { Badge, Card, Empty, PageHeader } from '../components/ui'
import { categories, statusLabels, statusTone } from '../data/mockData'
import { ago, sum, time } from '../lib/format'
import { clsxLite as cx } from '../lib/cx'

const FILTERS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'active', label: 'Faol' },
  { id: 'new', label: 'Yangi' },
  { id: 'completed', label: 'Bajarilgan' },
  { id: 'cancelled', label: 'Bekor qilingan' },
]

const PAGE_SIZE = 15

export default function Orders() {
  const { orders, workers, categoryById, setOrderStatus, assignWorker } = useApp()
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (category !== 'all' && o.categoryId !== category) return false
      if (filter === 'active' && !['new', 'accepted', 'on_way', 'in_progress'].includes(o.status)) return false
      if (['new', 'completed', 'cancelled'].includes(filter) && o.status !== filter) return false
      if (!q) return true
      return [o.id, o.clientName, o.workerName, o.clientPhone, o.problem]
        .some((v) => v?.toLowerCase().includes(q))
    })
  }, [orders, filter, category, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const reset = (fn) => (v) => { fn(v); setPage(1) }

  return (
    <>
      <PageHeader title="Buyurtmalar" subtitle={`${filtered.length} ta buyurtma topildi`} />

      <Card bodyClass="p-0">
        {/* filtrlar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-200 p-4 dark:border-ink-800">
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" onClick={() => reset(setFilter)(f.id)}
                className={cx(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === f.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700',
                )}>
                {f.label}
              </button>
            ))}
          </div>

          <select value={category} onChange={(e) => reset(setCategory)(e.target.value)}
            className="input w-auto py-1.5 text-xs" aria-label="Kategoriya bo‘yicha filtr">
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label className="relative ml-auto w-full sm:w-64">
            <span className="sr-only">Buyurtmalar ichida qidirish</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => reset(setQuery)(e.target.value)}
              className="input py-1.5 pl-9 text-xs" placeholder="ID, mijoz yoki usta…" />
          </label>
        </div>

        {rows.length === 0 ? (
          <Empty icon={ClipboardList} title="Buyurtma topilmadi"
            hint="Filtrlarni o‘zgartirib ko‘ring yoki qidiruv so‘rovini tozalang." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="border-b border-ink-200 dark:border-ink-800">
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Mijoz</th>
                  <th className="th">Muammo</th>
                  <th className="th">Usta</th>
                  <th className="th">Summa</th>
                  <th className="th">Komissiya</th>
                  <th className="th">Holat</th>
                  <th className="th">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {rows.map((o) => (
                  <tr key={o.id} onClick={() => setDetail(o)}
                    className={cx(
                      'cursor-pointer transition-colors hover:bg-ink-50 dark:hover:bg-ink-800/50',
                      o.isNew && 'animate-fade-in bg-brand-50/60 dark:bg-brand-500/5',
                    )}>
                    <td className="td font-semibold tnum">{o.id}</td>
                    <td className="td whitespace-nowrap">
                      <span className="block font-medium text-ink-900 dark:text-white">{o.clientName}</span>
                      <span className="block text-xs muted">{o.clientPhone}</span>
                    </td>
                    <td className="td">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: categoryById[o.categoryId]?.color }} />
                        <span className="max-w-[170px] truncate">{o.problem}</span>
                      </span>
                    </td>
                    <td className="td whitespace-nowrap">{o.workerName ?? <span className="muted">—</span>}</td>
                    <td className="td whitespace-nowrap tnum">{sum(o.price)}</td>
                    <td className="td whitespace-nowrap tnum text-emerald-600 dark:text-emerald-400">{sum(o.commission)}</td>
                    <td className="td"><Badge tone={statusTone[o.status]}>{statusLabels[o.status]}</Badge></td>
                    <td className="td whitespace-nowrap muted">{ago(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pageCount > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-ink-200 p-3 dark:border-ink-800">
            <p className="text-xs muted">{current}-sahifa, jami {pageCount}</p>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost !py-1.5 !text-xs" disabled={current === 1}
                onClick={() => setPage(current - 1)}>Oldingi</button>
              <button type="button" className="btn-ghost !py-1.5 !text-xs" disabled={current === pageCount}
                onClick={() => setPage(current + 1)}>Keyingi</button>
            </div>
          </div>
        )}
      </Card>

      {detail && (
        <OrderDrawer order={detail} workers={workers} categoryById={categoryById}
          onClose={() => setDetail(null)}
          onStatus={(s) => { setOrderStatus(detail.id, s); setDetail({ ...detail, status: s }) }}
          onAssign={(id) => { assignWorker(detail.id, id); setDetail(null) }} />
      )}
    </>
  )
}

/** Buyurtma tafsilotlari paneli — holatni o'zgartirish va usta tayinlash. */
function OrderDrawer({ order, workers, categoryById, onClose, onStatus, onAssign }) {
  const candidates = workers
    .filter((w) => w.status === 'online' && w.categoryId === order.categoryId)
    .slice(0, 5)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Yopish" onClick={onClose}
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" />
      <aside className="relative flex w-full max-w-md animate-fade-in flex-col overflow-y-auto border-l border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
        <header className="flex items-start justify-between gap-3 border-b border-ink-200 p-4 dark:border-ink-800">
          <div>
            <h2 className="text-lg font-bold tnum text-ink-900 dark:text-white">Buyurtma {order.id}</h2>
            <p className="mt-1 text-xs muted">{time(order.createdAt)} · {ago(order.createdAt)}</p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost !px-2" aria-label="Yopish">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 p-4">
          <Badge tone={statusTone[order.status]}>{statusLabels[order.status]}</Badge>

          <dl className="space-y-3 text-sm">
            <Row label="Mijoz" value={`${order.clientName} · ${order.clientPhone}`} />
            <Row label="Xizmat" value={categoryById[order.categoryId]?.name} />
            <Row label="Muammo" value={order.problem} />
            <Row label="Manzil" value={`${order.district} (${order.lat.toFixed(4)}, ${order.lng.toFixed(4)})`} />
            <Row label="Usta" value={order.workerName ?? 'Tayinlanmagan'} />
            <Row label="Summa" value={sum(order.price)} />
            <Row label="Platforma komissiyasi" value={sum(order.commission)} />
            <Row label="Ustaga o‘tkaziladi" value={sum(order.price - order.commission)} />
            {order.responseSec != null && <Row label="Javob vaqti" value={`${order.responseSec} soniya`} />}
            {order.rating != null && <Row label="Mijoz bahosi" value={`★ ${order.rating}`} />}
          </dl>

          {!order.workerName && candidates.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-ink-900 dark:text-ink-100">
                Yaqin atrofdagi online ustalar
              </p>
              <ul className="space-y-2">
                {candidates.map((w) => (
                  <li key={w.id} className="flex items-center gap-2 rounded-lg border border-ink-200 p-2 dark:border-ink-800">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900 dark:text-white">{w.name}</span>
                      <span className="block text-xs muted">★ {w.rating} · ~{w.avgArrivalMin} daq · {w.district}</span>
                    </span>
                    <button type="button" onClick={() => onAssign(w.id)} className="btn-primary !py-1.5 !text-xs">
                      Tayinlash
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-ink-200 pt-4 dark:border-ink-800">
            {order.status !== 'completed' && (
              <button type="button" onClick={() => onStatus('completed')} className="btn-primary !text-xs">
                Bajarildi deb belgilash
              </button>
            )}
            {order.status !== 'cancelled' && (
              <button type="button" onClick={() => onStatus('cancelled')} className="btn-danger !text-xs">
                Bekor qilish
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-xs muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink-900 dark:text-ink-100">{value}</dd>
    </div>
  )
}
