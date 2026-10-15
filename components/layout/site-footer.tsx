import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/ui/brand";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div><Brand inverse /><p className="footer-description">Không chỉ khám phá công nghệ.<br />Tự tay tạo nên điều mới.</p></div>
      <div><h2>Khám phá</h2><a href="#chuong-trinh">Chương trình học <ArrowUpRight size={14} aria-hidden="true" /></a><a href="#cach-hoc">Cách học tại STEM Fighters</a><a href="#hoat-dong">Hình ảnh hoạt động</a><a href="#cau-hoi">Câu hỏi thường gặp</a></div>
      <div><h2>Kết nối với STEM Fighters</h2><p>Hotline: [CẦN BỔ SUNG]</p><p>Email: [CẦN BỔ SUNG]</p><p>Địa chỉ cơ sở: [CẦN BỔ SUNG]</p></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} STEM Fighters</span><span>fightersacademy.com.vn</span></div>
  </footer>;
}
