import "server-only";
import { appendLead } from "@/lib/server/google-sheets";
import { createLeadHandler } from "@/lib/server/lead-handler";

export const runtime = "nodejs";
export const POST = createLeadHandler(appendLead);
