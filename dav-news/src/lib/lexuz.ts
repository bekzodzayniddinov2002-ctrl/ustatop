import * as cheerio from "cheerio";
import type { LexDocument, LexLink, LexSearchResult } from "./types";

// Lex.uz scraper: hujjatni ID/havola bo'yicha o'qish va sarlavha/raqam bo'yicha qidirish.
// Sayt tuzilmasi o'zgarishi mumkin, shuning uchun selektorlar bir nechta zaxira variantga ega.

const BASE_URL = (process.env.LEXUZ_BASE_URL || "https://lex.uz").replace(/\/$/, "");
const LANG = process.env.LEXUZ_LANG || "uz";
const TIMEOUT_MS = Number(process.env.LEXUZ_TIMEOUT_MS || 20000);

// Qidiruv sahifasi manzillari ({query} o'rniga so'rov qo'yiladi). Birinchisi ishlamasa keyingisi sinab ko'riladi.
const SEARCH_PATHS = process.env.LEXUZ_SEARCH_PATH
  ? [process.env.LEXUZ_SEARCH_PATH]
  : [`/${LANG}/search/nat?query={query}`, `/${LANG}/search/all?query={query}`, `/search/nat?query={query}`];

// Hujjat matni joylashgan konteynerlar (ustuvorlik tartibida)
const CONTENT_SELECTORS = ["#divCont", ".docBody", "#docBody", ".document-body", "article", "main"];

const DOC_ID_RE = /\/docs\/(-?\d+)/;

export class LexUzError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "LexUzError";
  }
}

/** Foydalanuvchi kiritgan qiymatdan Lex.uz ID ni ajratadi (havola yoki to'g'ridan-to'g'ri ID). */
export function parseDocumentId(input: string): string | null {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(DOC_ID_RE);
  if (fromUrl) return fromUrl[1];
  if (/^-?\d{4,}$/.test(trimmed)) return trimmed;
  return null;
}

export function documentUrl(id: string): string {
  return `${BASE_URL}/${LANG}/docs/${id}`;
}

async function fetchHtml(url: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DavNewsBot/1.0; +https://lex.uz)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": `${LANG},ru;q=0.8,en;q=0.5`,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new LexUzError(`Lex.uz ga ulanib bo'lmadi (${url}): ${reason}`);
  }
  if (!res.ok) throw new LexUzError(`Lex.uz ${res.status} qaytardi: ${url}`, res.status);
  return res.text();
}

function normalizeText(text: string): string {
  return text
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

function absolute(href: string): string {
  if (href.startsWith("http")) return href;
  return `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
}

/** Lex.uz hujjat sahifasini HTML dan ajratadi. Testlash uchun alohida eksport qilingan. */
export function parseDocumentHtml(html: string, id: string, url: string): LexDocument {
  const $ = cheerio.load(html);
  $("script, style, noscript, iframe, header, footer, nav").remove();

  const $content =
    CONTENT_SELECTORS.map((sel) => $(sel).first()).find((el) => el.length && el.text().trim().length > 200) ??
    $("body");

  // Blok elementlarni qatorlarga ajratish uchun yangi qator qo'shamiz
  $content.find("br").replaceWith("\n");
  $content.find("p, div, li, tr, h1, h2, h3, h4").each((_, el) => {
    $(el).append("\n");
  });

  const title =
    normalizeText($(".ACT_TITLE").first().text()) ||
    normalizeText($("h1").first().text()) ||
    normalizeText($("title").text()).replace(/\s*[-|]\s*Lex\.uz.*$/i, "") ||
    `Hujjat ${id}`;

  const links: LexLink[] = [];
  const seen = new Set<string>([id]);
  $content.find("a[href]").each((_, a) => {
    const href = $(a).attr("href") || "";
    const m = href.match(DOC_ID_RE);
    if (!m || seen.has(m[1])) return;
    seen.add(m[1]);
    links.push({ id: m[1], url: absolute(href), text: normalizeText($(a).text()).slice(0, 200) });
  });

  const text = normalizeText($content.text());
  if (text.length < 100) throw new LexUzError(`Hujjat matni topilmadi yoki juda qisqa: ${url}`);

  return { id, url, title, text, links, source: "lex.uz" };
}

/** Hujjatni Lex.uz ID yoki havolasi bo'yicha yuklab oladi. */
export async function fetchDocument(idOrUrl: string): Promise<LexDocument> {
  const id = parseDocumentId(idOrUrl);
  if (!id) throw new LexUzError(`Lex.uz hujjat ID si aniqlanmadi: ${idOrUrl}`);
  const url = idOrUrl.startsWith("http") ? idOrUrl : documentUrl(id);
  const html = await fetchHtml(url);
  return parseDocumentHtml(html, id, url);
}

/** Qidiruv natijalari sahifasidan hujjat havolalarini ajratadi. */
export function parseSearchHtml(html: string): LexSearchResult[] {
  const $ = cheerio.load(html);
  const results: LexSearchResult[] = [];
  const seen = new Set<string>();
  $("a[href]").each((_, a) => {
    const href = $(a).attr("href") || "";
    const m = href.match(DOC_ID_RE);
    if (!m || seen.has(m[1])) return;
    const title = normalizeText($(a).text());
    if (title.length < 8) return; // "Batafsil", ikonka kabi qisqa havolalarni o'tkazib yuboramiz
    seen.add(m[1]);
    results.push({ id: m[1], url: absolute(href), title });
  });
  return results;
}

/** Lex.uz da hujjat qidiradi (raqam, sana yoki sarlavha bo'yicha). */
export async function searchDocuments(query: string, limit = 5): Promise<LexSearchResult[]> {
  const errors: string[] = [];
  for (const path of SEARCH_PATHS) {
    const url = BASE_URL + path.replace("{query}", encodeURIComponent(query));
    try {
      const results = parseSearchHtml(await fetchHtml(url));
      if (results.length) return results.slice(0, limit);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  if (errors.length === SEARCH_PATHS.length) throw new LexUzError(errors[errors.length - 1]);
  return [];
}

/** Kiritilgan qiymat bo'yicha hujjatni topadi: ID/havola bo'lsa to'g'ridan-to'g'ri, aks holda qidiruv orqali. */
export async function resolveDocument(input: string): Promise<LexDocument> {
  if (parseDocumentId(input)) return fetchDocument(input);
  const results = await searchDocuments(input, 1);
  if (!results.length) throw new LexUzError(`Lex.uz da "${input}" bo'yicha hujjat topilmadi`);
  return fetchDocument(results[0].url);
}
