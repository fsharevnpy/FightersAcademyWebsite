import { trialContact } from "./contact";

export type ProgramId = "rio" | "starter-kit" | "lap-trinh" | "dien-tu-co-ban";
export type FAQ = { question: string; answer: string; trial?: boolean };

export type Program = {
  id: ProgramId;
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  summary: string;
  audience: string;
  levelCount?: number;
  tags: string[];
  modules: { name: string; group?: string; sessions?: number; tuition?: number; unit?: "chuyên đề" }[];
  example: { title: string; description: string };
  source: string;
  tuitionSource: string;
  fit: string;
  skills: string[];
  faqs: FAQ[];
};

export const programs: Program[] = [
  {
    id: "rio", slug: "rio", number: "01", name: "Rio", category: "KHÁM PHÁ & ROBOT",
    description: "Cho trẻ làm quen tư duy thuật toán qua điều khiển robot, khám phá đường đi và lập trình kéo thả.",
    summary: "Khám phá thuật toán qua robot, đường đi và lập trình kéo thả.",
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
    fit: "Dành cho trẻ thích khám phá qua robot và những hoạt động trực quan. Khóa đầu không yêu cầu kiến thức trước; trẻ cần có thể nghe và làm theo hướng dẫn 1–2 bước.",
    skills: ["Sắp xếp chuỗi lệnh và dự đoán đường đi của robot.", "Làm quen lập trình kéo thả, dò line và né vật cản.", "Thử cách điều khiển, quan sát kết quả và điều chỉnh thuật toán."],
    faqs: [
      { question: "Con cần biết lập trình trước khi học Rio không?", answer: "Khóa đầu của Rio không yêu cầu kiến thức trước; trẻ cần có thể nghe và làm theo hướng dẫn 1–2 bước. Trung tâm tư vấn điểm bắt đầu dựa trên khả năng hiện tại của con." },
      { question: "Rio có sử dụng màn hình ngay từ đầu không?", answer: "Hai khóa đầu ưu tiên thẻ lệnh, nút nhấn và hoạt động không màn hình cá nhân. Từ khóa 3, giáo trình giới thiệu lập trình kéo thả theo cặp, xen kẽ hoạt động với robot thật." },
      { question: "Trẻ khám phá thuật toán với Rio như thế nào?", answer: "Trẻ sắp xếp chuỗi lệnh, dự đoán đường đi rồi chạy thử với robot. Lộ trình mở rộng sang kéo thả, dò line, né vật cản và sáng tạo thuật toán." },
    ],
  },
  {
    id: "starter-kit", slug: "starter-kit", number: "02", name: "Starter Kit", category: "CHẾ TẠO & SÁNG TẠO",
    description: "Cho trẻ khám phá chế tạo sản phẩm, kết hợp lập trình Yolo:Bit, cảm biến và cơ khí.",
    summary: "Chế tạo sản phẩm với Yolo:Bit, cảm biến, lập trình và cơ khí.",
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
    fit: "Dành cho trẻ thích chế tạo và tìm hiểu cách một sản phẩm hoạt động. Theo giáo trình, đầu vào có thể là hoàn thành Rio hoặc đã nhận biết chuỗi lệnh, nút và biểu tượng.",
    skills: ["Kết hợp lập trình Yolo:Bit với cảm biến và thiết bị.", "Khám phá mô hình nhà thông minh, cơ khí và robot.", "Lắp ráp, chạy thử và điều chỉnh ý tưởng chế tạo."],
    faqs: [
      { question: "Có phải hoàn thành Rio mới học được Starter Kit?", answer: "Không bắt buộc. Theo giáo trình, đầu vào Starter Kit có thể là hoàn thành Rio hoặc đã nhận biết chuỗi lệnh, nút và biểu tượng. Cấp độ phù hợp cần được xác định theo năng lực của từng trẻ." },
      { question: "Starter Kit dùng Yolo:Bit và cảm biến để làm gì?", answer: "Giáo trình đi từ làm quen lập trình Yolo:Bit đến cảm biến, mô hình nhà thông minh, cơ khí, robot và sáng chế. Ví dụ thực hành là kết hợp cảm biến và thiết bị để mô hình phản hồi tự động." },
      { question: "Starter Kit có chỉ học trên máy tính không?", answer: "Chương trình kết hợp lập trình với thực hành lắp ráp và thử nghiệm. Các khóa Sensor Lab, Smart Home Engineer, Mechanical Maker và Robotics Engineer mở rộng việc học qua mô hình và thiết bị." },
    ],
  },
  {
    id: "lap-trinh", slug: "tu-duy-logic-lap-trinh", number: "03", name: "Tư duy logic & Lập trình", category: "LOGIC & THUẬT TOÁN",
    description: "Cho trẻ xây nền tảng tư duy trước khi viết chương trình: nhận biết quy luật, suy luận và sắp xếp trình tự.",
    summary: "Xây nền tảng logic qua quy luật, trình tự và suy luận thuật toán.",
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
    fit: "Dành cho trẻ cần xây nền tảng suy nghĩ có trình tự trước khi viết chương trình, thông qua quy luật, số và lượng, hình học và suy luận.",
    skills: ["Nhận biết quy luật, quan hệ giữa số và lượng.", "Khám phá hình học phẳng và tư duy không gian.", "Sắp xếp trình tự, hiểu điều kiện và suy luận thuật toán."],
    faqs: [
      { question: "Con học gì trước khi viết chương trình?", answer: "Giáo trình bắt đầu với nhận biết quy luật, quan hệ giữa số và lượng, tư duy giải toán, hình học phẳng và không gian. Sau đó là điều kiện, trình tự, suy luận và thuật toán." },
      { question: "Toán tư duy và tư duy lập trình liên hệ thế nào?", answer: "Các khóa toán tư duy cơ bản xây nền tảng nhận biết, so sánh và suy luận. Phần tư duy lập trình tiếp nối bằng thuật toán cơ bản, logic lập trình và sáng tạo." },
      { question: "Trẻ thực hành tư duy thuật toán ra sao?", answer: "Ví dụ trong giáo trình là nhận biết quy luật và suy luận các bước để giải quyết một nhiệm vụ. Trọng tâm là cách sắp xếp trình tự và giải thích cách làm, không chỉ viết lệnh." },
    ],
  },
  {
    id: "dien-tu-co-ban", slug: "dien-tu-co-ban", number: "04", name: "Điện tử cơ bản", category: "MẠCH ĐIỆN & KỸ THUẬT",
    description: "Cho trẻ khám phá mạch điện và mô hình đơn giản, tiến tới robot, lập trình nhúng và chuyên đề công nghệ.",
    summary: "Từ mạch điện, linh kiện đến robot, lập trình nhúng và công nghệ.",
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
    fit: "Dành cho trẻ quan tâm đến mạch điện, linh kiện và cách điều khiển mô hình. Lộ trình có các nhóm từ kỹ thuật cơ bản đến robot, lập trình nhúng và chuyên đề công nghệ; cấp độ được tư vấn theo năng lực hiện tại.",
    skills: ["Tìm hiểu mạch điện, công tắc, LED và motor qua thực hành.", "Khám phá cảm biến, robot và lập trình điều khiển.", "Mở rộng tới lập trình nhúng, IoT và AI theo từng cấp độ."],
    faqs: [
      { question: "Con chưa biết điện tử nên tìm hiểu từ đâu?", answer: "Nhóm Kỹ sư nhí tập sự bắt đầu với Logic và kỹ thuật cơ bản, sau đó có Robotic và Sensor cơ bản, Khám phá AI Mini. Liên hệ STEM Fighters để được tư vấn cấp độ phù hợp với nền tảng của con." },
      { question: "Trẻ có trực tiếp thao tác mạch điện và linh kiện không?", answer: "Ví dụ trong giáo trình là lắp mạch điện đơn giản, quan sát LED sáng/tắt và tìm hiểu vai trò của công tắc. Các nhóm tiếp theo mở rộng sang robot, cảm biến và lập trình điều khiển." },
      { question: "Các cấp độ và chuyên đề được tổ chức thế nào?", answer: "Giáo trình chia thành Kỹ sư nhí tập sự, chính thức, cao cấp và chuyên sâu. Nhóm chuyên sâu gồm IoT với ESP32/STM32, Robotics Control và AI – Computer Vision. Việc chọn điểm bắt đầu cần dựa trên năng lực của từng trẻ." },
    ],
  },
];

export const getProgramPath = (program: Program) => `/khoa-hoc/${program.slug}`;
export const getProgramBySlug = (slug: string) => programs.find(program => program.slug === slug);
export const getProgramFAQs = (program: Program): FAQ[] => [
  { question: `${program.name} phù hợp với độ tuổi nào?`, answer: `Thông tin độ tuổi của chương trình: ${program.audience}. Cấp độ phù hợp được tư vấn theo nền tảng và năng lực hiện tại của con.` },
  ...program.faqs,
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

export const faqs: FAQ[] = [
  { question: "Con chưa từng học STEM hoặc lập trình thì nên bắt đầu từ đâu?", answer: "Hãy đối chiếu độ tuổi, nền tảng, khả năng hiện tại và sở thích của con với từng chương trình. Rio khám phá qua robot; Starter Kit thiên về chế tạo; Tư duy logic & Lập trình xây nền tảng suy luận; Điện tử cơ bản tìm hiểu mạch điện và kỹ thuật. Không mặc định mọi trẻ đều phải bắt đầu từ Rio." },
  { question: "Rio và Tư duy logic & Lập trình khác nhau như thế nào?", answer: "Rio giúp trẻ khám phá thuật toán qua robot, điều khiển đường đi và lập trình kéo thả. Tư duy logic & Lập trình tập trung vào quy luật, trình tự, suy luận và nền tảng thuật toán. Hai hướng khám phá khác nhau, không phải chương trình nào tốt hơn." },
  { question: "Starter Kit và Điện tử cơ bản khác nhau như thế nào?", answer: "Starter Kit kết hợp Yolo:Bit, cảm biến, cơ khí và lập trình để chế tạo sản phẩm. Điện tử cơ bản đi từ mạch điện, linh kiện và mô hình tới robot, lập trình nhúng và chuyên đề công nghệ. Hãy chọn theo sở thích và nền tảng của con." },
  { question: "Con 7–12 tuổi nên chọn Starter Kit hay Điện tử cơ bản?", answer: "Độ tuổi là một yếu tố, không phải tiêu chí duy nhất. Sở thích chế tạo, tìm hiểu mạch điện, kinh nghiệm và mục tiêu học giúp xác định hướng phù hợp. Phụ huynh có thể đăng ký học thử hoặc trao đổi với STEM Fighters để được tư vấn điểm bắt đầu.", trial: true },
  { question: "Trẻ có sử dụng màn hình trong buổi học không?", answer: "Tùy chương trình và cấp độ, trẻ kết hợp hoạt động với robot, linh kiện, mô hình, bài tập tư duy và lập trình. Rio có hoạt động trực quan trước khi làm quen kéo thả; Starter Kit và Điện tử cơ bản kết hợp thiết bị với lập trình; Tư duy logic & Lập trình chú trọng quy luật và suy luận." },
  { question: "Có bắt buộc học các chương trình theo thứ tự không?", answer: "Không có một thứ tự chung cho tất cả trẻ. Chẳng hạn, giáo trình Starter Kit cho phép đầu vào từ Rio hoặc nền tảng nhận biết chuỗi lệnh, nút và biểu tượng. Chương trình và cấp độ phù hợp cần dựa trên độ tuổi, nền tảng và khả năng hiện tại của con." },
  { question: "Buổi học thử diễn ra như thế nào?", answer: trialContact.schedule, trial: true },
];
