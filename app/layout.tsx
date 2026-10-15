import type { Metadata, Viewport } from "next";
import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/vietnamese-500.css";
import "@fontsource/be-vietnam-pro/vietnamese-600.css";
import "@fontsource/be-vietnam-pro/vietnamese-700.css";
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/be-vietnam-pro/latin-500.css";
import "@fontsource/be-vietnam-pro/latin-600.css";
import "@fontsource/be-vietnam-pro/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stem.fightersacademy.com.vn"),
  title: "STEM Fighters — Khám phá công nghệ. Tự tay tạo nên sản phẩm.",
  description: "Khám phá bốn chương trình Rio, Starter Kit, Lập trình và Điện tử cơ bản tại STEM Fighters. Học qua thực hành, thử nghiệm và sáng tạo.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "vi_VN", url: "/", siteName: "STEM Fighters", title: "STEM Fighters — Từ tò mò đến sáng tạo", description: "Khám phá robot, lập trình và chế tạo qua những trải nghiệm STEM thực tế.", images: [{ url: "/images/mentor-student.jpg", width: 1600, height: 1067, alt: "Thực hành tại STEM Fighters" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
};
export const viewport: Viewport = { themeColor: "#0B1F4B" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><a href="#main-content" className="skip-link">Chuyển đến nội dung chính</a>{children}</body></html>;
}
