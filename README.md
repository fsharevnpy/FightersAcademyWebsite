# STEM Fighters — Homepage V1

Homepage Next.js App Router + TypeScript + Tailwind CSS, theo Design System đã duyệt. Bốn chương trình có mức nổi bật ngang nhau. Không có Supabase, API thu lead, analytics, tài khoản hoặc các trang khóa học riêng ở phase này.

## Chạy local

Yêu cầu Node.js 22 và npm.

```bash
npm ci
npm run dev
```

Mở http://localhost:3000. Trong workspace hiện tại, nếu Node chưa nằm trong PATH:

```bash
export PATH=/home/nguyen/.local/lib/stem-node/bin:$PATH
```

## Kiểm tra

```bash
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

Playwright chạy production server cổng 3100 và kiểm tra desktop/mobile: bốn chương trình, dialog và focus, menu mobile, FAQ, ảnh, overflow và CTA học thử.

## Cấu trúc

- `app/`: homepage, metadata và CSS tokens/Tailwind.
- `components/ui/`: Button, Brand, SectionHeading.
- `components/layout/`: header, footer, mobile CTA.
- `components/home/`: các section riêng của homepage, artwork SVG và dialog chương trình.
- `content/programs.ts`: dữ liệu bốn chương trình, nội dung giáo trình tóm tắt và FAQ.
- `public/images/`: ảnh tối ưu từ nguồn được cung cấp; bản gốc giữ nguyên trong `source/` và `LogoSTEM.png`.

Font Be Vietnam Pro self-hosted qua package `@fontsource`. Hình minh họa SVG chỉ mô tả khái niệm, không phải ảnh thiết bị thật. Ảnh hoạt động không được gán cho khóa học cụ thể chưa xác nhận.

## Tương tác trong phase này

- Navbar sử dụng anchor trong homepage, không dẫn tới trang chưa làm.
- Nút khám phá mở dialog tóm tắt riêng cho từng chương trình.
- CTA học thử đi đến khối thông tin đăng ký. Chưa thu dữ liệu, chưa có form gửi và không giả thông báo thành công.
- Lịch, học phí, hotline, cơ sở và độ tuổi chưa xác định được ghi `[CẦN BỔ SUNG]`.
- Lịch trình và sản phẩm trong giáo trình không được trình bày như lịch tuyển sinh hoặc thành tích học viên.

## `website:80` và domain

`compose.yaml` định nghĩa service `website`, ứng dụng nghe cổng 80 trong container. Metadata dùng domain chuẩn `https://fightersacademy.com.vn`.

```bash
docker compose up -d --build
```

Mặc định publish cổng host 80. Nếu host đã có reverse proxy ở cổng 80, đổi `WEBSITE_PORT` (ví dụ `WEBSITE_PORT=8080 docker compose up -d --build`) hoặc bỏ publish host và nối reverse proxy vào network của service. Proxy cùng network có thể trỏ tới `http://website:80`.

Chưa thay đổi DNS, cấu hình reverse proxy/TLS hoặc deploy production. Trước public cần xác nhận thông tin tuyển sinh/liên hệ, quyền công bố ảnh và hoàn thiện phần còn thiếu. Không đưa các file giáo án nguồn vào `public`.
