import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { learningExamplePhoto } from "@/content/media";
import { SectionHeading } from "@/components/ui/section-heading";

export function LearningExamples() {
  return <section className="section" aria-label="Học để làm được"><div className="container examples-layout">
    <div>
      <SectionHeading eyebrow="HỌC ĐỂ LÀM ĐƯỢC" title="Ý tưởng không chỉ ở trên giấy." description="Từ một chuỗi lệnh đến một mô hình hoạt động — mỗi nhiệm vụ là một cơ hội để con thử sức." />
      <p className="examples-note">Khám phá ví dụ thực hành và lộ trình tại trang chi tiết của từng chương trình.</p>
      <a href="#chuong-trinh" className="text-link">Xem chương trình <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
      <figure className="example-photo">
        <div className="learning-photo-frame"><Image src={learningExamplePhoto.src} alt={learningExamplePhoto.alt} fill sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)" loading="lazy" /></div>
        <figcaption>{learningExamplePhoto.caption}<span>Ảnh hoạt động tại STEM Fighters, không gắn với ví dụ giáo trình cụ thể.</span></figcaption>
      </figure>
  </div></section>;
}
