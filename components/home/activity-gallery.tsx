import Image from "next/image";
import { activityPhotos } from "@/content/media";
import { SectionHeading } from "@/components/ui/section-heading";

export function ActivityGallery() {
  return <section id="hoat-dong" className="section"><div className="container">
    <SectionHeading eyebrow="NHỮNG KHOẢNH KHẮC THỰC HÀNH" title="Hoạt động tại STEM Fighters" description="Một vài khoảnh khắc trong các lớp học, hoạt động trải nghiệm và quá trình thực hành của học viên tại STEM Fighters." />
    <div className="activity-grid">
      {activityPhotos.map(photo => <figure key={photo.src}>
        <div className="activity-photo"><Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 384px, (min-width: 1024px) calc((100vw - 128px) / 3), (min-width: 768px) calc((100vw - 96px) / 3), calc((100vw - 56px) / 2)" loading="lazy" style={{ objectPosition: photo.position }} /></div>
        <figcaption>{photo.caption}</figcaption>
      </figure>)}
    </div>
  </div></section>;
}
