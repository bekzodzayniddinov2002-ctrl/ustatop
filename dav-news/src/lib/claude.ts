import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { AnalysisResult, LexDocument, OldDocumentReference } from "./types";

// Claude API bilan ishlash: 3-qadam (havolalarni aniqlash) va 5-qadam (qiyosiy tahlil).
// Javoblar structured outputs (JSON schema) orqali olinadi, shuning uchun matndan JSON "qirqib olish" shart emas.

export const MAIN_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
export const FAST_MODEL = process.env.ANTHROPIC_FAST_MODEL || "claude-haiku-4-5";

// Kirish matnlari uchun xavfsiz chegaralar (belgilarda). Haiku 4.5 konteksti 200K token.
const FAST_INPUT_LIMIT = 250_000;
const MAIN_INPUT_LIMIT = 1_200_000;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

function clip(text: string, limit: number, onTruncate?: (msg: string) => void): string {
  if (text.length <= limit) return text;
  onTruncate?.(`Matn juda uzun (${text.length} belgi), dastlabki ${limit} belgisi tahlil qilinadi.`);
  return text.slice(0, limit);
}

function assertNotRefused(message: Anthropic.Message) {
  if (message.stop_reason === "refusal") {
    throw new Error("Claude so'rovni bajarishni rad etdi (refusal). Hujjat matnini tekshiring.");
  }
  if (message.stop_reason === "max_tokens") {
    throw new Error("Claude javobi max_tokens chegarasida kesildi. Hujjat juda katta bo'lishi mumkin.");
  }
}

// ---------- 3-qadam: eski hujjat(lar)ni aniqlash ----------

const ReferencesSchema = z.object({
  document: z.object({
    type: z.string().describe("Hujjat turi, masalan: Prezident Farmoni, Prezident qarori, Vazirlar Mahkamasining qarori"),
    number: z.string().describe("Hujjat raqami, masalan PF-181 yoki PQ-45 yoki 129"),
    date: z.string().describe("Qabul qilingan sana, YYYY-MM-DD, noma'lum bo'lsa bo'sh satr"),
    title: z.string(),
  }),
  references: z.array(
    z.object({
      type: z.string(),
      number: z.string(),
      date: z.string().nullable(),
      title: z.string().nullable(),
      relation: z.enum(["o'zgartirish", "bekor qilish", "to'ldirish", "havola"]),
      lexId: z.string().nullable().describe("Agar havolalar ro'yxatida shu hujjat bo'lsa, uning Lex.uz ID si"),
      searchQuery: z.string().describe("Lex.uz qidiruvi uchun qisqa so'rov: raqam va sana"),
    }),
  ),
});

export type ExtractedReferences = z.infer<typeof ReferencesSchema>;

export async function extractReferences(
  doc: LexDocument,
  log?: (msg: string) => void,
): Promise<ExtractedReferences & { references: OldDocumentReference[] }> {
  const links = doc.links.length
    ? doc.links.map((l) => `- ID ${l.id}: ${l.text}`).join("\n")
    : "(havolalar yo'q)";

  const message = await getClient().messages.parse({
    model: FAST_MODEL,
    max_tokens: 4000,
    system:
      "Siz O'zbekiston qonunchiligi bo'yicha huquqshunos-tahlilchisiz. Vazifangiz: yangi normativ-huquqiy hujjat matnidan " +
      "u o'zgartirayotgan, to'ldirayotgan yoki o'z kuchini yo'qotgan deb topayotgan OLDINGI hujjatlarni aniqlash. " +
      "Faqat matnda aniq ko'rsatilgan hujjatlarni qaytaring, o'ylab topmang. Muhimlik tartibida, ko'pi bilan 5 ta. " +
      "Shunchaki eslatib o'tilgan (masalan, 'ga muvofiq') hujjatlarga 'havola' munosabatini bering.",
    messages: [
      {
        role: "user",
        content:
          `<hujjat sarlavhasi>${doc.title}</hujjat sarlavhasi>\n` +
          `<matndagi Lex.uz havolalari>\n${links}\n</matndagi Lex.uz havolalari>\n` +
          `<hujjat matni>\n${clip(doc.text, FAST_INPUT_LIMIT, log)}\n</hujjat matni>`,
      },
    ],
    output_config: { format: zodOutputFormat(ReferencesSchema) },
  });
  assertNotRefused(message);
  if (!message.parsed_output) throw new Error("Claude javobini o'qib bo'lmadi (3-qadam).");

  // Faqat haqiqatda havolalar ro'yxatida bor ID larni qabul qilamiz
  const knownIds = new Set(doc.links.map((l) => l.id));
  const references = message.parsed_output.references.map((r) => ({
    ...r,
    lexId: r.lexId && knownIds.has(r.lexId) ? r.lexId : null,
  }));
  return { ...message.parsed_output, references };
}

// ---------- 5-qadam: qiyosiy tahlil va tuman vazifalari ----------

const AnalysisSchema = z.object({
  document: z.object({
    type: z.string(),
    number: z.string(),
    date: z.string(),
    title: z.string(),
    issuer: z.string(),
  }),
  summary: z.string().describe("Hujjatning umumiy mazmuni, 3-5 gap"),
  keyPoints: z.array(z.string()).describe("Asosiy yangiliklar, 3-7 ta qisqa band"),
  oldDocuments: z.array(
    z.object({
      type: z.string(),
      number: z.string(),
      date: z.string().nullable(),
      title: z.string().nullable(),
      relation: z.string(),
    }),
  ),
  comparison: z.array(
    z.object({
      topic: z.string(),
      before: z.string().describe("Eski hujjatda qanday edi (band raqami bilan)"),
      after: z.string().describe("Yangi hujjatda qanday bo'ldi (band raqami bilan)"),
      impact: z.string().describe("Amaliy ta'siri"),
    }),
  ),
  districtTasks: z.array(
    z.object({
      responsible: z.string().describe("Aniq ijrochi: tuman hokimligi, bo'lim, mahalla, hokim yordamchisi va h.k."),
      task: z.string(),
      mechanism: z.string().describe("Ijro mexanizmi: qanday hujjat, qanday tartib, kim bilan"),
      deadline: z.string(),
      priority: z.enum(["yuqori", "o'rta", "past"]),
    }),
  ),
  affectedGroups: z.array(z.object({ group: z.string(), effect: z.string() })),
});

export async function compareDocuments(
  newDoc: LexDocument,
  oldDocs: LexDocument[],
  district: string,
  log?: (msg: string) => void,
): Promise<Omit<AnalysisResult, "mode" | "model" | "generatedAt" | "district">> {
  const perOldLimit = Math.floor(MAIN_INPUT_LIMIT / 2 / Math.max(oldDocs.length, 1));
  const oldBlocks = oldDocs.length
    ? oldDocs
        .map(
          (d, i) =>
            `<eski_hujjat index="${i + 1}" url="${d.url}">\n<sarlavha>${d.title}</sarlavha>\n${clip(d.text, perOldLimit, log)}\n</eski_hujjat>`,
        )
        .join("\n\n")
    : "<eski_hujjat>Eski hujjat matni topilmadi. Qiyosiy tahlilni yangi hujjatdagi o'zgartirish bandlari asosida qiling va buni 'before' maydonida ochiq ayting.</eski_hujjat>";

  const message = await getClient().messages.parse({
    model: MAIN_MODEL,
    max_tokens: 16000,
    output_config: { effort: "medium", format: zodOutputFormat(AnalysisSchema) },
    system:
      "Siz O'zbekiston davlat boshqaruvi va mahalliy hokimiyat faoliyati bo'yicha ekspert-tahlilchisiz. " +
      "Yangi normativ-huquqiy hujjatni u o'zgartirgan eski hujjat bilan solishtirasiz va natijani o'zbek tilida (lotin yozuvida) beradiz. " +
      "Qoidalar:\n" +
      "1. Qiyosiy tahlilda har bir o'zgarish uchun eski va yangi holatni band raqamlari bilan aniq ko'rsating. Matnda yo'q narsani o'ylab topmang.\n" +
      "2. districtTasks ga FAQAT tuman/shahar darajasida (tuman hokimligi, uning bo'limlari, tuman idoralari, mahalla, hokim yordamchilari) bajarilishi kerak bo'lgan vazifalarni kiriting. " +
      "Respublika yoki vazirlik darajasidagi vazifalarni kiritmang, agar ular tuman darajasida ijro talab qilmasa.\n" +
      "3. Vazifalarni ko'rsatilgan hududning xususiyatlariga moslab, amaliy va o'lchanadigan qilib yozing. Muddatlarni hujjatdan oling; hujjatda bo'lmasa 'Hujjatda belgilanmagan' deb yozing.",
    messages: [
      {
        role: "user",
        content:
          `<hudud>${district}</hudud>\n\n` +
          `<yangi_hujjat url="${newDoc.url}">\n<sarlavha>${newDoc.title}</sarlavha>\n${clip(newDoc.text, MAIN_INPUT_LIMIT / 2, log)}\n</yangi_hujjat>\n\n` +
          oldBlocks,
      },
    ],
  });
  assertNotRefused(message);
  const parsed = message.parsed_output;
  if (!parsed) throw new Error("Claude javobini o'qib bo'lmadi (5-qadam).");

  return {
    ...parsed,
    document: { ...parsed.document, url: newDoc.source === "lex.uz" ? newDoc.url : null },
    oldDocuments: parsed.oldDocuments.map((o) => {
      const match = oldDocs.find((d) => d.source === "lex.uz" && o.number && d.title.includes(o.number));
      return { ...o, url: match?.url ?? null };
    }),
  };
}
