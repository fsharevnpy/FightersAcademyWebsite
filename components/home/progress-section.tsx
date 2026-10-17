import Image from "next/image";
import { BrainCircuit, Code2, Wrench, ScanSearch, MessagesSquare, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { programs } from "@/content/programs";

const items = [
  { icon: BrainCircuit, title: "Hiểu vấn đề", text: "Con có thể giải thích sản phẩm đang làm gì và vì sao?" },
  { icon: Code2, title: "Tư duy lập trình", text: "Con có thể sắp xếp lệnh và dự đoán kết quả?" },
  { icon: Wrench, title: "Lắp ráp & thử nghiệm", text: "Con có thể tự lắp, thử và điều chỉnh một chi tiết?" },
  { icon: ScanSearch, title: "Tìm & sửa lỗi", text: "Con có thể tìm nguyên nhân và thử một cách sửa?" },
  { icon: MessagesSquare, title: "Chia sẻ & hợp tác", text: "Con có thể kể lại cách làm và cùng bạn hoàn thành nhiệm vụ?" },
];

export function ProgressSection() {
  const program = programs.find(program => program.id === "starter-kit");
  if (!program) throw new Error("Missing fabrication program.");
  return <section className="section progress-section"><div className="container progress-grid"><div><SectionHeading eyebrow="NHÌN THẤY SỰ TIẾN BỘ" title="Điều quan trọng là\ncon tự làm được gì." description={`Theo giáo trình ${program.name}: quan sát cách trẻ thực hành, giải thích và cải tiến — không chỉ sản phẩm cuối cùng.`} />
    <figure className="progress-photo">
      <div className="progress-photo-frame"><Image src="/images/hands-on-building.webp" alt="Học viên tự tay ghép mô hình màu xanh bên khay linh kiện tại bàn thực hành" fill sizes="(min-width: 768px) 360px, (min-width: 520px) 480px, calc(100vw - 40px)" /></div>
      <figcaption>Tập trung vào từng chi tiết, tự tay thử từng cách làm.</figcaption>
    </figure>
    <a href="#cau-hoi" className="text-link">Phụ huynh thường hỏi <ArrowUpRight size={18} aria-hidden="true" /></a></div><div className="progress-list">{items.map(item => <article key={item.title}><span className="progress-icon"><item.icon size={23} strokeWidth={1.6} aria-hidden="true" /></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div></section>;
}
