import { Link } from 'react-router-dom'
import {
  Activity, ArrowRight, CheckCircle2, ClipboardList, Clock, Star, TrendingUp,
  Users, Wallet,
} from 'lucide-react'
import { useApp } from '../store'
import { StatCard } from '../components/StatCard'
import { CategoryDonut, DailyOrdersChart, RevenueChart } from '../components/charts'
import { Badge, Card, Dot, PageHeader, Progress } from '../components/ui'
import { LiveMap } from '../components/LiveMap'
import { dailySeries, kpiTargets, monthlySeries, roadmap, statusLabels, statusTone, systemHealth } from '../data/mockData'
import { ago, num, pct, sum } from '../lib/format'

export default function Dashboard() {
  const { stats, orders, workers, byCategory, categoryById, connected } = useApp()

  const recent = orders.slice(0, 7)
  const topWorkers = [...workers]
    .filter((w) => w.status !== 'blocked')
    .sort((a, b) => b.rating * 20 + b.jobs - (a.rating * 20 + a.jobs))
    .slice(0, 5)

  return (
    <>
      <PageHeader
        title="Boshqaruv paneli"
        subtitle="Navoiy pilot loyihasi — real-vaqt ko‘rsatkichlari">
        <Badge tone={connected ? 'emerald' : 'slate'}>
          <Dot tone={connected ? 'emerald' : 'slate'} pulse={connected} />
          {connected ? 'Socket.io ulangan' : 'Oqim pauzada'}
        </Badge>
        <Link to="/analitika" className="btn-ghost">
          Batafsil analitika <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      {/* --- asosiy KPI qatori --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} label="Jami buyurtmalar" value={num(stats.totalOrders)}
          delta={12.4} hint="pilot boshidan beri" tone="brand" />
        <StatCard icon={Wallet} label="Platforma daromadi" value={sum(stats.revenue, { short: true })}
          delta={18.2} hint={`GMV ${sum(stats.gmv, { short: true })}`} tone="emerald" />
        <StatCard icon={Users} label="Online ustalar" value={`${stats.onlineWorkers} / ${stats.totalWorkers}`}
          delta={6.1} hint="hozir ish qabul qilmoqda" tone="indigo" />
        <StatCard icon={Star} label="O‘rtacha reyting" value={stats.avgRating.toFixed(2)}
          delta={2.3} hint={`mamnunlik ${pct(stats.completionRate)}`} tone="amber" />
      </div>

      {/* --- ikkilamchi ko'rsatkichlar --- */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Faol buyurtmalar" value={num(stats.active)}
          hint="yangi + yo‘lda + bajarilmoqda" tone="sky" />
        <StatCard icon={Clock} label="O‘rtacha javob vaqti" value={`${Math.round(stats.avgResponseSec)} s`}
          hint="SLA: 120 soniya" tone="amber" />
        <StatCard icon={CheckCircle2} label="Bajarilish darajasi" value={pct(stats.completionRate, 1)}
          hint={`${stats.cancelled} ta bekor qilingan`} tone="emerald" />
        <StatCard icon={TrendingUp} label="O‘rtacha chek" value={sum(stats.avgCheck, { short: true })}
          hint="bajarilgan buyurtmalar bo‘yicha" tone="brand" />
      </div>

      {/* --- grafiklar --- */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card num="01" className="xl:col-span-2" title="Aylanma va buyurtmalar dinamikasi"
          subtitle="Pilot boshlanganidan buyon oylik o‘sish">
          <RevenueChart data={monthlySeries} />
        </Card>

        <Card num="02" title="Kategoriyalar kesimi" subtitle="Buyurtmalar taqsimoti">
          <CategoryDonut data={byCategory} />
          <ul className="mt-3 space-y-1.5">
            {byCategory.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c.color }} />
                <span className="flex-1 truncate text-ink-700 dark:text-ink-200">{c.name}</span>
                <span className="tnum font-semibold text-ink-900 dark:text-white">{c.orders}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card num="03" className="xl:col-span-2" title="So‘nggi 14 kun" subtitle="Kunlik buyurtmalar va bajarilishi">
          <DailyOrdersChart data={dailySeries} />
        </Card>

        <Card num="04" title="Yillik KPI maqsadlari" subtitle="Pitch deck bo‘yicha rejalar">
          <ul className="space-y-4">
            {Object.entries(kpiTargets).map(([key, k]) => {
              const isMoney = key === 'revenueYear'
              return (
                <li key={key}>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="truncate text-ink-700 dark:text-ink-200">{k.label}</span>
                    <span className="shrink-0 tnum font-semibold text-ink-900 dark:text-white">
                      {isMoney ? sum(k.current, { short: true }) : num(k.current)}
                      <span className="muted"> / {isMoney ? sum(k.target, { short: true }) : num(k.target)}</span>
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={k.current} max={k.target} />
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-5 border-t border-ink-200 pt-4 dark:border-brand-400/10">
            <p className="mb-2 text-xs font-semibold text-ink-900 dark:text-ink-100">Kengayish rejasi</p>
            <ol className="space-y-2">
              {roadmap.map((r) => (
                <li key={r.city} className="flex items-center gap-2 text-xs">
                  <Dot tone={r.state === 'done' ? 'emerald' : r.state === 'active' ? 'amber' : 'slate'}
                    pulse={r.state === 'active'} />
                  <span className="font-medium text-ink-800 dark:text-ink-100">{r.city}</span>
                  <span className="ml-auto muted">{r.period}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      </div>

      {/* --- xarita + tizim holati --- */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card num="05" className="xl:col-span-2" bodyClass="p-0"
          title="Ustalar joylashuvi" subtitle="Real-vaqt GPS kuzatuvi (±5m)"
          action={<Link to="/xarita" className="btn-ghost !py-1.5 !text-xs">To‘liq xarita</Link>}>
          <div className="p-4 pt-0">
            <LiveMap workers={workers} orders={orders} height={360} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card num="06" title="Tizim holati" subtitle="Backend va real-vaqt qatlami">
            <dl className="grid grid-cols-2 gap-3">
              {systemHealth.map((h) => (
                <div key={h.label} className="rounded-lg border border-ink-200 p-3 dark:border-brand-400/15 dark:bg-brand-500/5">
                  <dt className="text-xs muted">{h.label}</dt>
                  <dd className="mt-1 text-base font-bold text-ink-900 dark:text-brand-300">{h.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Eng faol ustalar" subtitle="Reyting va bajarilgan ishlar bo‘yicha">
            <ul className="space-y-3">
              {topWorkers.map((w, i) => (
                <li key={w.id} className="flex items-center gap-3">
                  <span className="w-4 shrink-0 text-center text-xs font-bold tnum muted">{i + 1}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: categoryById[w.categoryId]?.color }}>
                    {w.name.split(' ').map((p) => p[0]).join('')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink-900 dark:text-white">{w.name}</span>
                    <span className="block truncate text-xs muted">{categoryById[w.categoryId]?.name}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-xs font-semibold tnum text-ink-900 dark:text-white">★ {w.rating}</span>
                    <span className="block text-[11px] tnum muted">{w.jobs} ish</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* --- so'nggi buyurtmalar --- */}
      <Card className="mt-4" bodyClass="p-0" title="So‘nggi buyurtmalar"
        subtitle="Real-vaqt oqimi"
        action={<Link to="/buyurtmalar" className="btn-ghost !py-1.5 !text-xs">Barchasi</Link>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-ink-200 dark:border-brand-400/10">
              <tr>
                <th className="th">ID</th>
                <th className="th">Mijoz</th>
                <th className="th">Xizmat</th>
                <th className="th">Usta</th>
                <th className="th">Summa</th>
                <th className="th">Holat</th>
                <th className="th">Vaqt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800/70">
              {recent.map((o) => (
                <tr key={o.id} className={o.isNew ? 'animate-fade-in bg-brand-50/50 dark:bg-brand-500/10' : ''}>
                  <td className="td font-semibold tnum">{o.id}</td>
                  <td className="td whitespace-nowrap">{o.clientName}</td>
                  <td className="td">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: categoryById[o.categoryId]?.color }} />
                      {categoryById[o.categoryId]?.name}
                    </span>
                  </td>
                  <td className="td whitespace-nowrap">{o.workerName ?? <span className="muted">— tayinlanmagan</span>}</td>
                  <td className="td whitespace-nowrap tnum">{sum(o.price)}</td>
                  <td className="td"><Badge tone={statusTone[o.status]}>{statusLabels[o.status]}</Badge></td>
                  <td className="td whitespace-nowrap muted">{ago(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
