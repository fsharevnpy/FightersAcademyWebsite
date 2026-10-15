import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export function ActivityGallery() {
  return <section id="hoat-dong" className="section"><div className="container">
    <div className="section-title-row"><SectionHeading eyebrow="NHỮNG KHOẢNH KHẮC THỰC HÀNH" title="Tập trung làm.\nHào hứng khám phá." /><div className="gallery-aside"><p>Một góc lớp học.<br />Nhiều điều đang được khám phá.</p><ArrowDownRight size={32} strokeWidth={1.3} aria-hidden="true" /></div></div>
    <div className="activity-grid">
      <figure className="activity-large">
        <div className="activity-photo"><Image src="/images/group-robotics.webp" alt="Người hướng dẫn cùng ba học viên lắp ráp linh kiện, với mô hình robot trên bàn" fill sizes="(min-width: 1280px) 710px, (min-width: 768px) 56vw, calc(100vw - 40px)" /></div>
        <figcaption>Cùng khám phá, cùng tạo nên sản phẩm</figcaption>
      </figure>
      <figure className="activity-small">
        <div className="activity-photo"><Image src="/images/guided-programming.webp" alt="Người hướng dẫn chỉ vào chương trình trên màn hình trong lúc học viên quan sát" fill sizes="(min-width: 1280px) 475px, (min-width: 768px) 38vw, calc(100vw - 40px)" /></div>
        <figcaption>Gợi mở từng bước lập trình</figcaption>
      </figure>
      <figure className="activity-small">
        <div className="activity-photo"><Image src="/images/classroom.jpg" alt="Người hướng dẫn giới thiệu nội dung về vi xử lý ESP32 trong lớp học" fill sizes="(min-width: 1280px) 475px, (min-width: 768px) 38vw, calc(100vw - 40px)" /></div>
        <figcaption>Kết nối kiến thức với vật thật</figcaption>
      </figure>
    </div>
  </div></section>;
}
