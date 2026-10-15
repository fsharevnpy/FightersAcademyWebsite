import { cleanText, isRecord, leadLimits, type Attribution } from "./leads";

export const attributionStorageKey = "stem-fighters-attribution";
export const emptyAttribution: Attribution = { utmSource: "", utmMedium: "", utmCampaign: "" };

export function parseStoredAttribution(value: unknown): Attribution {
  if (!isRecord(value) || typeof value.utmSource !== "string" || typeof value.utmMedium !== "string" || typeof value.utmCampaign !== "string") {
    throw new Error("Invalid stored attribution");
  }
  return {
    utmSource: cleanText(value.utmSource).slice(0, leadLimits.utm),
    utmMedium: cleanText(value.utmMedium).slice(0, leadLimits.utm),
    utmCampaign: cleanText(value.utmCampaign).slice(0, leadLimits.utm),
  };
}

export function resolveAttribution(search: string, previous: Attribution): Attribution {
  const query = new URLSearchParams(search);
  if (!["utm_source", "utm_medium", "utm_campaign"].some(key => query.has(key))) return previous;
  return {
    utmSource: cleanText(query.get("utm_source") ?? "").slice(0, leadLimits.utm),
    utmMedium: cleanText(query.get("utm_medium") ?? "").slice(0, leadLimits.utm),
    utmCampaign: cleanText(query.get("utm_campaign") ?? "").slice(0, leadLimits.utm),
  };
}

export function captureAttribution(previous: Attribution = emptyAttribution): Attribution {
  let stored = previous;
  try {
    const saved = sessionStorage.getItem(attributionStorageKey);
    if (saved) stored = parseStoredAttribution(JSON.parse(saved));
  } catch {
    console.warn("[leads] Attribution storage unavailable or invalid; using current-session memory.");
  }
  const next = resolveAttribution(window.location.search, stored);
  try {
    sessionStorage.setItem(attributionStorageKey, JSON.stringify(next));
  } catch {
    console.warn("[leads] Attribution could not be persisted; submission remains available.");
  }
  return next;
}
