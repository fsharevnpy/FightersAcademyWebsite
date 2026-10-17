import { programs } from "../content/programs";

export const undecidedProgram = "Chưa xác định / Cần tư vấn";
export const leadPrograms = [...programs.map(program => program.name), undecidedProgram];
export const leadLimits = { parentName: 100, phone: 30, minAge: 3, maxAge: 18, sourcePage: 300, utm: 150 };
export const leadMessages = {
  success: "Đăng ký thành công! STEM Fighters sẽ liên hệ với bạn để tư vấn lịch học phù hợp.",
  failure: "Chưa thể gửi đăng ký. Vui lòng thử lại hoặc liên hệ STEM Fighters.",
};

export type Attribution = { utmSource: string; utmMedium: string; utmCampaign: string };
export type LeadInput = Attribution & {
  parentName: string;
  phone: string;
  childAge: number;
  program: string;
  sourcePage: string;
};
export type LeadField = "parentName" | "phone" | "childAge" | "program";
export type LeadErrors = Partial<Record<LeadField | "request", string>>;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function cleanText(value: string) {
  return value.replace(/\p{Cc}/gu, "").replace(/[<>]/g, "").trim();
}

export function normalizePhone(value: string) {
  return value.trim().replace(/[\s().-]/g, "").replace(/^(?:\+84|0084|84)/, "0");
}

export function validateLead(input: unknown): { success: true; data: LeadInput } | { success: false; errors: LeadErrors } {
  if (!isRecord(input)) return { success: false, errors: { request: "Dữ liệu không hợp lệ." } };
  const errors: LeadErrors = {};
  const parentName = typeof input.parentName === "string" ? cleanText(input.parentName).replace(/\s+/g, " ") : "";
  if (!parentName || typeof input.parentName !== "string" || input.parentName.length > leadLimits.parentName) {
    errors.parentName = "Vui lòng nhập tên phụ huynh (tối đa 100 ký tự).";
  }
  const phone = typeof input.phone === "string" ? normalizePhone(input.phone) : "";
  if (!/^(?:0[35789]\d{8}|02\d{9})$/.test(phone) || typeof input.phone !== "string" || input.phone.length > leadLimits.phone) {
    errors.phone = "Vui lòng nhập số điện thoại Việt Nam hợp lệ.";
  }
  const childAge = typeof input.childAge === "number" ? input.childAge : NaN;
  if (!Number.isInteger(childAge) || childAge < leadLimits.minAge || childAge > leadLimits.maxAge) {
    errors.childAge = "Vui lòng chọn tuổi của bé từ 3 đến 18.";
  }
  const submittedProgram = typeof input.program === "string" ? input.program : "";
  const program = programs.find(program => program.legacyNames?.includes(submittedProgram))?.name ?? submittedProgram;
  if (!leadPrograms.includes(program)) errors.program = "Vui lòng chọn chương trình quan tâm.";
  const sourcePage = typeof input.sourcePage === "string" ? cleanText(input.sourcePage) : "";
  if (!sourcePage.startsWith("/") || sourcePage.startsWith("//") || /[?#\\]/.test(sourcePage) || typeof input.sourcePage !== "string" || input.sourcePage.length > leadLimits.sourcePage) {
    errors.request = "Đường dẫn trang không hợp lệ.";
  }
  const attribution: Attribution = { utmSource: "", utmMedium: "", utmCampaign: "" };
  for (const key of ["utmSource", "utmMedium", "utmCampaign"] as const) {
    const value = input[key];
    if (value !== undefined && (typeof value !== "string" || value.length > leadLimits.utm)) {
      errors.request = "Thông tin nguồn truy cập không hợp lệ.";
    } else {
      attribution[key] = typeof value === "string" ? cleanText(value) : "";
    }
  }
  if (input.website !== undefined && input.website !== "") errors.request = "Dữ liệu không hợp lệ.";
  if (Object.keys(errors).length) return { success: false, errors };
  return { success: true, data: { parentName, phone, childAge, program, sourcePage, ...attribution } };
}
