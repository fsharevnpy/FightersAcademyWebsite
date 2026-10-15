# Thiết lập Google Sheets nhận đăng ký học thử

Luồng: Website → `POST /api/leads` → Google Sheets API → **STEM Fighters - Leads**, tab **Leads**.

Website không dùng Apps Script, Supabase, Firebase, Drive API hoặc database khác. Không cần tài khoản Google của phụ huynh. Chưa có credentials thì form sẽ báo lỗi thật, không giả thành công.

## 1. Mở folder quản lý leads

Đăng nhập tài khoản Google của người quản lý và mở [folder STEM Fighters](https://drive.google.com/drive/folders/1Mz7YYl_qC1MkVPQrbMEehlwjMfQ-r7eZ?usp=sharing).

Folder ID `1Mz7YYl_qC1MkVPQrbMEehlwjMfQ-r7eZ` chỉ dùng để tổ chức tài liệu. **Không** dùng Folder ID làm Spreadsheet ID.

## 2. Tạo Google Sheet

Trong folder, chọn **Mới / New → Google Trang tính / Google Sheets**. Đặt tên **STEM Fighters - Leads**. Nếu đã có file này, mở file hiện có.

## 3. Đặt tên tab

Đổi tên tab ở dưới cùng thành **Leads** (đúng chữ hoa/thường, không có khoảng trắng thừa).

## 4. Tạo hàng tiêu đề

Dán dòng sau vào ô **A1**. Các cột A:K phải theo đúng thứ tự:

```text
Created At	Parent Name	Phone	Child Age	Program	Source Page	UTM Source	UTM Medium	UTM Campaign	Status	Note
```

Không chèn cột khác vào giữa A:K. Website chỉ append dòng mới, không ghi đè leads cũ.

## 5. Lấy Spreadsheet ID

URL có dạng `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0`.

Sao chép phần giữa `/d/` và `/edit`, không lấy toàn bộ URL hoặc `gid`. Đây là giá trị `GOOGLE_SHEET_ID`.

## 6. Mở Google Cloud Console

Mở [Google Cloud Console](https://console.cloud.google.com/) bằng tài khoản có quyền quản lý project.

## 7. Tạo hoặc chọn project

Bấm bộ chọn project trên thanh trên cùng. Chọn project phù hợp hoặc **New Project**, ví dụ **STEM Fighters Website**. Đợi tạo xong rồi chọn project đó.

## 8. Bật Google Sheets API

Vào **APIs & Services → Library**, tìm **Google Sheets API**, bấm **Enable**.

**Không cần bật Google Drive API.** Scope sử dụng: `https://www.googleapis.com/auth/spreadsheets`.

## 9. Tạo Service Account

Vào **IAM & Admin → Service Accounts → Create Service Account**.

Tên gợi ý: `stem-fighters-leads`. Không cần cấp role Owner/Editor của cả Google Cloud project. Quyền ghi dữ liệu sẽ được cấp bằng cách share riêng Sheet ở bước 11.

## 10. Sao chép Service Account email

Email có dạng `stem-fighters-leads@PROJECT_ID.iam.gserviceaccount.com`. Đây không phải email Google cá nhân.

## 11. Share riêng Sheet

Quay lại **STEM Fighters - Leads**, chọn **Share**, thêm Service Account email, chọn quyền **Editor**.

Giữ **General access: Restricted**. Không share toàn bộ Google Drive, không bật “Anyone with the link can edit”, không public Sheet.

## 12. Tạo key cho hosting Docker hiện tại

Trong Service Account, vào **Keys → Add key → Create new key → JSON**. File JSON được tải xuống một lần.

Lưu file ngoài repository, thư mục public và thư mục build; chỉ người quản trị được đọc. Nếu tổ chức cấm tạo key, liên hệ quản trị viên Cloud để cấp cách triển khai được phê duyệt; không nới lỏng chính sách tổ chức.

Không gửi JSON/key vào chat, ticket, ảnh chụp hoặc email không bảo mật.

## 13. Lấy thông tin từ JSON

Mở JSON bằng editor local đáng tin cậy:

- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY`

Giữ nguyên toàn bộ private key, gồm phần BEGIN/END và các ký tự `\n`. Không lấy `private_key_id` thay cho private key.

## 14. Cấu hình môi trường server

Chỉ dùng **một phương án**: ba biến server-side bên dưới. Không dùng Base64 hoặc biến public song song.

### Ubuntu + Docker Compose hiện tại

Người quản trị tạo hoặc sửa `.env` trên server tại thư mục project, cùng cấp `compose.yaml`. Giữ nguyên cấu hình khác nếu file đã tồn tại.

```dotenv
GOOGLE_SHEET_ID="SPREADSHEET_ID_CUA_BAN"
GOOGLE_SERVICE_ACCOUNT_EMAIL="stem-fighters-leads@PROJECT_ID.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="PRIVATE_KEY_TU_JSON"
```

Thay các giá trị minh họa bằng dữ liệu thật **chỉ trên server**. Với key, thay `PRIVATE_KEY_TU_JSON` bằng chuỗi nguyên vẹn lấy từ JSON, trên một dòng có `\n`, nằm trong dấu nháy kép. Docker Compose hỗ trợ escape newline trong giá trị nháy kép; backend cũng chuyển chuỗi `\n` dạng escaped thành newline thật.

```bash
chmod 600 .env
```

`compose.yaml` truyền ba biến vào container lúc chạy, không lúc build. Các file `.env*` bị loại khỏi Docker build context. Không in `docker compose config` ra log công khai vì lệnh có thể hiển thị secret; dùng `docker compose config --quiet`.

Chạy local không dùng Docker: quản trị viên cấu hình cùng ba biến trong môi trường chạy Next.js rồi khởi động lại ứng dụng. Không đặt credentials trong frontend hoặc file public.

## 15. Redeploy

Tại thư mục project:

```bash
npm ci
npm run lint
npm run build
npm run typecheck
docker compose config --quiet
docker compose up -d --build website
docker compose ps
```

Nếu server chỉ có Docker, các bước npm có thể chạy trên máy phát triển; Docker tự cài dependencies và build. Không cần dừng tunnel hay thay cấu hình Cloudflare. Build không cần Google credentials; gửi lead mới cần credentials hợp lệ.

## 16. Gửi một lead test

Mở website bằng URL có UTM thử nghiệm:

```text
https://stem.fightersacademy.com.vn/?utm_source=facebook&utm_medium=paid_social&utm_campaign=lead_test
```

Bấm CTA của một chương trình và kiểm tra form chọn đúng chương trình đó. Điền tên test, số điện thoại của bạn, tuổi và gửi. Không dùng thông tin của người chưa đồng ý cung cấp.

Nút chuyển sang **Đang gửi...**, không gửi lặp khi bấm nhiều lần. Chỉ được hiện thông báo thành công sau khi API xác nhận append đúng một dòng.

## 17. Xác minh trong Sheet

Kiểm tra dòng mới có đủ 11 cột:

- Created At do server tạo, múi giờ `Asia/Ho_Chi_Minh`, định dạng `yyyy-MM-dd HH:mm`.
- Số điện thoại được chuẩn hóa: `+84`, `84`, `0084` thành số bắt đầu bằng `0`. Hỗ trợ số di động Việt Nam 10 chữ số và số cố định đầu `02` gồm 11 chữ số.
- Tuổi nhận tư vấn từ 3–18; đây là phạm vi nhập form, không thay đổi độ tuổi của từng chương trình.
- Source Page chỉ là pathname, không lưu toàn bộ URL hoặc query. Course page ghi đường dẫn `/khoa-hoc/...` và chọn sẵn chương trình của trang; phụ huynh vẫn có thể đổi lựa chọn. Ba UTM tiếp tục được giữ qua điều hướng nội bộ.
- UTM theo nguồn truy cập của phiên. URL không có UTM giữ attribution hiện tại; URL có UTM mới thay toàn bộ bộ ba để không ghép nhầm campaign cũ/mới. Không có dữ liệu thì ghi chuỗi rỗng.
- Status = **New**, Note = chuỗi rỗng; server tự đặt, không nhận từ browser.

API sử dụng `valueInputOption: RAW` để bảo toàn số 0 đầu số điện thoại và không diễn giải tên/UTM thành công thức Sheets. Thứ tự cột luôn là A:K.

Range append là `Leads!A1:K`: Google xác định bảng A:K và thêm dòng mới bên dưới, không ghi đè header. Dùng A1 notation đầy đủ vì range `Leads!A` bị Google Sheets API từ chối với lỗi parse range.

## 18. Xóa lead test

Sau khi đã xác minh, có thể xóa dòng test khỏi Sheet. Không xóa header hay đổi tên tab.

## Thiết lập Sheet thủ công (khuyến nghị)

- **View → Freeze → 1 row**.
- In đậm hàng tiêu đề.
- **Data → Create a filter**.
- Tạo dropdown cột J (Status): `New`, `Contacted`, `Trial Booked`, `Trial Completed`, `Enrolled`, `Lost`.
- MKT/Manager cập nhật Status và Note trực tiếp trong Sheet. Website không cung cấp admin, dashboard hoặc API sửa trạng thái.

## Lỗi thường gặp

- HTTP 503: thiếu một trong ba biến; kiểm tra cấu hình runtime và tạo lại container. Log chỉ ghi `[leads] STORAGE_NOT_CONFIGURED`.
- HTTP 500: kiểm tra API đã bật, Sheet ID, tên tab, quyền Editor, key còn hiệu lực và kết nối outbound tới Google. Log chỉ ghi `[leads] APPEND_FAILED`, không chứa dữ liệu lead hoặc lỗi Google thô.
- HTTP 400: dữ liệu không hợp lệ, payload quá lớn, nguồn cross-site hoặc honeypot được điền. Không có dòng mới được ghi.
- Google bị lỗi: form giữ dữ liệu, hiện lỗi và liên kết Facebook chính thức để liên hệ. Không giả thành công.
- Mạng mất kết nối sau khi gửi: kiểm tra Sheet trước khi gửi lại, vì Google có thể đã ghi dòng nhưng browser chưa nhận phản hồi. Không tự retry append để tránh nhân đôi; không hứa exactly-once.
- Honeypot và kiểm tra origin là bảo vệ cơ bản, không thay thế chống spam diện rộng. Khi có lưu lượng xấu, cân nhắc rate limit cho `/api/leads` ở Cloudflare; chưa cài CAPTCHA hoặc database rate limit.
- Session storage bị chặn: attribution dùng bộ nhớ của trang và URL hiện tại; có cảnh báo an toàn trong console. Không lưu dữ liệu phụ huynh vào sessionStorage/localStorage.

## Bảo mật bắt buộc

**KHÔNG** commit Service Account JSON/private key, dán key vào frontend, dùng prefix `NEXT_PUBLIC_`/`VITE_PUBLIC_`, trả secret về API response hoặc share Sheet public. Key chỉ nằm trên server. Không đưa `.env` vào ZIP cập nhật.

Nếu key bị lộ: vào **Service Account → Keys**, xóa/revoke key cũ ngay, tạo key mới, thay `GOOGLE_PRIVATE_KEY` trên server rồi redeploy. Xóa key khỏi các nơi đã chia sẻ; nếu đã commit thì xử lý cả lịch sử Git theo quy trình của tổ chức. Chỉ xóa file ở commit mới không đủ.

Chỉ cấp quyền Sheet cho người thực sự quản lý leads và Service Account. Hạn chế lưu trữ lead test, thiết lập quy trình xóa dữ liệu theo nhu cầu nghiệp vụ.

## Kiểm thử và trạng thái kết nối

```bash
npx playwright test "leads.spec.ts|leads-backend.spec.ts|homepage.spec.ts|courses.spec.ts|qa.spec.ts"
```

Tests dùng Google append giả lập có kiểm soát và API intercept cho UI; không ghi lead vào Sheet thật. Kiểm thử backend dùng official client với access token giả và endpoint local để xác nhận request append, không tạo OAuth/JWT thủ công.

Project chưa cài GA4 hoặc Meta Pixel, vì vậy không thêm tracker hoặc fire conversion giả.

**Kết nối thực tế đã xác minh ngày 16/10/2026:** bản production chạy local gọi `/api/leads`, nhận HTTP 200 và Google xác nhận append một dòng vào tab `Leads`. Dòng kiểm tra có tên `TEST KẾT NỐI - 2026-10-16 02:47:50`; có thể xóa thủ công sau khi đối chiếu.

Credentials chỉ được nạp tạm vào môi trường tiến trình để kiểm tra, không lưu vào source. Kết quả này **không** đồng nghĩa website trên Ubuntu đã được cấu hình: vẫn cần đưa bản code mới lên server, cấu hình ba biến môi trường, redeploy và kiểm tra form tại domain thật.
