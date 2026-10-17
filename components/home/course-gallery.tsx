"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { CoursePhoto } from "@/content/media";

type Props = { name: string; photos: readonly CoursePhoto[] };

export function CourseGallery({ name, photos }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const photo = selected === null ? undefined : photos[selected];
  const open = selected !== null;

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

  function step(direction: number) {
    setSelected(current => current === null ? null : (current + direction + photos.length) % photos.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    }
    if (event.key !== "Tab") return;
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!photos.length) return null;

  return <section className="course-gallery" aria-labelledby={`${id}-title`}>
    <div className="section-heading">
      <p className="eyebrow"><span aria-hidden="true" />KHOẢNH KHẮC TRONG LỚP HỌC</p>
      <h2 id={`${id}-title`}>Hình ảnh hoạt động</h2>
      <p className="section-description">Một vài hình ảnh học tập và thực hành trong chương trình {name}. Chọn ảnh để xem đầy đủ.</p>
    </div>
    <div className={`activity-grid course-gallery-grid${photos.length === 4 ? " course-gallery-grid--four" : ""}`}>
      {photos.map((item, index) => <figure key={item.src}>
        <button type="button" className="activity-photo" aria-label={`Phóng to ảnh: ${item.caption}`} aria-haspopup="dialog" aria-controls={`${id}-viewer`} onClick={event => {
          trigger.current = event.currentTarget;
          setSelected(index);
          dialog.current?.showModal();
        }}>
          <Image src={item.src} alt={item.alt} fill sizes={photos.length === 4 ? "(min-width: 1280px) 282px, (min-width: 1024px) 25vw, 50vw" : "(min-width: 1280px) 384px, (min-width: 768px) 33vw, 50vw"} loading="lazy" style={{ objectPosition: item.position }} />
          <span className="course-gallery-zoom"><Expand size={16} aria-hidden="true" /></span>
        </button>
        <figcaption>{item.caption}</figcaption>
      </figure>)}
    </div>
    <dialog ref={dialog} id={`${id}-viewer`} className="course-photo-dialog" aria-label={`Hình ảnh hoạt động: ${name}`} onKeyDown={onKeyDown} onClose={() => {
      setSelected(null);
      trigger.current?.focus({ preventScroll: true });
    }} onClick={event => {
      if (event.target === event.currentTarget) dialog.current?.close();
    }}>
      <div className="course-photo-viewer">
        <button autoFocus type="button" className="course-photo-close" aria-label="Đóng ảnh" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button>
        {photo && <figure>
          <div className="course-photo-full"><Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(min-width: 1100px) 1000px, 100vw" /></div>
          <figcaption aria-live="polite">{photo.caption} <span>— {(selected ?? 0) + 1}/{photos.length}</span></figcaption>
        </figure>}
        {photos.length > 1 && <div className="course-photo-controls">
          <button type="button" aria-label="Ảnh trước" onClick={() => step(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Ảnh tiếp theo" onClick={() => step(1)}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>}
      </div>
    </dialog>
  </section>;
}
