import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileCTA } from "@/components/layout/mobile-cta";
import { Hero } from "@/components/home/hero";
import { ProgramsSection } from "@/components/home/programs-section";
import { LearningExamples } from "@/components/home/learning-examples";
import { LearningProcess } from "@/components/home/learning-process";
import { ActivityGallery } from "@/components/home/activity-gallery";
import { ProgressSection } from "@/components/home/progress-section";
import { FAQSection } from "@/components/home/faq-section";
import { RegistrationSection } from "@/components/home/registration-section";

export default function Home() {
  return <div id="top"><SiteHeader /><main id="main-content" tabIndex={-1}><Hero /><ProgramsSection /><ActivityGallery /><LearningExamples /><LearningProcess /><ProgressSection /><FAQSection /><RegistrationSection /></main><SiteFooter /><MobileCTA /></div>;
}
