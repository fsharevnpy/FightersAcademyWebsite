import { Plus } from "lucide-react";
import { faqs, type FAQ } from "@/content/programs";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrialCTA } from "@/components/ui/trial-cta";

type Props = { items?: FAQ[]; title?: string; description?: string };

export function FAQSection({ items = faqs, title = "Một vài điều\nbạn có thể muốn biết.", description = "Hiểu hơn về chương trình trước khi chọn điểm khởi đầu cho con." }: Props = {}) {
  return <section id="cau-hoi" className="section"><div className="container faq-grid"><SectionHeading eyebrow="DÀNH CHO PHỤ HUYNH" title={title} description={description} /><div className="faq-list">{items.map(faq => <details key={faq.question} name="program-faq"><summary>{faq.question}<Plus size={20} aria-hidden="true" /></summary><p>{faq.answer}</p>{faq.trial && <TrialCTA className="faq-trial" />}</details>)}</div></div></section>;
}
