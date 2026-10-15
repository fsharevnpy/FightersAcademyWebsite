import { trialContact } from "./contact";

export type ProgramId = "rio" | "starter-kit" | "lap-trinh" | "dien-tu-co-ban";

export type Program = {
  id: ProgramId;
  number: string;
  name: string;
  category: string;
  description: string;
  audience: string;
  levelCount?: number;
  tags: string[];
  modules: { name: string; group?: string; sessions?: number; tuition?: number; unit?: "chuyên đề" }[];
  example: { title: string; description: string };
  source: string;
  tuitionSource: string;
};

export const programs: Program[] = [
  {
    id: "rio", number: "01", name: "Rio", category: "KHÁM PHÁ & ROBOT",
    description: "Cho trẻ làm quen tư duy thuật toán qua điều khiển robot, khám phá đường đi và lập trình kéo thả.",
    audience: "5–7 tuổi · tham khảo",
    tags: ["Robot", "Tư duy thuật toán", "Kéo thả"],
    modules: [
      { name: "Khám phá thế giới cùng Rio", sessions: 12, tuition: 2900000 },
      { name: "Khám phá mở rộng & tư duy thuật toán", sessions: 12, tuition: 2900000 },
      { name: "Lập trình kéo thả cùng Rio", sessions: 12, tuition: 3100000 },
      { name: "Rio thông minh – Dò line & né vật cản", sessions: 12, tuition: 3100000 },
      { name: "Xưởng sáng tạo thuật toán Rio", sessions: 12, tuition: 3100000 },
    ],
    example: { title: "Một hành trình cho Rio", description: "Sắp xếp chuỗi lệnh, dự đoán đường đi rồi chạy thử để đưa robot đến đích." },
    source: "Rio_STEM.xlsm",
    tuitionSource: "source/khoahoc/RIO.jpg",
  },
  {
    id: "starter-kit", number: "02", name: "Starter Kit", category: "CHẾ TẠO & SÁNG TẠO",
    description: "Cho trẻ khám phá chế tạo sản phẩm, kết hợp lập trình Yolo:Bit, cảm biến và cơ khí.",
    audience: "7–12 tuổi · tùy cấp độ",
    tags: ["Yolo:Bit", "Cảm biến", "Chế tạo"],
    modules: [
      { name: "Yolo:Bit – Nhà lập trình nhí", sessions: 16, tuition: 3200000 },
      { name: "Sensor Lab – Giác quan của máy", sessions: 16, tuition: 3200000 },
      { name: "Smart Home Engineer", sessions: 16, tuition: 3200000 },
      { name: "Mechanical Maker – Xưởng cơ khí", sessions: 16, tuition: 3500000 },
      { name: "Robotics Engineer", sessions: 16, tuition: 3500000 },
      { name: "Inventor Lab – Nhà sáng chế", sessions: 16, tuition: 3500000 },
    ],
    example: { title: "Ngôi nhà biết phản hồi", description: "Kết hợp cảm biến và thiết bị để tạo mô hình nhà có các chức năng tự động." },
    source: "Starter_Kit_STEM_6_khoa_96.xlsx",
    tuitionSource: "source/khoahoc/Stem Starter Kit.jpg",
  },
  {
    id: "lap-trinh", number: "03", name: "Tư duy logic & Lập trình", category: "LOGIC & THUẬT TOÁN",
    description: "Cho trẻ xây nền tảng tư duy trước khi viết chương trình: nhận biết quy luật, suy luận và sắp xếp trình tự.",
    audience: "5–7 tuổi · theo giáo trình",
    tags: ["Quy luật", "Logic", "Thuật toán"],
    modules: [
      { name: "Phát triển khả năng nhận biết quy luật", group: "Toán tư duy cơ bản · Khóa 1", sessions: 16, tuition: 3500000 },
      { name: "Hiểu biết quan hệ giữa số và lượng, và tư duy giải toán bằng nhiều cách", group: "Toán tư duy cơ bản · Khóa 2", sessions: 16, tuition: 3500000 },
      { name: "Hình học phẳng và tư duy không gian", group: "Toán tư duy cơ bản · Khóa 3", sessions: 16, tuition: 3500000 },
      { name: "Hiểu điều kiện, trình tự, suy luận và thuật toán", group: "Toán tư duy cơ bản · Khóa 4", sessions: 16, tuition: 3500000 },
      { name: "Tư duy thuật toán cơ bản", group: "Tư duy lập trình · Khóa 1", sessions: 16, tuition: 3500000 },
      { name: "Logic lập trình & sáng tạo", group: "Tư duy lập trình · Khóa 2", sessions: 16, tuition: 3500000 },
    ],
    example: { title: "Tìm quy luật, sắp trình tự", description: "Thực hành nhận biết quy luật và suy luận các bước để giải quyết một nhiệm vụ." },
    source: "Lập trình - Chi tiết mục tiêu mỗi khóa.xlsx",
    tuitionSource: "3.500.000 đồng mỗi khóa, do chủ website xác nhận",
  },
  {
    id: "dien-tu-co-ban", number: "04", name: "Điện tử cơ bản", category: "MẠCH ĐIỆN & KỸ THUẬT",
    description: "Cho trẻ khám phá mạch điện và mô hình đơn giản, tiến tới robot, lập trình nhúng và chuyên đề công nghệ.",
    audience: "7–15 tuổi", levelCount: 4,
    tags: ["Mạch điện", "LED & motor", "Thực hành"],
    modules: [
      { name: "Logic và kỹ thuật cơ bản", group: "Kỹ sư nhí tập sự · Khóa 1", tuition: 3500000 },
      { name: "Robotic và Sensor cơ bản", group: "Kỹ sư nhí tập sự · Khóa 2", tuition: 3800000 },
      { name: "Khám phá AI Mini", group: "Kỹ sư nhí tập sự · Khóa 2+", tuition: 3800000 },
      { name: "Robotic Basic", group: "Kỹ sư nhí chính thức · Khóa 1", tuition: 3500000 },
      { name: "Robotic Intermediate", group: "Kỹ sư nhí chính thức · Khóa 2", tuition: 3800000 },
      { name: "Robotic Advanced", group: "Kỹ sư nhí chính thức · Khóa 3", tuition: 4100000 },
      { name: "Lập trình AI Mini", group: "Kỹ sư nhí chính thức · Khóa 3+", tuition: 4100000 },
      { name: "Lập trình và điện tử (Basic)", group: "Kỹ sư nhí cao cấp · Khóa 1", tuition: 3500000 },
      { name: "Lập trình và điều khiển robot (Intermediate)", group: "Kỹ sư nhí cao cấp · Khóa 2", tuition: 3800000 },
      { name: "Lập trình nâng cao (Advanced)", group: "Kỹ sư nhí cao cấp · Khóa 3", tuition: 4100000 },
      { name: "Lập trình AI Mini", group: "Kỹ sư nhí cao cấp · Khóa 3+", tuition: 4400000 },
      { name: "IoT với ESP32/STM32", group: "Kỹ sư nhí chuyên sâu", tuition: 3000000, unit: "chuyên đề" },
      { name: "Robotics Control", group: "Kỹ sư nhí chuyên sâu", tuition: 3300000, unit: "chuyên đề" },
      { name: "AI – Computer Vision", group: "Kỹ sư nhí chuyên sâu", tuition: 3600000, unit: "chuyên đề" },
    ],
    example: { title: "Bật đèn bằng công tắc", description: "Lắp mạch điện đơn giản, quan sát LED sáng/tắt và tìm hiểu vai trò của công tắc." },
    source: "Chi tiết mục tiêu mỗi khóa.xlsx",
    tuitionSource: "source/khoahoc/Điện tử.pdf",
  },
];

export const formatTuition = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);

export function getProgramCourseCount(program: Program) {
  if (program.modules.length === 0) return null;
  return `${program.modules.length} ${program.modules.some(module => module.unit === "chuyên đề") ? "khóa & chuyên đề" : "khóa"}`;
}

export function getProgramStructure(program: Program) {
  const courseCount = getProgramCourseCount(program);
  if (!courseCount) return null;
  const levels = program.levelCount ? `${program.levelCount} nhóm cấp độ · ` : "";
  const sessions = program.modules.every(module => module.sessions !== undefined)
    ? ` · ${program.modules.reduce((total, module) => total + (module.sessions ?? 0), 0)} buổi theo giáo trình`
    : "";
  return `${levels}${courseCount}${sessions}`;
}

export function getTuitionSummary(program: Program) {
  const amounts = program.modules.flatMap(module => module.tuition === undefined ? [] : [module.tuition]);
  if (amounts.length !== program.modules.length || amounts.length === 0) return null;
  const lowest = Math.min(...amounts);
  if (program.modules.some(module => module.unit === "chuyên đề")) {
    const courses = program.modules.filter(module => module.unit !== "chuyên đề");
    const topics = program.modules.filter(module => module.unit === "chuyên đề");
    return [
      ...(courses.length ? [`Khóa học từ ${formatTuition(Math.min(...courses.map(module => module.tuition!)))}`] : []),
      `Chuyên đề từ ${formatTuition(Math.min(...topics.map(module => module.tuition!)))}`,
    ].join("\n");
  }
  const unit = program.modules.some(module => module.unit === "chuyên đề") ? "khóa hoặc chuyên đề" : "khóa";
  return `${amounts.some(amount => amount !== lowest) ? "Từ " : ""}${formatTuition(lowest)} / ${unit}`;
}

export function getProgramModuleGroups(program: Program) {
  const groups = new Map<string, Program["modules"]>();
  for (const courseModule of program.modules) {
    const level = courseModule.group?.split(" · ")[0];
    if (!level) throw new Error(`Missing curriculum level for ${program.id}`);
    const modules = groups.get(level) ?? [];
    modules.push(courseModule);
    groups.set(level, modules);
  }
  return Array.from(groups, ([name, modules]) => ({ name, modules }));
}

export const faqs = [
  { question: "Con chưa từng học lập trình có thể bắt đầu từ đâu?", answer: "Khóa đầu của Rio không yêu cầu kiến thức trước; trẻ cần có thể nghe và làm theo hướng dẫn 1–2 bước. Starter Kit bắt đầu với việc nhận biết chuỗi lệnh, nút và biểu tượng. Việc lựa chọn chương trình cần dựa trên độ tuổi và khả năng hiện tại của con." },
  { question: "Rio và Starter Kit khác nhau như thế nào?", answer: "Rio sử dụng robot để khám phá, điều khiển đường đi và làm quen thuật toán. Starter Kit mở rộng sang lập trình Yolo:Bit, cảm biến, cơ khí và chế tạo sản phẩm. Độ tuổi tham khảo của từng chương trình được ghi tại phần Chương trình học." },
  { question: "Trẻ có sử dụng màn hình trong buổi học không?", answer: "Hai khóa đầu của Rio ưu tiên thẻ lệnh, nút nhấn và hoạt động không màn hình cá nhân. Từ khóa 3, giáo trình giới thiệu lập trình kéo thả theo cặp, xen kẽ hoạt động với robot thật. Starter Kit có lập trình kết hợp thực hành lắp ráp và thử nghiệm." },
  { question: "Con có bắt buộc học Rio trước Starter Kit không?", answer: "Không bắt buộc. Theo giáo trình, đầu vào Starter Kit có thể là hoàn thành Rio hoặc đã nhận biết chuỗi lệnh, nút và biểu tượng. Cấp độ phù hợp cần được xác định theo năng lực của từng trẻ." },
  { question: "Buổi học thử diễn ra như thế nào?", answer: trialContact.schedule },
];
