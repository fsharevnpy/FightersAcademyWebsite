import { validateLead, type LeadInput } from "../leads";
import { LeadConfigurationError } from "./google-sheets";

const maxBodyBytes = 8_192;

async function readJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing request body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        throw new Error("Request body too large");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createLeadHandler(append: (lead: LeadInput) => Promise<void>) {
  return async function handleLead(request: Request) {
    const invalid = () => Response.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin && origin !== "https://stem.fightersacademy.com.vn") return invalid();
    if (request.headers.get("sec-fetch-site") === "cross-site") return invalid();
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return invalid();
    let input: unknown;
    try { input = await readJson(request); } catch { return invalid(); }
    const validation = validateLead(input);
    if (!validation.success) return invalid();
    try {
      await append(validation.data);
      return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      const notConfigured = error instanceof LeadConfigurationError;
      console.error(`[leads] ${notConfigured ? "STORAGE_NOT_CONFIGURED" : "APPEND_FAILED"}`);
      return Response.json({ success: false, error: "LEAD_SUBMISSION_FAILED" }, { status: notConfigured ? 503 : 500 });
    }
  };
}
