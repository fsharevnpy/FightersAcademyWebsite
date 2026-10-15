"use client";

import { useEffect, useState } from "react";
import { TrialCTA } from "@/components/ui/trial-cta";

export function MobileCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero-actions");
    const registration = document.getElementById("dang-ky");
    const footer = document.querySelector("footer");
    if (!hero || !registration || !footer) return;
    let heroPassed = false, registrationVisible = false, footerVisible = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        if (entry.target === registration) registrationVisible = entry.isIntersecting;
        if (entry.target === footer) footerVisible = entry.isIntersecting;
      }
      setVisible(heroPassed && !registrationVisible && !footerVisible);
    });
    [hero, registration, footer].forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return visible ? <div className="mobile-cta"><TrialCTA /></div> : null;
}
