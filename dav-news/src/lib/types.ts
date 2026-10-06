// Agent, scraper va UI o'rtasida almashinadigan umumiy turlar

export interface LexDocument {
  /** Lex.uz ichki identifikatori, masalan "-7058618" */
  id: string;
  url: string;
  title: string;
  /** Hujjat to'liq matni (toza, bo'sh joylar normallashtirilgan) */
  text: string;
  /** Matn ichidagi boshqa Lex.uz hujjatlariga havolalar */
  links: LexLink[];
  source: "lex.uz" | "demo";
}

export interface LexLink {
  id: string;
  url: string;
  text: string;
}

export interface LexSearchResult {
  id: string;
  url: string;
  title: string;
}

/** 3-qadam natijasi: yangi hujjat o'zgartirayotgan / bekor qilayotgan eski hujjat */
export interface OldDocumentReference {
  type: string;
  number: string;
  date: string | null;
  title: string | null;
  relation: "o'zgartirish" | "bekor qilish" | "to'ldirish" | "havola";
  lexId: string | null;
  searchQuery: string;
}

export interface ComparisonItem {
  topic: string;
  before: string;
  after: string;
  impact: string;
}

export interface DistrictTask {
  responsible: string;
  task: string;
  mechanism: string;
  deadline: string;
  priority: "yuqori" | "o'rta" | "past";
}

export interface AnalysisResult {
  document: {
    type: string;
    number: string;
    date: string;
    title: string;
    issuer: string;
    url: string | null;
  };
  summary: string;
  keyPoints: string[];
  oldDocuments: Array<{
    type: string;
    number: string;
    date: string | null;
    title: string | null;
    relation: string;
    url: string | null;
  }>;
  comparison: ComparisonItem[];
  district: string;
  districtTasks: DistrictTask[];
  affectedGroups: Array<{ group: string; effect: string }>;
  mode: "live" | "demo";
  model: string | null;
  generatedAt: string;
}

export type StepStatus = "pending" | "running" | "done" | "error" | "skipped";

export interface AgentStep {
  id: 1 | 2 | 3 | 4 | 5;
  title: string;
  status: StepStatus;
  detail?: string;
}

/** /api/analyze NDJSON oqimidagi hodisalar */
export type AgentEvent =
  | { type: "step"; step: AgentStep }
  | { type: "log"; message: string }
  | { type: "result"; result: AnalysisResult }
  | { type: "error"; message: string };

export interface AnalyzeRequest {
  /** Hujjat raqami ("PF-181"), Lex.uz havolasi yoki ID */
  query: string;
  district?: string;
  /** true bo'lsa, tarmoq va API ishlatilmaydi, Konimex demo ma'lumoti qaytariladi */
  demo?: boolean;
}
