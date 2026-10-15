"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ title, count, children }: { title: string; count: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <div className="curriculum-group">
    <h3><button type="button" id={`${id}-heading`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen(!open)}>
      <span>{title}<small>{count}</small></span><ChevronDown size={20} aria-hidden="true" />
    </button></h3>
    <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-heading`} hidden={!open}>{children}</div>
  </div>;
}
