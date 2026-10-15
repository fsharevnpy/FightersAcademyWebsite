import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUpRight, Check, Users } from "lucide-react";
import { siteUrl, trialContact } from "@/content/contact";
import { getProgramBySlug, getProgramFAQs, getProgramPath, getProgramStructure, getTuitionSummary, programs } from "@/content/programs";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileCTA } from "@/components/layout/mobile-cta";
import { ProgramArt } from "@/components/home/program-art";
import { ProgramCurriculum } from "@/components/home/program-curriculum";
import { FAQSection } from "@/components/home/faq-section";
import { RegistrationSection } from "@/components/home/registration-section";
import { TrialCTA } from "@/components/ui/trial-cta";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return programs.map(program => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const program = getProgramBySlug((await params).slug);
  if (!program) notFound();
  const title = `Khóa học ${program.name} cho trẻ ${program.audience.split(" · ")[0]} | STEM Fighters`;
  const description = `${program.description} Xem lộ trình, học phí từng khóa và đăng ký học thử tại STEM Fighters.`;
  const url = getProgramPath(program);
  const images = [{ url: "/images/mentor-student.jpg", width: 1600, height: 1067, alt: "Hoạt động tại STEM Fighters" }];
  return {
    title, description, alternates: { canonical: url }, robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website", locale: "vi_VN", siteName: "STEM Fighters", images },
    twitter: { card: "summary_large_image", title, description, images: images.map(image => image.url) },
  };
}

export default async function CoursePage({ params }: Props) {
  const program = getProgramBySlug((await params).slug);
  if (!program) notFound();
  const tuition = getTuitionSummary(program);
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: program.name, item: new URL(getProgramPath(program), siteUrl).href },
    ],
  };
  return <div id="top">
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <section className="course-hero section-tinted">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb"><ol><li><Link href="/">Trang chủ</Link></li><li aria-current="page">{program.name}</li></ol></nav>
          <div className="course-hero-grid">
            <div>
              <p className="eyebrow"><span aria-hidden="true" />{program.category}</p>
              <h1>{program.name}</h1>
              <p className="program-age"><Users size={18} aria-hidden="true" />{program.audience}</p>
              <p className="course-description">{program.description}</p>
              <div className="tags" aria-label="Kỹ năng và công nghệ">{program.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <p className="course-structure">{getProgramStructure(program)}</p>
              {tuition && <p className="course-tuition"><span>Học phí</span><strong>{tuition}</strong></p>}
              <div id="hero-actions" className="hero-actions"><TrialCTA program={program.id} /><ButtonLink href="#lo-trinh" variant="secondary">Xem lộ trình<ArrowDown size={18} aria-hidden="true" /></ButtonLink></div>
            </div>
            <div className="course-art"><ProgramArt kind={program.id} /></div>
          </div>
        </div>
      </section>
      <section className="section"><div className="container course-intro-grid">
        <div><SectionHeading eyebrow="ĐIỂM BẮT ĐẦU" title="Chương trình phù hợp với ai?" description={program.fit} /><p className="course-age-note">Độ tuổi: {program.audience}. Trung tâm tư vấn cấp độ theo năng lực hiện tại của con.</p></div>
        <div><h2>Trẻ sẽ học và thực hành gì?</h2><ul className="course-skills">{program.skills.map(skill => <li key={skill}><Check size={20} aria-hidden="true" /><span>{skill}</span></li>)}</ul>
          <article className="course-example"><p className="eyebrow">VÍ DỤ TỪ GIÁO TRÌNH</p><h3>{program.example.title}</h3><p>{program.example.description}</p><p className="course-note">Đây là ví dụ thực hành, không phải hồ sơ dự án học viên đã hoàn thành.</p></article>
        </div>
      </div></section>
      <section id="lo-trinh" className="section section-tinted"><div className="container course-curriculum">
        <SectionHeading eyebrow="LỘ TRÌNH HỌC" title="Các khóa học & học phí" description={getProgramStructure(program) ?? undefined} />
        <ProgramCurriculum program={program} />
        <p className="course-note">Học phí tính cho từng khóa hoặc chuyên đề, không phải toàn bộ lộ trình. {trialContact.schedule}</p>
        <TrialCTA program={program.id} />
      </div></section>
      <FAQSection items={getProgramFAQs(program)} title={`Tìm hiểu thêm về ${program.name}`} description="Những câu hỏi liên quan đến nội dung và điểm bắt đầu của chương trình." />
      <RegistrationSection />
      <section className="section"><div className="container">
        <SectionHeading eyebrow="CÁC HƯỚNG KHÁM PHÁ KHÁC" title="Khám phá chương trình khác" />
        <div className="related-programs">{programs.filter(other => other.id !== program.id).map(other => <article key={other.id}>
          <h3><Link href={getProgramPath(other)}>{other.name}</Link></h3><p className="program-age">{other.audience}</p><p>{other.description}</p>
          <Link href={getProgramPath(other)} className="text-link" aria-label={`Xem chi tiết chương trình ${other.name}`}>Xem chi tiết<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </article>)}</div>
      </div></section>
    </main>
    <SiteFooter /><MobileCTA />
  </div>;
}
