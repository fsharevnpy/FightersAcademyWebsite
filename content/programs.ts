export type ProgramId = "rio" | "starter-kit" | "lap-trinh" | "dien-tu-co-ban";

export type Program = {
  id: ProgramId;
  number: string;
  name: string;
  category: string;
  description: string;
  audience: string;
  structure: string;
  tags: string[];
  modules: string[];
  example: { title: string; description: string };
  source: string;
};

export const programs: Program[] = [
  {
    id: "rio", number: "01", name: "Rio", category: "KHÁM PHÁ & ROBOT",
    description: "Bắt đầu với những bước đi của robot. Từng bước khám phá thế giới và làm quen tư duy thuật toán.",
    audience: "5–7 tuổi · tham khảo", structure: "5 khóa · 60 buổi theo giáo trình",
    tags: ["Robot", "Tư duy thuật toán", "Kéo thả"],
    modules: ["Khám phá thế giới cùng Rio", "Khám phá mở rộng & tư duy thuật toán", "Lập trình kéo thả cùng Rio", "Rio thông minh – Dò line & né vật cản", "Xưởng sáng tạo thuật toán Rio"],
    example: { title: "Một hành trình cho Rio", description: "Sắp xếp chuỗi lệnh, dự đoán đường đi rồi chạy thử để đưa robot đến đích." },
    source: "Rio_STEM.xlsm",
  },
  {
    id: "starter-kit", number: "02", name: "Starter Kit", category: "CHẾ TẠO & SÁNG TẠO",
    description: "Kết nối lập trình, cảm biến và cơ khí. Biến những ý tưởng gần gũi thành sản phẩm có thể hoạt động.",
    audience: "7–12 tuổi · tùy cấp độ", structure: "6 khóa · 96 buổi theo giáo trình",
    tags: ["Yolo:Bit", "Cảm biến", "Chế tạo"],
    modules: ["Yolo:Bit – Nhà lập trình nhí", "Sensor Lab – Giác quan của máy", "Smart Home Engineer", "Mechanical Maker – Xưởng cơ khí", "Robotics Engineer", "Inventor Lab – Nhà sáng chế"],
    example: { title: "Ngôi nhà biết phản hồi", description: "Kết hợp cảm biến và thiết bị để tạo mô hình nhà có các chức năng tự động." },
    source: "Starter_Kit_STEM_6_khoa_96.xlsx",
  },
  {
    id: "lap-trinh", number: "03", name: "Lập trình", category: "LOGIC & THUẬT TOÁN",
    description: "Nhận ra quy luật, chia nhỏ vấn đề và sắp xếp từng bước. Xây nền tảng tư duy trước khi viết chương trình.",
    audience: "Độ tuổi: [CẦN BỔ SUNG]", structure: "Nền tảng toán học & tư duy lập trình",
    tags: ["Quy luật", "Logic", "Thuật toán"],
    modules: ["Nhận biết quy luật", "Quan hệ giữa số và lượng", "Hình học phẳng và tư duy không gian", "Điều kiện, trình tự, suy luận và thuật toán", "Tư duy thuật toán cơ bản", "Logic lập trình & sáng tạo"],
    example: { title: "Tìm quy luật, sắp trình tự", description: "Thực hành nhận biết quy luật và suy luận các bước để giải quyết một nhiệm vụ." },
    source: "Lập trình - Chi tiết mục tiêu mỗi khóa.xlsx",
  },
  {
    id: "dien-tu-co-ban", number: "04", name: "Điện tử cơ bản", category: "MẠCH ĐIỆN & KỸ THUẬT",
    description: "Tìm hiểu cách linh kiện làm việc cùng nhau. Thực hành với mạch điện, đèn LED, công tắc và động cơ.",
    audience: "Độ tuổi: [CẦN BỔ SUNG]", structure: "Logic · điện cơ bản · robot & cảm biến",
    tags: ["Mạch điện", "LED & motor", "Thực hành"],
    modules: ["Logic và kỹ thuật cơ bản", "Điện cơ bản, LED và công tắc", "Động cơ và mô hình chuyển động", "Robot và cảm biến cơ bản"],
    example: { title: "Bật đèn bằng công tắc", description: "Lắp mạch điện đơn giản, quan sát LED sáng/tắt và tìm hiểu vai trò của công tắc." },
    source: "Chi tiết mục tiêu mỗi khóa.xlsx",
  },
];

export const faqs = [
  { question: "Con chưa từng học lập trình có thể bắt đầu từ đâu?", answer: "Khóa đầu của Rio không yêu cầu kiến thức trước; trẻ cần có thể nghe và làm theo hướng dẫn 1–2 bước. Starter Kit bắt đầu với việc nhận biết chuỗi lệnh, nút và biểu tượng. Việc lựa chọn chương trình cần dựa trên độ tuổi và khả năng hiện tại của con." },
  { question: "Rio và Starter Kit khác nhau như thế nào?", answer: "Rio sử dụng robot để khám phá, điều khiển đường đi và làm quen thuật toán, với độ tuổi tham khảo 5–7. Starter Kit mở rộng sang lập trình Yolo:Bit, cảm biến, cơ khí và chế tạo sản phẩm; các cấp độ có độ tuổi tham khảo từ 7–12." },
  { question: "Trẻ có sử dụng màn hình trong buổi học không?", answer: "Hai khóa đầu của Rio ưu tiên thẻ lệnh, nút nhấn và hoạt động không màn hình cá nhân. Từ khóa 3, giáo trình giới thiệu lập trình kéo thả theo cặp, xen kẽ hoạt động với robot thật. Starter Kit có lập trình kết hợp thực hành lắp ráp và thử nghiệm." },
  { question: "Con có bắt buộc học Rio trước Starter Kit không?", answer: "Không bắt buộc. Theo giáo trình, đầu vào Starter Kit có thể là hoàn thành Rio hoặc đã nhận biết chuỗi lệnh, nút và biểu tượng. Cấp độ phù hợp cần được xác định theo năng lực của từng trẻ." },
  { question: "Buổi học thử diễn ra như thế nào?", answer: "Nội dung, lịch, cơ sở tổ chức và chi phí học thử: [CẦN BỔ SUNG]. Website sẽ cập nhật khi có thông tin chính thức." },
];
