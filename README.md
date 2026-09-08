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
| Uslub | **Tailwind CSS 3** (qorong‘i rejim standart, yorug‘ rejim ham bor) |
| Grafiklar | **Recharts** |
| Routing | React Router 6 |
| Ikonkalar | lucide-react |

Backend (`Node.js + Express + Socket.io + SQLite`) alohida repozitoriyda —
bu panel unga REST API va WebSocket orqali ulanishga tayyor.

## Ishga tushirish

### Docker orqali (tavsiya etiladi)

```bash
docker compose up            # http://localhost:5173 — hot reload bilan
```

Konteyner ishga tushgach `src/` ichidagi istalgan faylni tahrir qiling —
Vite HMR o'zgarishni brauzerga darhol yetkazadi, qayta ishga tushirish shart emas.

Ishlab chiqarish build'i (nginx orqali):

```bash
docker compose --profile prod up --build   # http://localhost:8080
```

To'xtatish: `docker compose --profile prod down`

### Docker'siz

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # ishlab chiqarish uchun build (dist/)
npm run preview  # build'ni lokal ko'rish
```

## Dizayn

Interfeys investor taqdimotining infografika uslubida qurilgan: tungi ko‘k fon,
neon moviy urg‘u, yorug‘ halqali ikonkalar va bo‘lim raqamlari (`01`, `02`, …).

- **Palitra** — `tailwind.config.js` dagi `brand` (neon moviy) va `ko‘kka
  siljitilgan `ink` shkalasi. Rangni o‘zgartirish uchun shu ikki shkalani
  tahrirlash kifoya, qolgani avtomatik moslashadi.
- **Qorong‘i rejim standart holat.** Yuqori o‘ng burchakdagi tugma orqali
  yorug‘ rejimga o‘tish mumkin, tanlov brauzerda saqlanadi.
- **Neon effektlar** — `index.css` dagi `.stat-value`, `.section-num` va
  `tailwind.config.js` dagi `shadow-glow` / `shadow-panel`.

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

## Docker

| Fayl | Vazifasi |
|---|---|
| `Dockerfile` | Ko'p bosqichli: `dev` (Vite + HMR) va `prod` (nginx) nishonlari |
| `docker-compose.yml` | `web` — ishlab chiqish; `web-prod` (prod profili) — nginx |
| `docker/nginx.conf` | SPA yo'naltirish, gzip, keshlash va xavfsizlik sarlavhalari |
| `.env.example` | Portlar va kuzatish rejimi uchun ixtiyoriy o'zgaruvchilar |

### Hot reload qanday ishlaydi

- Manba kodi konteynerga bog'lanadi (`.:/app`), shuning uchun tahrir darhol ko'rinadi.
- `node_modules` alohida nomlangan volume'da saqlanadi — host'dagi papka (yoki uning
  yo'qligi) konteyner ichidagi platformaga mos binarlarni bekor qilmaydi.
- Vite `--host 0.0.0.0` bilan ishga tushadi, aks holda konteyner tashqarisidan ochilmaydi.
- macOS va Windows'da bind mount inotify hodisalarini yetkazmaydi, shuning uchun
  `VITE_POLLING=true` (standart) — Vite fayllarni polling orqali kuzatadi.
  **Linux'da** `.env` faylida `VITE_POLLING=false` qilsangiz protsessor yuki kamayadi.

### Portni o'zgartirish

`.env` faylida (`cp .env.example .env`):

```
DEV_PORT=3000
PROD_PORT=8000
```

HMR mijozi brauzerda shu portga ulanishi uchun `HMR_PORT` compose faylida
avtomatik `DEV_PORT` ga tenglashtiriladi — qo'shimcha sozlash talab etilmaydi.

### `tailwind.config.js` o'zgarganda

Tailwind konfiguratsiyani dev-server ishga tushganda bir marta o'qiydi.
Konteyner ishlab turganda `git pull` qilsangiz va konfiguratsiya o'zgargan
bo'lsa, Vite eski palitra bilan qolib `The ... class does not exist` xatosini
beradi. Yechim — konteynerni qayta ishga tushirish:

```bash
# Ctrl+C bilan to'xtating, so'ng:
docker compose up
```

Bu faqat `tailwind.config.js` ga tegishli — oddiy kod o'zgarishlari HMR orqali
qayta ishga tushirishsiz yetkaziladi.

### Bog'liqliklar o'zgarganda

`package.json` yangilansa, `node_modules` volume'i avtomatik yangilanmaydi:

```bash
npm run docker:reinstall     # docker compose down -v && docker compose up --build
```

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
