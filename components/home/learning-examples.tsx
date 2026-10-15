import { ArrowUpRight } from "lucide-react";
import { programs } from "@/content/programs";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgramArt } from "./program-art";

export function LearningExamples() {
  return <section className="section" aria-label="Ví dụ thực hành trong chương trình"><div className="container">
    <SectionHeading eyebrow="HỌC ĐỂ LÀM ĐƯỢC" title="Ý tưởng không chỉ ở trên giấy." description="Từ một chuỗi lệnh đến một mô hình hoạt động — mỗi nhiệm vụ là một cơ hội để con thử sức." />
    <div className="example-grid">{programs.map(program => <article className="example-card" key={program.id}><div className="example-art"><ProgramArt kind={program.id} /><span>{program.name}</span></div><div className="example-body"><h3>{program.example.title}</h3><p>{program.example.description}</p></div></article>)}</div>
    <p className="examples-note"><span aria-hidden="true">↳</span> Ví dụ được trích từ giáo trình, không phải hồ sơ dự án học viên đã hoàn thành.<a href="#chuong-trinh">Xem chương trình <ArrowUpRight size={16} aria-hidden="true" /></a></p>
  </div></section>;
}
