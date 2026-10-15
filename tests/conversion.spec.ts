import { expect, test, type Page } from "@playwright/test";
import { contact } from "../content/contact";
import { getProgramPath, programs } from "../content/programs";
import { leadMessages, undecidedProgram } from "../lib/leads";

const courses = {
  rio: "rio", "starter-kit": "starter_kit", "lap-trinh": "logic_programming", "dien-tu-co-ban": "basic_electronics",
};
const events = (page: Page) => page.evaluate(() => window.dataLayer ?? []);
async function fillForm(page: Page) {
  await page.getByLabel("Tên phụ huynh").fill("TEST CONVERSION");
  await page.getByLabel("Số điện thoại").fill("0901234567");
  await page.getByLabel("Tuổi của bé").selectOption("9");
}
async function preventExternalNavigation(page: Page) {
  await page.locator('a[href^="tel:"], a[href^="https://zalo.me/"]').evaluateAll(links => {
    for (const link of links) link.addEventListener("click", event => event.preventDefault());
  });
}

for (const program of programs) {
  test(`${program.name}: tracks CTA and only confirmed leads, including a manual course change`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    const payloads: Record<string, unknown>[] = [];
    await page.route("**/api/leads", async route => {
      payloads.push(route.request().postDataJSON());
      await pending;
      await route.fulfill({ json: { success: true } });
    });
    const path = getProgramPath(program);
    await page.goto(`${path}?utm_source=qa&utm_campaign=private-query`);
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program.name);
    await expect(page.getByLabel("Chương trình quan tâm")).toBeEnabled();
    await page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" }).click();
    expect(await events(page)).toEqual([{ event: "click_hoc_thu", course: courses[program.id], page_path: path, cta_location: "hero" }]);
    await fillForm(page);
    await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
    await expect(page.getByRole("button", { name: "Đang gửi..." })).toBeDisabled();
    expect(await events(page)).toHaveLength(1);
    await expect.poll(() => payloads.length).toBe(1);
    expect(payloads[0]).toMatchObject({ program: program.name, sourcePage: path, utmSource: "qa" });
    release();
    await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
    expect(await events(page)).toEqual([
      { event: "click_hoc_thu", course: courses[program.id], page_path: path, cta_location: "hero" },
      { event: "submit_lead", course: courses[program.id], page_path: path, cta_location: "bottom_form" },
    ]);
    const other = programs.find(other => other.id !== program.id)!;
    await fillForm(page);
    await page.getByLabel("Chương trình quan tâm").selectOption(other.name);
    await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
    await expect.poll(async () => (await events(page)).length).toBe(3);
    expect(payloads[1]).toMatchObject({ program: other.name, sourcePage: path });
    expect((await events(page)).at(-1)).toEqual({ event: "submit_lead", course: courses[other.id], page_path: path, cta_location: "bottom_form" });
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program.name);
    expect(JSON.stringify(await events(page))).not.toMatch(/TEST CONVERSION|0901234567|private-query|utm_/);
    await page.locator("#lo-trinh").getByRole("link", { name: "Đăng ký học thử" }).click();
    expect((await events(page)).at(-1)).toEqual({ event: "click_hoc_thu", course: courses[program.id], page_path: path, cta_location: "mid_page" });
  });
}

test("homepage CTA locations, card courses and undecided lead retain homepage behavior", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/leads", route => route.fulfill({ json: { success: true } }));
  await page.goto("/");
  await page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" }).click();
  expect((await events(page)).at(-1)).toEqual({ event: "click_hoc_thu", course: "general", page_path: "/", cta_location: "hero" });
  await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(undecidedProgram);
  await fillForm(page);
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
  expect((await events(page)).at(-1)).toEqual({ event: "submit_lead", course: "general", page_path: "/", cta_location: "bottom_form" });
  if (testInfo.project.name === "desktop") await page.locator(".header-cta").click();
  else {
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Đăng ký học thử" }).click();
  }
  expect((await events(page)).at(-1)).toEqual({ event: "click_hoc_thu", course: "general", page_path: "/", cta_location: "header" });
  for (const program of programs) {
    await page.locator(".program-card").filter({ has: page.getByRole("heading", { name: program.name, exact: true }) }).getByRole("link", { name: "Đăng ký học thử" }).click();
    await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program.name);
    expect((await events(page)).at(-1)).toEqual({ event: "click_hoc_thu", course: courses[program.id], page_path: "/", cta_location: "mid_page" });
  }
  expect(await events(page)).toHaveLength(7);
});

test("phone and Zalo tracking reuses the existing queue across client navigation without duplicate listeners", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    window.dataLayer = [{ event: "existing_queue" }];
    const push = window.dataLayer.push;
    window.dataLayer.push = function (...entries) {
      document.documentElement.dataset.analyticsPushes = String(Number(document.documentElement.dataset.analyticsPushes ?? 0) + 1);
      return push.apply(this, entries);
    };
    Object.defineProperty(window, "gtag", { value: () => { throw new Error("Do not initialize or double-send to GA4"); } });
    Object.defineProperty(window, "fbq", { value: () => { throw new Error("Do not initialize or double-send to Meta"); } });
  });
  await page.goto("/");
  for (const program of [undefined, ...programs]) {
    if (program) {
      const related = page.locator(".related-programs");
      if (await related.count()) await related.getByRole("link", { name: `Xem chương trình ${program.name}`, exact: true }).click();
      else await page.getByRole("link", { name: `Xem chi tiết chương trình ${program.name}`, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${getProgramPath(program)}$`));
    }
    await preventExternalNavigation(page);
    for (const [selector, location] of [["#dang-ky", "bottom_form"], ["footer", "footer"]]) {
      const section = page.locator(selector);
      const phone = section.locator('a[href^="tel:"]');
      await expect(phone).toHaveAttribute("href", "tel:0398288830");
      await expect(phone).toContainText("0398 288 830");
      for (const [link, event] of [[phone, "click_phone"], [section.locator(`a[href="${contact.zaloHref}"]`), "click_zalo"]] as const) {
        await link.click();
        expect((await events(page)).at(-1)).toEqual({ event, course: program ? courses[program.id] : "general", page_path: program ? getProgramPath(program) : "/", cta_location: location });
      }
    }
  }
  expect(await events(page)).toHaveLength(21);
  expect((await events(page))[0]).toEqual({ event: "existing_queue" });
  await expect(page.locator("html")).toHaveAttribute("data-analytics-pushes", "20");
  await expect(page.locator('script[src*="googletagmanager"], script[src*="connect.facebook.net"]')).toHaveCount(0);
});

test("invalid, rejected, malformed and network-failed submissions never emit submit_lead", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/leads", route => {
    requests++;
    if (requests === 1) return route.fulfill({ status: 503, json: { success: false } });
    if (requests === 2) return route.fulfill({ json: { success: false } });
    if (requests === 3) return route.fulfill({ contentType: "application/json", body: "not json" });
    return route.abort("failed");
  });
  await page.goto("/khoa-hoc/rio");
  const submit = page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" });
  await submit.click();
  expect(requests).toBe(0);
  expect(await events(page)).toEqual([]);
  await fillForm(page);
  for (let attempt = 1; attempt <= 4; attempt++) {
    await submit.click();
    await expect.poll(() => requests).toBe(attempt);
    await expect(page.getByText(leadMessages.failure, { exact: true })).toBeVisible();
    await expect(submit).toBeEnabled();
    expect(await events(page)).toEqual([]);
  }
});

test("a broken external dataLayer push cannot break CTA navigation or lead success", async ({ page }) => {
  const warnings: string[] = [];
  page.on("console", message => { if (message.type() === "warning") warnings.push(message.text()); });
  await page.addInitScript(() => { window.dataLayer = []; window.dataLayer.push = () => { throw new Error("Test: broken external tag"); }; });
  await page.route("**/api/leads", route => route.fulfill({ json: { success: true } }));
  await page.goto("/khoa-hoc/rio");
  await page.locator("#hero-actions").getByRole("link", { name: "Đăng ký học thử" }).click();
  await expect(page.getByRole("form", { name: "Đăng ký học thử" })).toBeFocused();
  await fillForm(page);
  await page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" }).click();
  await expect(page.getByText(leadMessages.success, { exact: true })).toBeVisible();
  expect(warnings.filter(message => message.includes("[analytics]"))).toHaveLength(2);
});

for (const width of [360, 390, 768, 1280, 1440, 1920]) {
  test(`UX sweep at ${width}px: all routes, navigation, honeypot, accordion and sticky`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Each width is tested once across all five routes");
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    for (const program of [undefined, ...programs]) {
      const path = program ? getProgramPath(program) : "/";
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      if (width === 360 || width === 1920) await page.screenshot({ path: `test-results/ux-${program?.slug ?? "home"}-${width}.png` });
      await expect(page.locator(".site-header .brand")).toHaveAttribute("href", "/");
      await expect(page.locator(".site-header .brand")).toHaveCSS("cursor", "pointer");
      await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue(program?.name ?? undecidedProgram);
      if (program) {
        const back = page.getByRole("link", { name: "Về trang chủ", exact: true });
        await expect(back).toHaveAttribute("href", "/");
        await expect(back).toHaveCSS("font-size", width < 768 ? "15px" : "16px");
        await expect(back).toHaveCSS("font-weight", "600");
        expect((await back.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        await back.focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        await expect(back).toBeFocused();
        await expect(back).toHaveCSS("outline-style", "solid");
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL("/");
        await page.goto(path);
        await expect(page.locator(".related-programs article")).toHaveCount(3);
        await expect(page.locator(".related-programs h3")).not.toContainText([program.name]);
        const relatedTitle = page.locator(".related-programs h3 a").first();
        await relatedTitle.hover();
        await expect(relatedTitle).toHaveCSS("text-decoration-line", "underline");
        for (const other of programs.filter(other => other.id !== program.id)) {
          await expect(page.locator(".related-programs").getByRole("link", { name: `Xem chương trình ${other.name}`, exact: true })).toHaveAttribute("href", getProgramPath(other));
        }
        if (width >= 1280) {
          const cards = await page.locator(".related-programs article").evaluateAll(cards => cards.map(card => ({ y: card.getBoundingClientRect().y, height: card.getBoundingClientRect().height })));
          expect(new Set(cards.map(card => card.y)).size).toBe(1);
          expect(new Set(cards.map(card => card.height)).size).toBe(1);
        }
        if (program.id === "dien-tu-co-ban") {
          const toggles = page.locator(".curriculum-group h3 button");
          await expect(toggles).toHaveCount(4);
          for (const toggle of await toggles.all()) {
            await expect(toggle).toHaveAttribute("aria-expanded", "false");
            await toggle.hover();
            await expect(toggle).toHaveCSS("color", "rgb(7, 91, 232)");
            const panelId = await toggle.getAttribute("aria-controls");
            expect(panelId).toBeTruthy();
            const panel = page.locator(`[id="${panelId}"]`);
            await toggle.focus();
            await page.keyboard.press("Enter");
            await expect(toggle).toHaveAttribute("aria-expanded", "true");
            await expect(panel).toBeVisible();
          }
          await expect(page.locator(".module-list li:visible")).toHaveCount(14);
          await toggles.first().focus();
          await page.keyboard.press("Space");
          await expect(toggles.first()).toHaveAttribute("aria-expanded", "false");
        }
      }
      await expect(page.getByRole("textbox", { name: "Website" })).toHaveCount(0);
      await expect(page.locator("#website")).toHaveAttribute("tabindex", "-1");
      await expect(page.locator(".lead-honeypot")).toHaveCSS("position", "absolute");
      await expect(page.locator(".lead-honeypot")).toHaveCSS("clip-path", "inset(50%)");
      await page.getByLabel("Chương trình quan tâm").focus();
      await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: "Nhận tư vấn & lịch học thử" })).toBeFocused();
      await expect(page.locator(".mobile-cta")).not.toBeVisible();
      await page.locator("h1").click();
      const middle = page.locator(program ? ".course-intro-grid" : "#chuong-trinh");
      await middle.scrollIntoViewIfNeeded();
      if (width < 768) {
        const bar = page.locator(".mobile-cta");
        await expect(bar).toBeVisible();
        const bounds = (await bar.boundingBox())!;
        expect(bounds.height).toBeLessThanOrEqual(90);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
        for (const link of await bar.locator("a").all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        if (width === 360) await page.screenshot({ path: `test-results/ux-${program?.slug ?? "home"}-sticky.png` });
        await preventExternalNavigation(page);
        await bar.getByRole("link", { name: "Chat Zalo" }).click();
        expect((await events(page)).at(-1)).toEqual({ event: "click_zalo", course: program ? courses[program.id] : "general", page_path: path, cta_location: "sticky_mobile" });
        await page.getByRole("button", { name: "Mở menu" }).click();
        await expect(bar).not.toBeVisible();
        await page.keyboard.press("Escape");
        await middle.scrollIntoViewIfNeeded();
        await expect(bar).toBeVisible();
        await bar.getByRole("link", { name: "Đăng ký học thử" }).click();
        expect((await events(page)).at(-1)).toEqual({ event: "click_hoc_thu", course: program ? courses[program.id] : "general", page_path: path, cta_location: "sticky_mobile" });
        await expect(page.getByRole("form", { name: "Đăng ký học thử" })).toBeFocused();
        await expect(bar).not.toBeVisible();
        await page.getByLabel("Tên phụ huynh").focus();
        await middle.scrollIntoViewIfNeeded();
        await expect(bar).not.toBeVisible();
        await page.locator("footer").scrollIntoViewIfNeeded();
        await expect(bar).not.toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.locator(".site-header .brand").click();
      await expect(page).toHaveURL("/");
    }
    expect(errors).toEqual([]);
  });
}
