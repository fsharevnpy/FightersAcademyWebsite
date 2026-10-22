import Image from "next/image";
import { courseMedia } from "@/content/media";
import type { ProgramId } from "@/content/programs";
import { ProgramArt } from "./program-art";

export function ProgramVisual({ id, priority = false }: { id: ProgramId; priority?: boolean }) {
  const photo = courseMedia[id]?.representative;
  return <div className={`program-visual${id === "rio" ? " program-visual--contain" : id === "starter-kit" ? " program-visual--product" : ""}`}>
    {photo ? <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 380px, (min-width: 768px) 340px, calc(100vw - 40px)" loading={priority ? "eager" : "lazy"} /> : <ProgramArt kind={id} />}
  </div>;
}
