"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button";

const links = [{ href: "#chuong-trinh", label: "Chương trình học" }, { href: "#cach-hoc", label: "Cách học tại STEM Fighters" }, { href: "#hoat-dong", label: "Hoạt động" }];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") { setOpen(false); toggle.current?.focus({ preventScroll: true }); } }
    function onResize() { if (window.innerWidth >= 1024) setOpen(false); }
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.dataset.menuOpen = "true";
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); delete document.body.dataset.menuOpen; };
  }, [open]);

  return <header className="site-header">
    <div className="container header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Điều hướng chính">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
      <ButtonLink href="#dang-ky" className="header-cta">Đăng ký học thử <ArrowUpRight size={17} aria-hidden="true" /></ButtonLink>
      <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls={open ? "mobile-menu" : undefined} aria-label={open ? "Đóng menu" : "Mở menu"} onClick={() => setOpen(!open)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    </div>
    {open && <nav id="mobile-menu" className="mobile-menu container" aria-label="Điều hướng di động">
      {links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
      <ButtonLink href="#dang-ky" onClick={() => setOpen(false)}>Đăng ký học thử <ArrowUpRight size={18} aria-hidden="true" /></ButtonLink>
    </nav>}
  </header>;
}
