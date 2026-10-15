import { Search, Wrench, RefreshCw, MessagesSquare } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { icon: Search, title: "Bắt đầu từ tò mò", description: "Quan sát một tình huống gần gũi. Đặt câu hỏi và thử dự đoán điều sẽ xảy ra.", label: "KHÁM PHÁ" },
  { icon: Wrench, title: "Tự tay làm thử", description: "Lắp ráp, sắp xếp lệnh và tạo phiên bản đầu tiên từ ý tưởng của mình.", label: "THỰC HÀNH" },
  { icon: RefreshCw, title: "Thử, sai và làm lại", description: "Chạy thử, tìm nguyên nhân và thay đổi từng chi tiết để sản phẩm tốt hơn.", label: "CẢI TIẾN" },
  { icon: MessagesSquare, title: "Kể câu chuyện của con", description: "Trình bày cách sản phẩm hoạt động, điều đã học và điều muốn thử tiếp.", label: "CHIA SẺ" },
];

export function LearningProcess() {
  return <section id="cach-hoc" className="section process-section"><div className="container"><SectionHeading eyebrow="CÁCH HỌC TẠI STEM FIGHTERS" title="Làm trước. Hiểu sâu hơn sau mỗi lần thử." description="Kiến thức trở nên gần gũi khi con được chạm vào, thử nghiệm và tự tìm lời giải." centered /><div className="process-grid">{steps.map((step, index) => <article key={step.title} className="process-step"><div className="process-icon"><step.icon size={25} strokeWidth={1.6} aria-hidden="true" /><span>0{index + 1}</span></div><p className="process-label">{step.label}</p><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></div></section>;
}
