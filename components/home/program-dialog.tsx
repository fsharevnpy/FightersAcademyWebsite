"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { name: string; number: string; children: ReactNode };

export function ProgramDialog({ name, number, children }: Props) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const dialogId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.dialogOpen = "true";
    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.dialogOpen;
    };
  }, [open]);

  function close() {
    dialog.current?.close();
    setOpen(false);
  }

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const targets = dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], [tabindex='0']");
    if (!targets?.length) return;
    const first = targets[0];
    const last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return <>
    <Button
      variant="tertiary"
      aria-label={`Xem chi tiết chương trình ${name}`}
      aria-haspopup="dialog"
      aria-controls={dialogId}
      onClick={() => { dialog.current?.showModal(); setOpen(true); }}
    >Xem chi tiết <ArrowUpRight size={18} aria-hidden="true" /></Button>
    <dialog
      ref={dialog}
      id={dialogId}
      className="program-dialog"
      aria-labelledby={titleId}
      onClose={() => setOpen(false)}
      onKeyDown={containFocus}
      onClick={event => {
        if (event.target === event.currentTarget || (event.target instanceof Element && event.target.closest('a[href^="#"]'))) close();
      }}
    >
      <div className="dialog-inner">
        <button autoFocus type="button" className="dialog-close" aria-label="Đóng thông tin chương trình" onClick={close}><X size={22} aria-hidden="true" /></button>
        <p className="eyebrow">CHƯƠNG TRÌNH {number}</p>
        <h2 id={titleId}>{name}</h2>
        {children}
      </div>
    </dialog>
  </>;
}
