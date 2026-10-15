import { ArrowUpRight, Facebook, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/ui/brand";
import { contact } from "@/content/contact";

export function SiteFooter() {
  return <footer className="site-footer" data-cta-location="footer">
    <div className="container footer-grid">
      <div><Brand inverse /><p className="footer-description">Không chỉ khám phá công nghệ.<br />Tự tay tạo nên điều mới.</p></div>
      <div><h2>Khám phá</h2><Link href="/#chuong-trinh">Chương trình học <ArrowUpRight size={14} aria-hidden="true" /></Link><Link href="/#cach-hoc">Cách học tại STEM Fighters</Link><Link href="/#hoat-dong">Hình ảnh hoạt động</Link><a href="#cau-hoi">Câu hỏi thường gặp</a></div>
      <div className="footer-contact">
        <h2>Kết nối với STEM Fighters</h2>
        <a href={contact.phoneHref} className="footer-phone"><Phone size={18} aria-hidden="true" /><span>Gọi điện: {contact.phone}</span></a>
        <a href={contact.zaloHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /><span>Chat Zalo</span><ArrowUpRight size={16} aria-hidden="true" /></a>
        <a href={contact.facebookHref} target="_blank" rel="noopener noreferrer"><Facebook size={18} aria-hidden="true" /><span>Facebook STEM Fighters</span><ArrowUpRight size={16} aria-hidden="true" /></a>
        <a href={contact.mapsHref} target="_blank" rel="noopener noreferrer" className="footer-address"><MapPin size={19} aria-hidden="true" /><span>{contact.addressLines.map(line => <span key={line}>{line}</span>)}</span><ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} STEM Fighters</span><span>stem.fightersacademy.com.vn</span></div>
  </footer>;
}
