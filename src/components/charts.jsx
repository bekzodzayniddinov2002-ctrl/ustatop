import {
  Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { axisSum, num, sum } from '../lib/format'

/**
 * Recharts uchun umumiy sozlamalar. Grafiklar yorug' va qorong'i rejimda bir xil
 * o'qilishi uchun o'q/grid ranglari CSS o'zgaruvchisi emas, `currentColor` bilan
 * emas — aniq rangda beriladi va `dark` klassiga qarab tanlanadi.
 */
const AXIS = { fontSize: 12, fill: '#7286a6' }
const GRID = 'rgba(114,134,166,.22)'

function TipBox({ active, payload, label, valueFormat }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs shadow-pop dark:border-brand-400/30 dark:bg-ink-900">
      <p className="mb-1 font-semibold text-ink-900 dark:text-ink-100">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="flex items-center gap-2 text-ink-600 dark:text-ink-300">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span>{p.name}:</span>
          <span className="font-semibold tnum text-ink-900 dark:text-ink-100">
            {valueFormat ? valueFormat(p.value, p.dataKey) : num(p.value)}
          </span>
        </p>
      ))}
    </div>
  )
}

/** Buyurtma va daromad dinamikasi — ikki o'qli maydon grafigi. */
export function RevenueChart({ data, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c3f5" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#22c3f5" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={AXIS} axisLine={false} tickLine={false} tickFormatter={axisSum} />
        <YAxis yAxisId="right" orientation="right" tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip content={<TipBox valueFormat={(v, k) => (k === 'revenue' ? sum(v, { short: true }) : num(v))} />} />
        <Area yAxisId="left" type="monotone" dataKey="revenue" name="Aylanma" stroke="#22c3f5"
          strokeWidth={2} fill="url(#gRevenue)" />
        <Line yAxisId="right" type="monotone" dataKey="orders" name="Buyurtmalar" stroke="#fbbf24"
          strokeWidth={2} dot={{ r: 3, fill: '#fbbf24' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

/** So'nggi 14 kunlik buyurtmalar — ustunli grafik. */
export function DailyOrdersChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={2}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false} interval={1} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip cursor={{ fill: 'rgba(34,195,245,.08)' }} content={<TipBox />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="orders" name="Buyurtmalar" fill="#3d6f8f" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" name="Bajarilgan" fill="#22c3f5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Kategoriyalar kesimi — halqa diagramma. */
export function CategoryDonut({ data, height = 260 }) {
  const total = data.reduce((s, d) => s + d.orders, 0)
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="orders" nameKey="name" innerRadius="58%" outerRadius="86%"
            paddingAngle={2} stroke="none">
            {data.map((d) => <Cell key={d.id} fill={d.color} />)}
          </Pie>
          <Tooltip content={<TipBox />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tnum text-ink-900 dark:text-white">{num(total)}</span>
        <span className="text-xs muted">buyurtma</span>
      </div>
    </div>
  )
}

/** Sutkalik yuklama — smena rejalashtirish uchun. */
export function HourlyLoadChart({ data, height = 200 }) {
  const peak = Math.max(...data.map((d) => d.orders))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="hour" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip cursor={{ fill: 'rgba(34,195,245,.08)' }} content={<TipBox />} />
        <Bar dataKey="orders" name="Buyurtmalar" radius={[4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.hour} fill={d.orders === peak ? '#22c3f5' : '#3d6f8f'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
