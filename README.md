# UstaTop — Admin Dashboard

> **UstaTop** — O‘zbekistondagi ilk "Uber for Home Services" ilovasi.
> Bir tugma — usta tayyor. Pilot: **Navoiy shahri**.

Ushbu repozitoriy UstaTop investor taqdimotidagi **"Admin Panel"** slaydiga asosan
qurilgan boshqaruv panelini o‘z ichiga oladi. Panel orqali barcha ustalar,
buyurtmalar, moliyaviy operatsiyalar va marketing kampaniyalari nazorat qilinadi.

## Texnologiyalar

Taqdimotdagi arxitektura bo‘yicha tanlangan stek:

| Qatlam | Texnologiya |
|---|---|
| UI | **React 18** |
| Build | **Vite 6** |
| Uslub | **Tailwind CSS 3** (yorug‘ / qorong‘i rejim) |
| Grafiklar | **Recharts** |
| Routing | React Router 6 |
| Ikonkalar | lucide-react |

Backend (`Node.js + Express + Socket.io + SQLite`) alohida repozitoriyda —
bu panel unga REST API va WebSocket orqali ulanishga tayyor.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # ishlab chiqarish uchun build (dist/)
npm run preview  # build'ni lokal ko'rish
```

## Sahifalar

| Yo‘l | Sahifa | Vazifasi |
|---|---|---|
| `/` | **Boshqaruv paneli** | KPI‘lar, o‘sish grafiklari, real-vaqt xarita, so‘nggi buyurtmalar |
| `/buyurtmalar` | **Buyurtmalar** | Filtrlash, qidiruv, tafsilotlar paneli, usta tayinlash, holatni o‘zgartirish |
| `/ustalar` | **Ustalar** | Ustalarni tekshirish (verify), bloklash, reyting va daromad statistikasi |
| `/xarita` | **Real-vaqt xarita** | Ustalarning GPS joylashuvi va faol buyurtmalar |
| `/analitika` | **Analitika** | Komissiya, GMV, kategoriya kesimi, sutkalik yuklama, bozor hajmi |
| `/sms` | **SMS marketing** | Ommaviy xabar yuborish, shablonlar, kampaniyalar tarixi |
| `/sozlamalar` | **Sozlamalar** | Komissiya foizi, narxlar, to‘lov usullari, SMS shlyuzi |

## Asosiy ko‘rsatkichlar

Panel Navoiy pilot loyihasining haqiqiy ko‘rsatkichlariga asoslangan:

- **500+** yuklab olish, **50+** ro‘yxatdan o‘tgan usta, **200+** bajarilgan buyurtma
- **92%** mijozlar mamnunligi, **4.8/5** o‘rtacha reyting
- **15–20%** platforma komissiyasi
- Yillik maqsadlar: 5 000 buyurtma · 200 faol usta · 150 mln so‘m daromad · 3 shahar

## Loyiha tuzilishi

```
src/
├─ components/     # Layout, StatCard, charts, LiveMap, UI primitivlari
├─ pages/          # Har bir bo'lim uchun sahifa
├─ data/mockData.js# Demo ma'lumotlar (backend ulanganda API bilan almashtiriladi)
├─ hooks/          # useTheme, useRealtime (Socket.io taqlidi)
├─ lib/            # formatlash yordamchilari
└─ store.jsx       # global holat va amallar
```

## Backend'ga ulanish

Panel hozircha `src/data/mockData.js` dagi demo ma'lumotlar bilan ishlaydi.
Haqiqiy backend'ga o‘tish uchun ikki joyni almashtirish kifoya:

1. **`src/store.jsx`** — `useState(seed…)` o‘rniga API'dan `fetch` qiling.
2. **`src/hooks/useRealtime.js`** — `setInterval` o‘rniga `io(API_URL)` ulanishi va
   `order:new`, `order:status`, `worker:location` hodisalariga obuna.

Komponentlar ma'lumot shakliga bog‘langan, manbaga emas — shuning uchun
qolgan kodni o‘zgartirish shart emas.

## Xarita haqida

`LiveMap` komponenti tashqi tayl serverisiz ishlaydi: koordinatalar to‘g‘ridan-to‘g‘ri
SVG maydoniga proyeksiya qilinadi (Navoiy markazi atrofidagi ~10 km hudud).
Ishlab chiqarishda bu qatlam MapLibre yoki `react-native-maps` bilan almashtiriladi —
kirish ma'lumoti (`{lat, lng, status}`) o‘zgarmaydi.
