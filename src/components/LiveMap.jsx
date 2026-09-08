import { useMemo, useState } from 'react'
import { Crosshair, MapPin } from 'lucide-react'
import { CITY_CENTER, categoryById } from '../data/mockData'
import { Badge, Dot } from './ui'
import { clsxLite as cx } from '../lib/cx'

/**
 * Navoiy pilot hududining sxematik real-vaqt xaritasi.
 *
 * Tashqi tayl serverisiz ishlashi uchun koordinatalar to'g'ridan-to'g'ri SVG
 * viewBox'ga proyeksiya qilinadi. Ishlab chiqarishda bu qatlam
 * `react-native-maps` / MapLibre bilan almashtiriladi — kirish ma'lumoti
 * ({lat, lng, status}) o'zgarmaydi.
 */

const SPAN = { lat: 0.09, lng: 0.13 } // ko'rinish maydoni (~10x11 km)
const W = 100
const H = 66

function project({ lat, lng }) {
  return {
    x: ((lng - (CITY_CENTER.lng - SPAN.lng / 2)) / SPAN.lng) * W,
    y: H - ((lat - (CITY_CENTER.lat - SPAN.lat / 2)) / SPAN.lat) * H,
  }
}

const STATUS_FILL = { online: '#22c3f5', offline: '#5b7391', blocked: '#fb7185' }

export function LiveMap({ workers, orders = [], height = 420, showOrders = true }) {
  const [selected, setSelected] = useState(null)

  const pins = useMemo(() => workers.map((w) => ({ ...w, ...project(w) })), [workers])
  const orderPins = useMemo(
    () => (showOrders ? orders.filter((o) => ['new', 'accepted', 'on_way'].includes(o.status)) : [])
      .slice(0, 14).map((o) => ({ ...o, ...project(o) })),
    [orders, showOrders],
  )

  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-200 bg-[#eaf1f2] dark:border-brand-400/15 dark:bg-[#060f1f]" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice"
        role="img" aria-label="Navoiy shahri — ustalar joylashuvi">
        <defs>
          <pattern id="blocks" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M6 0H0V6" fill="none" stroke="rgba(34,195,245,.16)" strokeWidth=".28" />
          </pattern>
          <radialGradient id="glow">
            <stop offset="0%" stopColor="#22c3f5" stopOpacity=".28" />
            <stop offset="100%" stopColor="#22c3f5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* mahalla to'ri */}
        <rect width={W} height={H} fill="url(#blocks)" />
        {/* markaz atrofidagi faollik zonasi */}
        <circle cx={W / 2} cy={H / 2} r="26" fill="url(#glow)" />
        {/* asosiy magistrallar */}
        <path d={`M0 ${H * 0.42} L${W} ${H * 0.36}`} stroke="rgba(34,195,245,.32)" strokeWidth=".7" fill="none" />
        <path d={`M${W * 0.46} 0 L${W * 0.52} ${H}`} stroke="rgba(34,195,245,.32)" strokeWidth=".7" fill="none" />
        <path d={`M0 ${H * 0.78} Q${W * 0.5} ${H * 0.62} ${W} ${H * 0.84}`} stroke="rgba(34,195,245,.22)" strokeWidth=".5" fill="none" />

        {/* faol buyurtmalar */}
        {orderPins.map((o) => (
          <g key={o.id} transform={`translate(${o.x} ${o.y})`}>
            <circle r="1.6" fill="#fbbf24" fillOpacity=".22" />
            <circle r=".7" fill="#fbbf24" />
          </g>
        ))}

        {/* ustalar */}
        {pins.map((w) => {
          const isSel = selected?.id === w.id
          return (
            <g key={w.id} transform={`translate(${w.x} ${w.y})`}
              className="cursor-pointer"
              onClick={() => setSelected(isSel ? null : w)}>
              {w.status === 'online' && (
                <circle r="2.4" fill="#22c3f5" fillOpacity=".18">
                  <animate attributeName="r" values="1.4;3.2;1.4" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values=".28;0;.28" dur="2.6s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={isSel ? 1.7 : 1.15} fill={STATUS_FILL[w.status]}
                stroke={isSel ? '#fff' : 'rgba(255,255,255,.75)'} strokeWidth={isSel ? '.5' : '.28'} />
            </g>
          )
        })}
      </svg>

      {/* legenda */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
        <Badge tone="emerald"><Dot tone="emerald" /> Online</Badge>
        <Badge tone="slate"><Dot tone="slate" /> Offline</Badge>
        <Badge tone="amber"><Dot tone="amber" /> Faol buyurtma</Badge>
      </div>

      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-ink-700 shadow-card backdrop-blur dark:bg-ink-900/85 dark:text-ink-100 dark:ring-1 dark:ring-brand-400/25">
        <Crosshair className="h-3.5 w-3.5 text-brand-600 dark:text-brand-300" />
        Navoiy shahri
      </div>

      {/* tanlangan usta kartochkasi */}
      {selected && (
        <div className="absolute bottom-3 left-3 right-3 animate-fade-in rounded-xl border border-ink-200 bg-white/95 p-3 shadow-pop backdrop-blur dark:border-brand-400/30 dark:bg-ink-900/95 sm:right-auto sm:w-72">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">{selected.name}</p>
              <p className="truncate text-xs muted">
                {categoryById[selected.categoryId]?.name} · {selected.district}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(null)}
              className="shrink-0 text-xs muted hover:text-ink-900 dark:hover:text-white">
              Yopish
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge tone={selected.status === 'online' ? 'emerald' : selected.status === 'blocked' ? 'rose' : 'slate'}>
              {selected.status === 'online' ? 'Online' : selected.status === 'blocked' ? 'Bloklangan' : 'Offline'}
            </Badge>
            <Badge tone="amber">★ {selected.rating}</Badge>
            <Badge tone="sky">{selected.jobs} ish</Badge>
            <Badge tone="indigo">~{selected.avgArrivalMin} daq</Badge>
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs muted">
            <MapPin className="h-3 w-3" />
            {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  )
}

/** Xarita yonidagi qisqa statistika ustuni. */
export function MapLegendStats({ items }) {
  return (
    <dl className="grid grid-cols-2 gap-3">
      {items.map((it) => (
        <div key={it.label} className={cx('rounded-lg border border-ink-200 p-3 dark:border-brand-400/15 dark:bg-brand-500/5')}>
          <dt className="text-xs muted">{it.label}</dt>
          <dd className="mt-1 text-lg font-bold tnum text-ink-900 dark:text-brand-300">{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}
