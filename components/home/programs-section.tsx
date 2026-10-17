import Link from "next/link";
import { ArrowUpRight, Users, Layers3 } from "lucide-react";
import { getProgramCourseCount, getProgramPath, getTuitionSummary, programs } from "@/content/programs";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrialCTA } from "@/components/ui/trial-cta";
import { ProgramVisual } from "./program-visual";

export function ProgramsSection() {
  return (
    <section id="chuong-trinh" className="section section-tinted">
      <div className="container">
        <div className="section-title-row">
          <SectionHeading eyebrow="CHƯƠNG TRÌNH HỌC" title="Bốn cách bắt đầu.\nMột tinh thần khám phá." />
          <p className="section-aside">So sánh độ tuổi, hướng khám phá và kỹ năng của bốn chương trình để chọn điểm bắt đầu phù hợp với con.</p>
        </div>
        <div className="program-grid">
          {programs.map(program => {
            const tuition = getTuitionSummary(program);
            const courseCount = getProgramCourseCount(program);
            return (
            <article className="program-card" key={program.id}>
              <div className="program-card-top">
                <span className="program-category">{program.category}</span>
                <span className="program-number">/{program.number}</span>
              </div>
              <ProgramVisual id={program.id} />
              <div className="program-card-main">
                <div><h3>{program.name}</h3><div className="program-age"><Users size={15} aria-hidden="true" /><span>{program.audience}</span></div><p>{program.summary}</p></div>
              </div>
              <div className="program-facts">
                {courseCount && <span><Layers3 size={15} aria-hidden="true" />{courseCount}</span>}
                <div className="tags" aria-label="Kỹ năng và công nghệ">{program.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              </div>
              {tuition && <div className="program-tuition"><span>Học phí</span><strong>{tuition}</strong></div>}
              <div className="program-card-bottom">
                <Link href={getProgramPath(program)} className="button button--tertiary" aria-label={`Xem chi tiết chương trình ${program.name}`}>Xem chi tiết<ArrowUpRight size={18} aria-hidden="true" /></Link>
                <TrialCTA program={program.id} />
              </div>
            </article>
          );})}
        </div>
        <p className="program-note">Độ tuổi mang tính tham khảo; cấp độ phù hợp được xác định theo năng lực của từng trẻ. Học phí tính theo từng khóa hoặc chuyên đề, không phải toàn bộ lộ trình.</p>
      </div>
    </section>
  );
}
