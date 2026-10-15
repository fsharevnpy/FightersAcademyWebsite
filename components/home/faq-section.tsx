import { Plus } from "lucide-react";
import { faqs } from "@/content/programs";
import { SectionHeading } from "@/components/ui/section-heading";

export function FAQSection() {
  return <section id="cau-hoi" className="section"><div className="container faq-grid"><SectionHeading eyebrow="DÀNH CHO PHỤ HUYNH" title="Một vài điều\nbạn có thể muốn biết." description="Hiểu hơn về chương trình trước khi chọn điểm khởi đầu cho con." /><div className="faq-list">{faqs.map(faq => <details key={faq.question} name="homepage-faq"><summary>{faq.question}<Plus size={20} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div></div></section>;
}
