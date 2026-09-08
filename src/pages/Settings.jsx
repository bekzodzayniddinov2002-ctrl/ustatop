import { useState } from 'react'
import { RotateCcw, Save } from 'lucide-react'
import { useApp } from '../store'
import { Badge, Card, PageHeader } from '../components/ui'
import { categories, defaultSettings } from '../data/mockData'
import { sum } from '../lib/format'

export default function Settings() {
  const { settings, saveSettings } = useApp()
  const [draft, setDraft] = useState(settings)
  const [prices, setPrices] = useState(
    Object.fromEntries(categories.map((c) => [c.id, c.basePrice])),
  )

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings)
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }))

  return (
    <>
      <PageHeader title="Sozlamalar" subtitle="Komissiya, narxlar va platforma qoidalari">
        <button type="button" className="btn-ghost" onClick={() => setDraft(defaultSettings)}>
          <RotateCcw className="h-4 w-4" /> Standart holatga
        </button>
        <button type="button" className="btn-primary" disabled={!dirty} onClick={() => saveSettings(draft)}>
          <Save className="h-4 w-4" /> Saqlash
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Monetizatsiya" subtitle="Pitch deck bo‘yicha komissiya 15–20% oralig‘ida">
          <div className="space-y-5">
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="commission" className="text-sm font-medium text-ink-800 dark:text-ink-100">
                  Platforma komissiyasi
                </label>
                <span className="text-sm font-bold tnum text-brand-600 dark:text-brand-400">
                  {draft.commissionRate}%
                </span>
              </div>
              <input id="commission" type="range" min="5" max="30" step="1" value={draft.commissionRate}
                onChange={(e) => set('commissionRate')(Number(e.target.value))}
                className="mt-2 w-full accent-brand-600" />
              <p className="mt-1 text-xs muted">
                100 000 so‘mlik buyurtmada: platforma {sum(100000 * draft.commissionRate / 100)},
                usta {sum(100000 * (1 - draft.commissionRate / 100))}.
              </p>
              {(draft.commissionRate < 15 || draft.commissionRate > 20) && (
                <p className="mt-2">
                  <Badge tone="amber">Rejadagi 15–20% diapazondan tashqarida</Badge>
                </p>
              )}
            </div>

            <NumberField label="Minimal buyurtma summasi (so‘m)" value={draft.minOrderPrice}
              step={5000} onChange={set('minOrderPrice')} />
            <NumberField label="Buyurtmani qabul qilish oynasi (soniya)" value={draft.acceptWindowSec}
              step={10} onChange={set('acceptWindowSec')}
              hint="Shu vaqt ichida javob bermagan usta o‘tkazib yuboriladi." />
            <NumberField label="Qidiruv radiusi (km)" value={draft.searchRadiusKm}
              step={1} onChange={set('searchRadiusKm')} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Platforma qoidalari">
            <div className="space-y-1">
              <Toggle label="Avtomatik tayinlash"
                hint="Buyurtma barcha online ustalarga bir vaqtda yuboriladi"
                checked={draft.autoAssign} onChange={set('autoAssign')} />
              <Toggle label="Majburiy tekshiruv"
                hint="Faqat tekshirilgan ustalar buyurtma qabul qila oladi"
                checked={draft.requireVerification} onChange={set('requireVerification')} />
              <Toggle label="Naqd to‘lov" hint="Mijoz ustaga naqd to‘laydi"
                checked={draft.cashPayment} onChange={set('cashPayment')} />
              <Toggle label="Karta orqali to‘lov" hint="Payme / Click integratsiyasi — tez kunda"
                checked={draft.cardPayment} onChange={set('cardPayment')} />
            </div>
          </Card>

          <Card title="SMS shlyuzi">
            <label htmlFor="sender" className="mb-1.5 block text-xs font-medium text-ink-700 dark:text-ink-200">
              Jo‘natuvchi nomi (alfa-nom)
            </label>
            <input id="sender" value={draft.smsSender} onChange={(e) => set('smsSender')(e.target.value)}
              className="input uppercase" maxLength={11} />
            <p className="mt-1.5 text-xs muted">Operator tomonidan tasdiqlangan 11 belgigacha bo‘lgan nom.</p>
          </Card>
        </div>
      </div>

      <Card className="mt-4" bodyClass="p-0" title="Xizmat narxlari"
        subtitle="Har bir kategoriya uchun boshlang‘ich narx — mijozga taxminiy hisob shu asosda ko‘rsatiladi">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-ink-200 dark:border-brand-400/10">
              <tr>
                <th className="th">Kategoriya</th>
                <th className="th">Boshlang‘ich narx</th>
                <th className="th">Platforma ulushi</th>
                <th className="th">Ustaga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800/70">
              {categories.map((c) => {
                const price = prices[c.id]
                const fee = Math.round(price * draft.commissionRate / 100)
                return (
                  <tr key={c.id}>
                    <td className="td">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                        <span className="font-medium text-ink-900 dark:text-white">{c.name}</span>
                      </span>
                    </td>
                    <td className="td">
                      <input type="number" step={5000} min={0} value={price}
                        onChange={(e) => setPrices((p) => ({ ...p, [c.id]: Number(e.target.value) }))}
                        className="input w-36 py-1.5 tnum" aria-label={`${c.name} narxi`} />
                    </td>
                    <td className="td tnum text-emerald-600 dark:text-emerald-400">{sum(fee)}</td>
                    <td className="td tnum">{sum(price - fee)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function NumberField({ label, value, onChange, step = 1, hint }) {
  const id = label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-ink-100">
        {label}
      </label>
      <input id={id} type="number" step={step} min={0} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="input tnum" />
      {hint && <p className="mt-1 text-xs muted">{hint}</p>}
    </div>
  )
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500 dark:border-ink-600 dark:bg-ink-950" />
      <span>
        <span className="block text-sm font-medium text-ink-900 dark:text-white">{label}</span>
        {hint && <span className="mt-0.5 block text-xs muted">{hint}</span>}
      </span>
    </label>
  )
}
