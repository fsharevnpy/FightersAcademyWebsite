"use client";

import { useEffect } from "react";
import { contact } from "@/content/contact";
import { ctaLocations, trackConversion } from "@/lib/analytics";

export function ConversionTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a");
      const href = link?.getAttribute("href");
      const name = href === contact.phoneHref ? "click_phone" : href === contact.zaloHref ? "click_zalo" : undefined;
      if (!name || !link) return;
      const placement = link.closest("[data-cta-location]")?.getAttribute("data-cta-location");
      const location = ctaLocations.find(value => value === placement) ?? "mid_page";
      trackConversion(name, { location });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
