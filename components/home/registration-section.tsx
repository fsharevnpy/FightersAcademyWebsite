import { ArrowUpRight, CalendarDays, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { contact } from "@/content/contact";

export function RegistrationSection() {
  return <section id="dang-ky" className="registration-section" aria-labelledby="registration-title">
    <div className="container registration-panel">
      <div className="registration-copy">
        <p className="eyebrow"><span aria-hidden="true" />HẸN GẶP TẠI STEM FIGHTERS</p>
        <h2 id="registration-title">Cùng tìm chương trình<br />phù hợp cho con.</h2>
        <p>Liên hệ để được tư vấn chương trình và thông tin học thử cho con.</p>
        <div className="registration-hotline">
          <span>Hotline tư vấn & đăng ký</span>
          <a href={contact.phoneHref}><Phone size={26} strokeWidth={1.6} aria-hidden="true" />{contact.phone}</a>
        </div>
        <ButtonLink href={contact.phoneHref}><Phone size={18} aria-hidden="true" />Gọi tư vấn</ButtonLink>
      </div>
      <div className="registration-info">
        <h3>Thông tin đăng ký học thử</h3>
        <div className="registration-address">
          <MapPin size={24} strokeWidth={1.6} aria-hidden="true" />
          <div>
            <p className="contact-label">Địa chỉ</p>
            <address>{contact.addressLines.map(line => <span key={line}>{line}</span>)}</address>
            <ButtonLink href={contact.mapsHref} target="_blank" rel="noopener noreferrer" variant="tertiary">Chỉ đường Google Maps<ArrowUpRight size={18} aria-hidden="true" /></ButtonLink>
          </div>
        </div>
        <div className="registration-schedule"><CalendarDays size={20} aria-hidden="true" /><p>Lịch và chi phí học thử đang được cập nhật. Vui lòng liên hệ để được tư vấn.</p></div>
      </div>
    </div>
  </section>;
}
