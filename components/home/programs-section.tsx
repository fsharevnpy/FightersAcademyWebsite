import { Users, Layers3 } from "lucide-react";
import { formatTuition, getProgramCourseCount, getProgramStructure, getTuitionSummary, programs } from "@/content/programs";
import { trialContact } from "@/content/contact";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrialCTA } from "@/components/ui/trial-cta";
import { ProgramArt } from "./program-art";
import { ProgramDialog } from "./program-dialog";

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
              <div className="program-card-main">
                <div><h3>{program.name}</h3><div className="program-age"><Users size={15} aria-hidden="true" /><span>{program.audience}</span></div><p>{program.description}</p></div>
                <ProgramArt kind={program.id} />
              </div>
              <div className="program-facts">
                {courseCount && <span><Layers3 size={15} aria-hidden="true" />{courseCount}</span>}
                <div className="tags" aria-label="Kỹ năng và công nghệ">{program.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              </div>
              {tuition && <div className="program-tuition"><span>Học phí</span><strong>{tuition}</strong></div>}
              <div className="program-card-bottom">
                <ProgramDialog name={program.name} number={program.number}>
                  <p className="dialog-description">{program.description}</p>
                  <div className="dialog-facts"><span>{program.audience}</span><span>{getProgramStructure(program)}</span></div>
                  <h3>Các khóa học & học phí</h3>
                  <ol className="module-list">{program.modules.map((module, index) => <li key={`${module.group ?? ""}-${module.name}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div className="module-content">{module.group && <span className="module-group">{module.group}</span>}<strong>{module.name}</strong>{module.sessions && <span className="module-sessions">{module.sessions} buổi / khóa</span>}</div>
                    {module.tuition !== undefined && <span className="module-tuition">{formatTuition(module.tuition)}<small>/ {module.unit ?? "khóa"}</small></span>}
                  </li>)}</ol>
                  <p className="dialog-notice">Học phí tính cho từng khóa hoặc chuyên đề, không phải toàn bộ lộ trình. {trialContact.schedule}</p>
                  <TrialCTA />
                </ProgramDialog>
              </div>
            </article>
          );})}
        </div>
        <p className="program-note">Độ tuổi mang tính tham khảo; cấp độ phù hợp được xác định theo năng lực của từng trẻ. Học phí tính theo từng khóa hoặc chuyên đề, không phải toàn bộ lộ trình.</p>
      </div>
    </section>
  );
}
