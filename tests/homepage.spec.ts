import { expect, test } from "@playwright/test";
import { getProgramCourseCount, getProgramPath, getProgramStructure, getTuitionSummary, programs } from "../content/programs";

test("course summaries derive from curriculum and omit unavailable fees", () => {
  expect(programs.map(getProgramCourseCount)).toEqual(["5 khóa", "6 khóa", "6 khóa", "14 khóa & chuyên đề"]);
  expect(programs.map(getProgramStructure)).toEqual([
    "5 khóa · 60 buổi theo giáo trình",
    "6 khóa · 96 buổi theo giáo trình",
    "6 khóa · 96 buổi theo giáo trình",
    "4 nhóm cấp độ · 14 khóa & chuyên đề",
  ]);
  expect(getTuitionSummary({ ...programs[0], modules: [] })).toBeNull();
  expect(getTuitionSummary({ ...programs[0], modules: [{ name: "Unknown fee" }] })).toBeNull();
  expect(getTuitionSummary({ ...programs[0], modules: [...programs[0].modules, { name: "Unknown fee" }] })).toBeNull();
});

test("program tuition matches supplied tables and programming course fees", async ({ page }) => {
  await page.goto("/");
  const expectedPrograms = [
    { name: "Rio", summary: "Từ 2.900.000", prices: ["2.900.000", "2.900.000", "3.100.000", "3.100.000", "3.100.000"], sessions: "12 buổi / khóa" },
    { name: "Starter Kit", summary: "Từ 3.200.000", prices: ["3.200.000", "3.200.000", "3.200.000", "3.500.000", "3.500.000", "3.500.000"], sessions: "16 buổi / khóa" },
    { name: "Tư duy logic & Lập trình", summary: "3.500.000", prices: Array(6).fill("3.500.000"), sessions: "16 buổi / khóa" },
    { name: "Điện tử cơ bản", summary: "Khóa học từ 3.500.000", prices: ["3.500.000", "3.800.000", "3.800.000", "3.500.000", "3.800.000", "4.100.000", "4.100.000", "3.500.000", "3.800.000", "4.100.000", "4.400.000", "3.000.000", "3.300.000", "3.600.000"], sessions: null },
  ];
  for (const program of expectedPrograms) {
    await page.goto("/");
    const card = page.locator(".program-card").filter({ has: page.getByRole("heading", { name: program.name, exact: true }) });
    await expect(card.locator(".program-tuition")).toContainText(program.summary);
    await card.getByRole("link", { name: `Xem chi tiết chương trình ${program.name}`, exact: true }).click();
    const curriculum = page.locator("#lo-trinh");
    await expect(curriculum.locator(".module-tuition")).toHaveCount(program.prices.length);
    await expect(curriculum.locator(".module-tuition")).toContainText(program.prices);
    await expect(curriculum.locator(".module-sessions")).toHaveCount(program.sessions ? program.prices.length : 0);
    if (program.sessions) await expect(curriculum.locator(".module-sessions")).toHaveText(program.prices.map(() => program.sessions!));
    if (program.name === "Điện tử cơ bản") {
      await expect(curriculum.locator(".module-tuition small").filter({ hasText: "/ chuyên đề" })).toHaveCount(3);
      await expect(curriculum.locator(".module-group").filter({ hasText: "Khóa 2+" })).toHaveCount(1);
      await expect(curriculum.locator(".module-group").filter({ hasText: "Khóa 3+" })).toHaveCount(2);
    }
    expect(await curriculum.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
});

test("homepage loads all four programs without overflow or broken images", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/STEM Fighters/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".program-card")).toHaveCount(4);
  for (const name of ["Rio", "Starter Kit", "Tư duy logic & Lập trình", "Điện tử cơ bản"]) {
    await expect(page.locator(".program-card").getByRole("heading", { name, exact: true })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  for (const image of await page.locator("img:visible").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
  expect(errors).toEqual([]);
  await page.evaluate(async () => { await document.fonts.ready; window.scrollTo({ top: 0, behavior: "instant" }); });
  await expect(page.locator("h1")).toBeInViewport();
  await page.screenshot({ path: `test-results/hero-${testInfo.project.name}.png` });
  await page.screenshot({ path: `test-results/homepage-${testInfo.project.name}.png`, fullPage: true });
});

test("layout fits small phones, tablet and desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Viewport sweep uses the desktop browser");
  await page.goto("/");
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow at ${width}px`).toBe(true);
  }
});

test("each program links to its curriculum and back to the homepage", async ({ page }) => {
  for (const program of programs) {
    await page.goto("/");
    const link = page.getByRole("link", { name: `Xem chi tiết chương trình ${program.name}`, exact: true });
    await expect(link).toHaveAttribute("href", getProgramPath(program));
    await link.click();
    await expect(page.getByRole("heading", { name: program.name, exact: true, level: 1 })).toBeVisible();
    if (program.id === "dien-tu-co-ban") await page.locator(".curriculum-group h3 button").first().click();
    await expect(page.locator(".module-list li").first()).toBeVisible();
    await page.getByRole("link", { name: "Về trang chủ", exact: true }).click();
    await expect(page.locator(".program-card")).toHaveCount(4);
  }
});

test("FAQ reveals answers and trial CTAs reach the registration form", async ({ page }) => {
  await page.goto("/");
  const question = page.getByText("Con chưa từng học STEM hoặc lập trình thì nên bắt đầu từ đâu?", { exact: true });
  await question.click();
  await expect(page.locator("details[open]")).toContainText("Không mặc định mọi trẻ đều phải bắt đầu từ Rio.");
  await expect(page.locator(".faq-list details")).toHaveCount(7);
  await expect(page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" })).toHaveAttribute("href", "#dang-ky");
  await page.getByRole("heading", { name: "Thông tin đăng ký học thử" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Thông tin đăng ký học thử" })).toBeInViewport();
  const registration = page.locator("#dang-ky");
  await expect(registration).not.toContainText("[CẦN BỔ SUNG]");
  await expect(registration).toContainText("Liên hệ STEM Fighters để được tư vấn lịch học thử phù hợp.");
  await expect(registration.getByRole("button", { name: "Nhận tư vấn & lịch học thử" })).toHaveAttribute("type", "submit");
  for (const section of [registration, page.locator("footer")]) {
    await expect(section.getByRole("link", { name: "Gọi điện: 0398 288 830", exact: true })).toHaveAttribute("href", "tel:0398288830");
    const mapsLink = section.locator('a[href^="https://www.google.com/maps/search/"]').first();
    await expect(mapsLink).toHaveAttribute("target", "_blank");
    await expect(mapsLink).toHaveAttribute("rel", "noopener noreferrer");
    const mapsUrl = new URL((await mapsLink.getAttribute("href"))!);
    expect(mapsUrl.searchParams.get("query")).toBe("64 đường số 2, Khu đô thị Vạn Phúc, Phường Hiệp Bình, TP. Hồ Chí Minh");
    await expect(section).toContainText("Tầng 1, 64 đường số 2");
    await expect(section).toContainText("Phường Hiệp Bình, TP. Hồ Chí Minh");
  }
  await expect(page.locator("form")).toHaveCount(1);
});

test("phone calls and Zalo chat remain separate contact actions", async ({ page }) => {
  await page.context().route("https://zalo.me/0398288830", route => route.fulfill({
    status: 200, contentType: "text/html", body: "<title>Zalo destination</title>",
  }));
  await page.goto("/");
  for (const section of [page.locator("#dang-ky"), page.locator("footer")]) {
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("link", { name: "Gọi điện: 0398 288 830", exact: true })).toHaveAttribute("href", "tel:0398288830");
    const chat = section.getByRole("link", { name: "Chat Zalo", exact: true });
    await expect(chat).toHaveAttribute("href", "https://zalo.me/0398288830");
    await expect(chat).toHaveAttribute("target", "_blank");
    await expect(chat).toHaveAttribute("rel", "noopener noreferrer");
    await chat.focus();
    expect(await chat.evaluate(link => getComputedStyle(link).outlineStyle)).toBe("solid");
    const [popup] = await Promise.all([page.waitForEvent("popup"), page.keyboard.press("Enter")]);
    await expect(popup).toHaveURL("https://zalo.me/0398288830");
    await popup.close();
  }
  await expect(page.locator("#dang-ky").getByRole("link", { name: "Chat Zalo" })).toHaveClass(/button--secondary/);
  await expect(page.locator("#dang-ky").getByRole("button", { name: "Nhận tư vấn & lịch học thử" })).toBeEnabled();
});

test("contact map uses the shared address and opens Google Maps accessibly", async ({ page }) => {
  await page.goto("/");
  const map = page.locator(".contact-map");
  await map.scrollIntoViewIfNeeded();
  const frame = map.locator("iframe");
  const mapLink = map.getByRole("link", { name: "Mở Google Maps: địa chỉ STEM Fighters (tab mới)" });
  await expect(frame).toHaveAttribute("loading", "lazy");
  await expect(frame).toHaveAttribute("inert", "");
  const embedUrl = new URL((await frame.getAttribute("src"))!);
  const mapsUrl = new URL((await mapLink.getAttribute("href"))!);
  expect(embedUrl.origin).toBe("https://www.google.com");
  expect(embedUrl.searchParams.get("output")).toBe("embed");
  expect(embedUrl.searchParams.get("q")).toBe(mapsUrl.searchParams.get("query"));
  await expect(mapLink).toHaveAttribute("target", "_blank");
  await expect(mapLink).toHaveAttribute("rel", "noopener noreferrer");
  await page.locator(".registration-address a").focus();
  await page.keyboard.press("Tab");
  await expect(mapLink).toBeFocused();
  expect(await mapLink.evaluate(link => getComputedStyle(link).outlineStyle)).toBe("solid");
  await page.context().route("https://www.google.com/maps/search/**", route => route.fulfill({
    status: 200, contentType: "text/html", body: "<title>Google Maps destination</title>",
  }));
  const [popup] = await Promise.all([page.waitForEvent("popup"), mapLink.click()]);
  await expect(popup).toHaveURL(mapsUrl.href);
  await popup.close();
  const addressBounds = await page.locator(".registration-address").boundingBox();
  const mapBounds = await map.boundingBox();
  expect(addressBounds).not.toBeNull();
  expect(mapBounds).not.toBeNull();
  if (page.viewportSize()!.width >= 1200) {
    expect(mapBounds!.x).toBeGreaterThanOrEqual(addressBounds!.x + addressBounds!.width);
  } else {
    expect(mapBounds!.y).toBeGreaterThanOrEqual(addressBounds!.y + addressBounds!.height);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("four equal-weight cards keep facts consistent without exposing curriculum or placeholders", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const cards = page.locator(".program-card");
  const sizes = await cards.evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return { width: rect.width, height: rect.height, background: style.backgroundColor, border: style.border, padding: style.padding };
  }));
  for (const size of sizes) {
    expect(Math.abs(size.width - sizes[0].width)).toBeLessThanOrEqual(1);
    expect(Math.abs(size.height - sizes[0].height)).toBeLessThanOrEqual(1);
    expect(size.background).toBe(sizes[0].background);
    expect(size.border).toBe(sizes[0].border);
    expect(size.padding).toBe(sizes[0].padding);
  }
  for (const [index, program] of programs.entries()) {
    const card = cards.nth(index);
    await expect(card.locator(".program-age")).toHaveText(program.audience);
    await expect(card.locator(".program-facts")).toContainText(getProgramCourseCount(program)!);
    await expect(card.locator(".tags span")).toHaveText(program.tags);
    await expect(card.locator(".module-list")).toHaveCount(0);
    await expect(card.getByRole("link", { name: `Xem chi tiết chương trình ${program.name}`, exact: true })).toHaveAttribute("href", getProgramPath(program));
    await expect(card.getByRole("link", { name: "Đăng ký học thử" })).toHaveAttribute("href", "#dang-ky");
  }
  await expect(cards.nth(3).locator(".program-age")).toHaveText("7–15 tuổi");
  await expect(page.locator("dialog, .module-list, .curriculum-group")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/\[CẦN BỔ SUNG\]|đang (được )?cập nhật|sẽ cập nhật sau|placeholder|TODO|TBD/i);
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links =>
    links.map(link => link.getAttribute("href")!)
      .filter(href => !document.getElementById(decodeURIComponent(href.slice(1))))
  );
  expect(brokenAnchors).toEqual([]);
  const primaryLinks = page.locator("a.button--primary");
  for (const link of await primaryLinks.all()) {
    await expect(link).toHaveText("Đăng ký học thử");
    await expect(link).toHaveAttribute("href", "#dang-ky");
  }
});

test("mobile menu and sticky CTA behave correctly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "Collapsed navigation only");
  await page.goto("/");
  await expect(page.locator(".mobile-cta")).not.toBeVisible();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.getByRole("navigation", { name: "Điều hướng di động" })).toBeVisible();
  await page.getByRole("navigation", { name: "Điều hướng di động" }).getByRole("link", { name: "Chương trình học" }).click();
  await expect(page.getByRole("button", { name: "Mở menu" })).toHaveAttribute("aria-expanded", "false");
  // Wait for anchor smooth scrolling to finish before opening the sticky menu again.
  const anchorOffset = await page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
  await expect.poll(() => page.locator("#chuong-trinh").evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThanOrEqual(anchorOffset + 2);
  if (testInfo.project.name === "mobile") await expect(page.locator(".mobile-cta")).toBeVisible();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.locator(".mobile-cta")).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Mở menu" })).toBeFocused();
  if (testInfo.project.name === "mobile") {
    await expect(page.locator(".mobile-cta").getByRole("link", { name: "Đăng ký học thử" })).toHaveAttribute("href", "#dang-ky");
    await expect(page.locator(".mobile-cta").getByRole("link", { name: "Chat Zalo" })).toHaveAttribute("href", "https://zalo.me/0398288830");
    await page.locator(".mobile-cta").getByRole("link", { name: "Đăng ký học thử" }).click();
  } else {
    await page.getByRole("button", { name: "Mở menu" }).click();
    const trialLink = page.getByRole("navigation", { name: "Điều hướng di động" }).getByRole("link", { name: "Đăng ký học thử" });
    await expect(trialLink).toHaveAttribute("href", "#dang-ky");
    await trialLink.click();
    await expect(page.getByRole("button", { name: "Mở menu" })).toHaveAttribute("aria-expanded", "false");
  }
  await expect(page.getByLabel("Tên phụ huynh")).toBeInViewport();
  await expect(page.locator(".mobile-cta")).not.toBeVisible();
});
