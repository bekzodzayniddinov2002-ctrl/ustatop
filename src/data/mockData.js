/**
 * UstaTop demo ma'lumotlari.
 *
 * Barcha ko'rsatkichlar investor pitch deck'dagi Navoiy pilot natijalariga
 * asoslangan: 500+ yuklab olish, 50+ ro'yxatdan o'tgan usta, 200+ bajarilgan
 * buyurtma, 92% mamnunlik, 4.8/5 reyting, 15-20% platforma komissiyasi.
 *
 * Backend tayyor bo'lganda bu modul `src/lib/api.js` bilan almashtiriladi —
 * komponentlar faqat quyidagi shakldagi obyektlarga bog'langan.
 */

// Deterministik "tasodifiy" generator — har safar bir xil demo ma'lumot.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const rand = rng(20260101)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const between = (min, max) => min + rand() * (max - min)
const intBetween = (min, max) => Math.floor(between(min, max + 1))

/* ---------------------------------------------------------------- kategoriyalar */

export const categories = [
  { id: 'elektrik', name: 'Elektrik', icon: 'Zap', color: '#fbbf24', basePrice: 80000 },
  { id: 'santexnik', name: 'Santexnik', icon: 'Droplets', color: '#38bdf8', basePrice: 90000 },
  { id: 'gaz', name: 'Gaz', icon: 'Flame', color: '#fb7185', basePrice: 120000 },
  { id: 'tozalash', name: 'Tozalash', icon: 'Sparkles', color: '#22c3f5', basePrice: 150000 },
  { id: 'konditsioner', name: 'Konditsioner', icon: 'Wind', color: '#818cf8', basePrice: 180000 },
  { id: 'maishiy', name: 'TV / Maishiy texnika', icon: 'Tv', color: '#c084fc', basePrice: 100000 },
  { id: 'qulf', name: 'Qulf', icon: 'KeyRound', color: '#94a3b8', basePrice: 70000 },
  { id: 'boshqa', name: 'Boshqa', icon: 'Wrench', color: '#fb923c', basePrice: 85000 },
]

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))

/* ---------------------------------------------------------------------- ustalar */

const firstNames = [
  'Dilshod', 'Sardor', 'Bekzod', 'Jasur', 'Otabek', 'Aziz', 'Shuhrat', 'Rustam',
  'Farrux', 'Ulug‘bek', 'Doniyor', 'Akmal', 'Sanjar', 'Nodir', 'Islom',
  'Javohir', 'Temur', 'Muzaffar', 'Alisher', 'Zafar', 'Xurshid', 'Bahodir',
  'Ilhom', 'Qahramon', 'Sherzod', 'Anvar', 'Elyor', 'Umid', 'Ravshan', 'Behruz',
]
const lastNames = [
  'Karimov', 'Rasulov', 'Yusupov', 'Toshmatov', 'Ergashev', 'Xolmatov',
  'Abdullayev', 'Nazarov', 'Qodirov', 'Sultonov', 'Mirzayev', 'Sobirov',
  'Ismoilov', 'Yo‘ldoshev', 'Hakimov', 'Bo‘riyev', 'Saidov', 'Turdiyev',
]
// Navoiy shahri mahallalari (pilot hudud)
const districts = [
  'Navoiy markazi', 'Shimoliy dahasi', 'Janubiy dahasi', 'Beshrabot',
  'Yangi Navoiy', 'Karmana yo‘li', 'Sanoat zonasi', 'Qorako‘l ko‘chasi',
]

// Navoiy shahri markazi
export const CITY_CENTER = { lat: 40.0844, lng: 65.3792 }

export const workers = Array.from({ length: 54 }, (_, i) => {
  const cat = pick(categories)
  const jobs = intBetween(3, 74)
  const rating = Number(between(4.1, 5).toFixed(1))
  const statusRoll = rand()
  const status = statusRoll > 0.62 ? 'online' : statusRoll > 0.14 ? 'offline' : 'blocked'
  return {
    id: `U-${String(1001 + i)}`,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    phone: `+998 9${intBetween(0, 9)} ${intBetween(100, 999)}-${intBetween(10, 99)}-${intBetween(10, 99)}`,
    categoryId: cat.id,
    district: pick(districts),
    rating,
    jobs,
    // pilot davomida to'plangan daromad (so'm)
    earnings: jobs * intBetween(70000, 210000),
    status,
    verified: rand() > 0.22,
    joinedAt: new Date(2025, intBetween(8, 11), intBetween(1, 28)).toISOString(),
    acceptRate: Math.round(between(58, 98)),
    avgArrivalMin: Math.round(between(9, 34)),
    lat: CITY_CENTER.lat + between(-0.035, 0.035),
    lng: CITY_CENTER.lng + between(-0.05, 0.05),
  }
}).sort((a, b) => b.jobs - a.jobs)

/* ------------------------------------------------------------------ buyurtmalar */

const orderStatuses = ['new', 'accepted', 'on_way', 'in_progress', 'completed', 'cancelled']
export const statusLabels = {
  new: 'Yangi',
  accepted: 'Qabul qilindi',
  on_way: 'Yo‘lda',
  in_progress: 'Bajarilmoqda',
  completed: 'Bajarildi',
  cancelled: 'Bekor qilindi',
}
export const statusTone = {
  new: 'sky',
  accepted: 'indigo',
  on_way: 'amber',
  in_progress: 'brand',
  completed: 'emerald',
  cancelled: 'rose',
}

const clientNames = [
  'Nilufar Aliyeva', 'Dilshod Rahimov', 'Zulfiya Nazarova', 'Aziz Umarov',
  'Malika Yusupova', 'Kamol Ergashev', 'Sevara Xolmatova', 'Botir Qodirov',
  'Gulnora Sattorova', 'Jahongir Mirzayev', 'Nasiba Karimova', 'Oybek Tursunov',
  'Madina Sharipova', 'Ravshan Berdiyev', 'Feruza Islomova', 'Sanjar Aliyev',
]
const problems = {
  elektrik: ['Rozetka ishlamayapti', 'Avtomat tez-tez o‘chadi', 'Lyustra o‘rnatish', 'Simlar almashtirish'],
  santexnik: ['Kran oqmoqda', 'Kanalizatsiya tiqilgan', 'Smesitel almashtirish', 'Unitaz o‘rnatish'],
  gaz: ['Gaz plita ulash', 'Kolonka ishlamayapti', 'Gaz hidi kelmoqda', 'Gaz hisoblagich'],
  tozalash: ['Kvartira general tozalash', 'Ko‘chib kelgandan keyin tozalash', 'Deraza yuvish', 'Divan quruq tozalash'],
  konditsioner: ['Konditsioner sovutmayapti', 'Yangi konditsioner o‘rnatish', 'Freon to‘ldirish', 'Filtr tozalash'],
  maishiy: ['Kir yuvish mashinasi ishlamayapti', 'Muzlatgich sovutmayapti', 'TV ekran muammosi', 'Mikroto‘lqinli pech'],
  qulf: ['Eshik qulfi buzildi', 'Kalit ichida sindi', 'Yangi qulf o‘rnatish', 'Eshik ochib berish'],
  boshqa: ['Mebel yig‘ish', 'Devorga TV ilish', 'Eshik rostlash', 'Kichik ta‘mir ishlari'],
}

const now = new Date('2026-02-18T14:30:00')

export const orders = Array.from({ length: 236 }, (_, i) => {
  const worker = pick(workers)
  const cat = categoryById[worker.categoryId]
  // Pilot 92% mamnunlik ko'rsatkichiga mos taqsimot
  const roll = rand()
  const status =
    i < 8 ? pick(['new', 'accepted', 'on_way', 'in_progress'])
      : roll > 0.09 ? 'completed'
        : 'cancelled'
  const price = Math.round((cat.basePrice * between(0.8, 2.4)) / 5000) * 5000
  const commissionRate = 0.18
  const createdAt = new Date(now.getTime() - i * intBetween(40, 260) * 60 * 1000)
  return {
    id: `#${4820 - i}`,
    clientName: pick(clientNames),
    clientPhone: `+998 9${intBetween(0, 9)} ${intBetween(100, 999)}-${intBetween(10, 99)}-${intBetween(10, 99)}`,
    workerId: worker.id,
    workerName: worker.name,
    categoryId: cat.id,
    problem: pick(problems[cat.id]),
    district: pick(districts),
    status,
    price,
    commission: Math.round(price * commissionRate),
    rating: status === 'completed' ? Number(between(4.0, 5).toFixed(1)) : null,
    createdAt: createdAt.toISOString(),
    // buyurtma qabul qilingunga qadar o'tgan vaqt (soniya) — SLA 120s
    responseSec: status === 'new' ? null : Math.round(between(12, 138)),
    lat: CITY_CENTER.lat + between(-0.03, 0.03),
    lng: CITY_CENTER.lng + between(-0.045, 0.045),
  }
})

/* ------------------------------------------------------------------- grafiklar */

const monthNames = ['Sen', 'Okt', 'Noy', 'Dek', 'Yan', 'Fev']

// Pilot boshlangandan buyongi oylik dinamika (Navoiy)
export const monthlySeries = [
  { month: 'Sen', orders: 12, revenue: 1_940_000, workers: 9, clients: 41 },
  { month: 'Okt', orders: 24, revenue: 3_880_000, workers: 17, clients: 96 },
  { month: 'Noy', orders: 38, revenue: 6_420_000, workers: 26, clients: 168 },
  { month: 'Dek', orders: 47, revenue: 8_150_000, workers: 34, clients: 243 },
  { month: 'Yan', orders: 58, revenue: 10_340_000, workers: 45, clients: 372 },
  { month: 'Fev', orders: 57, revenue: 11_120_000, workers: 54, clients: 508 },
]

// So'nggi 14 kun — kunlik buyurtma va komissiya
export const dailySeries = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(now.getTime() - (13 - i) * 86400000)
  const base = 6 + Math.sin(i / 2) * 2.5 + i * 0.35
  const ord = Math.max(2, Math.round(base + between(-1.5, 2)))
  const avg = 145000
  return {
    date: `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`,
    orders: ord,
    completed: Math.max(1, ord - intBetween(0, 2)),
    revenue: Math.round(ord * avg * 0.18),
  }
})

// Sutka davomidagi buyurtma taqsimoti — smena rejalashtirish uchun
export const hourlyLoad = [
  { hour: '06', orders: 2 }, { hour: '08', orders: 9 }, { hour: '10', orders: 17 },
  { hour: '12', orders: 21 }, { hour: '14', orders: 24 }, { hour: '16', orders: 19 },
  { hour: '18', orders: 26 }, { hour: '20', orders: 15 }, { hour: '22', orders: 6 },
]

/* -------------------------------------------------------------- SMS kampaniyalar */

export const smsCampaigns = [
  { id: 1, title: 'Qishki chegirma — 15%', audience: 'Mijozlar', recipients: 508, sent: 508, delivered: 486, date: '2026-02-14', status: 'sent' },
  { id: 2, title: 'Ustalar uchun yangi tarif', audience: 'Ustalar', recipients: 54, sent: 54, delivered: 54, date: '2026-02-09', status: 'sent' },
  { id: 3, title: 'Nofaol ustalarni qaytarish', audience: 'Nofaol ustalar', recipients: 18, sent: 18, delivered: 16, date: '2026-02-02', status: 'sent' },
  { id: 4, title: 'Navro‘z aksiyasi', audience: 'Barcha', recipients: 562, sent: 0, delivered: 0, date: '2026-03-18', status: 'scheduled' },
]

/* ------------------------------------------------------------------ KPI maqsad */

// Pitch deck, "Monetizatsiya" slaydi: yillik KPI maqsadlari
export const kpiTargets = {
  ordersYear: { target: 5000, current: 236, label: 'Yillik buyurtmalar' },
  activeWorkers: { target: 200, current: 54, label: 'Faol ustalar' },
  revenueYear: { target: 150_000_000, current: 41_850_000, label: 'Yillik daromad' },
  cities: { target: 3, current: 1, label: 'Shaharlar' },
}

// Rivojlanish yo'li — pitch deck "Investitsiya" slaydi
export const roadmap = [
  { city: 'Navoiy', period: '2025 Q4 — pilot', state: 'done' },
  { city: 'Buxoro', period: '2026 Q2', state: 'active' },
  { city: 'Samarqand', period: '2026 Q3', state: 'planned' },
  { city: 'Toshkent', period: '2027', state: 'planned' },
]

/* --------------------------------------------------------------- tizim holati */

export const systemHealth = [
  { label: 'Uptime', value: '99.9%', tone: 'emerald' },
  { label: 'API javob', value: '<50ms', tone: 'emerald' },
  { label: 'Socket.io', value: 'Ulangan', tone: 'emerald' },
  { label: 'GPS aniqlik', value: '±5m', tone: 'sky' },
]

/* ------------------------------------------------------------------ sozlamalar */

export const defaultSettings = {
  commissionRate: 18,
  minOrderPrice: 50000,
  acceptWindowSec: 120,
  searchRadiusKm: 7,
  smsSender: 'USTATOP',
  autoAssign: true,
  requireVerification: true,
  cashPayment: true,
  cardPayment: false,
}
