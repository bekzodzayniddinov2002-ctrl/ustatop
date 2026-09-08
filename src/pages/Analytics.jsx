import { Building2, Percent, TrendingUp, Wallet } from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useApp } from '../store'
import { Card, PageHeader, Progress } from '../components/ui'
import { StatCard } from '../components/StatCard'
import { CategoryDonut, HourlyLoadChart, RevenueChart } from '../components/charts'
import { hourlyLoad, kpiTargets, monthlySeries } from '../data/mockData'
import { axisSum, num, pct, sum } from '../lib/format'

/** Bozor hajmi — pitch deck "Bozor tahlili" slaydidan (yillik, so'm). */
const marketSize = [
  { name: 'Uy ta’miri xizmatlari', value: 14.4e12 },
  { name: 'Maishiy texnika ta’miri', value: 8.2e12 },
  { name: 'Tozalash xizmatlari', value: 4.1e12 },
]

export default function Analytics() {
  const { stats, byCategory, orders, workers } = useApp()

  const commissionRate = stats.gmv ? (stats.revenue / stats.gmv) * 100 : 0
  const repeatClients = new Set(
    orders.map((o) => o.clientName).filter((n, i, arr) => arr.indexOf(n) !== i),
  ).size
  const revenuePerWorker = workers.length ? stats.revenue / workers.length : 0

  return (
    <>
      <PageHeader title="Analitika" subtitle="Moliyaviy ko‘rsatkichlar, bozor va o‘sish dinamikasi" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Platforma daromadi" value={sum(stats.revenue, { short: true })}
          delta={18.2} hint="komissiya hisobidan" tone="emerald" />
        <StatCard icon={TrendingUp} label="GMV (umumiy aylanma)" value={sum(stats.gmv, { short: true })}
          delta={16.7} hint="ustalar oboroti bilan" tone="brand" />
        <StatCard icon={Percent} label="Amaldagi komissiya" value={pct(commissionRate, 1)}
          hint="rejadagi diapazon: 15–20%" tone="amber" />
        <StatCard icon={Building2} label="Bir ustaga daromad" value={sum(revenuePerWorker, { short: true })}
          hint={`${repeatClients} ta takroriy mijoz`} tone="indigo" />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Oylik o‘sish" subtitle="Aylanma (chap o‘q) va buyurtmalar (o‘ng o‘q)">
          <RevenueChart data={monthlySeries} height={300} />
        </Card>

        <Card title="Yillik maqsadlar" subtitle="Reja bajarilishi">
          <ul className="space-y-4">
            {Object.entries(kpiTargets).map(([key, k]) => {
              const isMoney = key === 'revenueYear'
              const done = (k.current / k.target) * 100
              return (
                <li key={key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-ink-700 dark:text-ink-200">{k.label}</span>
                    <span className="text-xs font-bold tnum text-brand-600 dark:text-brand-400">{pct(done, 1)}</span>
                  </div>
                  <div className="mt-1.5"><Progress value={k.current} max={k.target} /></div>
                  <p className="mt-1 text-[11px] tnum muted">
                    {isMoney ? sum(k.current, { short: true }) : num(k.current)} / {isMoney ? sum(k.target, { short: true }) : num(k.target)}
                  </p>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Kategoriyalar bo‘yicha daromad" subtitle="Komissiya hissasi" className="lg:col-span-2" bodyClass="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byCategory} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(133,144,164,.22)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#8590a4' }} axisLine={false}
                tickLine={false} tickFormatter={axisSum} />
              <YAxis type="category" dataKey="name" width={130} axisLine={false} tickLine={false}
                tick={{ fontSize: 12, fill: '#8590a4' }} />
              <Tooltip cursor={{ fill: 'rgba(2,128,144,.06)' }}
                formatter={(v) => [sum(v), 'Daromad']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid rgba(133,144,164,.3)' }} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {byCategory.map((c) => <Cell key={c.id} fill={c.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Buyurtmalar taqsimoti" subtitle="Kategoriya kesimi">
          <CategoryDonut data={byCategory} height={280} />
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Sutkalik yuklama" subtitle="Ustalar smenasini rejalashtirish uchun">
          <HourlyLoadChart data={hourlyLoad} height={220} />
          <p className="mt-2 text-xs muted">
            Eng yuqori talab 18:00 atrofida — kechki smenaga ko‘proq usta jalb qilish tavsiya etiladi.
          </p>
        </Card>

        <Card title="Bozor hajmi (O‘zbekiston)" subtitle="Yillik hajm, Milliy statistika qo‘mitasi 2025">
          <ul className="space-y-4">
            {marketSize.map((m) => (
              <li key={m.name}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-ink-800 dark:text-ink-100">{m.name}</span>
                  <span className="text-sm font-bold tnum text-ink-900 dark:text-white">
                    {(m.value / 1e12).toFixed(1)}T so‘m
                  </span>
                </div>
                <div className="mt-1.5"><Progress value={m.value} max={14.4e12} tone="indigo" /></div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-ink-200 pt-4 dark:border-ink-800">
            {[
              { k: 'Internet foydalanuvchilari', v: '32.7M' },
              { k: 'Penetratsiya', v: '89%' },
              { k: 'Mobile-first', v: '61%' },
            ].map((x) => (
              <div key={x.k}>
                <dt className="text-[11px] leading-tight muted">{x.k}</dt>
                <dd className="mt-1 text-lg font-bold text-ink-900 dark:text-white">{x.v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  )
}
