import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";

test("QA: runtime, accessibility, images, layout and performance", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.addInitScript(() => {
    const metrics = { cls: 0, lcp: 0 };
    Object.assign(window, { qaMetrics: metrics });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) metrics.cls += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main")).toHaveCount(1);
  const findings = [];
  findings.push({ state: "homepage", result: await new AxeBuilder({ page }).options({ rules: { "label-content-name-mismatch": { enabled: true } } }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze() });
  for (const selector of [".hero", "#chuong-trinh", "#cach-hoc", "#hoat-dong", "#cau-hoi", "#dang-ky", "footer"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  for (const image of await page.locator("img:visible").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)).toBe(true);
  }
  const images = await page.locator("img").evaluateAll(images => images.filter((img): img is HTMLImageElement => img instanceof HTMLImageElement).map(img => ({ alt: img.alt, src: img.currentSrc, width: img.clientWidth, height: img.clientHeight, loading: img.loading })));
  const metrics = await page.evaluate(() => ({
    ...(window as Window & { qaMetrics?: { cls: number; lcp: number } }).qaMetrics,
    scripts: performance.getEntriesByType("resource").filter(entry => (entry as PerformanceResourceTiming).initiatorType === "script").map(entry => ({ url: entry.name, bytes: (entry as PerformanceResourceTiming).encodedBodySize })),
  }));
  if (testInfo.project.name !== "desktop") {
    await page.getByRole("button", { name: "Mở menu" }).click();
    findings.push({ state: "menu", result: await new AxeBuilder({ page }).options({ rules: { "label-content-name-mismatch": { enabled: true } } }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze() });
    await page.keyboard.press("Escape");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  expect(await page.locator(".program-card").first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe("0s");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `test-results/qa-${testInfo.project.name}.png`, fullPage: true });
  for (const [name, selector] of [["hero", ".hero"], ["programs", "#chuong-trinh"], ["activities", "#hoat-dong"], ["examples", "section[aria-label='Học để làm được']"], ["process", "#cach-hoc"], ["registration", "#dang-ky"], ["footer", "footer"]]) {
    await page.locator(selector).screenshot({ path: `test-results/qa-${testInfo.project.name}-${name}.png`, style: ".site-header, .mobile-cta, .skip-link { visibility: hidden !important; }" });
  }
  const violations = findings.flatMap(({ state, result }) => result.violations.map(v => ({ state, rule: v.id, impact: v.impact, nodes: v.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })));
  await writeFile(`test-results/qa-${testInfo.project.name}.json`, JSON.stringify({ metrics, images, errors, violations }, null, 2));
  expect(errors).toEqual([]);
  expect(metrics.cls).toBeLessThanOrEqual(0.1);
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("QA: keyboard course navigation, FAQ focus and hover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Chuyển đến nội dung chính" })).toBeFocused();
  await page.keyboard.press("Enter");
  const trigger = page.getByRole("link", { name: "Xem chi tiết chương trình Kỹ sư Công nghệ STEM nhí", exact: true });
  await trigger.focus();
  expect(await trigger.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/khoa-hoc\/ky-su-cong-nghe-stem-nhi$/);
  await expect(page.getByRole("heading", { level: 1, name: "Kỹ sư Công nghệ STEM nhí", exact: true })).toBeVisible();
  await expect(page.getByLabel("Chương trình quan tâm")).toHaveValue("Kỹ sư Công nghệ STEM nhí");
  await page.getByRole("link", { name: "Về trang chủ", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".program-card")).toHaveCount(4);
  await page.locator(".faq-list summary").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".faq-list details").first()).toHaveAttribute("open", "");
  const button = page.locator("#hero-actions .button--primary");
  await button.hover();
  expect(await button.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(6, 75, 194)");
  await button.focus();
  expect(await button.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid");
  await page.mouse.down();
  expect(await button.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(4, 59, 155)");
  await page.mouse.move(0, 0);
  await page.mouse.up();
});
