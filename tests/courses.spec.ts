import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";
import { contact, siteUrl } from "../content/contact";
import { getProgramFAQs, getProgramPath, getProgramStructure, programs } from "../content/programs";
import { leadMessages, undecidedProgram } from "../lib/leads";

test("all four landing pages render indexable content without JavaScript", async ({ browser, baseURL, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const program of programs) {
      const path = getProgramPath(program);
      const response = await page.goto(`${path}?utm_source=seo`, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      expect(response?.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
      await expect(page.locator("h1")).toHaveText(program.name);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteUrl}${path}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${siteUrl}${path}`);
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description).toContain(program.description);
      titles.add(title);
      descriptions.add(description!);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
      await expect(page.locator(".module-content strong")).toHaveText(program.modules.map(module => module.name));
      await expect(page.locator(".course-example")).toContainText(program.example.description);
      await expect(page.locator(".faq-list summary")).toHaveText(getProgramFAQs(program).map(faq => faq.question));
      await expect(page.locator(".course-structure")).toHaveText(getProgramStructure(program)!);
      const breadcrumb = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
      expect(breadcrumb["@type"]).toBe("BreadcrumbList");
      expect(breadcrumb.itemListElement.map((item: { item: string }) => item.item)).toEqual([siteUrl, `${siteUrl}${path}`]);
      expect((await page.reload({ waitUntil: "domcontentloaded" }))?.status()).toBe(200);
    }
    expect(titles.size).toBe(4);
    expect(descriptions.size).toBe(4);
  } finally { await context.close(); }
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect((xml.match(/<loc>/g) ?? []).length).toBe(5);
  for (const program of programs) expect(xml).toContain(`<loc>${siteUrl}${getProgramPath(program)}</loc>`);
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Allow: /");
  expect(await robots.text()).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  expect((await request.get("/khoa-hoc/not-a-course")).status()).toBe(404);
});

for (const program of programs) {
  test(`${program.name}: responsive content, curriculum, accessibility and local conversion`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(getProgramPath(program));
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program.name);
    await expect(page.locator("form")).toHaveCount(1);
    await expect(page.locator(".course-example")).toContainText(program.example.title);
    for (const toggle of await page.locator(".curriculum-group h3 button").all()) {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await toggle.click();
    }
    await expect(page.locator(".module-list li:visible")).toHaveCount(program.modules.length);
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")!).filter(href => !document.getElementById(href.slice(1))));
    expect(brokenAnchors).toEqual([]);
    for (const other of programs.filter(other => other.id !== program.id)) {
      await expect(page.locator(".related-programs").getByRole("link", { name: `Xem chương trình ${other.name}`, exact: true })).toHaveAttribute("href", getProgramPath(other));
    }
    const navigation = testInfo.project.name === "desktop" ? page.locator(".desktop-nav") : page.locator("#mobile-menu");
    if (testInfo.project.name !== "desktop") await page.getByRole("button", { name: "Mở menu" }).click();
    await expect(navigation.getByRole("link", { name: "Chương trình học" })).toHaveAttribute("href", "/#chuong-trinh");
    if (testInfo.project.name !== "desktop") await page.keyboard.press("Escape");
    await page.locator(".course-intro-grid").scrollIntoViewIfNeeded();
    const bar = page.getByRole("navigation", { name: "Liên hệ nhanh" });
    if (testInfo.project.name === "mobile") {
      await expect(bar).toBeVisible();
      await expect(bar.getByRole("link", { name: "Chat Zalo" })).toHaveAttribute("href", contact.zaloHref);
      await expect(bar.getByRole("link", { name: "Chat Zalo" })).toHaveAttribute("target", "_blank");
      const bounds = await bar.boundingBox();
      expect(bounds!.height).toBeLessThanOrEqual(90);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
      await bar.getByRole("link", { name: "Đăng ký học thử" }).focus();
      await page.keyboard.press("Enter");
    } else {
      await expect(bar).not.toBeVisible();
      await page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" }).click();
    }
    await expect(page.getByRole("form", { name: "Đăng ký học thử" })).toBeFocused();
    await expect(page.getByLabel("Tên phụ huynh")).toBeInViewport();
    await expect(bar).not.toBeVisible();
    await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).scrollIntoViewIfNeeded();
    await expect(bar).not.toBeVisible();
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(bar).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
    }
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    for (const [name, selector] of [["hero", ".course-hero"], ["curriculum", "#lo-trinh"], ["registration", "#dang-ky"]]) {
      await page.locator(selector).screenshot({ path: `test-results/course-${program.slug}-${testInfo.project.name}-${name}.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
    }
  });
}

test("homepage is shorter and activities appear earlier at all required widths", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One five-width measurement sweep");
  // Font-ready Chromium measurements before the course-page split.
  const before = [
    { width: 375, height: 13286, activitiesTop: 4844 },
    { width: 390, height: 13105, activitiesTop: 4688 },
    { width: 768, height: 9521, activitiesTop: 3048 },
    { width: 1024, height: 7830, activitiesTop: 2385 },
    { width: 1440, height: 7986, activitiesTop: 2416 },
  ];
  const measured = [];
  for (const baseline of before) {
    await page.setViewportSize({ width: baseline.width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const current = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      activitiesTop: Math.round(document.getElementById("hoat-dong")!.getBoundingClientRect().top + scrollY),
      sections: Array.from(document.querySelectorAll("main > section")).map(section => ({ name: section.id || section.className, height: Math.round(section.getBoundingClientRect().height) })),
    }));
    measured.push({ width: baseline.width, before: baseline, after: current });
    // The approved representative images add one 140px image + 16px gap per card row.
    const imageRows = baseline.width < 768 ? 4 : baseline.width < 1280 ? 2 : 1;
    const mediaAllowance = imageRows * 156;
    // Approved descriptive names may wrap onto one extra line per equal-height card row.
    const titleLineHeight = await page.locator(".program-card h3").first().evaluate(element => parseFloat(getComputedStyle(element).lineHeight));
    const titleAllowance = imageRows * titleLineHeight;
    // scrollHeight is an integer; compare against the same pixel rounding.
    expect.soft(current.height, `Homepage height at ${baseline.width}px`).toBeLessThanOrEqual(Math.round(baseline.height * .9 + mediaAllowance + titleAllowance));
    expect.soft(current.activitiesTop, `Activity position at ${baseline.width}px`).toBeLessThan(baseline.activitiesTop * .85 + mediaAllowance + titleAllowance);
    await page.locator("#chuong-trinh").screenshot({ path: `test-results/programs-${baseline.width}.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
  }
  await writeFile("test-results/homepage-height-comparison.json", JSON.stringify(measured, null, 2));
});

test("375px and 1024px complete the homepage, Tư duy lập trình STEM and electronics viewport matrix", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Extra widths complement all three viewport projects");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/", "/khoa-hoc/tu-duy-lap-trinh-stem", "/khoa-hoc/dien-tu-robot-thong-minh"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      for (const toggle of await page.locator(".curriculum-group h3 button").all()) await toggle.click();
      for (const selector of ["main", "#dang-ky", "footer"]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}px`).toBe(true);
      }
      await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).scrollIntoViewIfNeeded();
      await expect(page.locator(".mobile-cta")).not.toBeVisible();
      const section = path === "/" ? "#chuong-trinh" : ".course-hero";
      await page.locator(section).screenshot({ path: `test-results/extra-${width}-${path.split("/").pop() || "home"}.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
    }
  }
});

for (const blockedStorage of [false, true]) {
  test(`course form preserves program, source page and UTM across client navigation (storage blocked: ${blockedStorage})`, async ({ page }) => {
    if (blockedStorage) await page.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error("Test: blocked storage"); };
      Storage.prototype.setItem = () => { throw new Error("Test: blocked storage"); };
    });
    const payloads: Record<string, unknown>[] = [];
    await page.route("**/api/leads", route => { payloads.push(route.request().postDataJSON()); return route.fulfill({ json: { success: true } }); });
    await page.goto("/khoa-hoc/tu-duy-lap-trinh-stem?utm_source=facebook&utm_medium=paid&utm_campaign=rio");
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue("Tư duy lập trình STEM");
    await page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" }).click();
    await expect(page).toHaveURL(/utm_campaign=rio/);
    await page.getByLabel("Chương trình quan tâm").selectOption("Điện tử & Robot thông minh");
    await page.evaluate(() => { document.documentElement.dataset.navigationMarker = "same-document"; });
    await page.locator(".related-programs").getByRole("link", { name: "Xem chương trình Kỹ sư Công nghệ STEM nhí", exact: true }).click();
    await expect(page).toHaveURL(/\/khoa-hoc\/ky-su-cong-nghe-stem-nhi$/);
    await expect(page.locator("html")).toHaveAttribute("data-navigation-marker", "same-document");
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue("Kỹ sư Công nghệ STEM nhí");
    await page.getByLabel("Tên phụ huynh").fill("TEST COURSE FLOW");
    await page.getByLabel("Số điện thoại").fill("0901234567");
    await page.getByLabel("Tuổi của bé").selectOption("9");
    await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
    await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
    expect(payloads).toHaveLength(1);
    expect(payloads[0]).toMatchObject({ program: "Kỹ sư Công nghệ STEM nhí", sourcePage: "/khoa-hoc/ky-su-cong-nghe-stem-nhi", utmSource: "facebook", utmMedium: "paid", utmCampaign: "rio", website: "" });
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue("Kỹ sư Công nghệ STEM nhí");
    await page.getByRole("link", { name: "Về trang chủ", exact: true }).click();
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(undecidedProgram);
  });
}

test("honeypot is clipped, absent from accessibility and tab order, and still rejects spam", async ({ page, request }) => {
  let submits = 0;
  page.on("request", request => { if (request.url().endsWith("/api/leads")) submits++; });
  for (const path of ["/", "/khoa-hoc/tu-duy-lap-trinh-stem"]) {
    await page.goto(path);
    const trap = page.locator("#website");
    await expect(page.locator(".lead-honeypot")).toHaveAttribute("aria-hidden", "true");
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(trap).toHaveAttribute("autocomplete", "off");
    await expect(page.getByRole("textbox", { name: "Website" })).toHaveCount(0);
    expect(await page.locator(".lead-honeypot").evaluate(element => {
      const style = getComputedStyle(element);
      return style.position === "absolute" && style.clipPath === "inset(50%)" && element.getBoundingClientRect().width <= 1;
    })).toBe(true);
    await page.getByLabel("Chương trình quan tâm").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" })).toBeFocused();
    await page.getByLabel("Tên phụ huynh").fill("TEST HONEYPOT");
    await page.getByLabel("Số điện thoại").fill("0901234567");
    await page.getByLabel("Tuổi của bé").selectOption("9");
    await trap.evaluate(input => { if (input instanceof HTMLInputElement) input.value = "bot"; });
    await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
    await expect(page.getByText("Dữ liệu không hợp lệ.", { exact: true })).toBeVisible();
  }
  expect(submits).toBe(0);
  const response = await request.post("/api/leads", { data: { parentName: "TEST HONEYPOT", phone: "0901234567", childAge: 9, program: "Tư duy lập trình STEM", sourcePage: "/khoa-hoc/tu-duy-lap-trinh-stem", website: "bot" } });
  expect(response.status()).toBe(400);
});
