import { ArrowRight, Users, Layers3 } from "lucide-react";
import { formatTuition, getTuitionSummary, programs } from "@/content/programs";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ProgramArt } from "./program-art";
import { ProgramDialog } from "./program-dialog";

export function ProgramsSection() {
  return (
    <section id="chuong-trinh" className="section section-tinted">
      <div className="container">
        <div className="section-title-row">
          <SectionHeading eyebrow="CHƯƠNG TRÌNH HỌC" title="Bốn cách bắt đầu.\nMột tinh thần khám phá." />
          <p className="section-aside">Mỗi trẻ có một điểm khởi đầu khác nhau. <br />Khám phá lộ trình phù hợp với sự tò mò của con.</p>
        </div>
        <div className="program-grid">
          {programs.map(program => (
            <article className="program-card" key={program.id}>
              <div className="program-card-top">
                <span className="program-category">{program.category}</span>
                <span className="program-number">/{program.number}</span>
              </div>
              <div className="program-card-main">
                <div><h3>{program.name}</h3><p>{program.description}</p></div>
                <ProgramArt kind={program.id} />
              </div>
              <div className="program-facts">
                <span><Users size={15} aria-hidden="true" />{program.audience}</span>
                <span><Layers3 size={15} aria-hidden="true" />{program.structure}</span>
              </div>
              <div className="program-tuition"><span>Học phí</span><strong>{getTuitionSummary(program)}</strong></div>
              <div className="program-card-bottom">
                <div className="tags">{program.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <ProgramDialog name={program.name} number={program.number}>
                  <p className="dialog-description">{program.description}</p>
                  <div className="dialog-facts"><span>{program.audience}</span><span>{program.structure}</span></div>
                  <h3>Các khóa học & học phí</h3>
                  <ol className="module-list">{program.modules.map((module, index) => <li key={`${module.group ?? ""}-${module.name}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div className="module-content">{module.group && <span className="module-group">{module.group}</span>}<strong>{module.name}</strong>{module.sessions && <span className="module-sessions">{module.sessions} buổi / khóa</span>}</div>
                    {module.tuition !== undefined && <span className="module-tuition">{formatTuition(module.tuition)}<small>/ {module.unit ?? "khóa"}</small></span>}
                  </li>)}</ol>
                  <p className="dialog-notice">Học phí tính cho từng khóa hoặc chuyên đề, không phải toàn bộ lộ trình. Lịch mở lớp đang được cập nhật; vui lòng liên hệ để chọn cấp độ phù hợp và được tư vấn về lịch học, thiết bị, học liệu đi kèm.</p>
                  <ButtonLink href="#dang-ky">Tìm hiểu học thử <ArrowRight size={18} aria-hidden="true" /></ButtonLink>
                </ProgramDialog>
              </div>
            </article>
          ))}
        </div>
        <p className="program-note">Độ tuổi mang tính tham khảo; cấp độ phù hợp được xác định theo năng lực của từng trẻ.</p>
      </div>
    </section>
  );
}
