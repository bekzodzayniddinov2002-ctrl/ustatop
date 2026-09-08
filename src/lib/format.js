/** Formatlash yordamchilari — butun panel bo'ylab bir xil ko'rinish uchun. */

const nf = new Intl.NumberFormat('uz-UZ')

export const num = (v) => nf.format(Math.round(v ?? 0))

/** So'm summasini qisqartirilgan ko'rinishda: 11 120 000 → "11.1 mln so'm" */
export function sum(v, { short = false } = {}) {
  const n = Number(v ?? 0)
  if (!short) return `${nf.format(Math.round(n))} so‘m`
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} mlrd so‘m`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln so‘m`
  if (n >= 1_000) return `${Math.round(n / 1000)} ming so‘m`
  return `${nf.format(n)} so‘m`
}

/** Grafik o'qlari uchun juda qisqa yozuv: 11120000 → "11,1M" */
export function axisSum(v) {
  const n = Number(v ?? 0)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`
  if (n >= 1_000) return `${Math.round(n / 1000)}K`
  return String(n)
}

export const pct = (v, digits = 0) => `${Number(v ?? 0).toFixed(digits)}%`

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

export function date(iso) {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function time(iso) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** "12 daqiqa oldin" ko'rinishidagi nisbiy vaqt. */
export function ago(iso, from = new Date('2026-02-18T14:30:00')) {
  const diff = Math.max(0, (from - new Date(iso)) / 1000)
  if (diff < 60) return 'hozirgina'
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`
  const days = Math.floor(diff / 86400)
  if (days < 30) return `${days} kun oldin`
  return date(iso)
}

/** Ism-familiyadan bosh harflar — avatar uchun. */
export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
