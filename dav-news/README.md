# Dav News — Lex.uz qonunchilik tahlili AI agenti

Lex.uz dan yangi normativ-huquqiy hujjatni oladi, matndan u o'zgartirayotgan eski hujjat(lar)ni aniqlaydi,
ularni ham yuklab oladi va Claude yordamida ikkalasini solishtirib, **tuman/shahar darajasida** hokimlik va
mahalliy tashkilotlar bajarishi kerak bo'lgan vazifalarni ajratib beradi.

## Avtonom agent (src/lib/agent.ts, `POST /api/analyze`)

| Qadam | Nima qiladi | Kod |
|---|---|---|
| 1 | Hujjat raqami / havola / ID va hududni qabul qiladi, rejimni tanlaydi (jonli yoki demo) | `agent.ts` |
| 2 | Yangi hujjat matnini Lex.uz dan oladi (ID bo'lmasa qidiruv orqali topadi) | `lexuz.ts → resolveDocument` |
| 3 | Claude (tezkor model) o'zgartirilayotgan/bekor qilinayotgan eski hujjatlarni aniqlaydi | `claude.ts → extractReferences` |
| 4 | Eski hujjatni matndagi havola yoki Lex.uz qidiruvi orqali topib, skreping qiladi | `agent.ts → findOldDocument` |
| 5 | Claude (asosiy model) qiyosiy tahlil va tuman vazifalarini generatsiya qiladi | `claude.ts → compareDocuments` |

API javobi NDJSON oqimi: har bir qadam holati UI da jonli ko'rinadi. Claude javoblari JSON schema
(structured outputs) orqali olinadi.

## Tez boshlash

### 1. Muhit o'zgaruvchilari

```bash
cp .env.example .env.local
# .env.local ichida ANTHROPIC_API_KEY=sk-ant-... ni yozing
```

Kalit bo'lmasa ilova **DEMO rejimida** ishlaydi: Konimex tumani misolidagi namunaviy ma'lumot ko'rsatiladi.

| O'zgaruvchi | Standart qiymat | Izoh |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Anthropic API kaliti |
| `ANTHROPIC_MODEL` | `claude-sonnet-5-5` | Qiyosiy tahlil modeli |
| `ANTHROPIC_FAST_MODEL` | `claude-haiku-4-5` | Havolalarni aniqlash modeli (arzonroq) |
| `MOCK_MODE` | `auto` | `auto` / `true` / `false` |
| `DEFAULT_DISTRICT` | `Konimex tumani, Navoiy viloyati` | Standart hudud |
| `LEXUZ_BASE_URL`, `LEXUZ_LANG`, `LEXUZ_TIMEOUT_MS` | `https://lex.uz`, `uz`, `20000` | Scraper sozlamalari |
| `LEXUZ_SEARCH_PATH` | — | Qidiruv manzili shabloni, masalan `/uz/search/nat?query={query}` |

> Claude 3.5 Sonnet/Haiku modellari endi ishlamaydi, shuning uchun hozirgi Claude Sonnet 5.5 va Haiku 4.5 ishlatiladi.

### 2a. Docker orqali (tavsiya etiladi)

```bash
cd dav-news
docker compose up -d --build
# http://localhost:3000
docker compose logs -f      # loglar
docker compose down         # to'xtatish
```

Boshqa port kerak bo'lsa: `APP_PORT=8080 docker compose up -d`.

### 2b. Lokal (Node.js 20.9+)

```bash
cd dav-news
npm install
npm run dev       # http://localhost:3000
# yoki production:
npm run build && npm start
```

## API

```bash
curl -N -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"query":"https://lex.uz/uz/docs/-7058618","district":"Konimex tumani, Navoiy viloyati"}'
```

`{"demo": true}` qo'shilsa tarmoq va API ishlatilmaydi. `GET /api/analyze` joriy rejim va modellarni qaytaradi.

## Tuzilma

```
src/app/page.tsx              Dashboard (forma, agent qadamlari, natija, tarix)
src/app/api/analyze/route.ts  5 qadamli agent API (NDJSON oqim)
src/components/               Glassmorphism UI komponentlari
src/lib/lexuz.ts              Lex.uz scraper (o'qish va qidirish, cheerio)
src/lib/claude.ts             Claude API chaqiruvlari (@anthropic-ai/sdk)
src/lib/agent.ts              Agent orkestratsiyasi
src/lib/mock.ts               Konimex tumani demo ma'lumotlari
```

## Eslatmalar

- Lex.uz sahifa tuzilmasi o'zgarsa, `src/lib/lexuz.ts` dagi `CONTENT_SELECTORS` va `SEARCH_PATHS` ni yangilang.
- Demo ma'lumotlar o'quv maqsadida tuzilgan, rasmiy hujjat matni emas.
- AI tahlili yordamchi vosita; rasmiy matnni har doim Lex.uz da tekshiring.
