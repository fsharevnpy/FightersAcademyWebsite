import { ArrowRight, Users, Layers3 } from "lucide-react";
import { programs } from "@/content/programs";
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
              <div className="program-card-bottom">
                <div className="tags">{program.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <ProgramDialog name={program.name} number={program.number}>
                  <p className="dialog-description">{program.description}</p>
                  <div className="dialog-facts"><span>{program.audience}</span><span>{program.structure}</span></div>
                  <h3>Nội dung trong giáo trình</h3>
                  <ol className="module-list">{program.modules.map((module, index) => <li key={module}><span>{String(index + 1).padStart(2, "0")}</span>{module}</li>)}</ol>
                  <p className="dialog-notice">Lịch mở lớp, học phí và cơ sở: [CẦN BỔ SUNG]. Nội dung trên là tóm tắt giáo trình, không phải lịch tuyển sinh.</p>
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
