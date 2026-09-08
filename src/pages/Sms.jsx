import { useState } from 'react'
import { CheckCheck, Clock, Send, Users } from 'lucide-react'
import { useApp } from '../store'
import { Badge, Card, PageHeader } from '../components/ui'
import { StatCard } from '../components/StatCard'
import { date, num, pct } from '../lib/format'

const AUDIENCES = [
  { id: 'Barcha', hint: 'mijozlar + ustalar' },
  { id: 'Mijozlar', hint: 'ro‘yxatdan o‘tgan mijozlar' },
  { id: 'Ustalar', hint: 'barcha ustalar' },
  { id: 'Nofaol ustalar', hint: '14 kundan beri offline' },
]

const TEMPLATES = [
  { title: 'Chegirma aksiyasi', text: 'UstaTop: bu hafta barcha xizmatlarga 15% chegirma! Ilovani oching va ustani 2 daqiqada chaqiring.' },
  { title: 'Nofaol ustani qaytarish', text: 'UstaTop: hududingizda buyurtmalar ko‘paydi. Ilovani oching va online rejimga o‘ting — daromadingizni oshiring.' },
  { title: 'Yangi kategoriya', text: 'UstaTop: endi konditsioner xizmatlari ham mavjud. Ilovadan buyurtma bering!' },
]

const SMS_LIMIT = 160

export default function Sms() {
  const { campaigns, addCampaign, workers, stats } = useApp()
  const [audience, setAudience] = useState('Mijozlar')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [scheduled, setScheduled] = useState('')

  const recipients = {
    Barcha: 508 + workers.length,
    Mijozlar: 508,
    Ustalar: workers.length,
    'Nofaol ustalar': workers.filter((w) => w.status === 'offline').length,
  }[audience]

  const sent = campaigns.filter((c) => c.status === 'sent')
  const totalSent = sent.reduce((s, c) => s + c.sent, 0)
  const totalDelivered = sent.reduce((s, c) => s + c.delivered, 0)
  const parts = Math.max(1, Math.ceil(text.length / SMS_LIMIT))

  function submit(e) {
    e.preventDefault()
    if (!title.trim() || !text.trim()) return
    addCampaign({
      title: title.trim(),
      audience,
      recipients,
      sent: scheduled ? 0 : recipients,
      delivered: scheduled ? 0 : Math.round(recipients * 0.96),
      date: scheduled || new Date().toISOString().slice(0, 10),
      status: scheduled ? 'scheduled' : 'sent',
    })
    setTitle(''); setText(''); setScheduled('')
  }

  return (
    <>
      <PageHeader title="SMS marketing" subtitle="Mijozlar va ustalarga ommaviy xabar yuborish" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Send} label="Yuborilgan SMS" value={num(totalSent)} hint="jami kampaniyalar bo‘yicha" tone="brand" />
        <StatCard icon={CheckCheck} label="Yetkazilish" value={pct(totalSent ? (totalDelivered / totalSent) * 100 : 0, 1)}
          hint={`${num(totalDelivered)} ta yetkazildi`} tone="emerald" />
        <StatCard icon={Users} label="Bazadagi kontaktlar" value={num(508 + workers.length)}
          hint={`${workers.length} usta · 508 mijoz`} tone="indigo" />
        <StatCard icon={Clock} label="Rejalashtirilgan" value={num(campaigns.filter((c) => c.status === 'scheduled').length)}
          hint="navbatdagi kampaniyalar" tone="amber" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Yangi kampaniya" subtitle="Xabarni yozing va auditoriyani tanlang">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="sms-title" className="mb-1.5 block text-xs font-medium text-ink-700 dark:text-ink-200">
                Kampaniya nomi
              </label>
              <input id="sms-title" value={title} onChange={(e) => setTitle(e.target.value)}
                className="input" placeholder="Masalan: Navro‘z aksiyasi" required />
            </div>

            <fieldset>
              <legend className="mb-1.5 text-xs font-medium text-ink-700 dark:text-ink-200">Auditoriya</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {AUDIENCES.map((a) => (
                  <label key={a.id}
                    className={`cursor-pointer rounded-lg border p-2.5 text-left transition-colors ${
                      audience === a.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                        : 'border-ink-200 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800'
                    }`}>
                    <input type="radio" name="audience" value={a.id} className="sr-only"
                      checked={audience === a.id} onChange={() => setAudience(a.id)} />
                    <span className="block text-xs font-semibold text-ink-900 dark:text-white">{a.id}</span>
                    <span className="mt-0.5 block text-[11px] muted">{a.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="sms-text" className="mb-1.5 block text-xs font-medium text-ink-700 dark:text-ink-200">
                Xabar matni
              </label>
              <textarea id="sms-text" value={text} onChange={(e) => setText(e.target.value)}
                rows={4} className="input resize-none" required
                placeholder="UstaTop: bu hafta barcha xizmatlarga 15% chegirma!" />
              <p className="mt-1.5 flex items-center justify-between text-[11px] muted">
                <span className="tnum">{text.length} belgi · {parts} ta SMS</span>
                <span className="tnum">{num(recipients * parts)} ta xabar yuboriladi</span>
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="sms-date" className="mb-1.5 block text-xs font-medium text-ink-700 dark:text-ink-200">
                  Rejalashtirish (ixtiyoriy)
                </label>
                <input id="sms-date" type="date" value={scheduled}
                  onChange={(e) => setScheduled(e.target.value)} className="input w-auto" />
              </div>
              <button type="submit" className="btn-primary ml-auto">
                <Send className="h-4 w-4" />
                {scheduled ? 'Rejaga qo‘shish' : `Yuborish (${num(recipients)})`}
              </button>
            </div>
          </form>
        </Card>

        <Card title="Tayyor shablonlar" subtitle="Bosing — matn maydoniga qo‘shiladi">
          <ul className="space-y-2">
            {TEMPLATES.map((t) => (
              <li key={t.title}>
                <button type="button" onClick={() => { setTitle(t.title); setText(t.text) }}
                  className="w-full rounded-lg border border-ink-200 p-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/50 dark:border-ink-700 dark:hover:bg-brand-500/5">
                  <span className="block text-xs font-semibold text-ink-900 dark:text-white">{t.title}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed muted">{t.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4" bodyClass="p-0" title="Kampaniyalar tarixi">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-ink-200 dark:border-ink-800">
              <tr>
                <th className="th">Kampaniya</th>
                <th className="th">Auditoriya</th>
                <th className="th">Qabul qiluvchilar</th>
                <th className="th">Yetkazildi</th>
                <th className="th">Sana</th>
                <th className="th">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="td font-medium text-ink-900 dark:text-white">{c.title}</td>
                  <td className="td muted">{c.audience}</td>
                  <td className="td tnum">{num(c.recipients)}</td>
                  <td className="td tnum">
                    {c.sent ? `${num(c.delivered)} (${pct((c.delivered / c.sent) * 100)})` : '—'}
                  </td>
                  <td className="td whitespace-nowrap muted">{date(c.date)}</td>
                  <td className="td">
                    <Badge tone={c.status === 'sent' ? 'emerald' : 'amber'}>
                      {c.status === 'sent' ? 'Yuborilgan' : 'Rejalashtirilgan'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
