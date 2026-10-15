import type { ReactNode } from "react";
import { ArrowUpRight, CalendarDays, MapPin, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { TrialCTA } from "@/components/ui/trial-cta";
import { contact, trialContact } from "@/content/contact";

export function RegistrationSection({ children = <TrialCTA /> }: { children?: ReactNode }) {
  return <section id="dang-ky" className="registration-section" aria-labelledby="registration-title">
    <div className="container registration-panel">
      <div className="registration-copy">
        <p className="eyebrow"><span aria-hidden="true" />HẸN GẶP TẠI STEM FIGHTERS</p>
        <h2 id="registration-title">Cùng tìm chương trình<br />phù hợp cho con.</h2>
        <p>Gọi điện hoặc nhắn Zalo để được tư vấn chương trình và đăng ký học thử cho con.</p>
        <div className="registration-hotline">
          <span>Gọi điện tư vấn & đăng ký</span>
          <a href={contact.phoneHref} aria-label={`Gọi điện: ${contact.phone}`}><Phone size={26} strokeWidth={1.6} aria-hidden="true" />{contact.phone}</a>
        </div>
        <div className="registration-contact-options">
          <div className="registration-action">{children}</div>
          <ButtonLink href={contact.zaloHref} target="_blank" rel="noopener noreferrer" variant="secondary">Chat Zalo<MessageCircle size={18} aria-hidden="true" /></ButtonLink>
        </div>
      </div>
      <div className="registration-info">
        <h3>Thông tin đăng ký học thử</h3>
        <div className="registration-location">
          <div className="registration-address">
            <MapPin size={24} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <p className="contact-label">Địa chỉ</p>
              <address>{contact.addressLines.map(line => <span key={line}>{line}</span>)}</address>
              <ButtonLink href={contact.mapsHref} target="_blank" rel="noopener noreferrer" variant="tertiary">Chỉ đường Google Maps<ArrowUpRight size={18} aria-hidden="true" /></ButtonLink>
            </div>
          </div>
          <div className="contact-map">
            <iframe
              src={contact.mapsEmbedHref}
              title="Bản đồ địa chỉ STEM Fighters"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
              aria-hidden="true"
              inert
            />
            <a href={contact.mapsHref} target="_blank" rel="noopener noreferrer" aria-label="Mở Google Maps: địa chỉ STEM Fighters (tab mới)">
              <span>Mở Google Maps<ArrowUpRight size={16} aria-hidden="true" /></span>
            </a>
          </div>
        </div>
        <div className="registration-schedule"><CalendarDays size={20} aria-hidden="true" /><p>{trialContact.schedule}</p></div>
      </div>
    </div>
  </section>;
}
