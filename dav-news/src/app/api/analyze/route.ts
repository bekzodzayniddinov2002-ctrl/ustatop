import Anthropic from "@anthropic-ai/sdk";
import { runAgent, resolveMode } from "@/lib/agent";
import { hasApiKey, MAIN_MODEL, FAST_MODEL } from "@/lib/claude";
import type { AgentEvent, AnalyzeRequest } from "@/lib/types";

// POST /api/analyze — 5 qadamli avtonom agentni ishga tushiradi.
// Javob NDJSON oqimi: har bir qatorda bitta AgentEvent (step | log | result | error).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  // UI holat paneli uchun: rejim va modellar
  let mode: "demo" | "live" = "demo";
  try {
    mode = resolveMode({ query: "" });
  } catch {
    mode = "live";
  }
  return Response.json({ mode, hasApiKey: hasApiKey(), mainModel: MAIN_MODEL, fastModel: FAST_MODEL });
}

export async function POST(request: Request) {
  let body: AnalyzeRequest;
  try {
    body = (await request.json()) as AnalyzeRequest;
  } catch {
    return Response.json({ error: "So'rov tanasi JSON bo'lishi kerak" }, { status: 400 });
  }
  if (!body?.demo && !body?.query?.trim()) {
    return Response.json({ error: "Hujjat raqami yoki Lex.uz havolasini kiriting" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: AgentEvent) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        await runAgent({ query: body.query ?? "", district: body.district, demo: body.demo }, emit);
      } catch (err) {
        emit({ type: "error", message: describeError(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return "Anthropic API kaliti noto'g'ri (401). .env.local faylini tekshiring.";
  if (err instanceof Anthropic.NotFoundError) return `Model topilmadi: ${err.message}. ANTHROPIC_MODEL qiymatini tekshiring.`;
  if (err instanceof Anthropic.RateLimitError) return "Anthropic API so'rovlar chegarasiga yetildi (429). Birozdan so'ng qayta urinib ko'ring.";
  if (err instanceof Anthropic.APIError) return `Anthropic API xatosi (${err.status ?? "?"}): ${err.message}`;
  return err instanceof Error ? err.message : String(err);
}
