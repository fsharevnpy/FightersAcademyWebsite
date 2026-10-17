import { expect, test } from "@playwright/test";
import { createServer } from "node:http";
import { once } from "node:events";
import { auth, sheets } from "@googleapis/sheets";
import { leadPrograms, normalizePhone, validateLead, type LeadInput } from "../lib/leads";
import { emptyAttribution, parseStoredAttribution, resolveAttribution } from "../lib/lead-attribution";
import { appendLeadRow, formatCreatedAt, LeadConfigurationError, readSheetsConfig } from "../lib/server/google-sheets";
import { createLeadHandler } from "../lib/server/lead-handler";

const valid: LeadInput = {
  parentName: "Nguyễn Văn A", phone: "0901234567", childAge: 9, program: "Kỹ sư Công nghệ STEM nhí",
  sourcePage: "/", utmSource: "facebook", utmMedium: "paid_social", utmCampaign: "starterkit_oct",
};
const requestFor = (body: unknown) => new Request("http://localhost/api/leads", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

test("server validates all fields, normalizes phones and rejects spam", () => {
  for (const phone of ["0901234567", "+84 901 234 567", "84901234567", "0084901234567"]) {
    const result = validateLead({ ...valid, parentName: "  Nguyễn   Văn A  ", phone });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("0901234567");
      expect(result.data.parentName).toBe("Nguyễn Văn A");
    }
  }
  expect(normalizePhone("(028) 1234-5678")).toBe("02812345678");
  for (const program of leadPrograms) expect(validateLead({ ...valid, program }).success).toBe(true);
  const invalidInputs: unknown[] = [
    null, [], {}, { ...valid, parentName: "" }, { ...valid, parentName: "x".repeat(101) },
    { ...valid, phone: "12345" }, { ...valid, phone: "0901234567abc" }, { ...valid, phone: "0101234567" },
    ...[2, 19, 7.5, "9", null, Infinity].map(childAge => ({ ...valid, childAge })),
    { ...valid, program: "Lập trình" }, { ...valid, program: "unknown" },
    { ...valid, sourcePage: "https://example.com" }, { ...valid, sourcePage: "/?secret=1" },
    { ...valid, sourcePage: "//other.example" }, { ...valid, sourcePage: "/".repeat(301) },
    { ...valid, utmSource: "x".repeat(151) }, { ...valid, utmCampaign: {} },
    { ...valid, website: "spam" },
  ];
  for (const input of invalidInputs) expect(validateLead(input).success, JSON.stringify(input)).toBe(false);
  const sanitized = validateLead({ ...valid, utmSource: "<facebook>\u0000" });
  expect(sanitized.success && sanitized.data.utmSource).toBe("facebook");
});

test("attribution retains a session without mixing a new campaign with old values", () => {
  const first = resolveAttribution("?utm_source=facebook&utm_medium=paid_social&utm_campaign=oct", emptyAttribution);
  expect(resolveAttribution("?unrelated=ignored", first)).toEqual(first);
  expect(resolveAttribution("?utm_source=new", first)).toEqual({ utmSource: "new", utmMedium: "", utmCampaign: "" });
  expect(resolveAttribution("?utm_source=", first)).toEqual(emptyAttribution);
  expect(() => parseStoredAttribution({ utmSource: 42 })).toThrow("Invalid stored attribution");
  expect(resolveAttribution(`?utm_campaign=${"x".repeat(200)}`, emptyAttribution).utmCampaign).toHaveLength(150);
});

test("Google config is required and escaped newlines are normalized", () => {
  expect(() => readSheetsConfig({})).toThrow(LeadConfigurationError);
  expect(() => readSheetsConfig({ GOOGLE_SHEET_ID: "test-sheet", GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.invalid" })).toThrow(LeadConfigurationError);
  expect(readSheetsConfig({ GOOGLE_SHEET_ID: "test-sheet", GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.invalid", GOOGLE_PRIVATE_KEY: "not-a-real-key\\nsecond-line" }).privateKey).toBe("not-a-real-key\nsecond-line");
  expect(formatCreatedAt(new Date("2026-10-15T17:32:00Z"))).toBe("2026-10-16 00:32");
});

test("official Google client appends exactly A:K as RAW and propagates failures", async () => {
  let responseCode = 200;
  let confirmedRows = 1;
  const received: { method?: string; url?: string; authorization?: string; body: unknown }[] = [];
  const server = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    received.push({ method: request.method, url: request.url, authorization: request.headers.authorization, body: JSON.parse(Buffer.concat(chunks).toString()) });
    response.writeHead(responseCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(responseCode === 200 ? { updates: { updatedRows: confirmedRows } } : { error: { code: responseCode, message: "Controlled test failure" } }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not bind");
  try {
    const oauth = new auth.OAuth2();
    oauth.setCredentials({ access_token: "fake-test-token", expiry_date: Date.now() + 3_600_000 });
    const client = sheets({ version: "v4", auth: oauth, rootUrl: `http://127.0.0.1:${address.port}/` });
    const append = client.spreadsheets.values.append.bind(client.spreadsheets.values);
    await appendLeadRow(append, "fake-sheet", { ...valid, parentName: "=1+1" }, new Date("2026-10-16T03:32:00Z"));
    expect(received).toHaveLength(1);
    expect(received[0].method).toBe("POST");
    const url = new URL(received[0].url!, "http://localhost");
    expect(decodeURIComponent(url.pathname)).toBe("/v4/spreadsheets/fake-sheet/values/Leads!A1:K:append");
    expect(url.searchParams.get("valueInputOption")).toBe("RAW");
    expect(url.searchParams.get("insertDataOption")).toBe("INSERT_ROWS");
    expect(received[0].authorization).toBe("Bearer fake-test-token");
    expect(received[0].body).toEqual({ values: [["2026-10-16 10:32", "=1+1", "0901234567", 9, "Kỹ sư Công nghệ STEM nhí", "/", "facebook", "paid_social", "starterkit_oct", "New", ""]] });
    confirmedRows = 0;
    await expect(appendLeadRow(append, "fake-sheet", valid)).rejects.toThrow("not confirmed");
    responseCode = 503;
    await expect(appendLeadRow(append, "fake-sheet", valid)).rejects.toThrow();
    expect(received).toHaveLength(3);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

test("handler waits for append success and ignores client-managed columns", async () => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let appended: LeadInput | undefined;
  const handler = createLeadHandler(async lead => { appended = lead; await pending; });
  let responded = false;
  const result = handler(requestFor({ ...valid, createdAt: "fake", status: "Enrolled", note: "fake" })).then(response => { responded = true; return response; });
  await expect.poll(() => appended !== undefined).toBe(true);
  expect(responded).toBe(false);
  expect(appended).toEqual(valid);
  release();
  const response = await result;
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ success: true });
});

test("handler rejects malformed, oversized, cross-site and invalid requests before append", async () => {
  let count = 0;
  const handler = createLeadHandler(async () => { count++; });
  const requests = [
    requestFor({ ...valid, phone: "" }), requestFor({ ...valid, website: "bot" }), requestFor("x".repeat(9000)),
    new Request("http://localhost/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }),
    new Request("http://localhost/api/leads", { method: "POST", body: JSON.stringify(valid) }),
    new Request("http://localhost/api/leads", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://other.invalid" }, body: JSON.stringify(valid) }),
  ];
  for (const request of requests) {
    const response = await handler(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ success: false, error: "INVALID_INPUT" });
  }
  expect(count).toBe(0);
});

test("missing config and Google errors return safe errors without leaking raw details", async () => {
  const messages: unknown[][] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => { messages.push(args); };
  try {
    for (const error of [new LeadConfigurationError(), new Error("sensitive-test-sentinel")]) {
      const handler = createLeadHandler(async () => { throw error; });
      const response = await handler(requestFor(valid));
      expect(response.status).toBe(error instanceof LeadConfigurationError ? 503 : 500);
      expect(await response.json()).toEqual({ success: false, error: "LEAD_SUBMISSION_FAILED" });
    }
    expect(messages).toEqual([["[leads] STORAGE_NOT_CONFIGURED"], ["[leads] APPEND_FAILED"]]);
  } finally { console.error = original; }
});

test("production POST route validates input and reports unconfigured storage honestly", async ({ request }) => {
  const invalid = await request.post("/api/leads", { data: { ...valid, phone: "123" } });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toEqual({ success: false, error: "INVALID_INPUT" });
  const missingConfig = await request.post("/api/leads", { data: valid });
  expect(missingConfig.status()).toBe(503);
  expect(await missingConfig.json()).toEqual({ success: false, error: "LEAD_SUBMISSION_FAILED" });
  expect((await request.get("/api/leads")).status()).toBe(405);
});
