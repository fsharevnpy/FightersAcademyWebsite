"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { contact } from "@/content/contact";
import { ButtonLink } from "@/components/ui/button";
import { TrialCTA } from "@/components/ui/trial-cta";

export function MobileCTA() {
  const pathname = usePathname();
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
  }, [pathname]);
  return visible ? <nav className="mobile-cta" aria-label="Liên hệ nhanh"><TrialCTA /><ButtonLink href={contact.zaloHref} variant="secondary" target="_blank" rel="noopener noreferrer">Chat Zalo<MessageCircle size={18} aria-hidden="true" /></ButtonLink></nav> : null;
}
