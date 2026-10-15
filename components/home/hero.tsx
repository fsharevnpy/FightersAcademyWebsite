import Image from "next/image";
import { ArrowDown, ArrowUpRight, CircuitBoard, Code2, Lightbulb } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <div className="hero-copy">
        <p className="eyebrow"><span aria-hidden="true" />TỪ TÒ MÒ ĐẾN SÁNG TẠO</p>
        <h1 id="hero-title">Khám phá{" "}<br />công nghệ.<br /><span>Tự tay tạo nên<br className="desktop-break" /> <span className="whitespace-nowrap">sản phẩm.</span></span></h1>
        <p className="hero-description">Một ý tưởng nhỏ. Một bước thử mới.<br />Cùng con khám phá robot, lập trình và chế tạo qua những trải nghiệm STEM thực tế.</p>
        <div id="hero-actions" className="hero-actions">
          <ButtonLink href="#dang-ky">Đăng ký học thử <ArrowUpRight size={19} aria-hidden="true" /></ButtonLink>
          <ButtonLink href="#chuong-trinh" variant="secondary">Khám phá khóa học <ArrowDown size={17} aria-hidden="true" /></ButtonLink>
        </div>
        <div className="hero-footnote"><span className="small-spark" aria-hidden="true">✳</span><span>Học qua thực hành. Trưởng thành qua mỗi lần thử.</span></div>
      </div>
      <div className="hero-visual">
        <div className="hero-grid-pattern" aria-hidden="true" />
        <div className="hero-image-frame">
          <Image src="/images/mentor-student.jpg" alt="Người hướng dẫn đồng hành cùng học viên thực hành lắp ghép tại STEM Fighters" fill sizes="(min-width: 1280px) 580px, (min-width: 1024px) 48vw, (min-width: 768px) 92vw, 90vw" loading="eager" fetchPriority="high" className="hero-image" />
          <div className="photo-label"><span />MỘT KHOẢNH KHẮC TẠI STEM FIGHTERS</div>
        </div>
        <div className="floating-note"><span className="note-icon"><Lightbulb size={25} aria-hidden="true" /></span><div><strong>Ý tưởng của con.</strong><span>Sản phẩm do con tạo nên.</span></div><span className="note-plus" aria-hidden="true">+</span></div>
        <div className="visual-coordinate" aria-hidden="true">EXPLORE. BUILD. REPEAT.</div>
      </div>
    </div>
    <div className="container"><div className="hero-bottom"><p>CÔNG NGHỆ GẦN HƠN.<br /><strong>TRẢI NGHIỆM THẬT HƠN.</strong></p><span><Code2 aria-hidden="true" /> Tư duy lập trình</span><span><CircuitBoard aria-hidden="true" /> Kỹ năng kỹ thuật</span><span><Lightbulb aria-hidden="true" /> Sáng tạo thực tế</span></div></div>
  </section>;
}
