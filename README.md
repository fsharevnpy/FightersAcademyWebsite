# STEM Fighters — Homepage V1

Homepage Next.js App Router + TypeScript + Tailwind CSS, theo Design System đã duyệt. Bốn chương trình có mức nổi bật ngang nhau. Form học thử gửi qua API server tới Google Sheets. Không có Supabase, Apps Script, Drive API, analytics, tài khoản hoặc các trang khóa học riêng ở phase này.

## Thiết lập nhận lead

Xem [hướng dẫn Google Sheets từng bước](docs/GOOGLE_SHEETS_LEAD_SETUP.md). Cần tạo Sheet thủ công, bật Sheets API, share riêng Sheet cho Service Account và cấu hình `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` trên server.

**Không commit JSON/private key, không đặt credentials ở frontend hoặc biến public, không public Sheet.** Nếu key bị lộ, revoke key cũ, tạo key mới và redeploy theo tài liệu. Live integration cần setup thủ công; tests không chứng minh Sheet thật đã kết nối.

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

Playwright chạy production server cổng 3100 và kiểm tra mobile 390px, tablet 768px, desktop 1440px: bốn chương trình, dialog và focus, menu mobile, FAQ, ảnh, overflow và CTA học thử.

## Cấu trúc

- `app/`: homepage, metadata và CSS tokens/Tailwind.
- `components/ui/`: Button, Brand, SectionHeading.
- `components/layout/`: header, footer, mobile CTA.
- `components/home/`: các section riêng của homepage, artwork SVG và dialog chương trình.
- `content/programs.ts`: dữ liệu bốn chương trình, nội dung giáo trình, học phí từng khóa/chuyên đề, nguồn học phí và FAQ.
- `content/contact.ts`: hotline, địa chỉ, Google Maps và nội dung CTA/lịch học thử dùng chung.
- `lib/leads.ts`: validation và whitelist chương trình dùng chung; `lib/lead-attribution.ts`: UTM của phiên, không lưu dữ liệu lead.
- `app/api/leads/route.ts`, `lib/server/`: validate request, xác thực Service Account và append qua thư viện chính thức `@googleapis/sheets`.
- `public/images/`: ảnh tối ưu từ nguồn được cung cấp; bản gốc giữ nguyên trong `source/` và `LogoSTEM.png`.

Font Be Vietnam Pro self-hosted qua package `@fontsource`. Hình minh họa SVG chỉ mô tả khái niệm, không phải ảnh thiết bị thật. Ảnh hoạt động không được gán cho khóa học cụ thể chưa xác nhận.

## Tương tác trong phase này

- Navbar sử dụng anchor trong homepage, không dẫn tới trang chưa làm.
- Bốn card ngang hàng hiển thị độ tuổi, mô tả, hướng khám phá, kỹ năng, số khóa và học phí. Nút “Xem chi tiết” mở dialog curriculum hiện có; không tạo trang mới.
- `content/programs.ts` là nguồn dữ liệu khóa học: số khóa, tổng số buổi và học phí tóm tắt được tính từ `modules`. Giữ đầy đủ curriculum và `id` làm slug cho `/khoa-hoc/[slug]` ở phase sau.
- CTA “Đăng ký học thử” dùng chung `TrialCTA`, cuộn đến một form ở `#dang-ky`. CTA theo chương trình chọn sẵn chương trình; CTA chung chọn “Chưa xác định / Cần tư vấn”. ID `lap-trinh` được giữ ổn định, tên hiển thị là “Tư duy logic & Lập trình”.
- Số điện thoại được ghi rõ “Gọi điện”; “Chat Zalo” và Facebook chính thức là lựa chọn liên hệ riêng, không thay đích form của CTA học thử.
- Bản đồ Google Maps nhỏ tại khối liên hệ dùng chung địa chỉ với link chỉ đường, tải lazy qua iframe. Click hoặc dùng bàn phím trên bản đồ mở Google Maps ở tab mới; bản đồ nằm cạnh địa chỉ trên desktop và bên dưới ở màn hình hẹp. Cần kết nối tới Google để tải bản đồ; link chỉ đường vẫn dùng được nếu embed bị chặn.
- `TrialRegistrationForm` là nội dung mặc định của `RegistrationSection`. Thành công chỉ sau append được xác nhận; lỗi giữ nguyên dữ liệu. Có honeypot, khóa submit, kiểm tra origin và giới hạn payload. Không ghi lead vào storage của browser.
- Học phí Rio và Starter Kit theo ảnh trong `source/khoahoc/`; Điện tử theo hai trang PDF cùng thư mục. Tư duy logic & Lập trình có 6 khóa, mỗi khóa 16 buổi và giá 3.500.000 đồng/khóa như trước. Điện tử tách “Khóa học từ 3.500.000đ” và “Chuyên đề từ 3.000.000đ”; toàn bộ 14 khóa/chuyên đề giữ nguyên trong 4 accordion, mặc định đóng trên mọi viewport.
- Điện tử cơ bản dành cho học viên 7–15 tuổi, theo xác nhận của chủ website. Lịch học thử dùng wording “Liên hệ STEM Fighters để được tư vấn lịch học thử phù hợp.” Dữ liệu học phí chưa đủ sẽ được ẩn; không hiện placeholder. Không tự suy đoán số buổi Điện tử, lịch học, chi phí học thử hoặc thiết bị/học liệu. Hotline và địa chỉ đã được cung cấp; email chưa có nên chưa hiển thị.
- Lịch trình và sản phẩm trong giáo trình không được trình bày như lịch tuyển sinh hoặc thành tích học viên.

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

Kết quả mong đợi: localhost `200`, HTTP domain `308` tới HTTPS, HTTPS domain `200`. Mở website trên điện thoại và kiểm tra menu, ảnh, dialog chương trình và CTA liên hệ sau mỗi lần deploy.

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
