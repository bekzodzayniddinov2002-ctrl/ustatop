import { compareDocuments, extractReferences, hasApiKey, MAIN_MODEL } from "./claude";
import { fetchDocument, resolveDocument, searchDocuments } from "./lexuz";
import { buildDemoResult, DEMO_DISTRICT, DEMO_NEW_DOCUMENT, DEMO_OLD_DOCUMENT, DEMO_REFERENCES } from "./mock";
import type { AgentEvent, AgentStep, AnalysisResult, AnalyzeRequest, LexDocument, OldDocumentReference } from "./types";

// Avtonom agent: 5 qadamli tahlil zanjiri. Har bir qadam holati `emit` orqali UI ga oqim sifatida yuboriladi.

export const STEP_TITLES: Record<AgentStep["id"], string> = {
  1: "So'rovni qabul qilish",
  2: "Yangi hujjatni Lex.uz dan olish",
  3: "Eski hujjat(lar)ni aniqlash (Claude)",
  4: "Eski hujjatni qidirish va yuklab olish",
  5: "Qiyosiy tahlil va tuman vazifalari (Claude)",
};

const MAX_OLD_DOCUMENTS = 2;

type Emit = (event: AgentEvent) => void;

export function resolveMode(req: AnalyzeRequest): "demo" | "live" {
  const mockMode = (process.env.MOCK_MODE || "auto").toLowerCase();
  if (req.demo || mockMode === "true") return "demo";
  if (!hasApiKey()) {
    if (mockMode === "false") throw new Error("ANTHROPIC_API_KEY o'rnatilmagan va MOCK_MODE=false.");
    return "demo";
  }
  return "live";
}

function stepper(emit: Emit) {
  return (id: AgentStep["id"], status: AgentStep["status"], detail?: string) =>
    emit({ type: "step", step: { id, title: STEP_TITLES[id], status, detail } });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runAgent(req: AnalyzeRequest, emit: Emit): Promise<void> {
  const step = stepper(emit);
  const log = (message: string) => emit({ type: "log", message });
  const district = req.district?.trim() || process.env.DEFAULT_DISTRICT || DEMO_DISTRICT;
  const query = req.query.trim();

  // 1-qadam
  step(1, "running");
  const mode = resolveMode(req);
  step(1, "done", `${mode === "demo" ? "DEMO rejim" : "Jonli rejim"} · hudud: ${district}`);

  if (mode === "demo") {
    emit({ type: "result", result: await runDemo(step, log, district) });
    return;
  }

  // 2-qadam: yangi hujjat matni
  step(2, "running", query);
  const newDoc = await resolveDocument(query).catch((err: Error) => {
    step(2, "error", err.message);
    throw err;
  });
  step(2, "done", `${newDoc.title.slice(0, 120)} · ${newDoc.text.length.toLocaleString()} belgi · ${newDoc.links.length} ta havola`);

  // 3-qadam: o'zgartirilayotgan eski hujjatlarni aniqlash
  step(3, "running");
  const extracted = await extractReferences(newDoc, log).catch((err: Error) => {
    step(3, "error", err.message);
    throw err;
  });
  const targets = pickTargets(extracted.references);
  step(
    3,
    "done",
    targets.length
      ? targets.map((r) => `${r.type} ${r.number}${r.date ? ` (${r.date})` : ""} — ${r.relation}`).join("; ")
      : "Matnda o'zgartirilayotgan eski hujjat topilmadi",
  );

  // 4-qadam: eski hujjatlarni topish va skreping
  const oldDocs: LexDocument[] = [];
  if (!targets.length) {
    step(4, "skipped", "Qidiriladigan eski hujjat yo'q");
  } else {
    step(4, "running");
    for (const ref of targets) {
      try {
        const doc = await findOldDocument(ref, log);
        if (doc) oldDocs.push(doc);
      } catch (err) {
        log(`${ref.type} ${ref.number}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    step(
      4,
      oldDocs.length ? "done" : "error",
      oldDocs.length
        ? oldDocs.map((d) => d.title.slice(0, 90)).join("; ")
        : "Eski hujjat matni topilmadi, tahlil faqat yangi hujjat asosida davom etadi",
    );
  }

  // 5-qadam: qiyosiy tahlil
  step(5, "running", `Model: ${MAIN_MODEL}`);
  const analysis = await compareDocuments(newDoc, oldDocs, district, log).catch((err: Error) => {
    step(5, "error", err.message);
    throw err;
  });
  step(5, "done", `${analysis.comparison.length} ta o'zgarish · ${analysis.districtTasks.length} ta tuman vazifasi`);

  emit({
    type: "result",
    result: { ...analysis, district, mode: "live", model: MAIN_MODEL, generatedAt: new Date().toISOString() },
  });
}

/** O'zgartirish/bekor qilish munosabatidagi hujjatlarni ustun qo'yadi; ular bo'lmasa oddiy havolalarni oladi. */
function pickTargets(refs: OldDocumentReference[]): OldDocumentReference[] {
  const strong = refs.filter((r) => r.relation !== "havola");
  return (strong.length ? strong : refs).slice(0, MAX_OLD_DOCUMENTS);
}

async function findOldDocument(ref: OldDocumentReference, log: (m: string) => void): Promise<LexDocument | null> {
  if (ref.lexId) {
    log(`${ref.number}: matndagi havola orqali yuklanmoqda (ID ${ref.lexId})`);
    return fetchDocument(ref.lexId);
  }
  log(`${ref.number}: Lex.uz da qidirilmoqda — "${ref.searchQuery}"`);
  const results = await searchDocuments(ref.searchQuery, 5);
  // Raqami sarlavhada uchraydigan natijani afzal ko'ramiz
  const best = results.find((r) => r.title.includes(ref.number)) ?? results[0];
  if (!best) {
    log(`${ref.number}: qidiruv natija bermadi`);
    return null;
  }
  return fetchDocument(best.url);
}

async function runDemo(
  step: ReturnType<typeof stepper>,
  log: (m: string) => void,
  district: string,
): Promise<AnalysisResult> {
  log("DEMO rejim: Lex.uz va Claude API ga so'rov yuborilmaydi, Konimex tumani misolidagi namunaviy ma'lumot ko'rsatiladi.");
  step(2, "running", "PF-181");
  await sleep(600);
  step(2, "done", `${DEMO_NEW_DOCUMENT.title.slice(0, 120)} · ${DEMO_NEW_DOCUMENT.links.length} ta havola`);
  step(3, "running");
  await sleep(800);
  step(3, "done", DEMO_REFERENCES.map((r) => `${r.type} ${r.number} (${r.date}) — ${r.relation}`).join("; "));
  step(4, "running");
  await sleep(600);
  step(4, "done", DEMO_OLD_DOCUMENT.title.slice(0, 90));
  step(5, "running", "Namunaviy tahlil");
  await sleep(900);
  const result = buildDemoResult(district);
  step(5, "done", `${result.comparison.length} ta o'zgarish · ${result.districtTasks.length} ta tuman vazifasi`);
  return result;
}
