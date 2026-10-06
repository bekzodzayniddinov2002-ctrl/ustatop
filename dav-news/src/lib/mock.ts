import type { AnalysisResult, LexDocument, OldDocumentReference } from "./types";

// DEMO ma'lumotlari: Konimex tumani misolida namunaviy hujjatlar va tahlil.
// Hujjat matnlari o'quv maqsadida tuzilgan va rasmiy matnlar emas.

export const DEMO_DISTRICT = "Konimex tumani, Navoiy viloyati";

export const DEMO_NEW_DOCUMENT: LexDocument = {
  id: "demo-pf-181",
  url: "https://lex.uz",
  title:
    "O'zbekiston Respublikasi Prezidentining PF-181-son Farmoni. Mahallalarda tadbirkorlikni qo'llab-quvvatlash va aholi bandligini ta'minlash tizimini takomillashtirish to'g'risida",
  source: "demo",
  links: [{ id: "demo-vmq-129", url: "https://lex.uz", text: "Vazirlar Mahkamasining 2023-yil 28-martdagi 129-son qarori" }],
  text: `O'ZBEKISTON RESPUBLIKASI PREZIDENTINING FARMONI
Mahallalarda tadbirkorlikni qo'llab-quvvatlash va aholi bandligini ta'minlash tizimini takomillashtirish to'g'risida
(Namunaviy demo matn)

1. Belgilansinki, 2026-yil 1-noyabrdan boshlab:
a) mahallada oilaviy tadbirkorlik loyihalariga subsidiya ajratish to'g'risidagi arizalar faqat "Yagona interaktiv davlat xizmatlari portali" orqali elektron shaklda qabul qilinadi;
b) arizalarni ko'rib chiqish muddati 30 kundan 10 ish kuniga qisqartiriladi;
v) subsidiyaning eng yuqori miqdori bazaviy hisoblash miqdorining 30 baravaridan 50 baravariga oshiriladi;
g) subsidiya ajratish to'g'risidagi qarorni tuman (shahar) hokimligi huzuridagi ishchi guruh o'rniga mahalla yettiligi taqdimiga asosan hokim yordamchisi qabul qiladi.
2. Vazirlar Mahkamasining 2023-yil 28-martdagi 129-son qaroriga ilovaga muvofiq o'zgartirishlar kiritilsin. Qarorning 5-bandi va 2-ilovasi o'z kuchini yo'qotgan deb hisoblansin.
3. Tuman (shahar) hokimliklari:
bir oy muddatda har bir mahallaning "o'sish nuqtalari" ro'yxatini yangilasin;
har oyda subsidiya oluvchilar va yaratilgan ish o'rinlari to'g'risida ma'lumotni viloyat hokimligiga taqdim etsin.
4. Bandlik va kambag'allikni qisqartirish vazirligining tuman bo'limlari subsidiya oluvchilarni bepul kasbga o'qitish kurslariga yo'naltirsin.
5. Mazkur Farmon ijrosini nazorat qilish viloyat hokimlariga yuklansin.`,
};

export const DEMO_OLD_DOCUMENT: LexDocument = {
  id: "demo-vmq-129",
  url: "https://lex.uz",
  title:
    "Vazirlar Mahkamasining 129-son qarori. Oilaviy tadbirkorlikni rivojlantirish uchun subsidiyalar ajratish tartibi to'g'risida",
  source: "demo",
  links: [],
  text: `VAZIRLAR MAHKAMASINING QARORI
Oilaviy tadbirkorlikni rivojlantirish uchun subsidiyalar ajratish tartibi to'g'risida
(Namunaviy demo matn)

1. Subsidiya olish uchun ariza tuman (shahar) hokimligiga qog'oz shaklida yoki elektron shaklda topshiriladi.
2. Ariza tuman (shahar) hokimligi huzuridagi ishchi guruh tomonidan 30 kun ichida ko'rib chiqiladi.
3. Subsidiyaning eng yuqori miqdori bazaviy hisoblash miqdorining 30 baravarini tashkil etadi.
4. Subsidiya ajratish to'g'risidagi qaror ishchi guruh xulosasi asosida tuman (shahar) hokimi tomonidan qabul qilinadi.
5. Tuman (shahar) hokimligi har chorakda subsidiya oluvchilar to'g'risidagi hisobotni viloyat hokimligiga taqdim etadi.
2-ilova. Ishchi guruh tarkibi: hokim o'rinbosari (rahbar), moliya bo'limi, bandlik bo'limi, soliq inspeksiyasi vakillari.`,
};

export const DEMO_REFERENCES: OldDocumentReference[] = [
  {
    type: "Vazirlar Mahkamasining qarori",
    number: "129",
    date: "2023-03-28",
    title: "Oilaviy tadbirkorlikni rivojlantirish uchun subsidiyalar ajratish tartibi to'g'risida",
    relation: "o'zgartirish",
    lexId: "demo-vmq-129",
    searchQuery: "129-son qaror 28.03.2023",
  },
];

export function buildDemoResult(district: string = DEMO_DISTRICT): AnalysisResult {
  return {
    document: {
      type: "Prezident Farmoni",
      number: "PF-181",
      date: "2026-10-01",
      title: "Mahallalarda tadbirkorlikni qo'llab-quvvatlash va aholi bandligini ta'minlash tizimini takomillashtirish to'g'risida",
      issuer: "O'zbekiston Respublikasi Prezidenti",
      url: null,
    },
    summary:
      "Farmon mahalla darajasidagi oilaviy tadbirkorlik subsidiyalarini berish tartibini soddalashtiradi: arizalar faqat elektron shaklda qabul qilinadi, ko'rib chiqish muddati 10 ish kuniga qisqaradi, subsidiya chegarasi 50 BHMga oshadi va qaror qabul qilish vakolati tuman ishchi guruhidan hokim yordamchisiga o'tadi. Hokimliklar zimmasiga oylik hisobot va mahalla \"o'sish nuqtalari\"ni yangilash vazifasi yuklanadi.",
    keyPoints: [
      "Arizalar faqat my.gov.uz orqali elektron qabul qilinadi (2026-yil 1-noyabrdan)",
      "Ko'rib chiqish muddati: 30 kun → 10 ish kuni",
      "Subsidiya chegarasi: 30 BHM → 50 BHM",
      "Qaror qabul qiluvchi: tuman ishchi guruhi → hokim yordamchisi (mahalla yettiligi taqdimi bilan)",
      "Hisobot davriyligi: har chorak → har oy",
    ],
    oldDocuments: [
      {
        type: "Vazirlar Mahkamasining qarori",
        number: "129",
        date: "2023-03-28",
        title: "Oilaviy tadbirkorlikni rivojlantirish uchun subsidiyalar ajratish tartibi to'g'risida",
        relation: "o'zgartirish (5-band va 2-ilova o'z kuchini yo'qotgan)",
        url: null,
      },
    ],
    comparison: [
      {
        topic: "Ariza topshirish usuli",
        before: "Tuman hokimligiga qog'oz yoki elektron shaklda topshiriladi (129-qaror, 1-band).",
        after: "Faqat Yagona interaktiv davlat xizmatlari portali orqali elektron shaklda (PF-181, 1-band \"a\").",
        impact: "Qog'oz arizalar qabul qilinmaydi; internetdan foydalana olmaydigan fuqarolarga mahallada yordam ko'rsatish kerak.",
      },
      {
        topic: "Ko'rib chiqish muddati",
        before: "30 kun (129-qaror, 2-band).",
        after: "10 ish kuni (PF-181, 1-band \"b\").",
        impact: "Hujjatlarni tekshirish jarayoni uch baravar tezlashishi lozim.",
      },
      {
        topic: "Subsidiya miqdori",
        before: "Eng ko'pi 30 BHM (129-qaror, 3-band).",
        after: "Eng ko'pi 50 BHM (PF-181, 1-band \"v\").",
        impact: "Tuman bo'yicha subsidiya fondiga ehtiyoj oshadi; byudjet so'rovini qayta hisoblash kerak.",
      },
      {
        topic: "Qaror qabul qilish vakolati",
        before: "Hokim o'rinbosari boshchiligidagi ishchi guruh xulosasi asosida tuman hokimi (129-qaror, 4-band, 2-ilova).",
        after: "Mahalla yettiligi taqdimiga asosan hokim yordamchisi (PF-181, 1-band \"g\"); 2-ilova o'z kuchini yo'qotdi.",
        impact: "Tuman ishchi guruhi tarqatiladi, mas'uliyat mahalla darajasiga tushadi.",
      },
      {
        topic: "Hisobot berish",
        before: "Har chorakda viloyat hokimligiga (129-qaror, 5-band).",
        after: "Har oyda, yaratilgan ish o'rinlari bilan birga (PF-181, 3-band).",
        impact: "Oylik monitoring tizimi va mas'ul xodim belgilanishi zarur.",
      },
    ],
    district,
    districtTasks: [
      {
        responsible: "Konimex tumani hokimligi",
        task: "Tuman ishchi guruhini tugatish va subsidiya bo'yicha vakolatlarni hokim yordamchilariga rasmiy topshirish to'g'risida farmoyish chiqarish.",
        mechanism: "Hokim farmoyishi; ishchi guruhdagi ko'rib chiqilayotgan arizalarni dalolatnoma bilan hokim yordamchilariga o'tkazish.",
        deadline: "2026-yil 1-noyabrgacha",
        priority: "yuqori",
      },
      {
        responsible: "Hokim yordamchilari va mahalla yettiliklari",
        task: "Har bir mahallada arizalarni 10 ish kunida ko'rib chiqish jadvalini joriy etish; my.gov.uz orqali ariza topshira olmaydigan fuqarolarga mahalla idorasida yordam ko'rsatish.",
        mechanism: "Mahalla idorasida kompyuterli \"yordam burchagi\", navbatchilik jadvali, haftalik yig'ilishda muddatlar nazorati.",
        deadline: "2026-yil 1-noyabrdan doimiy",
        priority: "yuqori",
      },
      {
        responsible: "Tuman hokimligi, iqtisodiyot va moliya bo'limlari",
        task: "Subsidiya chegarasi 50 BHMga oshgani munosabati bilan tuman subsidiya fondiga ehtiyojni qayta hisoblab, viloyat hokimligiga so'rov kiritish.",
        mechanism: "Joriy navbatdagi arizalar soni × yangi chegaralar asosida hisob-kitob; viloyat moliya boshqarmasiga xat.",
        deadline: "1 oy ichida",
        priority: "o'rta",
      },
      {
        responsible: "Tuman hokimligi va mahalla yettiliklari",
        task: "Har bir mahallaning \"o'sish nuqtalari\" ro'yxatini (chorvachilik, qorako'lchilik, xizmat ko'rsatish, hunarmandchilik) yangilash.",
        mechanism: "Xonadonbay o'rganish natijalari asosida mahalla kesimida ro'yxat; hokimlik saytida e'lon qilish.",
        deadline: "1 oy ichida",
        priority: "o'rta",
      },
      {
        responsible: "Bandlik va kambag'allikni qisqartirish tuman bo'limi",
        task: "Subsidiya oluvchilarni bepul kasbga o'qitish kurslariga yo'naltirish va ish o'rinlari yaratilishini kuzatish.",
        mechanism: "Monomarkaz va kasb-hunar markazlari bilan yo'llanma tizimi; oylik ma'lumotlar bazasi.",
        deadline: "Doimiy",
        priority: "o'rta",
      },
      {
        responsible: "Tuman hokimligi (mas'ul: hokim o'rinbosari)",
        task: "Subsidiya oluvchilar va yaratilgan ish o'rinlari bo'yicha oylik hisobotni viloyat hokimligiga taqdim etish.",
        mechanism: "Har oyning 5-sanasigacha yagona shakl bo'yicha hisobot; mas'ul xodim tayinlash.",
        deadline: "Har oyning 5-sanasigacha",
        priority: "yuqori",
      },
    ],
    affectedGroups: [
      { group: "Oilaviy tadbirkorlar", effect: "Subsidiya kattaroq va tezroq beriladi, lekin faqat elektron ariza orqali." },
      { group: "Ishsiz va kam ta'minlangan oilalar", effect: "Bepul kasbga o'qitish va subsidiya imkoniyati kengayadi." },
      { group: "Hokim yordamchilari", effect: "Qaror qabul qilish vakolati va javobgarlik ortadi." },
    ],
    mode: "demo",
    model: null,
    generatedAt: new Date().toISOString(),
  };
}
