import { getProgramPath, programs, type ProgramId } from "@/content/programs";

export const ctaLocations = ["header", "hero", "mid_page", "bottom_form", "sticky_mobile", "footer"] as const;
export type CTALocation = typeof ctaLocations[number];
export type ConversionEvent = "click_hoc_thu" | "submit_lead" | "click_zalo" | "click_phone";

const courseValues: Record<ProgramId | "general", string> = {
  rio: "rio",
  "starter-kit": "starter_kit",
  "lap-trinh": "logic_programming",
  "dien-tu-co-ban": "basic_electronics",
  general: "general",
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackConversion(event: ConversionEvent, options: {
  location: CTALocation;
  course?: ProgramId | "general";
  pagePath?: string;
}) {
  if (typeof window === "undefined") return;
  const pagePath = options.pagePath ?? window.location.pathname;
  const course = options.course ?? programs.find(program => getProgramPath(program) === pagePath)?.id ?? "general";
  try {
    window.dataLayer ??= [];
    window.dataLayer.push({
      event, course: courseValues[course], page_path: pagePath, cta_location: options.location,
    });
  } catch (error) {
    // A third-party tag must not interrupt navigation or a confirmed lead submission.
    console.warn("[analytics] Conversion event could not be queued.", error);
  }
}
