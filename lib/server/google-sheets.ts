import { auth, sheets, type sheets_v4 } from "@googleapis/sheets";
import type { LeadInput } from "../leads";

export class LeadConfigurationError extends Error {
  constructor() { super("Lead storage is not configured."); }
}

export function readSheetsConfig(env: Record<string, string | undefined> = process.env) {
  const sheetId = env.GOOGLE_SHEET_ID?.trim();
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!sheetId || !email || !privateKey) throw new LeadConfigurationError();
  return { sheetId, email, privateKey };
}

export function formatCreatedAt(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")} ${part("hour")}:${part("minute")}`;
}

type AppendRows = (
  params: sheets_v4.Params$Resource$Spreadsheets$Values$Append,
  options: { timeout: number; retry: boolean },
) => Promise<{ data: sheets_v4.Schema$AppendValuesResponse }>;

export async function appendLeadRow(append: AppendRows, sheetId: string, lead: LeadInput, now = new Date()) {
  const response = await append({
    spreadsheetId: sheetId, range: "Leads!A1:K", valueInputOption: "RAW", insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[
      formatCreatedAt(now), lead.parentName, lead.phone, lead.childAge, lead.program,
      lead.sourcePage, lead.utmSource, lead.utmMedium, lead.utmCampaign, "New", "",
    ]] },
  }, { timeout: 12_000, retry: false });
  // RAW preserves leading-zero phone numbers and treats user text as data, not formulas.
  if (response.data.updates?.updatedRows !== 1) throw new Error("Lead append was not confirmed.");
}

export async function appendLead(lead: LeadInput) {
  const config = readSheetsConfig();
  const googleAuth = new auth.GoogleAuth({
    credentials: { client_email: config.email, private_key: config.privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    clientOptions: { transporterOptions: { timeout: 12_000, retry: false } },
  });
  const client = sheets({ version: "v4", auth: googleAuth });
  await appendLeadRow(client.spreadsheets.values.append.bind(client.spreadsheets.values), config.sheetId, lead);
}
