# STEM Fighters — Homepage & Course Pages

Website Next.js App Router + TypeScript + Tailwind CSS, theo Design System đã duyệt. Homepage giúp so sánh bốn chương trình ngang hàng; mỗi chương trình có landing page riêng. Form học thử dùng chung, gửi qua API server tới Google Sheets. Có conversion events qua dataLayer, chưa cài GA4/GTM/Meta Pixel. Không có Supabase, Apps Script, Drive API hoặc tài khoản.

## Thiết lập nhận lead

Xem [hướng dẫn Google Sheets từng bước](docs/GOOGLE_SHEETS_LEAD_SETUP.md). Cần tạo Sheet thủ công, bật Sheets API, share riêng Sheet cho Service Account và cấu hình `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` trên server.

**Không commit JSON/private key, không đặt credentials ở frontend hoặc biến public, không public Sheet.** Nếu key bị lộ, revoke key cũ, tạo key mới và redeploy theo tài liệu. Live integration cần setup thủ công; tests không chứng minh Sheet thật đã kết nối.

## Conversion tracking

`lib/analytics.ts` cung cấp `trackConversion`; chỉ push vào `window.dataLayer` hiện có (hoặc tạo queue nếu chưa có), không tải analytics script và không khởi tạo lại GA4/Meta Pixel. Lỗi từ tag bên ngoài được cảnh báo ở console, không chặn CTA hoặc kết quả gửi form.

| Event | Thời điểm | `cta_location` |
| --- | --- | --- |
| `click_hoc_thu` | Click CTA “Đăng ký học thử” | `header`, `hero`, `mid_page`, `sticky_mobile` |
| `submit_lead` | API trả HTTP thành công và `success: true`, sau khi backend xác nhận lưu | `bottom_form` |
| `click_zalo` | Click liên kết Zalo hiện có | `bottom_form`, `sticky_mobile`, `footer` |
| `click_phone` | Click hotline `tel:0398288830` | `bottom_form`, `footer` |

Mỗi event chỉ có `event`, `course`, `page_path`, `cta_location`. Không đưa tên phụ huynh, điện thoại, tuổi trẻ, query string hoặc UTM vào dataLayer. `course`: `rio`, `starter_kit`, `logic_programming`, `basic_electronics`, hoặc `general`. CTA dùng khóa học của card/trang; `submit_lead` dùng chương trình thực sự được chọn trong payload, kể cả khi người dùng thay đổi lựa chọn. `page_path` của lead là trang gửi request, không đổi nếu điều hướng trong khi chờ phản hồi.

`ConversionTracking` bắt click hotline/Zalo dùng chung trên mọi trang, lấy vị trí từ `data-cta-location` của container. Khi thêm vị trí liên hệ mới, đặt attribute này theo `CTALocation`; không thêm listener hoặc gọi tracking lần thứ hai trên cùng link.

**Cấu hình thủ công để nhận dữ liệu:** hiện queue chưa gửi dữ liệu đến nền tảng nào. Chủ website cần cung cấp GTM Container ID (`GTM-...`) và GA4 Measurement ID (`G-...`) nếu dùng GTM/GA4, hoặc Meta Pixel ID nếu dùng Meta. Không cần gửi private key hay mật khẩu analytics. Trong GTM, tạo Custom Event triggers theo bốn tên trên, Data Layer Variables cho ba tham số, gắn tag GA4/Meta tương ứng và publish container. Chỉ đánh dấu `submit_lead` là lead thành công; không map click nút thành lead. Không cài thêm script GA4/Pixel nếu container hiện có đã tải chúng; xử lý consent theo cấu hình được chủ website duyệt.

Kiểm tra trong GTM Preview/GA4 DebugView sau khi cấu hình và deploy. Có thể kiểm tra queue cục bộ bằng `window.dataLayer`; mở trang khác qua client navigation không được nhân đôi listener. Không có cookie banner được triển khai trong repository hiện tại; nếu bổ sung sau này, cần kiểm tra lại vị trí sticky CTA.

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
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

Playwright chạy production server cổng 3100 với Google credentials trống. Ba project chính kiểm tra 390/768/1440px; viewport sweep bổ sung 375/1024px cho homepage, Rio và Điện tử cơ bản. `tests/conversion.spec.ts` kiểm tra thêm cả năm trang ở 360/390/768/1280/1440/1920px và các conversion events. Kiểm tra SEO/HTML không cần JavaScript, curriculum, keyboard/focus, menu, FAQ, ảnh, overflow, honeypot, mobile CTA và form/UTM. Test giao diện dùng API fixture; kiểm tra append dùng Google client với server fixture cục bộ, không ghi lead thử vào Sheet thật.

## Cấu trúc

- `app/`: homepage, metadata và CSS tokens/Tailwind; `app/khoa-hoc/[slug]/page.tsx`: bốn course pages dựng HTML tĩnh; `app/sitemap.ts`, `app/robots.ts`: sitemap và robots theo convention Next.js.
- `components/ui/`: Button, Brand, SectionHeading.
- `components/layout/`: header, footer, mobile CTA.
- `components/home/`: các section homepage và component curriculum, FAQ, form được reuse trên course pages.
- `content/programs.ts`: nguồn dữ liệu bốn chương trình, slug, summary ngắn cho homepage (giữ nguyên description đầy đủ), nội dung giáo trình, học phí từng khóa/chuyên đề, nguồn học phí, kỹ năng và FAQ chung/riêng.
- `content/contact.ts`: hotline, địa chỉ, Google Maps và nội dung CTA/lịch học thử dùng chung.
- `content/media.ts`: ảnh hoạt động, alt text, caption, điểm crop và đường dẫn ảnh gốc cho các ảnh mới.
- `lib/leads.ts`: validation và whitelist chương trình dùng chung; `lib/lead-attribution.ts`: UTM của phiên, không lưu dữ liệu lead.
- `app/api/leads/route.ts`, `lib/server/`: validate request, xác thực Service Account và append qua thư viện chính thức `@googleapis/sheets`.
- `public/images/`: ảnh tối ưu từ nguồn được cung cấp; bản gốc giữ nguyên trong `source/` và `LogoSTEM.png`.

Font Be Vietnam Pro self-hosted qua package `@fontsource`. Hình minh họa SVG chỉ mô tả khái niệm, không phải ảnh thiết bị thật. Ảnh hoạt động không được gán cho khóa học cụ thể chưa xác nhận.

Gallery “Hoạt động tại STEM Fighters” dùng 6 ảnh, 3 cột trên tablet/desktop và 2 cột trên mobile. Các ảnh là tư liệu hoạt động chung, không đại diện cho một sự kiện duy nhất; tên thư mục gốc `source/workshop/` không phải nhãn sự kiện trên website. Bảy ảnh được chọn từ thư mục này đã chuyển thành WebP (cạnh dài tối đa 1280px, quality 82, bỏ metadata), giữ nguyên bản gốc. `next/image` tiếp tục tối ưu kích thước theo màn hình và tải lazy dưới hero. Không thêm lightbox hoặc nút ảnh giả.

“Học để làm được” dùng ảnh lắp ráp chung; các ví dụ cụ thể từ giáo trình nằm ở course page tương ứng. “Cách học” giữ nguyên bốn bước và dùng lại hai ảnh lớp học/lập trình có sẵn. Giữ nguyên ảnh hero, không suy diễn ảnh thuộc khóa học nào. Card homepage được thu gọn; artwork SVG hiện có được dùng trên hero của từng course page.

## Tương tác trong phase này

- Navbar trên course page liên kết về các section homepage; breadcrumb “← Về trang chủ” và logo đều về `/`. Mỗi course page có ba card chương trình khác, dùng summary sẵn có và CTA “Xem chương trình”.
- Bốn card ngang hàng chỉ hiển thị tóm tắt, độ tuổi, ba keyword, số khóa, học phí và CTA. “Xem chi tiết” là HTML link tới course page; homepage không render curriculum, accordion hay modal chương trình.
- `content/programs.ts` là nguồn dữ liệu khóa học: số khóa, tổng số buổi và học phí tóm tắt được tính từ `modules`. Giữ nguyên toàn bộ modules, độ tuổi, tên và học phí. `id` nội bộ `lap-trinh` không đổi; `slug` SEO là `tu-duy-logic-lap-trinh`.
- CTA “Đăng ký học thử” dùng chung `TrialCTA`, cuộn/focus một form ở `#dang-ky` ngay trên trang hiện tại. Course page mặc định chọn chương trình tương ứng (vẫn có thể thay đổi); homepage CTA chung chọn “Chưa xác định / Cần tư vấn”. Provider giữ UTM qua điều hướng client; `sourcePage` ghi pathname của trang gửi form. Không thay schema/API Google Sheets.
- Sticky CTA dưới 768px có “Đăng ký học thử” và “Chat Zalo”, dùng URL liên hệ hiện có. IntersectionObserver chỉ hiện sau hero và ẩn khi khu vực đăng ký/footer xuất hiện; cũng ẩn khi menu mở hoặc form đang có focus. Có safe-area dưới cùng.
- “Website” là honeypot: vẫn tồn tại trong form, được clip 1px/absolute, `aria-hidden`, `tabIndex=-1`, `autoComplete=off`; không chiếm chỗ và không yêu cầu phụ huynh nhập. Client và server vẫn từ chối khi field có dữ liệu.
- Số điện thoại được ghi rõ “Gọi điện”; “Chat Zalo” và Facebook chính thức là lựa chọn liên hệ riêng, không thay đích form của CTA học thử.
- Bản đồ Google Maps nhỏ tại khối liên hệ dùng chung địa chỉ với link chỉ đường, tải lazy qua iframe. Click hoặc dùng bàn phím trên bản đồ mở Google Maps ở tab mới; bản đồ nằm cạnh địa chỉ trên desktop và bên dưới ở màn hình hẹp. Cần kết nối tới Google để tải bản đồ; link chỉ đường vẫn dùng được nếu embed bị chặn.
- `TrialRegistrationForm` là nội dung mặc định của `RegistrationSection`. Thành công chỉ sau append được xác nhận; lỗi giữ nguyên dữ liệu. Có honeypot, khóa submit, kiểm tra origin và giới hạn payload. Không ghi lead vào storage của browser.
- Học phí Rio và Starter Kit theo ảnh trong `source/khoahoc/`; Điện tử theo hai trang PDF cùng thư mục. Tư duy logic & Lập trình có 6 khóa, mỗi khóa 16 buổi và giá 3.500.000 đồng/khóa như trước. Điện tử tách “Khóa học từ 3.500.000đ” và “Chuyên đề từ 3.000.000đ”; toàn bộ 14 khóa/chuyên đề giữ nguyên trong 4 accordion, mặc định đóng trên mọi viewport.
- Điện tử cơ bản dành cho học viên 7–15 tuổi, theo xác nhận của chủ website. Lịch học thử dùng wording “Liên hệ STEM Fighters để được tư vấn lịch học thử phù hợp.” Dữ liệu học phí chưa đủ sẽ được ẩn; không hiện placeholder. Không tự suy đoán số buổi Điện tử, lịch học, chi phí học thử hoặc thiết bị/học liệu. Hotline và địa chỉ đã được cung cấp; email chưa có nên chưa hiển thị.
- Lịch trình và sản phẩm trong giáo trình không được trình bày như lịch tuyển sinh hoặc thành tích học viên.

## Course URLs & SEO

- Rio: `/khoa-hoc/rio`
- Starter Kit: `/khoa-hoc/starter-kit`
- Tư duy logic & Lập trình: `/khoa-hoc/tu-duy-logic-lap-trinh`
- Điện tử cơ bản: `/khoa-hoc/dien-tu-co-ban`

Mỗi URL được prerender bằng `generateStaticParams`, có title/description riêng, một H1, self-canonical, Open Graph/Twitter, FAQ riêng, breadcrumb và structured data `BreadcrumbList`. Không thêm rating/review hoặc Course schema thiếu dữ liệu. Slug không hợp lệ trả 404; không tạo route listing rỗng. `/sitemap.xml` gồm homepage và bốn khóa; `/robots.txt` cho phép crawl. Query UTM không xuất hiện trong canonical nhưng vẫn được giữ cho luồng lead hiện có.

Deploy vẫn dùng Next standalone trong Docker, không cần SPA fallback hay thay Cloudflare Tunnel. Sau rebuild/recreate container, kiểm tra trực tiếp và refresh bốn URL, sitemap và robots trên domain thật; kiểm tra cục bộ không thay thế kiểm tra cấu hình Cloudflare hoặc Google Sheets production.

## Deploy production: Docker + Cloudflare Tunnel

Domain: **https://stem.fightersacademy.com.vn**. Cấu hình triển khai hiện tại dùng Docker trên server này, không dùng Vercel.

Luồng truy cập: trình duyệt → Cloudflare (HTTPS) → service `tunnel` → `http://website:80` trong Docker network. Service `website` chạy Next.js standalone và chỉ publish ra `127.0.0.1:80` để kiểm tra tại server. Không cần mở cổng 80/443 ra Internet; server cần kết nối outbound cho Cloudflare Tunnel. HTTP trên domain được chuyển sang HTTPS. Domain cũ `fightersacademy.com.vn` được giữ để redirect 308 sang `https://stem.fightersacademy.com.vn`, bảo toàn đường dẫn và query/UTM.

Các file vận hành:

- `Dockerfile`: build ứng dụng với Node.js 22, chạy standalone bằng user `node`.
- `compose.yaml`: service `website`, healthcheck và service `tunnel`; tự khởi động lại theo `unless-stopped` khi Docker daemon hoạt động.
- `deploy/cloudflared.yml`: route domain tới `http://website:80`.
- Credential tunnel ở ngoài repository: `/home/nguyen/.cloudflared/d2dad707-48a8-4e89-98a6-9a27fe352478.json`, mount read-only vào container. Không commit hoặc đưa credential vào image.

Tunnel riêng của website là `stem-fighters-website` (`d2dad707-48a8-4e89-98a6-9a27fe352478`). DNS domain đã được cấu hình cho tunnel này. Scheduler dùng tunnel riêng và cổng 8080; không sửa cấu hình Scheduler để deploy website.

### Deploy trên server hiện tại

Yêu cầu Docker Engine đang chạy, Docker Compose v2 và credential nêu trên tồn tại, đọc được bởi UID/GID `1000:1000` của service tunnel. Chỉ deploy bằng Docker thì không cần cài Node.js trên host.

```bash
cd /home/nguyen/FightersAcademyWebsite
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

Đợi `website` báo `healthy` và `tunnel` báo `Up`. Lệnh build sẽ cài dependency bằng `npm ci` và tạo production build. Docker build không tự chạy lint hoặc Playwright; chạy các bước ở mục **Kiểm tra** trước khi phát hành code mới.

### Cập nhật code và deploy lại

Sau khi cập nhật source và chạy các kiểm tra, lưu image đang chạy để có thể rollback:

```bash
cd /home/nguyen/FightersAcademyWebsite
website_container=$(docker compose ps -q website)
website_image=$(docker inspect --format '{{.Image}}' "$website_container")
docker image tag "$website_image" fightersacademywebsite-website:rollback
```

Build và thay container website:

```bash
docker compose up -d --build website
docker compose ps
```

Không cần `docker compose down`. Tunnel tiếp tục chạy; thao tác thay một container website có thể gây gián đoạn ngắn. Chỉ khi sửa cấu hình tunnel hoặc volume mount mới cần tạo lại service đó:

```bash
docker compose up -d --force-recreate tunnel
```

### Kiểm tra và xem log

```bash
docker compose ps
docker compose logs --tail=100 website tunnel
curl -I http://127.0.0.1:80
curl -I http://stem.fightersacademy.com.vn
curl -I https://stem.fightersacademy.com.vn
```

Kết quả mong đợi: localhost `200`, HTTP domain `308` tới HTTPS, HTTPS domain `200`. Mở website trên điện thoại và kiểm tra menu, ảnh, bốn course URLs, curriculum, form và sticky CTA sau mỗi lần deploy.

Theo dõi log trực tiếp (Ctrl+C chỉ thoát xem log):

```bash
docker compose logs -f --tail=100 website tunnel
```

Nếu localhost hoạt động nhưng domain lỗi, kiểm tra log `tunnel`, credential, kết nối Internet và DNS Cloudflare. Nếu `website` unhealthy, kiểm tra log `website` trước. Nếu port host 80 bị chiếm, đặt `WEBSITE_PORT=8081` trong file `.env` ở root rồi chạy lại Compose; route tunnel vẫn là `website:80`, nhưng lệnh kiểm tra localhost phải đổi sang 8081. Không dùng 8080 đang dành cho Scheduler.

### Rollback image

Nếu đã lưu tag `rollback` trước khi deploy, khôi phục image đó:

```bash
docker image tag fightersacademywebsite-website:rollback fightersacademywebsite-website:latest
docker compose up -d --no-build --force-recreate website
docker compose ps
curl -I https://stem.fightersacademy.com.vn
```

Tên image trên áp dụng cho project Compose mặc định trong thư mục `FightersAcademyWebsite`; nếu dùng `-p` hoặc `COMPOSE_PROJECT_NAME`, điều chỉnh tên image tương ứng. Rollback image không hoàn tác source hoặc cấu hình trên host. Khôi phục source tương ứng trước lần build tiếp theo; không xóa image `rollback` khi còn cần dự phòng.

### Chuyển sang server mới

1. Cài Docker Engine + Compose v2, bật Docker khởi động cùng server và chép repository sang server mới.
2. Chuyển credential tunnel qua kênh bảo mật, đặt ngoài repository. Sửa đường dẫn mount trong `compose.yaml` nếu khác server cũ và bảo đảm user `1000:1000` đọc được file.
3. Giữ tunnel ID trong `deploy/cloudflared.yml` nếu tiếp tục dùng tunnel hiện tại. Không cần tạo lại DNS khi tái sử dụng tunnel.
4. Chạy các lệnh deploy và kiểm tra như trên. Khi chuyển server, tránh để hai connector cùng tunnel phục vụ hai phiên bản website khác nhau; dừng service tunnel ở server cũ sau khi xác nhận server mới hoạt động đúng.

Nếu tạo **tunnel hoàn toàn mới**, dùng Cloudflare CLI trên máy quản trị:

```bash
cloudflared tunnel login
cloudflared tunnel create stem-fighters-website-new
cloudflared tunnel route dns <NEW_TUNNEL_ID> stem.fightersacademy.com.vn
```

Thay `<NEW_TUNNEL_ID>` bằng ID thực, cập nhật ID trong `deploy/cloudflared.yml` và credential mount trong `compose.yaml`. Nếu DNS domain đã tồn tại, lệnh route có thể từ chối; chuyển record hiện có sang tunnel mới trong Cloudflare khi sẵn sàng chuyển traffic. `cert.pem` dùng để quản trị Cloudflare, không cần mount vào container chạy tunnel.

Không đưa giáo án nguồn hoặc credential vào `public/`. Website phase này chưa có Supabase hoặc backend thu lead nên không cần cấu hình các biến môi trường cho Supabase khi deploy.
