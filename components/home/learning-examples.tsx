import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { programs } from "@/content/programs";
import { learningExamplePhoto } from "@/content/media";
import { SectionHeading } from "@/components/ui/section-heading";

export function LearningExamples() {
  return <section className="section" aria-label="Ví dụ thực hành trong chương trình"><div className="container">
    <SectionHeading eyebrow="HỌC ĐỂ LÀM ĐƯỢC" title="Ý tưởng không chỉ ở trên giấy." description="Từ một chuỗi lệnh đến một mô hình hoạt động — mỗi nhiệm vụ là một cơ hội để con thử sức." />
    <div className="examples-layout">
      <figure className="example-photo">
        <div className="learning-photo-frame"><Image src={learningExamplePhoto.src} alt={learningExamplePhoto.alt} fill sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)" loading="lazy" /></div>
        <figcaption>{learningExamplePhoto.caption}<span>Ảnh hoạt động tại STEM Fighters, không gắn với ví dụ giáo trình cụ thể.</span></figcaption>
      </figure>
      <div className="example-grid">{programs.map(program => <article className="example-card" key={program.id}><div className="example-body"><p className="example-program">{program.name}</p><h3>{program.example.title}</h3><p>{program.example.description}</p></div></article>)}</div>
    </div>
    <p className="examples-note"><span aria-hidden="true">↳</span> Ví dụ được trích từ giáo trình, không phải hồ sơ dự án học viên đã hoàn thành.<a href="#chuong-trinh">Xem chương trình <ArrowUpRight size={16} aria-hidden="true" /></a></p>
  </div></section>;
}
